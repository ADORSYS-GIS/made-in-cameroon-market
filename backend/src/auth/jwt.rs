use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::config::Config;
use crate::error::AppError;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,    // Subject (admin ID)
    pub role: String,   // Admin role
    pub exp: usize,     // Expiration time
    pub iat: usize,     // Issued at
}

pub fn generate_token(admin_id: Uuid, role: &str, config: &Config) -> Result<String, AppError> {
    let now = Utc::now();
    let expires_at = now + Duration::seconds(config.jwt_expires_in);
    
    let claims = Claims {
        sub: admin_id.to_string(),
        role: role.to_string(),
        exp: expires_at.timestamp() as usize,
        iat: now.timestamp() as usize,
    };
    
    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(config.jwt_secret.as_bytes()),
    )
    .map_err(|e| AppError::Internal(format!("Failed to generate JWT: {}", e)))
}

pub fn validate_token(token: &str, config: &Config) -> Result<Claims, AppError> {
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(config.jwt_secret.as_bytes()),
        &Validation::default(),
    )
    .map(|data| data.claims)
    .map_err(|_| AppError::Auth("Invalid token".to_string()))
}