use marketplace_cmr::{
    config::Config,
    domain::marketplace::service::Service,
    server::{Server, ServerConfig},
    telemetry,
};

#[tokio::main]
async fn main() -> color_eyre::Result<()> {
    color_eyre::install()?;
    telemetry::init_tracing();

    // Load configuration
    let config = Config::load()?;
    tracing::info!("Loaded configuration: {:?}", config);

    let service = Service::new();

    let server_config = ServerConfig {
        host: &config.server.host,
        port: config.server.port,
    };
    let server = Server::new(service, server_config).await?;
    server.run().await
}
