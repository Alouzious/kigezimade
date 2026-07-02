use axum::{
    extract::{Path, State},
    http::HeaderMap,
    routing::get,
    Json, Router,
};
use rust_decimal::Decimal;
use sqlx::PgPool;
use uuid::Uuid;

use crate::error::{AppError, AppResult};
use crate::images::{fetch_product_images, replace_product_images};
use crate::middleware::verify_artisan_token;
use crate::models::artisan::Artisan;
use crate::models::order::{Order, OrderWithProduct, UpdateOrderStatus};
use crate::models::product::{CreateProduct, Product, UpdateProduct};

const ORDER_STATUSES: &[&str] = &["pending", "contacted", "confirmed", "completed", "cancelled"];

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/{id}/dashboard", get(get_dashboard))
        .route("/{id}/products", get(list_products).post(create_product))
        .route(
            "/{id}/products/{product_id}",
            get(get_product)
                .put(update_product)
                .delete(delete_product),
        )
        .route(
            "/{id}/products/{product_id}/duplicate",
            axum::routing::post(duplicate_product),
        )
        .route("/{id}/orders", get(list_orders))
        .route(
            "/{id}/orders/{order_id}",
            axum::routing::put(update_order_status),
        )
}

#[derive(serde::Serialize)]
struct DashboardResponse {
    artisan: Artisan,
    products: Vec<serde_json::Value>,
    stats: DashboardStats,
}

#[derive(serde::Serialize)]
struct DashboardStats {
    total_products: i64,
    total_value: Decimal,
    pending_orders: i64,
    total_orders: i64,
    total_views: i64,
    top_product: Option<String>,
}

async fn get_dashboard(
    State(pool): State<PgPool>,
    Path(artisan_id): Path<Uuid>,
) -> AppResult<Json<DashboardResponse>> {
    let artisan = sqlx::query_as::<_, Artisan>("SELECT * FROM artisans WHERE id = $1")
        .bind(artisan_id)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::NotFound("artisan not found".into()))?;

    let products =
        sqlx::query_as::<_, Product>("SELECT * FROM products WHERE artisan_id = $1 ORDER BY created_at DESC")
            .bind(artisan_id)
            .fetch_all(&pool)
            .await?;

    let total_value: Decimal = products.iter().map(|p| p.price).sum();
    let total_products = products.len() as i64;

    let pending_orders: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*) FROM orders o
        JOIN products p ON p.id = o.product_id
        WHERE p.artisan_id = $1 AND o.status = 'pending'
        "#,
    )
    .bind(artisan_id)
    .fetch_one(&pool)
    .await?;

    let total_orders: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*) FROM orders o
        JOIN products p ON p.id = o.product_id
        WHERE p.artisan_id = $1
        "#,
    )
    .bind(artisan_id)
    .fetch_one(&pool)
    .await?;

    let total_views: i64 =
        sqlx::query_scalar("SELECT COALESCE(SUM(view_count), 0) FROM products WHERE artisan_id = $1")
            .bind(artisan_id)
            .fetch_one(&pool)
            .await?;

    let top_product: Option<String> = sqlx::query_scalar(
        "SELECT name FROM products WHERE artisan_id = $1 ORDER BY view_count DESC LIMIT 1",
    )
    .bind(artisan_id)
    .fetch_optional(&pool)
    .await?;

    let mut product_payload = Vec::new();
    for product in products {
        let images = fetch_product_images(&pool, product.id).await?;
        product_payload.push(serde_json::json!({
            "id": product.id,
            "artisan_id": product.artisan_id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "category": product.category,
            "image_url": product.image_url,
            "availability": product.availability,
            "view_count": product.view_count,
            "created_at": product.created_at,
            "images": images,
        }));
    }

    Ok(Json(DashboardResponse {
        artisan,
        products: product_payload,
        stats: DashboardStats {
            total_products,
            total_value,
            pending_orders,
            total_orders,
            total_views,
            top_product,
        },
    }))
}

async fn list_products(
    State(pool): State<PgPool>,
    Path(artisan_id): Path<Uuid>,
) -> AppResult<Json<Vec<serde_json::Value>>> {
    let _ = sqlx::query_as::<_, Artisan>("SELECT * FROM artisans WHERE id = $1")
        .bind(artisan_id)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::NotFound("artisan not found".into()))?;

    let products = sqlx::query_as::<_, Product>(
        "SELECT * FROM products WHERE artisan_id = $1 ORDER BY created_at DESC",
    )
    .bind(artisan_id)
    .fetch_all(&pool)
    .await?;

    let mut results = Vec::new();
    for product in products {
        let images = fetch_product_images(&pool, product.id).await?;
        results.push(serde_json::json!({
            "id": product.id,
            "artisan_id": product.artisan_id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "category": product.category,
            "image_url": product.image_url,
            "availability": product.availability,
            "view_count": product.view_count,
            "created_at": product.created_at,
            "images": images,
        }));
    }

    Ok(Json(results))
}

async fn get_product(
    State(pool): State<PgPool>,
    Path((artisan_id, product_id)): Path<(Uuid, Uuid)>,
) -> AppResult<Json<serde_json::Value>> {
    let product = fetch_owned_product(&pool, artisan_id, product_id).await?;
    let images = fetch_product_images(&pool, product.id).await?;

    Ok(Json(serde_json::json!({
        "id": product.id,
        "artisan_id": product.artisan_id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "category": product.category,
        "image_url": product.image_url,
        "created_at": product.created_at,
        "images": images,
    })))
}

async fn create_product(
    State(pool): State<PgPool>,
    headers: HeaderMap,
    Path(artisan_id): Path<Uuid>,
    Json(mut body): Json<CreateProduct>,
) -> AppResult<Json<serde_json::Value>> {
    verify_artisan_token(&headers, artisan_id)?;
    body.artisan_id = artisan_id;
    if body.name.trim().is_empty() {
        return Err(AppError::BadRequest("name is required".into()));
    }

    let _ = sqlx::query_as::<_, Artisan>("SELECT * FROM artisans WHERE id = $1")
        .bind(artisan_id)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::NotFound("artisan not found".into()))?;

    let mut image_urls: Vec<String> = body
        .image_urls
        .clone()
        .unwrap_or_default()
        .into_iter()
        .filter(|u| !u.trim().is_empty())
        .collect();

    if image_urls.is_empty() {
        if let Some(url) = &body.image_url {
            if !url.trim().is_empty() {
                image_urls.push(url.trim().to_string());
            }
        }
    }

    let availability = body.availability.unwrap_or_else(|| "in_stock".into());
    let primary_image = image_urls.first().cloned().unwrap_or_default();

    let product = sqlx::query_as::<_, Product>(
        r#"
        INSERT INTO products (artisan_id, name, description, price, category, image_url, availability)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        "#,
    )
    .bind(artisan_id)
    .bind(body.name.trim())
    .bind(body.description.unwrap_or_default())
    .bind(body.price)
    .bind(body.category.trim())
    .bind(primary_image)
    .bind(availability)
    .fetch_one(&pool)
    .await?;

    let images = if image_urls.is_empty() {
        Vec::new()
    } else {
        replace_product_images(&pool, product.id, &image_urls).await?
    };

    Ok(Json(serde_json::json!({
        "id": product.id,
        "artisan_id": product.artisan_id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "category": product.category,
        "image_url": product.image_url,
        "created_at": product.created_at,
        "images": images,
    })))
}

async fn update_product(
    State(pool): State<PgPool>,
    headers: HeaderMap,
    Path((artisan_id, product_id)): Path<(Uuid, Uuid)>,
    Json(body): Json<UpdateProduct>,
) -> AppResult<Json<serde_json::Value>> {
    verify_artisan_token(&headers, artisan_id)?;
    let existing = fetch_owned_product(&pool, artisan_id, product_id).await?;

    let mut primary_image = body
        .image_url
        .clone()
        .unwrap_or_else(|| existing.image_url.clone());

    let image_urls = body.image_urls.clone().map(|urls| {
        urls.into_iter()
            .filter(|u| !u.trim().is_empty())
            .map(|u| u.trim().to_string())
            .collect::<Vec<_>>()
    });

    if let Some(ref urls) = image_urls {
        if let Some(first) = urls.first() {
            primary_image = first.clone();
        }
    }

    let product = sqlx::query_as::<_, Product>(
        r#"
        UPDATE products SET
            name = $2,
            description = $3,
            price = $4,
            category = $5,
            image_url = $6,
            availability = $7
        WHERE id = $1
        RETURNING *
        "#,
    )
    .bind(product_id)
    .bind(body.name.unwrap_or(existing.name))
    .bind(body.description.unwrap_or(existing.description))
    .bind(body.price.unwrap_or(existing.price))
    .bind(body.category.unwrap_or(existing.category))
    .bind(primary_image)
    .bind(body.availability.unwrap_or(existing.availability))
    .fetch_one(&pool)
    .await?;

    let images = if let Some(urls) = image_urls {
        replace_product_images(&pool, product.id, &urls).await?
    } else {
        fetch_product_images(&pool, product.id).await?
    };

    Ok(Json(serde_json::json!({
        "id": product.id,
        "artisan_id": product.artisan_id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "category": product.category,
        "image_url": product.image_url,
        "created_at": product.created_at,
        "images": images,
    })))
}

async fn delete_product(
    State(pool): State<PgPool>,
    headers: HeaderMap,
    Path((artisan_id, product_id)): Path<(Uuid, Uuid)>,
) -> AppResult<Json<serde_json::Value>> {
    verify_artisan_token(&headers, artisan_id)?;
    let _ = fetch_owned_product(&pool, artisan_id, product_id).await?;

    sqlx::query("DELETE FROM products WHERE id = $1")
        .bind(product_id)
        .execute(&pool)
        .await?;

    Ok(Json(serde_json::json!({ "deleted": true })))
}

async fn duplicate_product(
    State(pool): State<PgPool>,
    headers: HeaderMap,
    Path((artisan_id, product_id)): Path<(Uuid, Uuid)>,
) -> AppResult<Json<serde_json::Value>> {
    verify_artisan_token(&headers, artisan_id)?;
    let existing = fetch_owned_product(&pool, artisan_id, product_id).await?;
    let images = fetch_product_images(&pool, product_id).await?;
    let image_urls: Vec<String> = images.iter().map(|i| i.image_url.clone()).collect();
    let primary = image_urls.first().cloned().unwrap_or(existing.image_url.clone());

    let product = sqlx::query_as::<_, Product>(
        r#"
        INSERT INTO products (artisan_id, name, description, price, category, image_url, availability)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        "#,
    )
    .bind(artisan_id)
    .bind(format!("{} (copy)", existing.name))
    .bind(&existing.description)
    .bind(existing.price)
    .bind(&existing.category)
    .bind(primary)
    .bind(&existing.availability)
    .fetch_one(&pool)
    .await?;

    let new_images = if image_urls.is_empty() {
        Vec::new()
    } else {
        replace_product_images(&pool, product.id, &image_urls).await?
    };

    Ok(Json(serde_json::json!({
        "id": product.id,
        "name": product.name,
        "images": new_images,
    })))
}

async fn fetch_owned_product(
    pool: &PgPool,
    artisan_id: Uuid,
    product_id: Uuid,
) -> AppResult<Product> {
    let product = sqlx::query_as::<_, Product>(
        "SELECT * FROM products WHERE id = $1 AND artisan_id = $2",
    )
    .bind(product_id)
    .bind(artisan_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound("product not found".into()))?;

    Ok(product)
}

async fn list_orders(
    State(pool): State<PgPool>,
    Path(artisan_id): Path<Uuid>,
) -> AppResult<Json<Vec<OrderWithProduct>>> {
    let _ = sqlx::query_as::<_, Artisan>("SELECT * FROM artisans WHERE id = $1")
        .bind(artisan_id)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::NotFound("artisan not found".into()))?;

    let orders = sqlx::query_as::<_, OrderWithProduct>(
        r#"
        SELECT o.id, o.product_id, o.buyer_name, o.buyer_email, o.buyer_phone,
               o.buyer_message, o.quantity, o.total_price, o.status, o.created_at,
               p.name AS product_name, p.image_url AS product_image_url
        FROM orders o
        JOIN products p ON p.id = o.product_id
        WHERE p.artisan_id = $1
        ORDER BY o.created_at DESC
        "#,
    )
    .bind(artisan_id)
    .fetch_all(&pool)
    .await?;

    Ok(Json(orders))
}

async fn update_order_status(
    State(pool): State<PgPool>,
    headers: HeaderMap,
    Path((artisan_id, order_id)): Path<(Uuid, Uuid)>,
    Json(body): Json<UpdateOrderStatus>,
) -> AppResult<Json<Order>> {
    verify_artisan_token(&headers, artisan_id)?;
    let status = body.status.trim().to_lowercase();
    if !ORDER_STATUSES.contains(&status.as_str()) {
        return Err(AppError::BadRequest(format!(
            "status must be one of: {}",
            ORDER_STATUSES.join(", ")
        )));
    }

    let order = sqlx::query_as::<_, Order>(
        r#"
        UPDATE orders o SET status = $3
        FROM products p
        WHERE o.id = $1 AND o.product_id = p.id AND p.artisan_id = $2
        RETURNING o.*
        "#,
    )
    .bind(order_id)
    .bind(artisan_id)
    .bind(status)
    .fetch_optional(&pool)
    .await?
    .ok_or_else(|| AppError::NotFound("order not found".into()))?;

    Ok(Json(order))
}
