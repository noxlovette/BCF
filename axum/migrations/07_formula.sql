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


-- Add migration script here
CREATE TABLE formula_ingredients (
    id VARCHAR(21) PRIMARY KEY,
    formula_id VARCHAR(21) NOT NULL,
    name VARCHAR(100) NOT NULL DEFAULT 'New Ingredient',
    amount INTEGER NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL DEFAULT 'g',
    volatility VARCHAR(50) NOT NULL DEFAULT 'Top',
    percentage FLOAT NOT NULL DEFAULT 10,
    counterpart_id VARCHAR(21),
    CONSTRAINT formula_ingredients_formula_id_fkey 
        FOREIGN KEY (formula_id) REFERENCES formulas(id) ON DELETE CASCADE,
    CONSTRAINT formula_ingredients_counterpart_id_fkey 
        FOREIGN KEY (counterpart_id) REFERENCES collection_ingredients(id) ON DELETE SET NULL,
    CONSTRAINT formula_ingredients_percentage_check 
        CHECK (percentage >= 0 AND percentage <= 100)
);

-- Create indices for common queries
CREATE INDEX idx_formula_ingredients_formula_id 
    ON formula_ingredients(formula_id);
CREATE INDEX idx_formula_ingredients_formula_volatility 
    ON formula_ingredients(formula_id, volatility);
CREATE INDEX idx_formula_ingredients_counterpart 
    ON formula_ingredients(counterpart_id);
