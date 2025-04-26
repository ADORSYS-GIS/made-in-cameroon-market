use actix_web::web;
use crate::handlers::{auth, vendor, document};
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
                    // Vendor routes
                    .service(
                        web::scope("/vendors")
                            .route("/pending", web::get().to(vendor::get_pending_vendors))
                            .route("/{id}", web::get().to(vendor::get_vendor_by_id))
                            .route("/{id}", web::patch().to(vendor::update_vendor_status))
                    )
                    // Document routes
                    .service(
                        web::scope("/documents")
                            .route("/upload", web::post().to(document::upload_document))
                            .route("/{key}", web::get().to(document::get_document))
                    )
            )
    );
}