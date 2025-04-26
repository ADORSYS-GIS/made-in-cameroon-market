use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Vendor {
    pub id: Uuid,
    pub name: String,
    pub phone: String,
    pub id_document_url: String,
    pub status: VendorStatus,
    pub rejection_reason: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type, Clone, PartialEq)]
#[sqlx(type_name = "vendor_status", rename_all = "lowercase")]
pub enum VendorStatus {
    Pending,
    Approved,
    Rejected,
}

impl Default for VendorStatus {
    fn default() -> Self {
        Self::Pending
    }
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct CreateVendorRequest {
    #[validate(length(min = 3, max = 100, message = "Name must be between 3 and 100 characters"))]
    pub name: String,
    
    #[validate(length(min = 9, max = 15, message = "Phone number must be between 9 and 15 characters"))]
    #[validate(regex(path = "PHONE_REGEX", message = "Phone number format is invalid"))]
    pub phone: String,
    
    pub id_document_url: String,
}

use validator::ValidationError;

#[derive(Debug, Serialize, Deserialize, Validate)]
#[validate(schema(function = "validate_update_vendor_status", skip_on_field_errors = false))]
pub struct UpdateVendorStatusRequest {
    pub status: VendorStatus,
    pub rejection_reason: Option<String>,
}

fn validate_update_vendor_status(req: &UpdateVendorStatusRequest) -> Result<(), ValidationError> {
    if req.status == VendorStatus::Rejected && req.rejection_reason.is_none() {
        return Err(ValidationError::new("rejection_reason_required"));
    }
    Ok(())
}


lazy_static::lazy_static! {
    static ref PHONE_REGEX: regex::Regex = regex::Regex::new(r"^\+?[0-9]{9,15}$").unwrap();
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VendorResponse {
    pub id: Uuid,
    pub name: String,
    pub phone: String,
    pub id_document_url: String,
    pub status: VendorStatus,
    pub rejection_reason: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PaginatedVendorResponse {
    pub vendors: Vec<VendorResponse>,
    pub total: i64,
    pub page: i64,
    pub per_page: i64,
}