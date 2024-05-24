import bcrypt from 'bcrypt';
import { pool } from '../database/db.js';
import { jwtGenerator } from '../jwt/jwtGenerator.js';
import { validInfo } from '../middleware/validInfo.js';
import * as queries from '../database/queries.js';


const register = (validInfo, async (req,res) => {
    try {
        // 1. destructure the req.body (email, name, password)

        const { name, email, password } = req.body;

        // 2. check if the user exist, then throw error

        const user = await pool.query(queries.selectUser, [email]);

        if (user.rows.length !== 0) {
            return res.status(401).send("User already exist");
        }
        // 3. bcrypt user password inside our database

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 4. enter the new user inside our database

        const newUser = await pool.query(queries.addUser, [name, email, bcryptPassword]);

        // 5. generating our jwt token

        const token = jwtGenerator(newUser.rows[0].user_id);

        return res.status(201).json({ token });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
    }
});


export { register }