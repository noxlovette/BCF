use csv::Reader;
use nanoid::nanoid;
use serde::Deserialize;
use sqlx::PgPool;
use rust::db::init::init_db;
use anyhow::Result;

#[derive(Debug, Deserialize)]
struct OldIngredient {
    id: String,
    common_name: String,
    other_names: Option<String>,
    cas: String,
    ingredient_type: Option<String>,
    #[serde(rename = "use")]
    usage: Option<String>,
    volatility: Option<String>,
    is_restricted: bool,
    origin: Option<String>,
    slug: String,
}

async fn migrate_ingredients(
    pool: &PgPool,
    csv_path: &str,
) -> Result<()> {
    let mut rdr = Reader::from_path(csv_path)?;
    
    for result in rdr.deserialize() {
        let old_ingredient: OldIngredient = result?;
        let new_id = nanoid!();
        
        sqlx::query(r#"
            INSERT INTO ingredients (
                id, common_name, other_names, cas, 
                ing_type, ing_description, volatility, 
                restricted, origin, slug
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (cas, common_name) DO NOTHING
        "#)
        .bind(&new_id)
        .bind(&old_ingredient.common_name)
        .bind(&old_ingredient.other_names)
        .bind(&old_ingredient.cas)
        .bind(&old_ingredient.ingredient_type)
        .bind(&old_ingredient.usage)
        .bind(&old_ingredient.volatility)
        .bind(&old_ingredient.is_restricted)
        .bind(&old_ingredient.origin)
        .bind(&old_ingredient.slug)
        .execute(pool)
        .await?;
    }
    Ok(())
}

#[tokio::main]
async fn main() -> Result<()> {
    let pool = init_db().await?;
    migrate_ingredients(&pool, "ingredients.csv").await?;
    println!("Migration completed!");
    Ok(())
}