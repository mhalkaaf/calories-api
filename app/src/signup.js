import { pool } from './db.js';
import * as queries from './queries.js';
import bcrypt from 'bcrypt';

const addUser = (req, res) => {

    const { username, email, password } = req.body;

    // check if emails is already exist
    pool.query(queries.checkEmailExists, [email], async (error, results) => { // Tambahkan async di sini
        if (error) {
            console.error("Error executing query", error.stack);
            return res.status(500).send("Internal server error");
        }
        if (results.rows.length) {
            return res.status(400).send("Email already exists.");
        }

        try {
            // Hash kata sandi
            const hashedPassword = await bcrypt.hash(password, 10); // Menggunakan 10 putaran salt

            // Tambahkan pengguna ke database dengan kata sandi yang dihash
            pool.query(queries.addUser, [username, email, hashedPassword], (error, results) => {
                if (error) {
                    console.error("Error executing query", error.stack);
                    return res.status(500).send("Internal server error");
                }
                return res.status(200).send("Student added successfully");
            });
        } catch (hashError) {
            console.error("Error hashing password", hashError.stack);
            return res.status(500).send("Internal server error");
        }
    });
};


export{
    addUser,
};