use moka::future::Cache;
use std::sync::{Arc, OnceLock};
use std::time::Duration;
use uuid::Uuid;

static CACHE: OnceLock<Arc<AppCache>> = OnceLock::new();

pub fn cache() -> Arc<AppCache> {
    CACHE.get_or_init(AppCache::new).clone()
}

pub struct AppCache {
    products_list: Cache<String, Vec<serde_json::Value>>,
    product_detail: Cache<Uuid, serde_json::Value>,
    artisans_list: Cache<String, Vec<serde_json::Value>>,
    artisans_featured: Cache<String, Vec<serde_json::Value>>,
    artisan_detail: Cache<Uuid, serde_json::Value>,
    artisan_products: Cache<Uuid, Vec<serde_json::Value>>,
}

impl AppCache {
    fn new() -> Arc<Self> {
        let ttl_secs: u64 = std::env::var("CACHE_TTL_SECS")
            .ok()
            .and_then(|s| s.parse().ok())
            .unwrap_or(120);

        let ttl = Duration::from_secs(ttl_secs);

        tracing::info!("API cache enabled (TTL {ttl_secs}s)");

        Arc::new(Self {
            products_list: Cache::builder()
                .max_capacity(200)
                .time_to_live(ttl)
                .build(),
            product_detail: Cache::builder()
                .max_capacity(500)
                .time_to_live(ttl)
                .build(),
            artisans_list: Cache::builder()
                .max_capacity(10)
                .time_to_live(ttl)
                .build(),
            artisans_featured: Cache::builder()
                .max_capacity(10)
                .time_to_live(ttl)
                .build(),
            artisan_detail: Cache::builder()
                .max_capacity(200)
                .time_to_live(ttl)
                .build(),
            artisan_products: Cache::builder()
                .max_capacity(200)
                .time_to_live(ttl)
                .build(),
        })
    }

    pub async fn products_list(&self, key: &str) -> Option<Vec<serde_json::Value>> {
        self.products_list.get(key).await
    }

    pub async fn set_products_list(&self, key: String, value: Vec<serde_json::Value>) {
        self.products_list.insert(key, value).await;
    }

    pub async fn product_detail(&self, id: Uuid) -> Option<serde_json::Value> {
        self.product_detail.get(&id).await
    }

    pub async fn set_product_detail(&self, id: Uuid, value: serde_json::Value) {
        self.product_detail.insert(id, value).await;
    }

    pub async fn artisans_list(&self) -> Option<Vec<serde_json::Value>> {
        self.artisans_list.get("all").await
    }

    pub async fn set_artisans_list(&self, value: Vec<serde_json::Value>) {
        self.artisans_list.insert("all".into(), value).await;
    }

    pub async fn artisans_featured(&self) -> Option<Vec<serde_json::Value>> {
        self.artisans_featured.get("featured").await
    }

    pub async fn set_artisans_featured(&self, value: Vec<serde_json::Value>) {
        self.artisans_featured.insert("featured".into(), value).await;
    }

    pub async fn artisan_detail(&self, id: Uuid) -> Option<serde_json::Value> {
        self.artisan_detail.get(&id).await
    }

    pub async fn set_artisan_detail(&self, id: Uuid, value: serde_json::Value) {
        self.artisan_detail.insert(id, value).await;
    }

    pub async fn artisan_products(&self, id: Uuid) -> Option<Vec<serde_json::Value>> {
        self.artisan_products.get(&id).await
    }

    pub async fn set_artisan_products(&self, id: Uuid, value: Vec<serde_json::Value>) {
        self.artisan_products.insert(id, value).await;
    }

    pub fn invalidate_products(&self) {
        self.products_list.invalidate_all();
        self.product_detail.invalidate_all();
        self.artisan_products.invalidate_all();
        tracing::debug!("cache invalidated: products");
    }

    pub fn invalidate_artisans(&self) {
        self.artisans_list.invalidate_all();
        self.artisans_featured.invalidate_all();
        self.artisan_detail.invalidate_all();
        self.invalidate_products();
        tracing::debug!("cache invalidated: artisans + products");
    }
}
