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
