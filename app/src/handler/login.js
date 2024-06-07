\import "dotenv/config.js";
import bcrypt from 'bcrypt';
import { pool } from '../database/db.js';
import { validInfo } from '../middleware/validInfo.js';
import { selectUser } from '../database/queries.js'


const login = (validInfo, async (req, res) => {

    const { email, password } = req.body;

    try {
        const client = await pool.connect();

        const userLogin = await client.query(selectUser, [email]);
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


export { login, verify, logout }