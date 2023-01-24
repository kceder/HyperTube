-- CREATE USER hyper;
-- CREATE DATABASE hypertube;
-- GRANT ALL PRIVILEGES ON DATABASE hypertube TO hyper;
SET TIME ZONE 'Europe/Helsinki';

CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(10) NOT NULL,
	firstname VARCHAR(30) DEFAULT '',
	lastname VARCHAR(30) DEFAULT '',
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) DEFAULT '',
	confirmed BOOLEAN DEFAULT false,
	profile_pic VARCHAR(255) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS email_tokens (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    token_hash VARCHAR(32) NOT NULL,
    expires_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS downloads (
	id SERIAL NOT NULL PRIMARY KEY,
	imdb_id VARCHAR(15) NOT NULL,
	quality VARCHAR(10) NOT NULL,
	completed BOOLEAN DEFAULT false,
	path VARCHAR(1000) NOT NULL,
	size BIGINT NOT NULL,
	last_watched BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
	id SERIAL NOT NULL PRIMARY KEY,
	user_id INT NOT NULL,
	imdb_id VARCHAR(15) NOT NULL,
	comment VARCHAR(255) NOT NULL,
	created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS users_movies (
	id SERIAL NOT NULL PRIMARY KEY,
	user_id INT NOT NULL,
	imdb_id VARCHAR(15) NOT NULL
);

-- Hashed password is Asdf1
INSERT INTO users VALUES (1, 'Bobby1', 'Robert', 'Doe', 'test@test.com', '$2a$12$bzfTNVzNkqMH94ubFhDPL.OfPQcj5Xi2/5H2tPemG0fByaUGlZDlu');

-- We need to manually set the id column after inserting the three users
SELECT setval(pg_get_serial_sequence('users', 'id'), MAX(id)) FROM users;