use sqlx::{postgres::PgPool, Error};
use uuid::Uuid;
use crate::models::admin::Admin;

pub async fn init_db(pool: &PgPool) -> Result<(), Error> {
    // Create admins table if it doesn't exist
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS admins (
            id UUID PRIMARY KEY,
            email VARCHAR NOT NULL UNIQUE,
            hashed_password VARCHAR NOT NULL,
            role VARCHAR NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await?;
    
    Ok(())
}

pub async fn find_admin_by_email(pool: &PgPool, email: &str) -> Result<Option<Admin>, Error> {
    sqlx::query_as::<_, Admin>(
        "SELECT id, email, hashed_password, role FROM admins WHERE email = $1",
    )
    .bind(email)
    .fetch_optional(pool)
    .await
}

pub async fn find_admin_by_id(pool: &PgPool, id: Uuid) -> Result<Option<Admin>, Error> {
    sqlx::query_as::<_, Admin>(
        "SELECT id, email, hashed_password, role FROM admins WHERE id = $1",
    )
    .bind(id)
    .fetch_optional(pool)
    .await
}

pub async fn create_admin(
    pool: &PgPool,
    email: &str,
    hashed_password: &str,
    role: &str,
) -> Result<Admin, Error> {
    let id = Uuid::new_v4();
    
    sqlx::query_as::<_, Admin>(
        r#"
        INSERT INTO admins (id, email, hashed_password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, hashed_password, role
        "#,
    )
    .bind(id)
    .bind(email)
    .bind(hashed_password)
    .bind(role)
    .fetch_one(pool)
    .await
}

// src/middleware/auth.rs