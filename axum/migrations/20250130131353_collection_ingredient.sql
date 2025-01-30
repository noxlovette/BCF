-- Add migration script here

CREATE TABLE collection_ingredients (
    id VARCHAR(21) PRIMARY KEY,
    user_id VARCHAR(21) NOT NULL,
    common_name VARCHAR(255) NOT NULL DEFAULT 'New Ingredient',
    cas VARCHAR(30) NOT NULL DEFAULT '0000-00-0',
    other_names TEXT,
    
    markdown TEXT,
    
    -- Numeric fields
    amount FLOAT NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT 'g',
    -- General metadata
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Constraints
    CONSTRAINT collection_ingredients_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT collection_ingredients_user_id_id_key 
        UNIQUE(user_id, id)
);

-- Create indices for common queries
CREATE INDEX idx_collection_ingredients_user_id ON collection_ingredients(user_id);
CREATE INDEX idx_collection_ingredients_common_name ON collection_ingredients(common_name);

-- Add updated_at trigger
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON collection_ingredients
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- Create ordering index for user, common_name
CREATE INDEX idx_collection_ingredients_user_common_name 
    ON collection_ingredients(user_id, common_name);
