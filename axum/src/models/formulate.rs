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
    pub amount: i32,
    pub unit: String,
    pub counterpart_id: Option<String>,
    pub percentage: f64,
}


#[serde_with::serde_as]
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FormulaIngredientUpdate { 
    pub id: Option<String>,
    pub formula_id: Option<String>,
    pub name: Option<String>,
    pub amount: Option<i32>,
    pub volatility: Option<String>,
    pub unit: Option<String>,
    pub counterpart_id: Option<String>,
    pub percentage: Option<f64>,
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


#[derive(Serialize, Deserialize, Debug)]
pub struct FormulaWithIngredients {
    pub formula: Formula,
    pub ingredients: Vec<FormulaIngredient>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FormulaWithIngUpdate {
    pub formula: FormulaUpdate,
    pub ingredients: Vec<FormulaIngredientUpdate>,
}

#[serde_with::serde_as]
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FormulaUpdate {
    pub id: Option<String>,
    pub user_id: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
    pub solvent: Option<String>
}


#[derive(Debug, Deserialize)]
pub struct FormulaPayload {
    pub formula: Option<FormulaUpdate>,
    pub ingredients: Vec<FormulaIngredientUpdate>,
}

#[derive(Debug, Deserialize)]
pub struct FormulaCreatePayload {
    pub title: Option<String>,
    pub description: Option<String>,
    pub notes: Option<String>,
    pub solvent: Option<String>,
}