use tracing_subscriber::{EnvFilter, fmt, layer::SubscriberExt as _, util::SubscriberInitExt as _};

pub fn init_tracing() {
    // Initialize a minimal tracing configuration
    let env_filter = EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| EnvFilter::new("debug,tower_http=debug"));
    tracing_subscriber::registry()
        .with(fmt::layer())
        .with(env_filter)
        .init();
}
