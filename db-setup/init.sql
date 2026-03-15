CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    pronouns VARCHAR(100) NOT NUll,
    rating integer NOT NULL
);

CREATE TABLE tournaments (
    id SERIAL PRIMARY KEY,
    tournament_name VARCHAR(100) NOT NULL,
    closed BOOLEAN NOT NULL
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

-- CREATE TABLE tournament_matches (
--     id INTEGER NOT NULL,
--     tournament_id INTEGER NOT NULL REFERENCES tournaments(id),

--     user1_id INTEGER REFERENCES users(id),
--     user2_id INTEGER REFERENCES users(id),

--     parent_match_1_id INTEGER,

--     parent_match_2_id INTEGER,

--     FOREIGN KEY (parent_match_1_id, tournament_id) 
--         REFERENCES tournament_matches (id, tournament_id),

--     FOREIGN KEY (parent_match_2_id, tournament_id) 
--         REFERENCES tournament_matches (id, tournament_id),

--     match_record_id INTEGER REFERENCES matches(id),


--     PRIMARY KEY (id, tournament_id)
-- );
CREATE TABLE tournament_matches (
    id SERIAL PRIMARY KEY,

    match_number INTEGER,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id),

    user1_id INTEGER REFERENCES users(id),
    user2_id INTEGER REFERENCES users(id),

    parent_match_1_id INTEGER REFERENCES tournament_matches(id),
    parent_match_2_id INTEGER REFERENCES tournament_matches(id),

    inherits_parent_match_1_winner BOOLEAN,
    inherits_parent_match_2_winner BOOLEAN,


    match_record_id INTEGER REFERENCES matches(id)
);

ALTER TABLE matches 
ADD CONSTRAINT check_different_users CHECK (user1_id <> user2_id);

ALTER TABLE matches
ADD CONSTRAINT check_winner_in_match CHECK (user1_id = winner_id OR user2_id = winner_id);


INSERT INTO users (name, email, pronouns, rating) VALUES ('ex1', 'ex1@example.com', 'it/its', 1000);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex2', 'ex2@example.com', 'it/its', 1000);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex3', 'ex3@example.com', 'it/its', 1000);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex4', 'ex4@example.com', 'it/its', 1000);

INSERT INTO tournaments (tournament_name, closed) VALUES ('ex tourney 1', false);
INSERT INTO tournaments (tournament_name, closed) VALUES ('ex tourney 2', false);
INSERT INTO tournaments (tournament_name, closed) VALUES ('ex tourney 3', true);
INSERT INTO tournaments (tournament_name, closed) VALUES ('ex tourney 4', true);


INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (1, 1);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (2, 1);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (2, 2);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (3, 2);

INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (1, 3);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (2, 3);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (3, 3);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (4, 3);

INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (1, 4);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (2, 4);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (3, 4);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (4, 4);

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

INSERT INTO tournament_matches (tournament_id, user1_id, user2_id) VALUES (3, 1, 2);
INSERT INTO tournament_matches (tournament_id, user1_id, user2_id) VALUES (3, 3, 4);
INSERT INTO tournament_matches (tournament_id, parent_match_1_id, parent_match_2_id, inherits_parent_match_1_winner, inherits_parent_match_2_winner) 
VALUES (3, 1, 2, true, true);

INSERT INTO tournament_matches (tournament_id, user1_id, user2_id) VALUES (4, 1, 2);
INSERT INTO tournament_matches (tournament_id, user1_id, user2_id) VALUES (4, 3, 4);
INSERT INTO tournament_matches (tournament_id, parent_match_1_id, parent_match_2_id, inherits_parent_match_1_winner, inherits_parent_match_2_winner) 
VALUES (4, 4, 5, true, true);

