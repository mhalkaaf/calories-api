const selectUser = "SELECT * FROM users where email = $1";
const addUser = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
// const insertCaloriesData = "INSERT INTO calorie_calculations (user_id, meal, calories) VALUES ${params.join(',')} RETURNING *";
const insertCaloriesData = (dataLength) => {
    const params = [];
    for (let i = 0; i < dataLength; i++) {
        params.push(`($1, $${i * 2 + 2}, $${i * 2 + 3})`);
    }
    return `INSERT INTO calories (user_id, meals, calories) VALUES ${params.join(', ')} RETURNING *`;
};


const addCalorieCalculation = async (meals, calories) => {
    const result = await pool.query(
        'INSERT INTO calories (meal, calories) VALUES ($1, $2) RETURNING *',
        [meals, calories]
    );
    return result.rows[0];
};
export {
    selectUser,
    addUser,
    insertCaloriesData
};