use axum::{
    extract::{Path, Query, State},
    routing::get,
    Json, Router,
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::cache;
use crate::error::{AppError, AppResult};
use crate::images::{fetch_product_images, replace_product_images};
use crate::models::artisan::Artisan;
use crate::models::product::{
    CreateProduct, Product, ProductDetail, ProductWithArtisan, UpdateProduct,
};

#[derive(Debug, serde::Deserialize)]
pub struct ProductFilters {
    pub category: Option<String>,
    pub district: Option<String>,
    pub search: Option<String>,
}

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/", get(list_products).post(create_product))
        .route(
            "/{id}",
            get(get_product)
                .put(update_product)
                .delete(delete_product),
        )
}

fn collect_image_urls(body: &CreateProduct) -> Vec<String> {
    let mut urls: Vec<String> = body
        .image_urls
        .clone()
        .unwrap_or_default()
        .into_iter()
        .filter(|u| !u.trim().is_empty())
        .collect();

    if urls.is_empty() {
        if let Some(url) = &body.image_url {
            if !url.trim().is_empty() {
                urls.push(url.trim().to_string());
            }
        }
    }

    urls
}

fn collect_update_image_urls(body: &UpdateProduct) -> Option<Vec<String>> {
    if let Some(urls) = &body.image_urls {
        return Some(
            urls.iter()
                .filter(|u| !u.trim().is_empty())
                .map(|u| u.trim().to_string())
                .collect(),
        );
    }

    body.image_url.as_ref().map(|url| vec![url.trim().to_string()])
}

fn products_filter_key(filters: &ProductFilters) -> String {
    format!(
        "c={}|d={}|s={}",
        filters.category.as_deref().unwrap_or(""),
        filters.district.as_deref().unwrap_or(""),
        filters.search.as_deref().map(str::trim).unwrap_or(""),
    )
}

async fn list_products(
    State(pool): State<PgPool>,
    Query(filters): Query<ProductFilters>,
) -> AppResult<Json<Vec<serde_json::Value>>> {
    let cache_key = products_filter_key(&filters);
    if let Some(hit) = cache::cache().products_list(&cache_key).await {
        return Ok(Json(hit));
    }

    let results = fetch_products_list(&pool, &filters).await?;
    cache::cache()
        .set_products_list(cache_key, results.clone())
        .await;
    Ok(Json(results))
}

async fn fetch_products_list(
    pool: &PgPool,
    filters: &ProductFilters,
) -> AppResult<Vec<serde_json::Value>> {
    let mut query = String::from(
        r#"
        SELECT p.id, p.artisan_id, p.name, p.description, p.price, p.category, p.image_url,
               p.availability, p.view_count, p.created_at,
               a.name AS artisan_name, a.district AS artisan_district, a.verified AS artisan_verified
        FROM products p
        JOIN artisans a ON a.id = p.artisan_id
        WHERE 1=1
        "#,
    );

    let mut bind_idx = 1;
    let mut binds: Vec<String> = Vec::new();

    if let Some(ref cat) = filters.category {
        if !cat.is_empty() && cat != "all" {
            query.push_str(&format!(" AND p.category = ${bind_idx}"));
            binds.push(cat.clone());
            bind_idx += 1;
        }
    }

    if let Some(ref district) = filters.district {
        if !district.is_empty() && district != "all" {
            query.push_str(&format!(" AND a.district = ${bind_idx}"));
            binds.push(district.clone());
            bind_idx += 1;
        }
    }

    if let Some(ref search) = filters.search {
        if !search.trim().is_empty() {
            query.push_str(&format!(
                " AND (p.name ILIKE ${bind_idx} OR p.description ILIKE ${bind_idx} OR a.name ILIKE ${bind_idx})"
            ));
            binds.push(format!("%{}%", search.trim()));
            let _ = bind_idx;
        }
    }

    query.push_str(" ORDER BY p.created_at DESC");

    let mut q = sqlx::query_as::<_, ProductWithArtisanRow>(&query);
    for b in &binds {
        q = q.bind(b);
    }

    let rows = q.fetch_all(pool).await?;

    let mut results = Vec::new();
    for r in rows {
        let artisan_name = r.artisan_name.clone();
        let artisan_district = r.artisan_district.clone();
        let artisan_verified = r.artisan_verified;
        let product = r.into_product();
        let images = fetch_product_images(pool, product.id).await?;
        let item = ProductWithArtisan {
            product,
            artisan_name,
            artisan_district,
        };
        results.push(serde_json::json!({
            "id": item.product.id,
            "artisan_id": item.product.artisan_id,
            "name": item.product.name,
            "description": item.product.description,
            "price": item.product.price,
            "category": item.product.category,
            "image_url": item.product.image_url,
            "availability": item.product.availability,
            "view_count": item.product.view_count,
            "created_at": item.product.created_at,
            "artisan_name": item.artisan_name,
            "artisan_district": item.artisan_district,
            "artisan_verified": artisan_verified,
            "images": images,
        }));
    }

    Ok(results)
}

#[derive(sqlx::FromRow)]
struct ProductWithArtisanRow {
    id: Uuid,
    artisan_id: Uuid,
    name: String,
    description: String,
    price: rust_decimal::Decimal,
    category: String,
    image_url: String,
    availability: String,
    view_count: i32,
    created_at: chrono::DateTime<chrono::Utc>,
    artisan_name: String,
    artisan_district: String,
    artisan_verified: bool,
}

impl ProductWithArtisanRow {
    fn into_product(self) -> Product {
        Product {
            id: self.id,
            artisan_id: self.artisan_id,
            name: self.name,
            description: self.description,
            price: self.price,
            category: self.category,
            image_url: self.image_url,
            availability: self.availability,
            view_count: self.view_count,
            created_at: self.created_at,
        }
    }
}

async fn get_product(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> AppResult<Json<serde_json::Value>> {
    if let Some(hit) = cache::cache().product_detail(id).await {
        let pool = pool.clone();
        tokio::spawn(async move {
            let _ = sqlx::query("UPDATE products SET view_count = view_count + 1 WHERE id = $1")
                .bind(id)
                .execute(&pool)
                .await;
        });
        return Ok(Json(hit));
    }

    let product = sqlx::query_as::<_, Product>("SELECT * FROM products WHERE id = $1")
        .bind(id)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::NotFound("product not found".into()))?;

    let _ = sqlx::query("UPDATE products SET view_count = view_count + 1 WHERE id = $1")
        .bind(id)
        .execute(&pool)
        .await?;

    let artisan = sqlx::query_as::<_, Artisan>("SELECT * FROM artisans WHERE id = $1")
        .bind(product.artisan_id)
        .fetch_one(&pool)
        .await?;

    let images = fetch_product_images(&pool, product.id).await?;
    let detail = ProductDetail {
        product,
        artisan,
        images,
    };

    let value = serde_json::to_value(&detail).unwrap();
    cache::cache().set_product_detail(id, value.clone()).await;

    Ok(Json(value))
}

async fn create_product(
    State(pool): State<PgPool>,
    Json(body): Json<CreateProduct>,
) -> AppResult<Json<serde_json::Value>> {
    if body.name.trim().is_empty() {
        return Err(AppError::BadRequest("name is required".into()));
    }

    let artisan_exists: bool =
        sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM artisans WHERE id = $1)")
            .bind(body.artisan_id)
            .fetch_one(&pool)
            .await?;

    if !artisan_exists {
        return Err(AppError::BadRequest("artisan not found".into()));
    }

    let image_urls = collect_image_urls(&body);
    let primary_image = image_urls.first().cloned().unwrap_or_default();

    let availability = body
        .availability
        .unwrap_or_else(|| "in_stock".into());

    let product = sqlx::query_as::<_, Product>(
        r#"
        INSERT INTO products (artisan_id, name, description, price, category, image_url, availability)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        "#,
    )
    .bind(body.artisan_id)
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

    cache::cache().invalidate_products();

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
    Path(id): Path<Uuid>,
    Json(body): Json<UpdateProduct>,
) -> AppResult<Json<serde_json::Value>> {
    let existing = sqlx::query_as::<_, Product>("SELECT * FROM products WHERE id = $1")
        .bind(id)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::NotFound("product not found".into()))?;

    let image_urls = collect_update_image_urls(&body);

    let mut primary_image = body
        .image_url
        .clone()
        .unwrap_or_else(|| existing.image_url.clone());

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
    .bind(id)
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

    cache::cache().invalidate_products();

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
    Path(id): Path<Uuid>,
) -> AppResult<Json<serde_json::Value>> {
    let result = sqlx::query("DELETE FROM products WHERE id = $1")
        .bind(id)
        .execute(&pool)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound("product not found".into()));
    }

    cache::cache().invalidate_products();

    Ok(Json(serde_json::json!({ "deleted": true })))
}
