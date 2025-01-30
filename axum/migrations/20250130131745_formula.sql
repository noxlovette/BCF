-- Add migration script here
CREATE TABLE formulas (
    id VARCHAR(21) PRIMARY KEY,
    user_id VARCHAR(21) NOT NULL,
    title VARCHAR(50),
    description TEXT,
    solvent VARCHAR(50) DEFAULT 'Ethanol',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT formulas_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);


CREATE INDEX idx_formulas_user_id ON formulas(user_id);
CREATE INDEX idx_formulas_user_updated 
    ON formulas(user_id, updated_at DESC);


CREATE TRIGGER set_timestamp
BEFORE UPDATE ON formulas
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();