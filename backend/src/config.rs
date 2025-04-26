use std::env;

pub struct Config {
    pub jwt_secret: String,
    pub jwt_expires_in: i64, // seconds
}

impl Config {
    pub fn from_env() -> Self {
        Self {
            jwt_secret: env::var("JWT_SECRET").expect("JWT_SECRET must be set"),
            jwt_expires_in: env::var("JWT_EXPIRES_IN")
                .unwrap_or_else(|_| "86400".to_string()) // Default: 24 hours
                .parse::<i64>()
                .expect("JWT_EXPIRES_IN must be a valid integer"),
        }
    }
}