use crate::api::collect;
use crate::db::init::AppState;
use axum::routing::get;
use axum::Router;

// watch out - uses lessonIDs associated with the note
pub fn collect_routes() -> Router<AppState> {
    Router::new()
        .route(
            "/",
            get(collect::list_collect_ings).post(collect::upsert_collect_ing),
        )
        .route(
            "/ci/{id}",
            get(collect::fetch_collect_ing)
                .patch(collect::update_ingredient)
                .delete(collect::delete_collect_ing),
        )
}
