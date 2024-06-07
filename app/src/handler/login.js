import jwt from 'jsonwebtoken';
import "dotenv/config.js";
import bcrypt from 'bcrypt';
import { pool } from '../database/db.js';
import { jwtGenerator } from '../jwt/jwtGenerator.js';
import { validInfo } from '../middleware/validInfo.js';
import * as queries from '../database/queries.js'


const login = (validInfo, async (req, res) => {

    const { email, password } = req.body;

    try {
        const client = await pool.connect();

        const userLogin = await client.query(queries.selectUser, [email]);
        client.release();

        if (userLogin.rows.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const user = userLogin.rows[0];

        const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).send('Invalid username or password');
            }
    
        req.session.userId = user.id;
        console.log(`Logged in user ID: ${user.id}`);

        res.status(200).send('Logged in successfully');

    } catch (err) {
        console.error('Error logging in', err);
        res.status(500).send('Internal Server Error');
    }

});

// Logout Route
const logout = (async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.status(200).send('Logged out successfully');
    })
});

const verify = (async (req, res, next) => {

    const jwtToken = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Assuming JWT token is passed in Authorization header
    if (!jwtToken) {
        return res.status(401).send('Authorization token is missing');
    }

    try {
        const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user = decodedToken; // Assign decoded token to req.user
        res.status(200).json({ message: "Token is Valid" });
        next(); // Call next to move to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: "Authorization token is invalid" });
    }
});


export { login, verify, logout }