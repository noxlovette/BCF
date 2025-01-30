use serde::{Deserialize, Serialize};
use time::format_description::well_known::Rfc3339;
use time::OffsetDateTime;

#[serde_with::serde_as]
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FormulaIngredient {
    pub id: String,
    pub formula_id: String,
    pub name: String,
    pub volatility: String,
    pub amount: f64,
    pub unit: String,
    pub counterpart_id: String,
    pub percentage: f32,
}


#[serde_with::serde_as]
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FormulaIngredientUpdate { 
    pub id: Option<String>,
    pub formula_id: Option<String>,
    pub name: Option<String>,
    pub amount: Option<f64>,
    pub volatility: Option<String>,
    pub unit: Option<String>,
    pub counterpart_id: Option<String>,
    pub percentage: Option<f32>,
}


#[serde_with::serde_as]
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Formula { 
    pub id: String,
    pub user_id: String,
    pub title: Option<String>,
    pub description: Option<String>,
    pub solvent: Option<String>,
    #[serde_as(as = "Rfc3339")]
    pub created_at: OffsetDateTime,
    #[serde_as(as = "Rfc3339")]
    pub updated_at: OffsetDateTime,
}

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
#[serde_with::serde_as]
pub struct FormulaFull {
    pub id: String,
    pub user_id: String,
    pub title: Option<String>,
    pub description: Option<String>,
    pub solvent: Option<String>,
    #[serde_as(as = "Rfc3339")]
    pub created_at: OffsetDateTime,
    #[serde_as(as = "Rfc3339")]
    pub updated_at: OffsetDateTime,
    #[sqlx(rename = "ingredients")]
    #[serde(default)]
    pub ingredients: Option<serde_json::Value>
}

impl FormulaFull {
    pub fn with_parsed_ingredients(self) -> Result<Self, serde_json::Error> {
        let ingredients: Vec<FormulaIngredient> = if let Some(json) = self.ingredients {
            serde_json::from_value(json)?
        } else {
            Vec::new()
        };
        
        Ok(Self {
            ingredients: Some(serde_json::to_value(ingredients)?),
            ..self
        })
    }
}

#[serde_with::serde_as]
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FormulaUpdate {
    pub id: Option<String>,
    pub user_id: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
    pub solvent: Option<String>,
    #[serde_as(as = "Option<Rfc3339>")]
    pub created_at: Option<OffsetDateTime>,
    #[serde_as(as = "Option<Rfc3339>")]
    pub updated_at: Option<OffsetDateTime>,
}


#[derive(Debug, Deserialize)]
pub struct FormulaPayload {
    pub title: Option<String>,
    pub description: Option<String>,
    pub notes: Option<String>,
    pub solvent: Option<String>,
    pub ingredients: Vec<FormulaIngredientUpdate>,
}

#[derive(Debug, Deserialize)]
pub struct FormulaCreatePayload {
    pub title: Option<String>,
    pub description: Option<String>,
    pub notes: Option<String>,
    pub solvent: Option<String>,
}