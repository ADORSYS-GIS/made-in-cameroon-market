use axum::http::StatusCode;

pub async fn health_check() -> StatusCode {
    StatusCode::OK
}

#[cfg(test)]
pub mod tests {
    use super::*;

    #[tokio::test]
    async fn test_health_check() {
        assert!(health_check().await == StatusCode::OK);
    }
}
