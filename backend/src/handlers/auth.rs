use actix_web::{web, HttpResponse};
use sqlx::PgPool;
use uuid::Uuid;

use crate::auth::{jwt, password};
use crate::config::Config;
use crate::db;
use crate::error::AppError;
use crate::models::admin::{AdminLogin, AdminResponse, LoginResponse};

pub async fn login(
    db_pool: web::Data<PgPool>,
    config: web::Data<Config>,
    login_data: web::Json<AdminLogin>,
) -> Result<HttpResponse, AppError> {
    // Find admin by email
    let admin = db::find_admin_by_email(&db_pool, &login_data.email)
        .await?
        .ok_or_else(|| AppError::Auth("Invalid email or password".to_string()))?;
    
    // Verify password
    if !password::verify_password(&login_data.password, &admin.hashed_password)? {
        return Err(AppError::Auth("Invalid email or password".to_string()));
    }
    
    // Generate JWT token
    let token = jwt::generate_token(admin.id, &admin.role, &config)?;
    
    // Create response
    let response = LoginResponse {
        token,
        admin: AdminResponse {
            id: admin.id,
            email: admin.email,
            role: admin.role,
        },
    };
    
    Ok(HttpResponse::Ok().json(response))
}

pub async fn register_admin(
    db_pool: web::Data<PgPool>,
    login_data: web::Json<AdminLogin>,
) -> Result<HttpResponse, AppError> {
    // Check if admin already exists
    let existing_admin = db::find_admin_by_email(&db_pool, &login_data.email).await?;
    
    if existing_admin.is_some() {
        return Err(AppError::Validation("Email already in use".to_string()));
    }
    
    // Hash password
    let hashed_password = password::hash_password(&login_data.password)?;
    
    // Create admin
    let admin = db::create_admin(&db_pool, &login_data.email, &hashed_password, "admin").await?;
    
    // Create response
    let response = AdminResponse {
        id: admin.id,
        email: admin.email,
        role: admin.role,
    };
    
    Ok(HttpResponse::Created().json(response))
}

pub async fn get_current_admin(
    db_pool: web::Data<PgPool>,
    auth_admin: web::ReqData<crate::middleware::auth::AuthenticatedAdmin>,
) -> Result<HttpResponse, AppError> {
    // Find admin by ID
    let admin = db::find_admin_by_id(&db_pool, auth_admin.admin_id)
        .await?
        .ok_or_else(|| AppError::NotFound("Admin not found".to_string()))?;
    
    // Create response
    let response = AdminResponse {
        id: admin.id,
        email: admin.email,
        role: admin.role,
    };
    
    Ok(HttpResponse::Ok().json(response))
}