//! interface that external modules use to interact with the domain.

// TODO : Implement the service layer.
pub trait EidService: Clone + Send + Sync + 'static {}
