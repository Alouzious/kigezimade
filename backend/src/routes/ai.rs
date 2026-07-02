use std::sync::Arc;

use axum::{
    extract::{Path, State},
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;
use sqlx::PgPool;
use uuid::Uuid;

use crate::ai::groq_client::GroqClient;
use crate::error::{AppError, AppResult};
use crate::models::artisan::Artisan;
use crate::models::product::Product;
use crate::models::story::{ProductStory, StoryWithTranslations, Translation};

#[derive(Clone)]
pub struct AiState {
    pub groq: Arc<GroqClient>,
}

pub fn router() -> Router<(PgPool, AiState)> {
    Router::new()
        .route("/products/{id}/story", get(get_story).post(generate_story))
        .route(
            "/products/{id}/story/translate",
            post(translate_story),
        )
}

#[derive(Deserialize)]
struct TranslateRequest {
    language_code: String,
}

async fn get_story(
    State((pool, _)): State<(PgPool, AiState)>,
    Path(id): Path<Uuid>,
) -> AppResult<Json<StoryWithTranslations>> {
    let story = sqlx::query_as::<_, ProductStory>(
        "SELECT * FROM product_stories WHERE product_id = $1",
    )
    .bind(id)
    .fetch_optional(&pool)
    .await?;

    let Some(story) = story else {
        return Err(AppError::NotFound("story not found for this product".into()));
    };

    let translations = sqlx::query_as::<_, Translation>(
        "SELECT * FROM translations WHERE product_story_id = $1 ORDER BY language_code",
    )
    .bind(story.id)
    .fetch_all(&pool)
    .await?;

    Ok(Json(StoryWithTranslations {
        story,
        translations,
    }))
}

async fn generate_story(
    State((pool, ai_state)): State<(PgPool, AiState)>,
    Path(id): Path<Uuid>,
) -> AppResult<Json<StoryWithTranslations>> {
    let product = sqlx::query_as::<_, Product>("SELECT * FROM products WHERE id = $1")
        .bind(id)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::NotFound("product not found".into()))?;

    let artisan = sqlx::query_as::<_, Artisan>("SELECT * FROM artisans WHERE id = $1")
        .bind(product.artisan_id)
        .fetch_one(&pool)
        .await?;

    let story_text = ai_state
        .groq
        .generate_story(
            &product.name,
            &product.description,
            &artisan.name,
            &artisan.bio,
            &artisan.craft_specialty,
            &artisan.district,
        )
        .await?;

    let story = sqlx::query_as::<_, ProductStory>(
        r#"
        INSERT INTO product_stories (product_id, story_text)
        VALUES ($1, $2)
        ON CONFLICT (product_id) DO UPDATE SET
            story_text = EXCLUDED.story_text,
            generated_at = NOW()
        RETURNING *
        "#,
    )
    .bind(id)
    .bind(&story_text)
    .fetch_one(&pool)
    .await?;

    // Auto-translate to French
    if let Ok(french) = ai_state.groq.translate(&story_text, "fr").await {
        let _ = sqlx::query(
            r#"
            INSERT INTO translations (product_story_id, language_code, translated_text)
            VALUES ($1, 'fr', $2)
            ON CONFLICT (product_story_id, language_code) DO UPDATE SET
                translated_text = EXCLUDED.translated_text,
                created_at = NOW()
            "#,
        )
        .bind(story.id)
        .bind(french)
        .execute(&pool)
        .await;
    }

    let translations = sqlx::query_as::<_, Translation>(
        "SELECT * FROM translations WHERE product_story_id = $1 ORDER BY language_code",
    )
    .bind(story.id)
    .fetch_all(&pool)
    .await?;

    Ok(Json(StoryWithTranslations {
        story,
        translations,
    }))
}

async fn translate_story(
    State((pool, ai_state)): State<(PgPool, AiState)>,
    Path(id): Path<Uuid>,
    Json(body): Json<TranslateRequest>,
) -> AppResult<Json<Translation>> {
    if body.language_code.trim().is_empty() {
        return Err(AppError::BadRequest("language_code is required".into()));
    }

    let story = sqlx::query_as::<_, ProductStory>(
        "SELECT * FROM product_stories WHERE product_id = $1",
    )
    .bind(id)
    .fetch_optional(&pool)
    .await?
    .ok_or_else(|| AppError::NotFound("story not found — generate one first".into()))?;

    let translated = ai_state
        .groq
        .translate(&story.story_text, &body.language_code)
        .await?;

    let translation = sqlx::query_as::<_, Translation>(
        r#"
        INSERT INTO translations (product_story_id, language_code, translated_text)
        VALUES ($1, $2, $3)
        ON CONFLICT (product_story_id, language_code) DO UPDATE SET
            translated_text = EXCLUDED.translated_text,
            created_at = NOW()
        RETURNING *
        "#,
    )
    .bind(story.id)
    .bind(body.language_code.trim())
    .bind(translated)
    .fetch_one(&pool)
    .await?;

    Ok(Json(translation))
}
