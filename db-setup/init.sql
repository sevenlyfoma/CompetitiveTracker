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
    closed BOOLEAN NOT NULL,
    style VARCHAR(100) NOT NULL
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
    match_title VARCHAR(100) NOT NULL,
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


INSERT INTO users (name, email, pronouns, rating) VALUES ('ex1', 'ex1@example.com', 'it/its', 1100);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex2', 'ex2@example.com', 'it/its', 1200);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex3', 'ex3@example.com', 'it/its', 1300);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex4', 'ex4@example.com', 'it/its', 1400);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex5', 'ex5@example.com', 'it/its', 1500);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex6', 'ex6@example.com', 'it/its', 1600);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex7', 'ex7@example.com', 'it/its', 1700);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex8', 'ex8@example.com', 'it/its', 1800);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex9', 'ex9@example.com', 'it/its', 1900);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex10', 'ex10@example.com', 'it/its', 2000);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex11', 'ex11@example.com', 'it/its', 2100);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex12', 'ex12@example.com', 'it/its', 2200);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex13', 'ex13@example.com', 'it/its', 2300);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex14', 'ex14@example.com', 'it/its', 2400);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex15', 'ex15@example.com', 'it/its', 2500);
INSERT INTO users (name, email, pronouns, rating) VALUES ('ex16', 'ex16@example.com', 'it/its', 2600);

INSERT INTO tournaments (tournament_name, closed, style) VALUES ('ex tourney 1', false, 'single');
INSERT INTO tournaments (tournament_name, closed, style) VALUES ('ex tourney 2', false, 'double');
INSERT INTO tournaments (tournament_name, closed, style) VALUES ('ex tourney 3', true, 'single');
INSERT INTO tournaments (tournament_name, closed, style) VALUES ('ex tourney 4', true, 'double');

INSERT INTO tournaments (tournament_name, closed, style) VALUES ('ex tourney 5', false, 'double');
INSERT INTO tournaments (tournament_name, closed, style) VALUES ('ex tourney 6', false, 'double');


INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (1, 1);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (2, 1);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (3, 1);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (4, 1);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (5, 1);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (6, 1);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (7, 1);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (8, 1);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (9, 1);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (10, 1);

INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (1, 2);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (2, 2);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (3, 2);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (4, 2);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (5, 2);


INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (1, 3);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (2, 3);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (3, 3);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (4, 3);

INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (1, 4);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (2, 4);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (3, 4);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (4, 4);


INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (1, 5);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (2, 5);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (3, 5);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (4, 5);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (5, 5);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (6, 5);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (7, 5);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (8, 5);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (9, 5);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (10, 5);


INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (1, 6);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (2, 6);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (3, 6);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (4, 6);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (5, 6);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (6, 6);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (7, 6);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (8, 6);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (9, 6);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (10, 6);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (11, 6);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (12, 6);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (13, 6);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (14, 6);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (15, 6);
INSERT INTO tournament_entrants (user_id, tournament_id) VALUES (16, 6);

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

INSERT INTO tournament_matches (tournament_id, user1_id, user2_id, match_number, match_title) VALUES (3, 1, 2, 2, 'Semi Finals');
INSERT INTO tournament_matches (tournament_id, user1_id, user2_id, match_number, match_title) VALUES (3, 3, 4, 2, 'Semi Finals');
INSERT INTO tournament_matches (tournament_id, parent_match_1_id, parent_match_2_id, inherits_parent_match_1_winner, inherits_parent_match_2_winner, match_number, match_title) 
VALUES (3, 1, 2, true, true, 0, 'Finals');

INSERT INTO tournament_matches (tournament_id, user1_id, user2_id, match_number, match_title) VALUES (4, 1, 2, 3, 'Winner''s Semi Finals');
INSERT INTO tournament_matches (tournament_id, user1_id, user2_id, match_number, match_title) VALUES (4, 3, 4, 3, 'Winner''s Semi Finals');
INSERT INTO tournament_matches (tournament_id, parent_match_1_id, parent_match_2_id, inherits_parent_match_1_winner, inherits_parent_match_2_winner, match_number, match_title) 
VALUES (4, 4, 5, true, true, 2, 'Winner''s Finals');

INSERT INTO tournament_matches (tournament_id, parent_match_1_id, parent_match_2_id, inherits_parent_match_1_winner, inherits_parent_match_2_winner, match_number, match_title) 
VALUES (4, 4, 5, false, false, 2, 'Loser''s Semi Finals');

INSERT INTO tournament_matches (tournament_id, parent_match_1_id, parent_match_2_id, inherits_parent_match_1_winner, inherits_parent_match_2_winner, match_number, match_title) 
VALUES (4, 6, 7, false, true, 2, 'Loser''s Finals');

INSERT INTO tournament_matches (tournament_id, parent_match_1_id, parent_match_2_id, inherits_parent_match_1_winner, inherits_parent_match_2_winner, match_number, match_title) 
VALUES (4, 6, 8, true, true, 0, 'Grand Finals');
