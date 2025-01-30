use crate::db::error::DbError;
use crate::db::init::AppState;
use crate::models::browse::{BrowseIngredient, BrowseQuery, PaginatedResponse};
use axum::extract::{Json, Path, Query, State};

pub async fn fetch_browse(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<Option<BrowseIngredient>>, DbError> {
    let lesson = sqlx::query_as!(
        BrowseIngredient,
        r#"
        SELECT *
        FROM ingredients
        WHERE id = $1
        "#,
        id,
    )
    .fetch_optional(&state.db)
    .await?;

    Ok(Json(lesson))
}

// Using PostgreSQL's built-in full-text search
pub async fn list_browse(
    State(state): State<AppState>,
    Query(query): Query<BrowseQuery>,
) -> Result<Json<Vec<BrowseIngredient>>, DbError> {
    let page_size = query.page_size.unwrap_or(10);
    let page = query.page.unwrap_or(1);
    let offset = (page - 1) * page_size;

    let ingredients = if let Some(search) = query.search {
        sqlx::query_as!(
            BrowseIngredient,
            r#"
            SELECT *
            FROM ingredients
            WHERE 
                common_name ILIKE $1 
                OR other_names ILIKE $1 
                OR cas ILIKE $1
            ORDER BY common_name
            LIMIT $2 OFFSET $3
            "#,
            format!("%{}%", search),
            page_size as i32,
            offset as i32
        )
        .fetch_all(&state.db)
        .await?
    } else {
        sqlx::query_as!(
            BrowseIngredient,
            "SELECT * FROM ingredients ORDER BY common_name LIMIT $1 OFFSET $2",
            page_size as i32,
            offset as i32
        )
        .fetch_all(&state.db)
        .await?
    };

    Ok(Json(ingredients))
}
