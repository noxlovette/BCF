use anyhow::Result;
use csv::Reader;
use nanoid::nanoid;
use rust::db::init::init_db;
use serde::Deserialize;
use sqlx::PgPool;
use std::collections::HashMap;

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

#[derive(Debug, Deserialize)]
struct OldDescriptor {
    id: String,
    name: String,
    description: String,
}

#[derive(Debug, Deserialize)]
struct OldIngredientDescriptor {
    ingredient_id: String,
    descriptor_id: String,
}

async fn migrate_ingredients(pool: &PgPool, csv_path: &str) -> Result<HashMap<String, String>> {
    let mut id_mapping = HashMap::new();
    let mut rdr = Reader::from_path(csv_path)?;

    for result in rdr.deserialize() {
        let old_ingredient: OldIngredient = result?;
        let new_id = nanoid!();

        sqlx::query(
            r#"
            INSERT INTO ingredients (
                id, common_name, other_names, cas,
                ing_type, ing_description, volatility,
                restricted, origin, slug
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (cas, common_name) DO NOTHING
        "#,
        )
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

        id_mapping.insert(old_ingredient.id, new_id);
    }

    Ok(id_mapping)
}

async fn migrate_descriptors(pool: &PgPool, csv_path: &str) -> Result<HashMap<String, String>> {
    let mut id_mapping = HashMap::new();
    let mut rdr = Reader::from_path(csv_path)?;

    for result in rdr.deserialize() {
        let old_descriptor: OldDescriptor = result?;
        let new_id = nanoid!();

        sqlx::query(
            r#"
            INSERT INTO descriptors (id, name, description)
            VALUES ($1, $2, $3)
        "#,
        )
        .bind(&new_id)
        .bind(&old_descriptor.name)
        .bind(&old_descriptor.description)
        .execute(pool)
        .await?;

        id_mapping.insert(old_descriptor.id, new_id);
    }

    Ok(id_mapping)
}

async fn migrate_ingredient_descriptors(
    pool: &PgPool,
    csv_paths: &[(&str, i32)], // Tuple of path and position
    ingredient_mapping: &HashMap<String, String>,
    descriptor_mapping: &HashMap<String, String>,
) -> Result<()> {
    for (csv_path, position) in csv_paths {
        let mut rdr = Reader::from_path(csv_path)?;

        for result in rdr.deserialize() {
            let old_relation: OldIngredientDescriptor = result?;

            if let (Some(new_ingredient_id), Some(new_descriptor_id)) = (
                ingredient_mapping.get(&old_relation.ingredient_id),
                descriptor_mapping.get(&old_relation.descriptor_id),
            ) {
                sqlx::query(
                    r#"
                    INSERT INTO ingredient_descriptors (ingredient_id, descriptor_id, position)
                    VALUES ($1, $2, $3)
                    "#,
                )
                .bind(new_ingredient_id)
                .bind(new_descriptor_id)
                .bind(position)
                .execute(pool)
                .await?;
            }
        }
    }
    Ok(())
}

#[tokio::main]
async fn main() -> Result<()> {
    let pool = init_db().await?;

    let ingredient_mapping = migrate_ingredients(&pool, "ingredients.csv").await?;
    let descriptor_mapping = migrate_descriptors(&pool, "descriptors.csv").await?;

    let descriptor_files = vec![
        ("ingredient_descriptor1.csv", 1),
        ("ingredient_descriptor2.csv", 2),
        ("ingredient_descriptor3.csv", 3),
    ];

    migrate_ingredient_descriptors(
        &pool,
        &descriptor_files,
        &ingredient_mapping,
        &descriptor_mapping,
    )
    .await?;

    println!("Migration completed successfully!");
    Ok(())
}
