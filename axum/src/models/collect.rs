use serde::{Deserialize, Serialize};
use time::format_description::well_known::Rfc3339;
use time::OffsetDateTime;

#[serde_with::serde_as]
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CollectIngredient {
    pub id: Option<String>,
    pub user_id: Option<String>,
    pub common_name: String,
    pub cas: String,
    pub other_names: Option<String>,
    pub markdown: Option<String>,
    pub amount: f64,
    pub unit: String,
    #[serde_as(as = "Option<Rfc3339>")]
    pub created_at: Option<OffsetDateTime>,
    #[serde_as(as = "Option<Rfc3339>")]
    pub updated_at: Option<OffsetDateTime>,
}

#[serde_with::serde_as]
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CollectIngredientUpdate {
    pub id: Option<String>,
    pub user_id: Option<String>,
    pub common_name: Option<String>,
    pub cas: Option<String>,
    pub other_names: Option<String>,
    pub markdown: Option<String>,
    pub amount: Option<f64>,
    pub unit: Option<String>,
    #[serde_as(as = "Option<Rfc3339>")]
    pub created_at: Option<OffsetDateTime>,
    #[serde_as(as = "Option<Rfc3339>")]
    pub updated_at: Option<OffsetDateTime>,
}
