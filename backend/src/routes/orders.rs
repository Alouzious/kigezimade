use axum::{
    extract::{Path, State},
    routing::get,
    Json, Router,
};
use rust_decimal::Decimal;
use sqlx::PgPool;
use uuid::Uuid;

use crate::email::{email_service, send_buyer_confirmation, send_order_notification};
use crate::error::{AppError, AppResult};
use crate::models::artisan::Artisan;
use crate::models::order::{CreateOrder, Order, OrderWithProduct};
use crate::models::product::Product;

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/", get(list_orders).post(create_order))
        .route("/track/{id}", get(track_order))
        .route("/{id}", get(get_order))
}

async fn list_orders(State(pool): State<PgPool>) -> AppResult<Json<Vec<Order>>> {
    let orders = sqlx::query_as::<_, Order>("SELECT * FROM orders ORDER BY created_at DESC")
        .fetch_all(&pool)
        .await?;

    Ok(Json(orders))
}

async fn get_order(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> AppResult<Json<Order>> {
    let order = sqlx::query_as::<_, Order>("SELECT * FROM orders WHERE id = $1")
        .bind(id)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::NotFound("order not found".into()))?;

    Ok(Json(order))
}

async fn create_order(
    State(pool): State<PgPool>,
    Json(body): Json<CreateOrder>,
) -> AppResult<Json<Order>> {
    if body.buyer_name.trim().is_empty() || body.buyer_email.trim().is_empty() {
        return Err(AppError::BadRequest(
            "buyer name and email are required".into(),
        ));
    }

    if body.buyer_phone.trim().is_empty() {
        return Err(AppError::BadRequest(
            "phone or WhatsApp number is required".into(),
        ));
    }

    let quantity = body.quantity.unwrap_or(1);
    if quantity < 1 {
        return Err(AppError::BadRequest("quantity must be at least 1".into()));
    }

    let product = sqlx::query_as::<_, Product>("SELECT * FROM products WHERE id = $1")
        .bind(body.product_id)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::NotFound("product not found".into()))?;

    let artisan = sqlx::query_as::<_, Artisan>("SELECT * FROM artisans WHERE id = $1")
        .bind(product.artisan_id)
        .fetch_one(&pool)
        .await?;

    let total_price = product.price * Decimal::from(quantity);
    let buyer_message = body.buyer_message.unwrap_or_default();

    let order = sqlx::query_as::<_, Order>(
        r#"
        INSERT INTO orders (product_id, buyer_name, buyer_email, buyer_phone, buyer_message, quantity, total_price, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
        RETURNING *
        "#,
    )
    .bind(body.product_id)
    .bind(body.buyer_name.trim())
    .bind(body.buyer_email.trim())
    .bind(body.buyer_phone.trim())
    .bind(buyer_message.trim())
    .bind(quantity)
    .bind(total_price)
    .fetch_one(&pool)
    .await?;

    let email = email_service();
    let price_str = total_price.to_string();

    if let Some(artisan_email) = &artisan.email {
        send_order_notification(
            email,
            artisan_email,
            &artisan.name,
            &product.name,
            &order.buyer_name,
            &order.buyer_email,
            &order.buyer_phone,
            order.quantity,
            &price_str,
            &order.buyer_message,
        );
    }

    send_buyer_confirmation(
        email,
        &order.buyer_email,
        &order.buyer_name,
        &product.name,
        &artisan.name,
        &price_str,
    );

    Ok(Json(order))
}

async fn track_order(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> AppResult<Json<OrderWithProduct>> {
    let order = sqlx::query_as::<_, OrderWithProduct>(
        r#"
        SELECT o.id, o.product_id, o.buyer_name, o.buyer_email, o.buyer_phone,
               o.buyer_message, o.quantity, o.total_price, o.status, o.created_at,
               p.name AS product_name, p.image_url AS product_image_url
        FROM orders o
        JOIN products p ON p.id = o.product_id
        WHERE o.id = $1
        "#,
    )
    .bind(id)
    .fetch_optional(&pool)
    .await?
    .ok_or_else(|| AppError::NotFound("order not found".into()))?;

    Ok(Json(order))
}
