import bcrypt from 'bcrypt';
import { pool } from '../database/db.js';
import { validInfo } from '../middleware/validInfo.js';
import { selectUser, addUser } from '../database/queries.js';


const register = (validInfo, async (req,res) => {

    try {
        // 1. destructure the req.body (email, name, password)

        const { name, email, password } = req.body;

        if (!password) {
            return res.status(401).json({ status: 'error', message: 'Password is required!' });
        }

        // 2. check if the user exist, then throw error

        const user = await pool.query(selectUser, [email]);

        if (user.rows.length !== 0) {
            return res.status(401).json({ status: 'error', message: 'User already exist' });
        }

        const bcryptPassword = await bcrypt.hash(password, 10);

        const client = await pool.connect();

        const addingUser = await client.query(addUser, [name, email, bcryptPassword]);
        client.release();

        const newUser = addingUser.rows[0];

        req.session.userId = newUser.id;
        console.log(`Registered user ID: ${newUser.id}`);

        // res.status(201).json({ message: 'User registered successfully', user: newUser });
        res.status(201).json({ status: 'success', message: 'User registered successfully', data: { user: newUser } });

    } catch (err) {
        console.error('Error registering user', err);
        // res.status(500).send('Internal Server Error');
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


export { register }