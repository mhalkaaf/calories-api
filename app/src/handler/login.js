import "dotenv/config.js";
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
            return res.status(401).json({ status: 'error', message: 'Invalid user or password!' });
        }

        const user = userLogin.rows[0];

        const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ status: 'error', message: 'Invalid user or password!' });
            }
    
        req.session.userId = user.id;
        console.log(`Logged in user ID: ${user.id}`);

        // res.status(200).send('Logged in successfully');
        res.status(200).json({ status: 'success', message: 'Logged in successfully' });

    } catch (err) {
        console.error('Error logging in', err);
        res.status(500).json({ status: 'error', message: 'Internal server error!' });
    }

});

// Logout Route
const logout = (async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            // return res.status(500).send('Failed to logout');
            return res.status(500).json({ status: 'error', message: 'Failed to logout' });
        }
        // res.status(200).send('Logged out successfully');
        res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    })
});


export { login, verify, logout }