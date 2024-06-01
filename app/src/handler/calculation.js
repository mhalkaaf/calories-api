import jwt from 'jsonwebtoken';
import "dotenv/config.js";
import { insertCaloriesData } from '../database/queries.js'
import { pool } from '../database/db.js'


const caloriesData = (async (req, res) => {

    try {
        
        // Extract userId from JWT token in request header
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Assuming JWT token is passed in Authorization header
        if (!token) {
            return res.status(401).send('Authorization token is missing');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode JWT token
        const user_id = decodedToken.user_id;

        if (!user_id) {
            return res.status(401).send('Invalid token, user_id not found');
        }

        // Extract title and meals array
        const { title, meals } = req.body; 

        if (!title || !Array.isArray(meals)) {
            return res.status(400).send('Invalid input format');
        }

        const client = await pool.connect();
        await client.query('BEGIN');

        const insertValues = [user_id, title];
        let totalCalories = 0;

        meals.forEach((item) => {
            if (item.meals && item.calories) {
                insertValues.push(item.meals, parseInt(item.calories));
                totalCalories += parseInt(item.calories);
            }
        });

        const queryText = insertCaloriesData(meals.length);
        const calorieCalculation = await client.query(queryText, insertValues);

        await client.query('COMMIT');
        client.release();

        return res.status(201).json({
            data: calorieCalculation.rows,
            totalCalories: totalCalories
        });

    } catch (err) {
        console.error('Error inserting data', err);
        res.status(500).send('Internal Server Error');
    }

});


export { caloriesData }