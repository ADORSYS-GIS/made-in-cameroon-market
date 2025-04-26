use actix_web::{web, HttpResponse};
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::db::vendor;
use crate::error::AppError;
use crate::middleware::auth::AuthenticatedAdmin;
use crate::models::vendor::{UpdateVendorStatusRequest, PaginatedVendorResponse, VendorResponse};

// Get pending vendor applications (paginated)
pub async fn get_pending_vendors(
    db_pool: web::Data<PgPool>,
    query: web::Query<PaginationParams>,
    _: web::ReqData<AuthenticatedAdmin>, // Ensure admin is authenticated
) -> Result<HttpResponse, AppError> {
    let page = query.page.unwrap_or(1);
    let per_page = query.per_page.unwrap_or(10);
    
    // Validate pagination parameters
    if page < 1 || per_page < 1 || per_page > 100 {
        return Err(AppError::Validation("Invalid pagination parameters".to_string()));
    }
    
    // Get vendors with pagination
    let (vendors, total) = vendor::get_pending_vendors(&db_pool, page, per_page).await?;
    
    // Map to response type
    let vendor_responses: Vec<VendorResponse> = vendors
        .into_iter()
        .map(|v| VendorResponse {
            id: v.id,
            name: v.name,
            phone: v.phone,
            id_document_url: v.id_document_url,
            status: v.status,
            rejection_reason: v.rejection_reason,
            created_at: v.created_at,
            updated_at: v.updated_at,
        })
        .collect();
    
    let response = PaginatedVendorResponse {
        vendors: vendor_responses,
        total,
        page,
        per_page,
    };
    
    Ok(HttpResponse::Ok().json(response))
}

// Get details for a specific vendor
pub async fn get_vendor_by_id(
    db_pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    _: web::ReqData<AuthenticatedAdmin>, // Ensure admin is authenticated
) -> Result<HttpResponse, AppError> {
    let vendor_id = path.into_inner();
    
    // Get vendor
    let vendor = vendor::get_vendor_by_id(&db_pool, vendor_id)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Vendor with ID {} not found", vendor_id)))?;
    
    // Map to response type
    let response = VendorResponse {
        id: vendor.id,
        name: vendor.name,
        phone: vendor.phone,
        id_document_url: vendor.id_document_url,
        status: vendor.status,
        rejection_reason: vendor.rejection_reason,
        created_at: vendor.created_at,
        updated_at: vendor.updated_at,
    };
    
    Ok(HttpResponse::Ok().json(response))
}

// Update vendor status (approve/reject)
pub async fn update_vendor_status(
    db_pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    status_update: web::Json<UpdateVendorStatusRequest>,
    auth_admin: web::ReqData<AuthenticatedAdmin>,
) -> Result<HttpResponse, AppError> {
    let vendor_id = path.into_inner();
    
    // Validate request body
    status_update.validate()
        .map_err(|e| AppError::Validation(format!("Validation error: {}", e)))?;
    
    // Check if vendor exists and get current status
    let vendor = vendor::get_vendor_by_id(&db_pool, vendor_id)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Vendor with ID {} not found", vendor_id)))?;
    
    let old_status = vendor.status.clone();
    
    // Update vendor status
    let updated_vendor = vendor::update_vendor_status(
        &db_pool,
        vendor_id,
        &status_update,
    )
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Vendor with ID {} not found", vendor_id)))?;
    
    // Log status change
    vendor::log_vendor_status_change(
        &db_pool,
        vendor_id,
        auth_admin.admin_id,
        &old_status,
        &updated_vendor.status,
        status_update.rejection_reason.as_deref(),
    )
    .await?;
    
    // Map to response type
    let response = VendorResponse {
        id: updated_vendor.id,
        name: updated_vendor.name,
        phone: updated_vendor.phone,
        id_document_url: updated_vendor.id_document_url,
        status: updated_vendor.status,
        rejection_reason: updated_vendor.rejection_reason,
        created_at: updated_vendor.created_at,
        updated_at: updated_vendor.updated_at,
    };
    
    Ok(HttpResponse::Ok().json(response))
}

// Pagination query parameters
#[derive(serde::Deserialize)]
pub struct PaginationParams {
    pub page: Option<i64>,
    pub per_page: Option<i64>,
}