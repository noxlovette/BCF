use crate::api::formulate;
use crate::db::init::AppState;
use axum::routing::{get, post};
use axum::Router;

pub fn formulate_routes() -> Router<AppState> {
    Router::new()
        .route(
            "/",
            post(formulate::create_formula).get(formulate::list_formulas),
        )
        .route(
            "/formula/{formula_id}",
            get(formulate::fetch_formula_with_ingredients)
                .patch(formulate::update_formula)
                .delete(formulate::delete_formula),
        )
}
