import jwt from 'jsonwebtoken';
import "dotenv/config.js";
import bcrypt from 'bcrypt';
import { pool } from '../database/db.js';
import { jwtGenerator } from '../jwt/jwtGenerator.js';
import { validInfo } from '../middleware/validInfo.js';
import { selectUser } from '../database/queries.js'


const login = (validInfo, async (req, res) => {
    try {
        // 1. destructure the req.body

        const { email, password } = req.body;

        // 2. check if the user doesnt exist (if not) throw error

        const user = await pool.query(selectUser, [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Invalid Credential' });
        }

        // 3. check if incoming password is the same as database

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            res.status(401).json({ status: 'error', message: 'Invalid Credential' });
        } 

        // 4. give them jwt token

        const token = jwtGenerator(user.rows[0].id);
        return res.json({ token });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ status: 'error', message: 'Internal Server error' });
        }
});

const verify = (async (req, res, next) => {

    const jwtToken = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Assuming JWT token is passed in Authorization header
    if (!jwtToken) {
        return res.status(401).json({ status: 'error', message: 'Authorization token is missing' });
    }

    try {
        const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user = decodedToken; // Assign decoded token to req.user
        res.status(200).json({ status: 'success', message: 'Token is Valid' });
        next(); // Call next to move to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ status: 'error', message: 'Authorization token is invalid' });
    }
});

export { login, verify }