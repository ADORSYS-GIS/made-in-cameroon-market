use actix_multipart::Multipart;
use actix_web::{web, HttpResponse};
use futures::{StreamExt, TryStreamExt};
use std::io::Write;

use crate::error::AppError;
use crate::middleware::auth::AuthenticatedAdmin;

const MAX_FILE_SIZE: usize = 10 * 1024 * 1024; // 10MB

pub async fn upload_document(
    mut payload: Multipart,
    _: web::ReqData<AuthenticatedAdmin>,
) -> Result<HttpResponse, AppError> {
    while let Ok(Some(mut field)) = payload.try_next().await {
        let content_disposition = field.content_disposition();

        let filename = content_disposition
            .get_filename()
            .ok_or_else(|| AppError::Validation("No filename provided".to_string()))?
            .to_string();

        let content_type = field
            .content_type()
            .map(|ct| ct.to_string())
            .unwrap_or_else(|| "application/octet-stream".to_string());

        if !is_valid_document_type(&content_type) {
            return Err(AppError::Validation(
                "Invalid file type. Only images and PDFs are allowed.".to_string(),
            ));
        }

        let mut file_data = Vec::new();
        let mut size: usize = 0;

        while let Some(chunk) = field.next().await {
            let data = chunk.map_err(|e| {
                AppError::Internal(format!("Error reading file chunk: {}", e))
            })?;

            size += data.len();
            if size > MAX_FILE_SIZE {
                return Err(AppError::Validation(
                    format!("File size exceeds the maximum allowed size of {} bytes", MAX_FILE_SIZE),
                ));
            }

            file_data.write_all(&data).map_err(|e| {
                AppError::Internal(format!("Error writing file data: {}", e))
            })?;
        }

        return Ok(HttpResponse::Ok().json(serde_json::json!({
            "message": "File received successfully",
            "filename": filename
        })));
    }

    Err(AppError::Validation("No file provided".to_string()))
}


// Check if the content type is allowed for ID documents
fn is_valid_document_type(content_type: &str) -> bool {
    match content_type {
        "image/jpeg" | "image/jpg" | "image/png" | "application/pdf" => true,
        _ => false,
    }
}

// Handler to retrieve a document (dummy version)
pub async fn get_document(
    path: web::Path<String>,
    _: web::ReqData<AuthenticatedAdmin>, // Ensure admin is authenticated
) -> Result<HttpResponse, AppError> {
    let document_key = path.into_inner();

    // Normally you'd fetch the document from disk or database.
    // Here we just return a dummy response for demonstration.
    Ok(HttpResponse::Ok()
        .content_type("application/octet-stream")
        .body(format!("Dummy content for document: {}", document_key)))
}
