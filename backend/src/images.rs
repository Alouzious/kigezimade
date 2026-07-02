use sqlx::PgPool;
use uuid::Uuid;

use crate::error::AppResult;
use crate::models::product_image::ProductImage;

pub async fn fetch_product_images(pool: &PgPool, product_id: Uuid) -> AppResult<Vec<ProductImage>> {
    let images = sqlx::query_as::<_, ProductImage>(
        "SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC, created_at ASC",
    )
    .bind(product_id)
    .fetch_all(pool)
    .await?;

    Ok(images)
}

pub async fn replace_product_images(
    pool: &PgPool,
    product_id: Uuid,
    image_urls: &[String],
) -> AppResult<Vec<ProductImage>> {
    sqlx::query("DELETE FROM product_images WHERE product_id = $1")
        .bind(product_id)
        .execute(pool)
        .await?;

    let mut images = Vec::new();
    for (index, url) in image_urls.iter().filter(|u| !u.trim().is_empty()).enumerate() {
        let image = sqlx::query_as::<_, ProductImage>(
            r#"
            INSERT INTO product_images (product_id, image_url, sort_order)
            VALUES ($1, $2, $3)
            RETURNING *
            "#,
        )
        .bind(product_id)
        .bind(url.trim())
        .bind(index as i32)
        .fetch_one(pool)
        .await?;
        images.push(image);
    }

    if let Some(first) = images.first() {
        sqlx::query("UPDATE products SET image_url = $2 WHERE id = $1")
            .bind(product_id)
            .bind(&first.image_url)
            .execute(pool)
            .await?;
    }

    Ok(images)
}
