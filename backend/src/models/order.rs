use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct Order {
    pub id: Uuid,
    pub product_id: Uuid,
    pub buyer_name: String,
    pub buyer_email: String,
    pub buyer_phone: String,
    pub buyer_message: String,
    pub quantity: i32,
    pub total_price: Decimal,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct OrderWithProduct {
    pub id: Uuid,
    pub product_id: Uuid,
    pub buyer_name: String,
    pub buyer_email: String,
    pub buyer_phone: String,
    pub buyer_message: String,
    pub quantity: i32,
    pub total_price: Decimal,
    pub status: String,
    pub created_at: DateTime<Utc>,
    pub product_name: String,
    pub product_image_url: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateOrder {
    pub product_id: Uuid,
    pub buyer_name: String,
    pub buyer_email: String,
    pub buyer_phone: String,
    pub buyer_message: Option<String>,
    pub quantity: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateOrderStatus {
    pub status: String,
}
