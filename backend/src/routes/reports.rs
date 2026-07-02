use axum::{extract::State, routing::post, Json, Router};
use serde::Deserialize;
use sqlx::PgPool;
use uuid::Uuid;

use crate::error::{AppError, AppResult};

pub fn router() -> Router<PgPool> {
    Router::new().route("/", post(create_report))
}

#[derive(Deserialize)]
struct CreateReport {
    order_id: Option<Uuid>,
    reporter_name: Option<String>,
    reporter_email: String,
    message: String,
}

async fn create_report(
    State(pool): State<PgPool>,
    Json(body): Json<CreateReport>,
) -> AppResult<Json<serde_json::Value>> {
    if body.reporter_email.trim().is_empty() || body.message.trim().is_empty() {
        return Err(AppError::BadRequest("email and message are required".into()));
    }

    sqlx::query(
        "INSERT INTO reports (order_id, reporter_name, reporter_email, message) VALUES ($1, $2, $3, $4)",
    )
    .bind(body.order_id)
    .bind(body.reporter_name.unwrap_or_default().trim())
    .bind(body.reporter_email.trim())
    .bind(body.message.trim())
    .execute(&pool)
    .await?;

    Ok(Json(serde_json::json!({ "message": "Thank you. We will look into this." })))
}
