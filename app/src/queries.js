const getUser = "SELECT * FROM users";
const getUserById = "SELECT * FROM users WHERE id = $1";
const checkEmailExists = "SELECT s FROM users s WHERE s.email = $1";
const addUser = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)";
const deleteUser = "DELETE FROM users WHERE id = $1";
const updateUser = "UPDATE users SET username = $1 WHERE id = $2";


export {
    getUser,
    getUserById,
    checkEmailExists,
    addUser,
    deleteUser,
    updateUser
};