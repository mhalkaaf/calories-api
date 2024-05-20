const pool = require('./db');
const queries = require('./queries');

const getUser = (req, res) => {
    pool.query(queries.getUser, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const getUserById = (req, res) => {

    const id = parseInt(req.params.id);

    pool.query(queries.getUserById, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const addUser = (req, res) => {

    const { name, email, password } = req.body;

    // check if emails is already exist
    pool.query(queries.checkEmailExists, [email], (error, results) => {
        if (error) {
            console.error("Error executing query", error.stack);
            return res.status(500).send("Internal server error");
        }
        if (results.rows.length) {
            return res.status(400).send("Email already exists.");
        }

        // add student to database
        pool.query(queries.addUser, [name, email, password], (error, results) => {
            if (error) {
                console.error("Error executing query", error.stack);
                return res.status(500).send("Internal server error");
            }
            return res.status(200).send("Student added successfully");
        });
    });

    
};

const deleteUser = (req, res) =>  {
    const id = parseInt(req.params.id);

    pool.query(queries.getUserById, [id], (error, results) => {
        const noUserFound = !results.rows.length;
        if (noUserFound) {
            res.send("User does not exist in database");
        };
        
        pool.query(queries.deleteUser, [id], (error, results) => {
            if (error) {
                console.error("Error executing query", error.stack);
                return res.status(500).send("Internal server error");
            }
            return res.status(200).send("Student delete successfully");
        });
    });
};

const updateUser = (req, res) => {
    const id = parseInt(req.params.id)
    const { name } = req.body

    pool.query(queries.getUserById, [id], (error, results) => {
        const noUserFound = !results.rows.length;
        if (noUserFound) {
            res.send("Student does not exist in database");
        };

        pool.query(queries.updateUser, [name, id], (error, results) => {
            if (error) {
                console.error("Error executing query", error.stack);
                return res.status(500).send("Internal server error");
            }
            return res.status(200).send("Updated successfully")
        });
    });
        
};

module.exports = {
    getUser,
    getUserById,
    addUser,
    deleteUser,
    updateUser
};