use eid_server::{
    config::Config,
    domain::marketplace::ports::EidService,
    server::{Server, ServerConfig},
};

#[derive(Clone)]
struct MockService;

impl EidService for MockService {}

// Helper function to spawn a test server on a random port
pub async fn spawn_server() -> String {
    let config = {
        let mut config = Config::load().unwrap();
        // Use a random OS port
        config.server.port = 0;
        config
    };
    let eid_service = MockService;

    let server_config = ServerConfig {
        host: &config.server.host,
        port: config.server.port,
    };

    let server = Server::new(eid_service, server_config.clone())
        .await
        .unwrap();

    let port = server.port().unwrap();
    tokio::spawn(async move {
        server.run().await.expect("failed to run server");
    });

    format!("http://{}:{}", server_config.host, port)
}
