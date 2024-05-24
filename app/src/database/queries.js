const selectUser = "SELECT * FROM users where email = $1";
const addUser = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";


export {
    selectUser,
    addUser,
};