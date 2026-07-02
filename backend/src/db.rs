use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use std::time::Duration;

pub async fn create_pool(database_url: &str) -> Result<PgPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(10)
        .acquire_timeout(Duration::from_secs(30))
        .connect(database_url)
        .await
}

pub async fn run_migrations(pool: &PgPool) -> Result<(), sqlx::Error> {
    let migration_sql = [
        include_str!("../migrations/001_initial_schema.sql"),
        include_str!("../migrations/002_seed_data.sql"),
        include_str!("../migrations/003_product_images.sql"),
        include_str!("../migrations/004_artisan_auth.sql"),
        include_str!("../migrations/005_orders_enhanced.sql"),
        include_str!("../migrations/006_enhancements.sql"),
    ];

    for sql in migration_sql {
        // Run each statement separately; ignore "already exists" errors for idempotent local dev
        for statement in sql.split(';').map(str::trim).filter(|s| !s.is_empty()) {
            if let Err(e) = sqlx::query(statement).execute(pool).await {
                let msg = e.to_string();
                if !msg.contains("already exists") && !msg.contains("duplicate key") {
                    return Err(e);
                }
            }
        }
    }

    Ok(())
}
