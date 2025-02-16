use crate::db::error::DbError;
use crate::db::init::AppState;
use crate::models::browse::{BrowseIngredient, BrowseIngredientUpdate, BrowseIngredientWithSuggestions, BrowseQuery};
use crate::models::suggestion::Suggestion;
use axum::extract::{Json, Path, Query, State};
use axum::response::IntoResponse;
use hyper::StatusCode;

pub async fn fetch_browse(
    State(state): State<AppState>,
    Path(slug): Path<String>,
) -> Result<Json<Option<BrowseIngredient>>, DbError> {
    let ingredient = sqlx::query_as!(
        BrowseIngredient,
        r#"
        WITH descriptor_info AS (
            SELECT 
                i.*, 
                array_remove(array_agg (DISTINCT d.name), NULL) as descriptors,
                array_remove(array_agg (DISTINCT d.colour), NULL) as colours
            FROM ingredients i
            LEFT JOIN ingredient_descriptors id ON i.id = id.ingredient_id 
            LEFT JOIN descriptors d ON id.descriptor_id = d.id
            WHERE i.slug = $1
            GROUP BY i.id
        )
        SELECT * FROM descriptor_info
        "#,
        slug,
    )
    .fetch_optional(&state.db)
    .await?;

    Ok(Json(ingredient))
}

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
            WITH descriptor_info AS (
                SELECT 
                    i.*,
                    array_remove(array_agg(DISTINCT d.name), NULL) AS descriptors,
                    array_remove(array_agg(DISTINCT d.colour), NULL) AS colours
                FROM ingredients i
                LEFT JOIN ingredient_descriptors id ON i.id = id.ingredient_id
                LEFT JOIN descriptors d ON id.descriptor_id = d.id
                WHERE i.common_name ILIKE $1 
                    OR i.other_names ILIKE $1 
                    OR i.cas ILIKE $1
                    OR d.name ILIKE $1  -- Add descriptor search
                GROUP BY i.id
            )
            SELECT * FROM descriptor_info
            ORDER BY updated_at DESC
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
            r#"
            WITH descriptor_info AS (
                SELECT 
                    i.*,
                    array_remove(array_agg(DISTINCT d.name), NULL) AS descriptors,
                    array_remove(array_agg(DISTINCT d.colour), NULL) AS colours
                FROM ingredients i
                LEFT JOIN ingredient_descriptors id ON i.id = id.ingredient_id
                LEFT JOIN descriptors d ON id.descriptor_id = d.id
                GROUP BY i.id
            )
            SELECT * FROM descriptor_info
            ORDER BY updated_at DESC
            LIMIT $1 OFFSET $2
            "#,
            page_size as i32,
            offset as i32
        )
        .fetch_all(&state.db)
        .await?
    };

    Ok(Json(ingredients))
}



pub async fn fetch_browse_for_edit(
    State(state): State<AppState>,
    Path(slug): Path<String>,
) -> Result<Json<BrowseIngredientWithSuggestions>, DbError> {
    let ingredient = sqlx::query_as!(
        BrowseIngredient,
        r#"
        WITH descriptor_info AS (
            SELECT 
                i.*, 
                array_remove(array_agg (DISTINCT d.name), NULL) as descriptors,
                array_remove(array_agg (DISTINCT d.colour), NULL) as colours
            FROM ingredients i
            LEFT JOIN ingredient_descriptors id ON i.id = id.ingredient_id 
            LEFT JOIN descriptors d ON id.descriptor_id = d.id
            WHERE i.slug = $1
            GROUP BY i.id
        )
        SELECT * FROM descriptor_info
        "#,
        slug,
    )
    .fetch_one(&state.db)
    .await?;

    let suggestions = Suggestion::fetch_edit(&state.db, &ingredient.id).await?;

    Ok(Json(BrowseIngredientWithSuggestions { ingredient, suggestions }))
}

pub async fn update_browse_ingredient(
    State(state): State<AppState>,
    Path(slug): Path<String>,
    Json(payload): Json<BrowseIngredientUpdate>,
) -> impl IntoResponse {
    let result = sqlx::query!(
        r#"
    UPDATE ingredients
    SET 
        common_name = COALESCE($2, common_name),
        ing_description = COALESCE($3, ing_description),
        ing_type = COALESCE($4, ing_type),
        volatility = COALESCE($5, volatility),
        restricted = COALESCE($6, restricted),
        other_names = COALESCE($7, other_names),
        origin =COALESCE($8, origin),
        cas = COALESCE($9, cas)
    WHERE slug = $1
    "#,
        slug,
        payload.common_name,
        payload.ing_description,
        payload.ing_type,
        payload.volatility,
        payload.restricted,
        payload.other_names,
        payload.origin,
        payload.cas
    )
    .execute(&state.db)
    .await;

    match result {
        Ok(query_result) if query_result.rows_affected() > 0 => StatusCode::OK,
        Ok(_) => StatusCode::NOT_FOUND,
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR,
    }
}