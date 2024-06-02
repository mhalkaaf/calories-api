CREATE DATABASE jwttutorial;

create extension if not exists "uuid-ossp";

CREATE TABLE users(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (name, email, password) VALUES ('haeckal', 'haeckal@gmail.com', 'haikal123');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);


CREATE TABLE calories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(30) NOT NULL,
    meals VARCHAR(30) NOT NULL,
    calories INT NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_At = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_calories_updated_at
BEFORE UPDATE ON calories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- show calculation data on dashboard
SELECT title, meals, calories 
FROM calories 
WHERE user_id = $1
ORDER BY date DESC

-- grouping to show data as daily
SELECT 
    DATE(created_at) as date, 
   	SUM(calories) as total_calories
FROM 
    calories
WHERE 
    user_id = $1
GROUP BY 
    DATE(created_at)
ORDER BY 
	DATE(created_at) DESC

-- grouping to show data as daily with item
SELECT 
	DATE(created_at) as date, 
    SUM(calories) as total_calories,
    json_agg(json_build_object('meals', meals, 'calories', calories)) as daily_meals
FROM 
    calories
WHERE 
    user_id = $1
GROUP BY 
    DATE(created_at)
ORDER BY 
    DATE(created_at) DESC
