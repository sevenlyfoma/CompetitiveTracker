CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    pronouns VARCHAR(100) NOT NUll,
    rating integer NOT NULL
);

INSERT INTO users (name, email, pronouns, rating) VALUES ('ex', 'ex@example.com', 'it/its', 1000);