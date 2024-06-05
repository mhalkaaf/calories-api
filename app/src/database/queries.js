const selectUser = "SELECT * FROM users where email = $1";
const addUser = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
const insertCaloriesData = (mealsLength) => {
    const valuePlaceholders = [];
    for (let i = 0; i < mealsLength; i++) {
        const base = i * 2 + 3; // Update the base increment to match 2 placeholders per meal
        valuePlaceholders.push(`($1::uuid, $2::text, $${base}::text, $${base + 1}::int)`);
    }
    return `INSERT INTO calories (user_id, title, meals, calories) VALUES ${valuePlaceholders.join(', ')} RETURNING *`;
};

const getCaloriesData = "SELECT title, meals, calories FROM calories WHERE user_id = $1 ORDER BY date DESC";

const getDailyCaloriesData = "SELECT DATE(created_at) as date, SUM(calories) as total_calories FROM calories WHERE user_id = $1 GROUP BY DATE(created_at) ORDER BY DATE(created_at) DESC";

const getSummaryData = "SELECT DATE(created_at) as date, SUM(calories) as total_calories, json_agg(json_build_object('meals', meals, 'calories', calories)) as daily_meals FROM calories WHERE user_id = $1 GROUP BY DATE(created_at) ORDER BY DATE(created_at) DESC";

const addItem = "INSERT INTO calories (user_id, meal, amount) VALUES ($1, $2, $3) RETURNING *";


export {
    selectUser,
    addUser,
    insertCaloriesData,
    getCaloriesData,
    getDailyCaloriesData,
    getSummaryData,
    addItem
};