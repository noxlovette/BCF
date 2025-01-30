-- Add migration script here
CREATE TABLE ingredient_descriptor1 (
    ingredient_id VARCHAR(21) REFERENCES ingredients(id) ON DELETE CASCADE,
    descriptor_id VARCHAR(21) REFERENCES descriptors(id) ON DELETE CASCADE,
    PRIMARY KEY (ingredient_id, descriptor_id)
);

CREATE TABLE ingredient_descriptor2 (
    ingredient_id VARCHAR(21) REFERENCES ingredients(id) ON DELETE CASCADE,
    descriptor_id VARCHAR(21) REFERENCES descriptors(id) ON DELETE CASCADE,
    PRIMARY KEY (ingredient_id, descriptor_id)
);

CREATE TABLE ingredient_descriptor3 (
    ingredient_id VARCHAR(21) REFERENCES ingredients(id) ON DELETE CASCADE,
    descriptor_id VARCHAR(21) REFERENCES descriptors(id) ON DELETE CASCADE,
    PRIMARY KEY (ingredient_id, descriptor_id)
);

CREATE TABLE related_ingredients (
    ingredient_id VARCHAR(21) REFERENCES ingredients(id) ON DELETE CASCADE,
    related_ingredient_id VARCHAR(21) REFERENCES ingredients(id) ON DELETE CASCADE,
    PRIMARY KEY (ingredient_id, related_ingredient_id),
    CHECK (ingredient_id != related_ingredient_id)
);

CREATE TABLE ingredient_contributors (
    ingredient_id VARCHAR(21) REFERENCES ingredients(id) ON DELETE CASCADE,
    user_id VARCHAR(21) REFERENCES "user"(id) ON DELETE CASCADE,
    PRIMARY KEY (ingredient_id, user_id)
);