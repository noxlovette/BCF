use crate::db::error::DbError;
use crate::db::init::AppState;
use crate::models::browse::{BrowseIngredient, BrowseQuery};
use axum::extract::{Json, Path, Query, State};

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
                array_remove(array_agg (DISTINCT d.name), NULL) as descriptors,
                array_remove(array_agg (DISTINCT d.colour), NULL) as colours
            FROM ingredients i
            LEFT JOIN ingredient_descriptors id ON i.id = id.ingredient_id
            LEFT JOIN descriptors d ON id.descriptor_id = d.id
            WHERE i.common_name ILIKE $1 
                OR i.other_names ILIKE $1 
                OR i.cas ILIKE $1
                OR d.name ILIKE $1  -- Add descriptor search
            GROUP BY i.id
            ORDER BY i.common_name
            LIMIT $2 OFFSET $3
        )
        SELECT * FROM descriptor_info
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
                    array_agg(DISTINCT d.name) as descriptors,
                    array_agg(DISTINCT d.colour) as colours
                FROM ingredients i
                LEFT JOIN ingredient_descriptors id ON i.id = id.ingredient_id
                LEFT JOIN descriptors d ON id.descriptor_id = d.id
                GROUP BY i.id
                ORDER BY i.common_name
                LIMIT $1 OFFSET $2
            )
            SELECT * FROM descriptor_info
            "#,
            page_size as i32,
            offset as i32
        )
        .fetch_all(&state.db)
        .await?
    };

    Ok(Json(ingredients))
}
