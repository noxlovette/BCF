-- Add migration script here
CREATE TABLE ingredients (
    id VARCHAR(21) PRIMARY KEY,
    common_name VARCHAR(200) NOT NULL,
    other_names TEXT,
    cas VARCHAR(30) NOT NULL,
    ing_type VARCHAR(30),
    ing_description TEXT,
    volatility VARCHAR(20),
    restricted BOOLEAN DEFAULT FALSE,
    origin TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cas, common_name)
);

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON ingredients
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();