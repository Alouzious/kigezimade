use bcrypt::{hash, verify, DEFAULT_COST};

use crate::error::{AppError, AppResult};

pub fn hash_password(password: &str) -> AppResult<String> {
    hash(password, DEFAULT_COST).map_err(|e| AppError::Internal(format!("hash error: {e}")))
}

pub fn verify_password(password: &str, hash: &str) -> AppResult<bool> {
    if hash.is_empty() {
        return Ok(false);
    }
    verify(password, hash).map_err(|e| AppError::Internal(format!("verify error: {e}")))
}
