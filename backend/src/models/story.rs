use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct ProductStory {
    pub id: Uuid,
    pub product_id: Uuid,
    pub story_text: String,
    pub generated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct Translation {
    pub id: Uuid,
    pub product_story_id: Uuid,
    pub language_code: String,
    pub translated_text: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct StoryWithTranslations {
    pub story: ProductStory,
    pub translations: Vec<Translation>,
}
