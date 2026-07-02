use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
}

pub struct JwtService {
    secret: String,
}

impl JwtService {
    pub fn from_env() -> Self {
        let secret = std::env::var("JWT_SECRET")
            .unwrap_or_else(|_| "kigezimade-dev-secret-change-in-production".into());
        Self { secret }
    }

    pub fn create_token(&self, artisan_id: Uuid) -> Result<String, String> {
        let exp = (Utc::now() + Duration::days(30)).timestamp() as usize;
        let claims = Claims {
            sub: artisan_id.to_string(),
            exp,
        };
        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.secret.as_bytes()),
        )
        .map_err(|e| e.to_string())
    }

    pub fn verify_token(&self, token: &str) -> Result<Uuid, String> {
        let data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.secret.as_bytes()),
            &Validation::default(),
        )
        .map_err(|_| "invalid or expired session".to_string())?;

        Uuid::parse_str(&data.claims.sub).map_err(|_| "invalid token subject".to_string())
    }
}
