import jwt from 'jsonwebtoken';
import "dotenv/config.js";
import { pool } from '../database/db.js';
import { addItem, getItem } from '../database/queries.js';


const addNewItem = (async (req,res) => {

    // Extract userId from JWT token in request header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Assuming JWT token is passed in Authorization header
    if (!token) {
        return res.status(401).send('Authorization token is missing');
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode JWT token
    } catch (error) {
        return res.status(401).send('Invalid authorization token');
    }

    const user_id = decodedToken.user_id;

    if (!user_id) {
        return res.status(401).send('Invalid token, user_id not found');
    }

    try {
        const { meal, amount } = req.body;

        const client = await pool.connect();

        await client.query('BEGIN');

        const newItem = await client.query(addItem, [user_id, meal, amount]);

        await client.query('COMMIT');
        client.release();

        res.status(201).json({ message: 'Meals saved successfully', 
                               Item: newItem.rows });

    } catch (error) {
        console.error('Error inserting data', err);
        res.status(500).send('Internal Server Error');
    }
    
});

const getNewItem = (async (req,res) => {

    // Extract userId from JWT token in request header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Assuming JWT token is passed in Authorization header
    if (!token) {
        return res.status(401).send('Authorization token is missing');
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode JWT token
    } catch (error) {
        return res.status(401).send('Invalid authorization token');
    }

    const user_id = decodedToken.user_id;

    if (!user_id) {
        return res.status(401).send('Invalid token, user_id not found');
    }

    try {

        const client = await pool.connect();

        await client.query('BEGIN');

        const getItems = await client.query(getItem, [user_id]);

        await client.query('COMMIT');
        client.release();

        res.status(201).json({ message: 'Meals saved successfully', 
                               Item: getItems.rows });

    } catch (error) {
        console.error('Error inserting data', err);
        res.status(500).send('Internal Server Error');
    }
    
});

export { addNewItem, getNewItem }