use axum::http::HeaderMap;
use uuid::Uuid;

use crate::auth::JwtService;
use crate::error::{AppError, AppResult};

pub fn verify_artisan_token(headers: &HeaderMap, artisan_id: Uuid) -> AppResult<()> {
    let auth_header = headers
        .get("authorization")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or_else(|| AppError::Unauthorized("sign in required".into()))?;

    let jwt = JwtService::from_env();
    let token_id = jwt
        .verify_token(token)
        .map_err(|e| AppError::Unauthorized(e))?;

    if token_id != artisan_id {
        return Err(AppError::Unauthorized("access denied".into()));
    }

    Ok(())
}
