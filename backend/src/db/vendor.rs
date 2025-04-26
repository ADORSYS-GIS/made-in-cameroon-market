use sqlx::{postgres::PgPool, Error};
use uuid::Uuid;
use chrono::Utc;

use crate::models::vendor::{Vendor, VendorStatus, CreateVendorRequest, UpdateVendorStatusRequest};

pub async fn init_vendor_tables(pool: &PgPool) -> Result<(), Error> {
    // Create vendor_status enum if it doesn't exist
    sqlx::query(
        r#"
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vendor_status') THEN
                CREATE TYPE vendor_status AS ENUM ('pending', 'approved', 'rejected');
            END IF;
        END $$;
        "#,
    )
    .execute(pool)
    .await?;
    
    // Create vendors table if it doesn't exist
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS vendors (
            id UUID PRIMARY KEY,
            name VARCHAR NOT NULL,
            phone VARCHAR NOT NULL UNIQUE,
            id_document_url VARCHAR NOT NULL,
            status vendor_status NOT NULL DEFAULT 'pending',
            rejection_reason VARCHAR,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        "#,
    )
    .execute(pool)
    .await?;
    
    // Create index on status for faster queries
    sqlx::query(
        r#"
        CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors (status);
        "#,
    )
    .execute(pool)
    .await?;
    
    Ok(())
}

pub async fn create_vendor(
    pool: &PgPool,
    vendor_data: &CreateVendorRequest,
) -> Result<Vendor, Error> {
    let id = Uuid::new_v4();
    let now = Utc::now();
    
    sqlx::query_as::<_, Vendor>(
        r#"
        INSERT INTO vendors (id, name, phone, id_document_url, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, phone, id_document_url, status, rejection_reason, created_at, updated_at
        "#,
    )
    .bind(id)
    .bind(&vendor_data.name)
    .bind(&vendor_data.phone)
    .bind(&vendor_data.id_document_url)
    .bind(now)
    .bind(now)
    .fetch_one(pool)
    .await
}

pub async fn get_pending_vendors(
    pool: &PgPool,
    page: i64,
    per_page: i64,
) -> Result<(Vec<Vendor>, i64), Error> {
    let offset = (page - 1) * per_page;
    
    // Get vendors
    let vendors = sqlx::query_as::<_, Vendor>(
        r#"
        SELECT id, name, phone, id_document_url, status, rejection_reason, created_at, updated_at
        FROM vendors
        WHERE status = 'pending'
        ORDER BY created_at ASC
        LIMIT $1 OFFSET $2
        "#,
    )
    .bind(per_page)
    .bind(offset)
    .fetch_all(pool)
    .await?;
    
    // Get total count
    let total = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT COUNT(*) FROM vendors WHERE status = 'pending'
        "#,
    )
    .fetch_one(pool)
    .await?;
    
    Ok((vendors, total))
}

pub async fn get_vendor_by_id(pool: &PgPool, id: Uuid) -> Result<Option<Vendor>, Error> {
    sqlx::query_as::<_, Vendor>(
        r#"
        SELECT id, name, phone, id_document_url, status, rejection_reason, created_at, updated_at
        FROM vendors
        WHERE id = $1
        "#,
    )
    .bind(id)
    .fetch_optional(pool)
    .await
}

pub async fn update_vendor_status(
    pool: &PgPool,
    id: Uuid,
    status_update: &UpdateVendorStatusRequest,
) -> Result<Option<Vendor>, Error> {
    let now = Utc::now();
    
    sqlx::query_as::<_, Vendor>(
        r#"
        UPDATE vendors
        SET status = $1, 
            rejection_reason = $2,
            updated_at = $3
        WHERE id = $4
        RETURNING id, name, phone, id_document_url, status, rejection_reason, created_at, updated_at
        "#,
    )
    .bind(&status_update.status)
    .bind(&status_update.rejection_reason)
    .bind(now)
    .bind(id)
    .fetch_optional(pool)
    .await
}

pub async fn log_vendor_status_change(
    pool: &PgPool,
    vendor_id: Uuid,
    admin_id: Uuid,
    old_status: &VendorStatus,
    new_status: &VendorStatus,
    reason: Option<&str>,
) -> Result<(), Error> {
    sqlx::query(
        r#"
        INSERT INTO audit_logs (
            id, entity_type, entity_id, action_type, admin_id, details
        )
        VALUES (
            $1, 'vendor', $2, 'status_change', $3, 
            jsonb_build_object(
                'old_status', $4,
                'new_status', $5,
                'reason', $6
            )
        )
        "#,
    )
    .bind(Uuid::new_v4())
    .bind(vendor_id)
    .bind(admin_id)
    .bind(format!("{:?}", old_status).to_lowercase())
    .bind(format!("{:?}", new_status).to_lowercase())
    .bind(reason)
    .execute(pool)
    .await?;
    
    Ok(())
}