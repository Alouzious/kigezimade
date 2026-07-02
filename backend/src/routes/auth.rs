use axum::{extract::State, routing::post, Json, Router};
use chrono::{Duration, Utc};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

use crate::auth::{hash_password, verify_password, JwtService};
use crate::email::email_service;
use crate::error::{AppError, AppResult};
use crate::models::artisan::Artisan;

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/login", post(login))
        .route("/forgot-password", post(forgot_password))
        .route("/reset-password", post(reset_password))
}

#[derive(Deserialize)]
struct LoginArtisan {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
struct LoginResponse {
    artisan: Artisan,
    token: String,
}

#[derive(Deserialize)]
struct ForgotPasswordRequest {
    email: String,
}

#[derive(Deserialize)]
struct ResetPasswordRequest {
    token: String,
    password: String,
}

async fn login(
    State(pool): State<PgPool>,
    Json(body): Json<LoginArtisan>,
) -> AppResult<Json<LoginResponse>> {
    let email = body.email.trim().to_lowercase();
    let password = body.password.trim();

    if email.is_empty() || password.is_empty() {
        return Err(AppError::BadRequest("email and password are required".into()));
    }

    let artisan = sqlx::query_as::<_, Artisan>("SELECT * FROM artisans WHERE LOWER(email) = $1")
        .bind(&email)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::Unauthorized("invalid email or password".into()))?;

    let valid = verify_password(password, &artisan.password_hash)?;
    if !valid {
        return Err(AppError::Unauthorized("invalid email or password".into()));
    }

    let jwt = JwtService::from_env();
    let token = jwt
        .create_token(artisan.id)
        .map_err(|e| AppError::Internal(e))?;

    Ok(Json(LoginResponse { artisan, token }))
}

async fn forgot_password(
    State(pool): State<PgPool>,
    Json(body): Json<ForgotPasswordRequest>,
) -> AppResult<Json<serde_json::Value>> {
    let email = body.email.trim().to_lowercase();
    if email.is_empty() {
        return Err(AppError::BadRequest("email is required".into()));
    }

    let artisan = sqlx::query_as::<_, Artisan>("SELECT * FROM artisans WHERE LOWER(email) = $1")
        .bind(&email)
        .fetch_optional(&pool)
        .await?;

    if let Some(artisan) = artisan {
        let token = Uuid::new_v4().to_string();
        let expires = Utc::now() + Duration::hours(1);

        sqlx::query("DELETE FROM password_reset_tokens WHERE artisan_id = $1")
            .bind(artisan.id)
            .execute(&pool)
            .await?;

        sqlx::query(
            "INSERT INTO password_reset_tokens (artisan_id, token, expires_at) VALUES ($1, $2, $3)",
        )
        .bind(artisan.id)
        .bind(&token)
        .bind(expires)
        .execute(&pool)
        .await?;

        let frontend_url =
            std::env::var("FRONTEND_URL").unwrap_or_else(|_| "http://localhost:5173".into());
        let reset_link = format!("{frontend_url}/reset-password?token={token}");

        if let Some(artisan_email) = &artisan.email {
            let email_svc = email_service();
            if email_svc.is_enabled() {
                let _ = email_svc.send(
                    artisan_email,
                    "Reset your Kigezi Made password",
                    &format!(
                        "Hello {},\n\nReset your password here (valid 1 hour):\n{reset_link}\n\n— Kigezi Made",
                        artisan.name
                    ),
                );
            }
        }
    }

    Ok(Json(serde_json::json!({
        "message": "If that email is registered, a reset link has been sent."
    })))
}

async fn reset_password(
    State(pool): State<PgPool>,
    Json(body): Json<ResetPasswordRequest>,
) -> AppResult<Json<serde_json::Value>> {
    if body.password.len() < 6 {
        return Err(AppError::BadRequest(
            "password must be at least 6 characters".into(),
        ));
    }

    let row: Option<(Uuid,)> = sqlx::query_as(
        "SELECT artisan_id FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW()",
    )
    .bind(body.token.trim())
    .fetch_optional(&pool)
    .await?;

    let Some((artisan_id,)) = row else {
        return Err(AppError::BadRequest("invalid or expired reset link".into()));
    };

    let password_hash = hash_password(body.password.trim())?;

    sqlx::query("UPDATE artisans SET password_hash = $2 WHERE id = $1")
        .bind(artisan_id)
        .bind(password_hash)
        .execute(&pool)
        .await?;

    sqlx::query("DELETE FROM password_reset_tokens WHERE artisan_id = $1")
        .bind(artisan_id)
        .execute(&pool)
        .await?;

    Ok(Json(serde_json::json!({ "message": "Password updated. You can sign in now." })))
}

pub fn validate_registration(email: &str, password: &str) -> AppResult<()> {
    let email = email.trim();
    if email.is_empty() || !email.contains('@') {
        return Err(AppError::BadRequest("a valid email is required".into()));
    }
    if password.len() < 6 {
        return Err(AppError::BadRequest(
            "password must be at least 6 characters".into(),
        ));
    }
    Ok(())
}

pub async fn hash_for_storage(password: &str) -> AppResult<String> {
    hash_password(password)
}
