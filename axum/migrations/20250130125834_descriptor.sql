-- Add migration script here
CREATE TABLE descriptors (
    id VARCHAR(21) PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    description TEXT NOT NULL
);
