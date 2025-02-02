use serde::{Deserialize, Serialize};
use sqlx::postgres::PgPool;
use time::OffsetDateTime;

#[derive(Debug, Serialize, Deserialize, sqlx::Type, Clone, Copy)]
#[sqlx(type_name = "suggestion_status")]
#[sqlx(rename_all = "lowercase")]
pub enum SuggestionStatus {
    Pending,
    Approved,
    Rejected,
}

impl ToString for SuggestionStatus {
    fn to_string(&self) -> String {
        match self {
            SuggestionStatus::Pending => "pending",
            SuggestionStatus::Approved => "approved",
            SuggestionStatus::Rejected => "rejected",
        }
        .to_string()
    }
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
#[serde_with::serde_as]
#[serde(rename_all = "camelCase")]
pub struct Suggestion {
    pub id: String,
    pub ingredient_id: Option<String>,
    pub common_name: String,
    pub cas: Option<String>,
    pub markdown: Option<String>,
    pub user_id: String,
    pub status: SuggestionStatus,
    #[serde_as(as = "Rfc3339")]
    pub created_at: OffsetDateTime,
    #[serde_as(as = "Rfc3339")]
    pub updated_at: OffsetDateTime,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SuggestionPayload {
    pub ingredient_id: String,
    pub common_name: String,
    pub cas: String,
    pub markdown: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateSuggestion {
    pub common_name: Option<String>,
    pub cas: Option<String>,
    pub markdown: Option<String>,
    pub status: Option<SuggestionStatus>,
}

impl SuggestionPayload {
    pub async fn create(
        payload: Self,
        pool: &PgPool,
        user_id: &str,
    ) -> Result<Option<Suggestion>, sqlx::Error> {
        sqlx::query_as!(
            Suggestion,
            r#"
            INSERT INTO suggestions(id, user_id, ingredient_id, common_name, cas, markdown, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7::suggestion_status)
            RETURNING 
                id, ingredient_id, common_name, cas, markdown,
                user_id, status as "status: SuggestionStatus",
                created_at, updated_at
            "#,
            nanoid::nanoid!(),
            user_id,
            payload.ingredient_id,
            payload.common_name,
            payload.cas,
            payload.markdown,
            SuggestionStatus::Pending as _
        )
        .fetch_optional(pool)
        .await
    }
}

impl Suggestion {
    pub async fn fetch(
        pool: &PgPool,
        id: &str,
        user_id: &str,
    ) -> Result<Option<Self>, sqlx::Error> {
        sqlx::query_as!(
            Self,
            r#"
            SELECT 
                id, ingredient_id, common_name, cas, markdown, 
                user_id, status as "status: SuggestionStatus", 
                created_at, updated_at
            FROM suggestions 
            WHERE id = $1 AND user_id = $2
            "#,
            id,
            user_id
        )
        .fetch_optional(pool)
        .await
    }

    pub async fn list(pool: &PgPool, user_id: &str) -> Result<Vec<Self>, sqlx::Error> {
        sqlx::query_as!(
            Self,
            r#"
            SELECT 
                id, ingredient_id, common_name, cas, markdown, 
                user_id, status as "status: SuggestionStatus", 
                created_at, updated_at
            FROM suggestions 
            WHERE user_id = $1
            ORDER BY created_at DESC
            "#,
            user_id
        )
        .fetch_all(pool)
        .await
    }

    pub async fn delete(pool: &PgPool, user_id: &str, id: &str) -> Result<Self, sqlx::Error> {
        sqlx::query_as!(
            Self,
            r#"
            DELETE FROM suggestions
            WHERE id = $1 AND user_id = $2
            RETURNING 
                id, ingredient_id, common_name, cas, markdown, 
                user_id, status as "status: SuggestionStatus", 
                created_at, updated_at
            "#,
            id,
            user_id
        )
        .fetch_one(pool)
        .await
    }
}

impl UpdateSuggestion {
    pub async fn update(
        &self,
        pool: &PgPool,
        id: &str,
        user_id: &str,
    ) -> Result<Suggestion, sqlx::Error> {
        sqlx::query_as!(
            Suggestion,
            r#"
            UPDATE suggestions 
            SET 
                common_name = COALESCE($1, common_name),
                cas = COALESCE($2, cas),
                markdown = COALESCE($3, markdown),
                status = COALESCE($4, status),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5 AND user_id = $6
            RETURNING 
                id, ingredient_id, common_name, cas, markdown, 
                user_id, status as "status: SuggestionStatus", 
                created_at, updated_at
            "#,
            self.common_name,
            self.cas,
            self.markdown,
            self.status as Option<SuggestionStatus>,
            id,
            user_id
        )
        .fetch_one(pool)
        .await
    }
}
