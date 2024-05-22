import { pool } from './db.js';
import * as queries from './queries.js';


const addUser = (req, res) => {

    const { username, email, password } = req.body;

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
        pool.query(queries.addUser, [username, email, password], (error, results) => {
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
    const { username } = req.body

    pool.query(queries.getUserById, [id], (error, results) => {
        const noUserFound = !results.rows.length;
        if (noUserFound) {
            res.send("Student does not exist in database");
        };

        pool.query(queries.updateUser, [username, id], (error, results) => {
            if (error) {
                console.error("Error executing query", error.stack);
                return res.status(500).send("Internal server error");
            }
            return res.status(200).send("Updated successfully")
        });
    });
        
};


export { 
    addUser,
    deleteUser,
    updateUser
};