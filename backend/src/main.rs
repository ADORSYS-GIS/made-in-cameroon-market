use actix_cors::Cors;
use actix_web::{middleware::Logger, web, App, HttpServer};
use dotenv::dotenv;
use sqlx::postgres::PgPoolOptions;
use std::env;

mod auth;
mod config;
mod db;
mod error;
mod handlers;
mod middleware;
mod models;
mod routes;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));

    // Database connection setup
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let db_pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to create database connection pool");

    // Initialize database schema if needed
    db::init_db(&db_pool).await.expect("Database initialization failed");

    // App configuration
    log::info!("Starting server at http://localhost:8080");
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(Logger::default())
            .wrap(cors)
            .app_data(web::Data::new(db_pool.clone()))
            .app_data(web::Data::new(config::Config::from_env()))
            .configure(routes::configure)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}