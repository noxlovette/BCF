use crate::auth::jwt::Claims;
use crate::db::error::DbError;
use crate::db::init::AppState;
use crate::models::formulate::{Formula, FormulaCreatePayload, FormulaFull, FormulaPayload};
use axum::extract::Path;
use axum::{extract::State, Json};

pub async fn fetch_formula(
    State(pool): State<AppState>,
    claims: Claims,
    Path(formula_id): Path<String>,
) -> Result<Json<FormulaFull>, DbError> {
    let formula = sqlx::query_as!(
        FormulaFull,
        r#"
        SELECT f.*, 
            COALESCE(
                jsonb_agg(
                    jsonb_build_object(
                        'id', fi.id,
                        'name', fi.name,
                        'amount', fi.amount,
                        'unit', fi.unit,
                        'volatility', fi.volatility,
                        'percentage', fi.percentage
                    )
                ) FILTER (WHERE fi.id IS NOT NULL),
                '[]'::jsonb
            ) as "ingredients!"
        FROM formulas f
        LEFT JOIN formula_ingredients fi ON f.id = fi.formula_id
        WHERE f.id = $1 AND f.user_id = $2
        GROUP BY f.id
        "#,
        formula_id,
        claims.sub
    )
    .fetch_one(&pool.db)
    .await?
    .with_parsed_ingredients()
    .unwrap();

    Ok(Json(formula))
}

pub async fn create_formula(
    State(pool): State<AppState>,
    claims: Claims,
    Json(payload): Json<FormulaCreatePayload>,
) -> Result<Json<Formula>, DbError> {
    let mut tx = pool.db.begin().await?;

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
    .fetch_one(&mut *tx)
    .await?;

    tx.commit().await?;
    Ok(Json(formula))
}

pub async fn update_formula(
    State(pool): State<AppState>,
    claims: Claims,
    Path(formula_id): Path<String>,
    Json(payload): Json<FormulaPayload>,
) -> Result<Json<Formula>, DbError> {
    let mut tx = pool.db.begin().await?;

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
        payload.title,
        payload.description,
        payload.solvent.unwrap_or_else(|| "Ethanol".to_string()),
        formula_id,
        claims.sub
    )
    .fetch_one(&mut *tx)
    .await?;

    // Transform ingredients data
    let (ids, f_ids, names, amounts, units, vols, percs): (
        Vec<Option<String>>,
        Vec<Option<String>>,
        Vec<Option<String>>,
        Vec<Option<f64>>,
        Vec<Option<String>>,
        Vec<Option<String>>,
        Vec<Option<f32>>,
    ) = payload
        .ingredients
        .into_iter()
        .map(|i| {
            (
                Some(
                    i.id.filter(|id| !id.is_empty())
                        .unwrap_or_else(|| nanoid::nanoid!()),
                ),
                Some(formula.id.clone()),
                i.name,
                i.amount,
                i.unit,
                i.volatility,
                i.percentage,
            )
        })
        .unzip_n_vec();

    sqlx::query!(
        r#"
            INSERT INTO formula_ingredients
            (id, formula_id, name, amount, unit, volatility, percentage)
            SELECT * FROM UNNEST(
                $1::varchar[],
                $2::varchar[],
                $3::varchar[],
                $4::double precision[],
                $5::varchar[],
                $6::varchar[],
                $7::real[]
            )
            ON CONFLICT (id) DO UPDATE
            SET 
                name = COALESCE(EXCLUDED.name, formula_ingredients.name),
                amount = COALESCE(EXCLUDED.amount, formula_ingredients.amount),
                unit = COALESCE(EXCLUDED.unit, formula_ingredients.unit),
                volatility = COALESCE(EXCLUDED.volatility, formula_ingredients.volatility),
                percentage = COALESCE(EXCLUDED.percentage, formula_ingredients.percentage)
            "#,
        &ids.iter()
            .map(|x| x.clone().unwrap_or_default())
            .collect::<Vec<_>>(),
        &f_ids
            .iter()
            .map(|x| x.clone().unwrap_or_default())
            .collect::<Vec<_>>(),
        &names
            .iter()
            .map(|x| x.clone().unwrap_or_default())
            .collect::<Vec<_>>(),
        &amounts
            .iter()
            .map(|x| x.unwrap_or_default())
            .collect::<Vec<_>>(),
        &units
            .iter()
            .map(|x| x.clone().unwrap_or_default())
            .collect::<Vec<_>>(),
        &vols
            .iter()
            .map(|x| x.clone().unwrap_or_default())
            .collect::<Vec<_>>(),
        &percs
            .iter()
            .map(|x| x.unwrap_or_default())
            .collect::<Vec<_>>()
    )
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;
    Ok(Json(formula))
}

trait UnzipN<T1, T2, T3, T4, T5, T6, T7> {
    fn unzip_n_vec(
        self,
    ) -> (
        Vec<T1>,
        Vec<T2>,
        Vec<T3>,
        Vec<T4>,
        Vec<T5>,
        Vec<T6>,
        Vec<T7>,
    );
}

impl<I, T1, T2, T3, T4, T5, T6, T7> UnzipN<T1, T2, T3, T4, T5, T6, T7> for I
where
    I: Iterator<Item = (T1, T2, T3, T4, T5, T6, T7)>,
{
    fn unzip_n_vec(
        self,
    ) -> (
        Vec<T1>,
        Vec<T2>,
        Vec<T3>,
        Vec<T4>,
        Vec<T5>,
        Vec<T6>,
        Vec<T7>,
    ) {
        let mut t1 = Vec::new();
        let mut t2 = Vec::new();
        let mut t3 = Vec::new();
        let mut t4 = Vec::new();
        let mut t5 = Vec::new();
        let mut t6 = Vec::new();
        let mut t7 = Vec::new();

        self.for_each(|(x1, x2, x3, x4, x5, x6, x7)| {
            t1.push(x1);
            t2.push(x2);
            t3.push(x3);
            t4.push(x4);
            t5.push(x5);
            t6.push(x6);
            t7.push(x7);
        });

        (t1, t2, t3, t4, t5, t6, t7)
    }
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
