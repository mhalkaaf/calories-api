import bcrypt from 'bcrypt';
import { pool } from '../database/db.js';
import { jwtGenerator } from '../jwt/jwtGenerator.js';
import { validInfo } from '../middleware/validInfo.js';
import * as queries from '../database/queries.js';


const register = (validInfo, async (req,res) => {
    try {
        // 1. destructure the req.body (email, name, password)

        const { name, email, password } = req.body;

        if (!password) {
            return res.status(400).send("Password is required");
        }

        // 2. check if the user exist, then throw error

        const user = await pool.query(queries.selectUser, [email]);

        if (user.rows.length !== 0) {
            return res.status(401).send("User already exist");
        }

        const bcryptPassword = await bcrypt.hash(password, 10);

        const client = await pool.connect();

        const addingUser = await client.query(queries.addUser, [name, email, bcryptPassword]);
        client.release();

        const newUser = addingUser.rows[0];

        req.session.userId = newUser.id;
        console.log(`Registered user ID: ${newUser.id}`);

        res.status(201).json({ message: 'User registered successfully', user: newUser });

        // 3. bcrypt user password inside our database

        // const saltRound = 10;
        // const salt = await bcrypt.genSalt(saltRound);

        // console.log('Generated salt:', salt);

        // const bcryptPassword = await bcrypt.hash(password, salt);

        // // 4. enter the new user inside our database

        // const newUser = await pool.query(queries.addUser, [name, email, bcryptPassword]);

        // // 5. generating our jwt token

        // const token = jwtGenerator(newUser.rows[0].user_id);

        // return res.status(201).json({ token });
    } catch (err) {
        console.error('Error registering user', err);
        res.status(500).send('Internal Server Error');
    }
});

export { register }