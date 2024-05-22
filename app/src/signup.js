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

export{
    addUser,
};