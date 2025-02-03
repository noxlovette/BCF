-- Add migration script here
CREATE TABLE descriptors (
    id VARCHAR(21) PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    description TEXT NOT NULL,
    colour CHAR(7)
);
CREATE TABLE ingredient_descriptors (
    ingredient_id VARCHAR(21) REFERENCES ingredients(id) ON DELETE CASCADE,
    descriptor_id VARCHAR(21) REFERENCES descriptors(id) ON DELETE CASCADE,
    position INTEGER CHECK (position BETWEEN 1 AND 3),
    PRIMARY KEY (ingredient_id, position)
);
