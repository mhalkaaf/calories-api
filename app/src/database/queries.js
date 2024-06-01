const selectUser = "SELECT * FROM users where email = $1";
const addUser = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
// const insertCaloriesData = "INSERT INTO calorie_calculations (user_id, meal, calories) VALUES ${params.join(',')} RETURNING *";
const insertCaloriesData = (mealsLength) => {
    const valuePlaceholders = [];
    for (let i = 0; i < mealsLength; i++) {
        const base = i * 2 + 3; // Update the base increment to match 2 placeholders per meal
        valuePlaceholders.push(`($1::uuid, $2::text, $${base}::text, $${base + 1}::int)`);
    }
    return `INSERT INTO calories (user_id, title, meals, calories) VALUES ${valuePlaceholders.join(', ')} RETURNING *`;
};


// const addCalorieCalculation = async (meals, calories) => {
//     const result = await pool.query(
//         'INSERT INTO calories (meal, calories) VALUES ($1, $2) RETURNING *',
//         [meals, calories]
//     );
//     return result.rows[0];
// };


export {
    selectUser,
    addUser,
    insertCaloriesData
};