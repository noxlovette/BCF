use crate::api::browse;
use crate::db::init::AppState;
use axum::routing::get;
use axum::Router;

pub fn browse_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(browse::list_browse))
        .route("/b/{id}", get(browse::fetch_browse))
}
