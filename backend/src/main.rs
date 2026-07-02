mod ai;
mod auth;
mod db;
mod email;
mod error;
mod images;
mod middleware;
mod models;
mod routes;

use axum::http::HeaderValue;
use std::net::SocketAddr;
use std::sync::Arc;

use axum::routing::get;
use axum::Router;
use routes::ai::AiState;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use ai::groq_client::GroqClient;
use db::{create_pool, run_migrations};

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "kigezimade_backend=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let database_url =
        std::env::var("DATABASE_URL").expect("DATABASE_URL must be set in .env");
    let groq_api_key =
        std::env::var("GROQ_API_KEY").expect("GROQ_API_KEY must be set in .env");
    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "3000".into())
        .parse()
        .expect("PORT must be a valid number");

    let pool = create_pool(&database_url)
        .await
        .expect("failed to connect to database");

    run_migrations(&pool)
        .await
        .expect("failed to run migrations");

    let groq = Arc::new(GroqClient::new(groq_api_key));
    let ai_state = AiState { groq };

    let cors_origin = std::env::var("CORS_ORIGIN").unwrap_or_else(|_| "http://localhost:5173".into());

    let cors = CorsLayer::new()
        .allow_origin(
            cors_origin
                .parse::<HeaderValue>()
                .expect("invalid CORS_ORIGIN"),
        )
        .allow_methods(Any)
        .allow_headers(Any);

    let api_routes = Router::new()
        .nest("/auth", routes::auth::router())
        .nest("/artisans", routes::artisans::router())
        .nest("/products", routes::products::router())
        .nest("/orders", routes::orders::router())
        .nest("/reports", routes::reports::router())
        .with_state(pool.clone());

    let ai_routes = Router::new()
        .merge(routes::ai::router())
        .with_state((pool, ai_state));

    let app = Router::new()
        .route("/health", get(|| async { "ok" }))
        .nest("/api", api_routes)
        .nest("/api/ai", ai_routes)
        .layer(cors)
        .layer(TraceLayer::new_for_http());

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("Kigezi Made API listening on {addr}");

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("failed to bind port");

    axum::serve(listener, app)
        .await
        .expect("server error");
}
