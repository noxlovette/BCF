use crate::db::error::DbError;
use crate::db::init::AppState;
use crate::models::suggestion::{Suggestion, SuggestionPayload};
use crate::{auth::jwt::Claims, models::suggestion::UpdateSuggestion};
use axum::extract::{Json, Path, State};

pub async fn fetch_suggestion(
    State(state): State<AppState>,
    claims: Claims,
    Path(id): Path<String>,
) -> Result<Json<Option<Suggestion>>, DbError> {
    let suggestion = Suggestion::fetch(&state.db, &id, &claims.sub).await?;
    Ok(Json(suggestion))
}

#[axum::debug_handler]
pub async fn create_suggestion(
    State(state): State<AppState>,
    claims: Claims,
    Json(payload): Json<SuggestionPayload>,
) -> Result<Json<Option<Suggestion>>, DbError> {
    let suggestion = SuggestionPayload::create(payload, &state.db, &claims.sub).await?;
    Ok(Json(suggestion))
}

pub async fn list_suggestion(
    State(state): State<AppState>,
    claims: Claims,
) -> Result<Json<Vec<Suggestion>>, DbError> {
    let suggestions = Suggestion::list(&state.db, &claims.sub).await?;
    Ok(Json(suggestions))
}

pub async fn update_suggestion(
    State(state): State<AppState>,
    claims: Claims,
    Path(id): Path<String>,
    Json(payload): Json<UpdateSuggestion>,
) -> Result<Json<Suggestion>, DbError> {
    let updated = payload.update(&state.db, &id, &claims.sub).await?;

    Ok(Json(updated))
}

pub async fn delete_suggestion(
    State(state): State<AppState>,
    claims: Claims,
    Path(id): Path<String>,
) -> Result<Json<Suggestion>, DbError> {
    let deleted = Suggestion::delete(&state.db, &claims.sub, &id).await?;

    Ok(Json(deleted))
}
