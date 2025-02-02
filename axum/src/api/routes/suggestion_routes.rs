use crate::api::suggestion;
use crate::db::init::AppState;
use axum::routing::get;
use axum::Router;

pub fn suggestion_routes() -> Router<AppState> {
    Router::new()
        .route(
            "/",
            get(suggestion::list_suggestion).post(suggestion::create_suggestion),
        )
        .route(
            "/s/{id}",
            get(suggestion::fetch_suggestion)
                .patch(suggestion::update_suggestion)
                .delete(suggestion::delete_suggestion),
        )
}
