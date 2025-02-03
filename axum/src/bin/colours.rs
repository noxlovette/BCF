use anyhow::Result;
use csv::Reader;
use rust::db::init::init_db;
use serde::Deserialize;
use sqlx::PgPool;

#[derive(Debug, Deserialize)]
struct Colour {
    name: String,
    colour: String,
}

async fn update_colours(pool: &PgPool, file_path: &str) -> Result<()> {
    let mut rdr = Reader::from_path(file_path)?;

    for result in rdr.deserialize() {
        let colour: Colour = result?;
        sqlx::query("UPDATE descriptors SET colour = $1 WHERE name = $2")
            .bind(&colour.colour)
            .bind(&colour.name)
            .execute(pool)
            .await?;
    }

    Ok(())
}

#[tokio::main]
async fn main() -> Result<()> {
    let pool = init_db().await?;

    update_colours(&pool, "colours.csv").await?;
    Ok(())
}
