use crate::auth::jwt::Claims;
use crate::db::error::DbError;
use crate::db::init::AppState;
use crate::models::browse::BrowseQuery;
use crate::models::collect::{CollectIngredient, CollectIngredientUpdate};
use axum::extract::{Json, Path, Query, State};

//todo add restriction to cas and user id
pub async fn upsert_collect_ing(
    State(state): State<AppState>,
    claims: Claims,
    Json(payload): Json<CollectIngredient>,
) -> Result<Json<CollectIngredient>, DbError> {
    let note = sqlx::query_as!(
        CollectIngredient,
        r#"
        INSERT INTO collection_ingredients (id, user_id, common_name, cas, other_names, markdown, amount, unit)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id, user_id) 
        DO UPDATE SET
            markdown = EXCLUDED.markdown,
            other_names = EXCLUDED.other_names,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *
        "#,
        nanoid::nanoid!(),
        claims.sub,
        payload.common_name,
        payload.cas,
        payload.other_names,
        payload.markdown,
        payload.amount,
        payload.unit
    )
    .fetch_one(&state.db)
    .await?;

    Ok(Json(note))
}

pub async fn update_ingredient(
    State(state): State<AppState>,
    claims: Claims,
    Path(collect_id): Path<String>,
    Json(payload): Json<CollectIngredientUpdate>,
) -> Result<Json<CollectIngredient>, DbError> {
    let collect_ing = sqlx::query_as!(
        CollectIngredient,
        r#"
    UPDATE collection_ingredients
    SET 
        common_name = COALESCE($3, common_name),
        markdown = COALESCE($4, markdown),
        amount = COALESCE($5, amount),
        unit = COALESCE($6, unit),
        cas = COALESCE($7, cas),
        other_names = COALESCE($8, other_names)
    WHERE id = $1 AND user_id = $2
    RETURNING *
    "#,
        collect_id,
        claims.sub,
        payload.common_name,
        payload.markdown,
        payload.amount,
        payload.unit,
        payload.cas,
        payload.other_names
    )
    .fetch_one(&state.db)
    .await?;

    Ok(Json(collect_ing))
}

pub async fn fetch_collect_ing(
    State(state): State<AppState>,
    claims: Claims,
    Path(collect_id): Path<String>,
) -> Result<Json<Option<CollectIngredient>>, DbError> {
    let collect_ing = sqlx::query_as!(
        CollectIngredient,
        r#"
        SELECT * FROM collection_ingredients
        WHERE id = $1 AND user_id = $2
        "#,
        collect_id,
        claims.sub
    )
    .fetch_optional(&state.db)
    .await?;

    Ok(Json(collect_ing))
}

pub async fn list_collect_ings(
    State(state): State<AppState>,
    Query(query): Query<BrowseQuery>,
    claims: Claims,
) -> Result<Json<Vec<CollectIngredient>>, DbError> {
    let page_size = query.page_size.unwrap_or(10);
    let page = query.page.unwrap_or(1);
    let offset = (page - 1) * page_size;

    let collect_ings = if let Some(search) = query.search {
        sqlx::query_as!(
            CollectIngredient,
            r#"
            SELECT *
            FROM collection_ingredients
            WHERE user_id = $4
            AND (
                common_name ILIKE $1
                OR other_names ILIKE $1
                OR cas ILIKE $1
            )
            ORDER BY common_name
            LIMIT $2 OFFSET $3
            "#,
            format!("%{}%", search),
            page_size as i32,
            offset as i32,
            claims.sub
        )
        .fetch_all(&state.db)
        .await?
    } else {
        sqlx::query_as!(
            CollectIngredient,
            "SELECT * FROM collection_ingredients WHERE user_id = $3 ORDER BY common_name LIMIT $1 OFFSET $2",
            page_size as i32,
            offset as i32,
            claims.sub
        )
        .fetch_all(&state.db)
        .await?
    };

    Ok(Json(collect_ings))
}

pub async fn delete_collect_ing(
    State(state): State<AppState>,
    claims: Claims,
    Path(collect_id): Path<String>,
) -> Result<Json<CollectIngredient>, DbError> {
    let collect_ing = sqlx::query_as!(
        CollectIngredient,
        r#"
        DELETE FROM collection_ingredients
        WHERE id = $1 AND user_id = $2
        RETURNING *
        "#,
        collect_id,
        claims.sub
    )
    .fetch_one(&state.db)
    .await?;

    Ok(Json(collect_ing))
}
