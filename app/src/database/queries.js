const selectUser = "SELECT * FROM users where email = $1";

const addUser = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";

const addItem = "INSERT INTO calories (user_id, meal, amount) VALUES ($1, $2, $3) RETURNING *";

const getItem = "SELECT meal, amount FROM calories WHERE user_id = $1";

const updateItem = "UPDATE calories SET meal = $1, amount = $2 WHERE user_id = $3 AND id = $4 RETURNING *;"

const deleteItem = "DELETE FROM calories WHERE user_id = $1 AND id = $2 RETURNING *";


export {
    selectUser,
    addUser,
    addItem,
    getItem,
    updateItem,
    deleteItem
};