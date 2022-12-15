-- CREATE USER hyper;
-- CREATE DATABASE hypertube;
-- GRANT ALL PRIVILEGES ON DATABASE hypertube TO hyper;
SET TIME ZONE 'Europe/Helsinki';

CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(10) NOT NULL,
	firstname VARCHAR(30) NOT NULL,
	lastname VARCHAR(30) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	profile_pic VARCHAR(255) DEFAULT ''
);

-- Hashed password is Asdf1
INSERT INTO users VALUES (1, 'Bobby1', 'Robert', 'Doe', 'test@test.com', '$2a$12$bzfTNVzNkqMH94ubFhDPL.OfPQcj5Xi2/5H2tPemG0fByaUGlZDlu');

-- We need to manually set the id column after inserting the three users
SELECT setval(pg_get_serial_sequence('users', 'id'), MAX(id)) FROM users;