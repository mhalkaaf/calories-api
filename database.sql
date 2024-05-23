CREATE DATABASE jwttutorial;

CREATE TABLE users(
    id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (name, email, password) VALUES ('haeckal', 'haeckal@gmail.com', 'haikal123');