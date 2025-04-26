use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error, HttpMessage,
};
use futures::future::{ready, LocalBoxFuture, Ready};
use std::future::Future;
use std::pin::Pin;
use std::rc::Rc;
use std::task::{Context, Poll};
use uuid::Uuid;

use crate::auth::jwt;
use crate::config::Config;
use crate::error::AppError;

#[derive(Debug, Clone)]
pub struct AuthenticatedAdmin {
    pub admin_id: Uuid,
    pub role: String,
}

pub struct Authentication;

impl<S, B> Transform<S, ServiceRequest> for Authentication
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static, // Added + 'static
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = AuthenticationMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(AuthenticationMiddleware {
            service: Rc::new(service),
        }))
    }
}

pub struct AuthenticationMiddleware<S> {
    service: Rc<S>,
}

impl<S, B> Service<ServiceRequest> for AuthenticationMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static, // Added + 'static
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let service = Rc::clone(&self.service);
        
        Box::pin(async move {
            // Extract authorization header
            let auth_header = req
                .headers()
                .get("Authorization")
                .and_then(|h| h.to_str().ok())
                .and_then(|auth_value| {
                    if auth_value.starts_with("Bearer ") {
                        Some(auth_value[7..].to_string())
                    } else {
                        None
                    }
                });
            
            let token = match auth_header {
                Some(token) => token,
                None => {
                    return Err(actix_web::error::ErrorUnauthorized(
                        AppError::Auth("Missing authorization token".to_string()),
                    ));
                }
            };
            
            // Validate JWT token
            let config = req
                .app_data::<actix_web::web::Data<Config>>()
                .expect("Config not found in app_data");
            
            let claims = match jwt::validate_token(&token, config.get_ref()) {
                Ok(claims) => claims,
                Err(e) => {
                    return Err(actix_web::error::ErrorUnauthorized(e));
                }
            };
            
            // Parse admin ID from subject claim
            let admin_id = match Uuid::parse_str(&claims.sub) {
                Ok(id) => id,
                Err(_) => {
                    return Err(actix_web::error::ErrorUnauthorized(
                        AppError::Auth("Invalid admin ID in token".to_string()),
                    ));
                }
            };
            
            // Store admin information in request extensions
            req.extensions_mut().insert(AuthenticatedAdmin {
                admin_id,
                role: claims.role,
            });
            
            // Pass request to the next service
            service.call(req).await
        })
    }
}