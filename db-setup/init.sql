CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    pronouns VARCHAR(100) NOT NUll,
    rating integer NOT NULL
);

CREATE TABLE tournaments (
    id SERIAL PRIMARY KEY,
    tournament_name VARCHAR(100) NOT NULL
);

CREATE TABLE tournament_entrants (
    user_id INTEGER NOT NULL REFERENCES users(id),
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id),
    PRIMARY KEY (user_id, tournament_id)
);

CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    date_of_match TIMESTAMP NOT NULL,
    user1_id INTEGER NOT NULL REFERENCES users(id),
    user2_id INTEGER NOT NULL REFERENCES users(id),
    winner_id INTEGER REFERENCES users(id),
    user1_rating_before integer NOT NULL,
    user1_rating_after integer NOT NULL,
    user2_rating_before integer NOT NULL,
    user2_rating_after integer NOT NULL
);

CREATE TABLE tournament_matches (
    id INTEGER NOT NULL,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id),

    user1_id INTEGER REFERENCES users(id), --Can be null since might not be filled in yet
    user2_id INTEGER REFERENCES users(id),

    parent_match_1_id INTEGER,
    parent_match_1_tournament_id INTEGER,

    parent_match_2_id INTEGER,
    parent_match_2_tournament_id INTEGER,

    FOREIGN KEY (parent_match_1_id, parent_match_1_tournament_id) 
        REFERENCES tournament_matches (id, tournament_id),

    FOREIGN KEY (parent_match_2_id, parent_match_2_tournament_id) 
        REFERENCES tournament_matches (id, tournament_id),

    match_record_id INTEGER REFERENCES matches(id),


    PRIMARY KEY (id, tournament_id)
);



ALTER TABLE matches 
ADD CONSTRAINT check_different_users CHECK (user1_id <> user2_id);

ALTER TABLE matches
ADD CONSTRAINT check_winner_in_match CHECK (user1_id = winner_id OR user2_id = winner_id);


INSERT INTO users (name, email, pronouns, rating) VALUES ('ex1', 'ex1@example.com', 'it/its', 1000);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex2', 'ex2@example.com', 'it/its', 1000);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex3', 'ex3@example.com', 'it/its', 1000);

INSERT INTO matches 
(date_of_match, user1_id, user2_id, winner_id, user1_rating_before, user1_rating_after, user2_rating_before, user2_rating_after) 
VALUES 
('2026-02-22', 1, 2, 1, 980, 1000, 1020, 1000);

INSERT INTO matches 
(date_of_match, user1_id, user2_id, winner_id, user1_rating_before, user1_rating_after, user2_rating_before, user2_rating_after) 
VALUES 
('2026-02-22', 1, 2, 2, 1000, 980, 1000, 1020);

INSERT INTO matches 
(date_of_match, user1_id, user2_id, winner_id, user1_rating_before, user1_rating_after, user2_rating_before, user2_rating_after) 
VALUES 
('2026-02-22', 1, 3, 1, 980, 1000, 1020, 1000);