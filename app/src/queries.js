const getUser = "SELECT * FROM users";
const getUserById = "SELECT * FROM users WHERE id = $1";
const checkEmailExists = "SELECT s FROM users s WHERE s.email = $1";
const addUser = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";
const deleteUser = "DELETE FROM students WHERE id = $1";
const updateUser = "UPDATE students SET name = $1 WHERE id = $2";

module.exports = {
    getUser,
    getUserById,
    checkEmailExists,
    addUser,
    deleteUser,
    updateUser
}