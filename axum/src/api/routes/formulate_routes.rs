use crate::api::formulate;
use crate::db::init::AppState;
use axum::routing::{get, patch, post};
use axum::Router;

// watch out - uses lessonIDs associated with the note
pub fn formulate_routes() -> Router<AppState> {
    Router::new()
        .route("/", post(formulate::create_formula))
        .route("/formula/{formula_id}",
        get(formulate::fetch_formula).patch(formulate::update_formula))
}
