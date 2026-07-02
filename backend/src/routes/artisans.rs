use axum::{
    extract::{Path, State},
    http::HeaderMap,
    routing::get,
    Json, Router,
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::cache;
use crate::error::{AppError, AppResult};
use crate::middleware::verify_artisan_token;
use crate::models::artisan::{Artisan, CreateArtisan, UpdateArtisan};
use crate::routes::auth::{hash_for_storage, validate_registration};

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/", get(list_artisans).post(create_artisan))
        .route("/featured", get(list_featured))
        .merge(crate::routes::dashboard::router())
        .route(
            "/{id}",
            get(get_artisan)
                .put(update_artisan)
                .delete(delete_artisan),
        )
}

async fn list_artisans(State(pool): State<PgPool>) -> AppResult<Json<Vec<Artisan>>> {
    if let Some(hit) = cache::cache().artisans_list().await {
        let artisans: Vec<Artisan> = hit
            .into_iter()
            .filter_map(|v| serde_json::from_value(v).ok())
            .collect();
        if !artisans.is_empty() {
            return Ok(Json(artisans));
        }
    }

    let artisans = sqlx::query_as::<_, Artisan>(
        "SELECT * FROM artisans ORDER BY created_at DESC",
    )
    .fetch_all(&pool)
    .await?;

    let json: Vec<serde_json::Value> = artisans
        .iter()
        .filter_map(|a| serde_json::to_value(a).ok())
        .collect();
    cache::cache().set_artisans_list(json).await;

    Ok(Json(artisans))
}

async fn list_featured(State(pool): State<PgPool>) -> AppResult<Json<Vec<Artisan>>> {
    if let Some(hit) = cache::cache().artisans_featured().await {
        let artisans: Vec<Artisan> = hit
            .into_iter()
            .filter_map(|v| serde_json::from_value(v).ok())
            .collect();
        if !artisans.is_empty() {
            return Ok(Json(artisans));
        }
    }

    let artisans = sqlx::query_as::<_, Artisan>(
        "SELECT * FROM artisans ORDER BY created_at ASC LIMIT 3",
    )
    .fetch_all(&pool)
    .await?;

    let json: Vec<serde_json::Value> = artisans
        .iter()
        .filter_map(|a| serde_json::to_value(a).ok())
        .collect();
    cache::cache().set_artisans_featured(json).await;

    Ok(Json(artisans))
}

async fn get_artisan(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> AppResult<Json<Artisan>> {
    if let Some(hit) = cache::cache().artisan_detail(id).await {
        if let Ok(artisan) = serde_json::from_value::<Artisan>(hit) {
            return Ok(Json(artisan));
        }
    }

    let artisan = sqlx::query_as::<_, Artisan>("SELECT * FROM artisans WHERE id = $1")
        .bind(id)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::NotFound("artisan not found".into()))?;

    if let Ok(value) = serde_json::to_value(&artisan) {
        cache::cache().set_artisan_detail(id, value).await;
    }

    Ok(Json(artisan))
}

async fn create_artisan(
    State(pool): State<PgPool>,
    Json(body): Json<CreateArtisan>,
) -> AppResult<Json<Artisan>> {
    if body.name.trim().is_empty() || body.district.trim().is_empty() {
        return Err(AppError::BadRequest(
            "name and district are required".into(),
        ));
    }

    validate_registration(&body.email, &body.password)?;
    let email = body.email.trim().to_lowercase();
    let password_hash = hash_for_storage(body.password.trim()).await?;

    let existing: bool = sqlx::query_scalar(
        "SELECT EXISTS(SELECT 1 FROM artisans WHERE LOWER(email) = $1)",
    )
    .bind(&email)
    .fetch_one(&pool)
    .await?;

    if existing {
        return Err(AppError::BadRequest("an account with this email already exists".into()));
    }

    let artisan = sqlx::query_as::<_, Artisan>(
        r#"
        INSERT INTO artisans (name, email, password_hash, phone, bio, district, craft_specialty, photo_url, workshop_video_url, map_embed_url, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
        "#,
    )
    .bind(body.name.trim())
    .bind(email)
    .bind(password_hash)
    .bind(body.phone.unwrap_or_default())
    .bind(body.bio.unwrap_or_default())
    .bind(body.district.trim())
    .bind(body.craft_specialty.unwrap_or_default())
    .bind(body.photo_url.unwrap_or_default())
    .bind(body.workshop_video_url.unwrap_or_default())
    .bind(body.map_embed_url.unwrap_or_default())
    .bind(body.latitude)
    .bind(body.longitude)
    .fetch_one(&pool)
    .await?;

    cache::cache().invalidate_artisans();

    Ok(Json(artisan))
}

async fn update_artisan(
    State(pool): State<PgPool>,
    headers: HeaderMap,
    Path(id): Path<Uuid>,
    Json(body): Json<UpdateArtisan>,
) -> AppResult<Json<Artisan>> {
    verify_artisan_token(&headers, id)?;
    let existing = sqlx::query_as::<_, Artisan>("SELECT * FROM artisans WHERE id = $1")
        .bind(id)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::NotFound("artisan not found".into()))?;

    let artisan = sqlx::query_as::<_, Artisan>(
        r#"
        UPDATE artisans SET
            name = $2,
            bio = $3,
            district = $4,
            craft_specialty = $5,
            phone = $6,
            photo_url = $7,
            workshop_video_url = $8,
            map_embed_url = $9,
            visit_notes = $10,
            workshop_hours = $11,
            latitude = $12,
            longitude = $13
        WHERE id = $1
        RETURNING *
        "#,
    )
    .bind(id)
    .bind(body.name.unwrap_or(existing.name))
    .bind(body.bio.unwrap_or(existing.bio))
    .bind(body.district.unwrap_or(existing.district))
    .bind(body.craft_specialty.unwrap_or(existing.craft_specialty))
    .bind(body.phone.unwrap_or(existing.phone))
    .bind(body.photo_url.unwrap_or(existing.photo_url))
    .bind(body.workshop_video_url.unwrap_or(existing.workshop_video_url))
    .bind(body.map_embed_url.unwrap_or(existing.map_embed_url))
    .bind(body.visit_notes.unwrap_or(existing.visit_notes))
    .bind(body.workshop_hours.unwrap_or(existing.workshop_hours))
    .bind(body.latitude.or(existing.latitude))
    .bind(body.longitude.or(existing.longitude))
    .fetch_one(&pool)
    .await?;

    cache::cache().invalidate_artisans();

    Ok(Json(artisan))
}

async fn delete_artisan(
    State(pool): State<PgPool>,
    headers: HeaderMap,
    Path(id): Path<Uuid>,
) -> AppResult<Json<serde_json::Value>> {
    verify_artisan_token(&headers, id)?;
    let result = sqlx::query("DELETE FROM artisans WHERE id = $1")
        .bind(id)
        .execute(&pool)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound("artisan not found".into()));
    }

    cache::cache().invalidate_artisans();

    Ok(Json(serde_json::json!({ "deleted": true })))
}
