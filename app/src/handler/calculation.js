import jwt from 'jsonwebtoken';
import { insertCaloriesData } from '../database/queries.js'
import { pool } from '../database/db.js'
import "dotenv/config.js";


const caloriesData = (async (req, res) => {

    try {
        // Extract userId from JWT token in request header
        // const token = req.headers.authorization.split(' ')[1]; // Assuming JWT token is passed in Authorization header
        // const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode JWT token
        // const user_id = decodedToken.user_id;

        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).send('Authorization token is missing');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode JWT token
        const user_id = decodedToken.user_id;

        if (!user_id) {
            return res.status(401).send('Invalid token, user_id not found');
        }

        const data = req.body; // Array of meal objects

        if (!Array.isArray(data)) {
            return res.status(400).send('Invalid input format');
        }

        const client = await pool.connect();
        await client.query('BEGIN');

        const insertValues = [];
        const params = [];

        // const meals = [];
        // const calories = [];

        // Iterate over each object in the array
        data.forEach((item, index) => {
            if (item.meals && item.calories) {
                const paramIndex = index * 3;
                params.push(`($1, $${paramIndex + 2}, $${paramIndex + 3})`);
                insertValues.push(item.meals, parseInt(item.calories));
            }
        });

        // console.log('Meals:', meals);
        // console.log('Calories:', calories);

        // // Check if meals and calories arrays have the same length
        // if (meals.length !== calories.length) {
        //     return res.status(400).send('Invalid input format');
        // }

        // const params = [];
        // const values = [user_id];

        // Construct parameterized query string and values array
        // for (let i = 0; i < meals.length; i++) {
        //     params.push(`($1, $${params.length + 2}, $${params.length + 3})`);
        //     values.push(meals[i], calories[i]);
        // }

        // const client = await pool.connect();
        // await client.query('BEGIN');

        const queryText = insertCaloriesData(data.length);
        const values = [user_id, ...insertValues];

        const calorieCalculation = await client.query(queryText, values);

        await client.query('COMMIT');
        client.release();

        // res.status(200).send('Data successfully inserted');

        // const { meals, calories } = req.body;

        return res.status(201).json(calorieCalculation.rows);

    } catch (err) {
        console.error('Error inserting data', err);
        res.status(500).send('Internal Server Error');
    }

});

export { caloriesData }