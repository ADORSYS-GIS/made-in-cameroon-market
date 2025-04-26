use actix_web::{web, guard};
use crate::handlers::auth;
use crate::middleware::auth::Authentication;

pub fn configure(cfg: &mut web::ServiceConfig) {
    // Public routes
    cfg.service(
        web::scope("/api/admin")
            .route("/login", web::post().to(auth::login))
            .route("/register", web::post().to(auth::register_admin))
            // Protected routes
            .service(
                web::scope("")
                    .wrap(Authentication)
                    .route("/me", web::get().to(auth::get_current_admin))
            )
    );
}