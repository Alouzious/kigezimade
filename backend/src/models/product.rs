use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

use super::artisan::Artisan;
use super::product_image::ProductImage;

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct Product {
    pub id: Uuid,
    pub artisan_id: Uuid,
    pub name: String,
    pub description: String,
    pub price: Decimal,
    pub category: String,
    pub image_url: String,
    pub availability: String,
    pub view_count: i32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct ProductWithArtisan {
    #[serde(flatten)]
    pub product: Product,
    pub artisan_name: String,
    pub artisan_district: String,
}

#[derive(Debug, Serialize)]
pub struct ProductDetail {
    #[serde(flatten)]
    pub product: Product,
    pub artisan: Artisan,
    pub images: Vec<ProductImage>,
}

#[derive(Debug, Serialize)]
pub struct ProductWithImages {
    #[serde(flatten)]
    pub product: Product,
    pub images: Vec<ProductImage>,
}

#[derive(Debug, Deserialize)]
pub struct CreateProduct {
    pub artisan_id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub price: Decimal,
    pub category: String,
    pub image_url: Option<String>,
    pub image_urls: Option<Vec<String>>,
    pub availability: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateProduct {
    pub name: Option<String>,
    pub description: Option<String>,
    pub price: Option<Decimal>,
    pub category: Option<String>,
    pub image_url: Option<String>,
    pub image_urls: Option<Vec<String>>,
    pub availability: Option<String>,
}
