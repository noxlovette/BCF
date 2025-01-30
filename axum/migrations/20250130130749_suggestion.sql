-- Add migration script here
CREATE TYPE suggestion_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE suggestions (
    id VARCHAR(21) PRIMARY KEY,
    ingredient_id VARCHAR(21),
    common_name VARCHAR(200) NOT NULL DEFAULT 'unchanged',
    cas VARCHAR(30) DEFAULT 'unchanged',
    markdown TEXT,
    user_id VARCHAR(21) NOT NULL,
    status suggestion_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT suggestions_ingredient_id_fkey 
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON suggestions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();