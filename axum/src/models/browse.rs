use serde::{Deserialize, Serialize};
use time::format_description::well_known::Rfc3339;
use time::OffsetDateTime;

use super::suggestion::Suggestion;

#[serde_with::serde_as]
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct BrowseIngredient {
    pub id: String,
    pub common_name: String,
    pub other_names: Option<String>,
    pub slug: String,
    pub cas: Option<String>,
    pub ing_type: Option<String>,
    pub ing_description: Option<String>,
    pub volatility: Option<String>,
    pub restricted: Option<bool>,
    pub origin: Option<String>,
    pub colours: Option<Vec<String>>,
    pub descriptors: Option<Vec<String>>,
    #[serde_as(as = "Rfc3339")]
    pub created_at: OffsetDateTime,
    #[serde_as(as = "Rfc3339")]
    pub updated_at: OffsetDateTime,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct BrowseIngredientWithSuggestions {
    pub ingredient: BrowseIngredient,
    pub suggestions: Vec<Suggestion>
}

#[derive(Deserialize)]
pub struct BrowseQuery {
    pub search: Option<String>,
    pub page: Option<u32>,
    pub page_size: Option<u32>,
}

#[derive(Serialize)]
pub struct PaginatedResponse {
    pub names: Vec<BrowseIngredient>,
    pub cas: Vec<BrowseIngredient>,
    pub descriptors: Vec<BrowseIngredient>,
    pub total: i64,
    pub page: u32,
    pub page_size: u32,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct BrowseIngredientUpdate {
    pub common_name: Option<String>,
    pub other_names: Option<String>,
    pub cas: Option<String>,
    pub ing_type: Option<String>,
    pub ing_description: Option<String>,
    pub volatility: Option<String>,
    pub restricted: Option<bool>,
    pub origin: Option<String>,
}