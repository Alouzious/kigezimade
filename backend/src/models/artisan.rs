use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct Artisan {
    pub id: Uuid,
    pub name: String,
    pub email: Option<String>,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub phone: String,
    pub bio: String,
    pub district: String,
    pub craft_specialty: String,
    pub photo_url: String,
    pub workshop_video_url: String,
    pub map_embed_url: String,
    pub verified: bool,
    pub visit_notes: String,
    pub workshop_hours: String,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateArtisan {
    pub name: String,
    pub email: String,
    pub password: String,
    pub phone: Option<String>,
    pub bio: Option<String>,
    pub district: String,
    pub craft_specialty: Option<String>,
    pub photo_url: Option<String>,
    pub workshop_video_url: Option<String>,
    pub map_embed_url: Option<String>,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
}

#[derive(Debug, Deserialize)]
pub struct LoginArtisan {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateArtisan {
    pub name: Option<String>,
    pub bio: Option<String>,
    pub district: Option<String>,
    pub craft_specialty: Option<String>,
    pub phone: Option<String>,
    pub photo_url: Option<String>,
    pub workshop_video_url: Option<String>,
    pub map_embed_url: Option<String>,
    pub visit_notes: Option<String>,
    pub workshop_hours: Option<String>,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
}
