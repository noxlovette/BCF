use axum::{extract::State, Json};
use crate::models::formulate::{Formula, FormulaPayload};
use crate::db::init::AppState;
use crate::auth::jwt::Claims;
use crate::db::error::DbError;

pub async fn upsert_formula(
    State(pool): State<AppState>,
    claims: Claims, 
    formula_id: Option<String>,
    Json(payload): Json<FormulaPayload>,
 ) -> Result<Json<Formula>, DbError> {
    let mut tx = pool.db.begin().await?;
    
    // Insert/update formula
    let formula = sqlx::query_as!(
        Formula,
        r#"
        INSERT INTO formulas (id, user_id, title, description, solvent)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE 
        SET title = EXCLUDED.title,
            description = EXCLUDED.description,
            solvent = EXCLUDED.solvent
        RETURNING *
        "#,
        formula_id.unwrap_or_else(|| nanoid::nanoid!()),
        claims.sub,
        payload.title,
        payload.description,
        payload.solvent.unwrap_or_else(|| "Ethanol".to_string())
    )
    .fetch_one(&mut *tx)
    .await?;
 
    // Transform ingredients data
    let (ids, f_ids, names, amounts, units, vols, percs): (
        Vec<String>, 
        Vec<String>,
        Vec<String>,
        Vec<i32>,
        Vec<String>,
        Vec<String>, 
        Vec<f64>
    ) = payload.ingredients
        .into_iter()
        .map(|i| (
            if i.id.is_empty() { nanoid::nanoid!() } else { i.id },
            formula.id.clone(),
            i.name,
            i.amount as i32,
            i.unit,
            i.volatility,
            i.percentage as f64
        ))
        .unzip_n_vec();

 
    // Batch upsert ingredients
    sqlx::query!(
        r#"
        INSERT INTO formula_ingredients 
        (id, formula_id, name, amount, unit, volatility, percentage)
        SELECT * FROM UNNEST(
            $1::varchar[],
            $2::varchar[],
            $3::varchar[],
            $4::int[],
            $5::varchar[],
            $6::varchar[],
            $7::double precision[]
        )
        ON CONFLICT (id) DO UPDATE
        SET name = EXCLUDED.name,
            amount = EXCLUDED.amount,
            unit = EXCLUDED.unit,
            volatility = EXCLUDED.volatility,
            percentage = EXCLUDED.percentage
        "#,
        &ids,
        &f_ids, 
        &names,
        &amounts,
        &units,
        &vols,
        &percs
    )
    .execute(&mut *tx)
    .await?;
 
    tx.commit().await?;
    Ok(Json(formula))
 }

trait UnzipN<T1, T2, T3, T4, T5, T6, T7> {
    fn unzip_n_vec(self) -> (Vec<T1>, Vec<T2>, Vec<T3>, Vec<T4>, Vec<T5>, Vec<T6>, Vec<T7>);
}

impl<I, T1, T2, T3, T4, T5, T6, T7> UnzipN<T1, T2, T3, T4, T5, T6, T7> for I 
where
    I: Iterator<Item = (T1, T2, T3, T4, T5, T6, T7)>
{
    fn unzip_n_vec(self) -> (Vec<T1>, Vec<T2>, Vec<T3>, Vec<T4>, Vec<T5>, Vec<T6>, Vec<T7>) {
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