CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    pronouns VARCHAR(100) NOT NUll,
    rating integer NOT NULL
);

INSERT INTO users (name, email, pronouns, rating) VALUES ('ex1', 'ex1@example.com', 'it/its', 1000);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex2', 'ex2@example.com', 'it/its', 1000);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex3', 'ex3@example.com', 'it/its', 1000);