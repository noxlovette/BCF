use crate::auth::jwt::Claims;
use crate::db::error::DbError;
use crate::db::init::AppState;
use crate::models::formulate::{Formula, FormulaCreatePayload, FormulaWithIngredients, FormulaWithIngUpdate, FormulaIngredient};
use axum::extract::Path;
use axum::{extract::State, Json};

pub async fn fetch_formula_with_ingredients(
    State(state): State<AppState>,
    claims: Claims,
    Path(formula_id): Path<String>,
) -> Result<Json<FormulaWithIngredients>, DbError> {
    let formula = sqlx::query_as!(
        Formula,
        r#"
        SELECT * FROM formulas 
        WHERE id = $1 AND user_id=$2
        "#,
        formula_id,
        claims.sub
    )
    .fetch_one(&state.db)
    .await?;

    let ingredients = sqlx::query_as!(
        FormulaIngredient,
        r#"
        SELECT * FROM formula_ingredients 
        WHERE formula_id = $1
        "#,
        formula_id
    )
    .fetch_all(&state.db)
    .await?;
    
    Ok(Json(FormulaWithIngredients { formula, ingredients }))
    
}

pub async fn create_formula(
    State(state): State<AppState>,
    claims: Claims,
    Json(payload): Json<FormulaCreatePayload>,
) -> Result<Json<Formula>, DbError> {

    let formula = sqlx::query_as!(
        Formula,
        r#"
        INSERT INTO formulas (id, user_id, title, description, solvent)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        "#,
        nanoid::nanoid!(),
        claims.sub,
        payload.title,
        payload.description,
        payload.solvent.unwrap_or_else(|| "Ethanol".to_string())
    )
    .fetch_one(&state.db)
    .await?;

    Ok(Json(formula))
}

pub async fn update_formula(
    State(state): State<AppState>,
    claims: Claims,
    Path(formula_id): Path<String>,
    Json(payload): Json<FormulaWithIngUpdate>,
) -> Result<Json<FormulaWithIngredients>, DbError> {
    // Step 1: Update the formula
    let formula = sqlx::query_as!(
        Formula,
        r#"
        UPDATE formulas 
        SET 
            title = COALESCE($1, title),
            description = COALESCE($2, description),
            solvent = COALESCE($3, solvent)
        WHERE id = $4 AND user_id = $5
        RETURNING *
        "#,
        payload.formula.title,
        payload.formula.description,
        payload.formula.solvent,
        formula_id,
        claims.sub
    )
    .fetch_one(&state.db)
    .await?;

    let mut tx = state.db.begin().await?;

    // Step 2: Remove Ingredients That Are No Longer in Payload
    sqlx::query!(
        r#"
        DELETE FROM formula_ingredients
        WHERE formula_id = $1 AND id NOT IN (
            SELECT UNNEST($2::text[])
        )
        "#,
        formula_id,
        &payload.ingredients.iter()
        .filter_map(|i| i.id.clone()).collect::<Vec<String>>()
    )
    .execute(&mut *tx)
    .await?;

    // Step 3: Upsert (Insert or Update) Ingredients
    for ingredient in &payload.ingredients {
    let ing_id = ingredient.id.clone().unwrap_or_else(|| nanoid::nanoid!());
    sqlx::query!(
        r#"
        INSERT INTO formula_ingredients (id, formula_id, name, amount, unit, volatility, percentage, counterpart_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE
        SET 
            name = EXCLUDED.name,
            amount = EXCLUDED.amount,
            unit = EXCLUDED.unit,
            volatility = EXCLUDED.volatility,
            percentage = EXCLUDED.percentage,
            counterpart_id = EXCLUDED.counterpart_id
        RETURNING id
        "#,
        ing_id,
        formula_id,
        ingredient.name,
        ingredient.amount,
        ingredient.unit,
        ingredient.volatility,
        ingredient.percentage,
        ingredient.counterpart_id
    )
    .fetch_one(&mut *tx)
    .await?;
}

    tx.commit().await?;

    // Fetch updated ingredients
    let updated_ingredients = sqlx::query_as!(
        FormulaIngredient,
        r#"
        SELECT * FROM formula_ingredients WHERE formula_id = $1
        "#,
        formula_id
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(FormulaWithIngredients { formula, ingredients: updated_ingredients }))
}



pub async fn delete_formula(
    State(state): State<AppState>,
    claims: Claims,
    Path(collect_id): Path<String>,
) -> Result<Json<Formula>, DbError> {
    let formula = sqlx::query_as!(
        Formula,
        r#"
        DELETE FROM formulas
        WHERE id = $1 AND user_id = $2
        RETURNING *
        "#,
        collect_id,
        claims.sub
    )
    .fetch_one(&state.db)
    .await?;

    Ok(Json(formula))
}

pub async fn list_formulas(
    State(state): State<AppState>,
    claims: Claims,
) -> Result<Json<Vec<Formula>>, DbError> {
    let formulas = sqlx::query_as!(
        Formula,
        r#"
        SELECT * FROM formulas
        WHERE user_id = $1
        "#,
        claims.sub
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(formulas))
}
