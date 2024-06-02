import jwt from 'jsonwebtoken';
import "dotenv/config.js";
import { pool } from '../database/db.js';
import { getCaloriesData, getDailyCaloriesData, getSummaryData } from '../database/queries.js';

const getItems = (async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).send('Authorization token is missing');
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).send('Invalid authorization token');
        }

        const user_id = decodedToken.user_id;

        if (!user_id) {
            return res.status(401).send('Invalid token, user_id not found');
        }

        const client = await pool.connect();

        await client.query('BEGIN');

        // const getData = await pool.query(getCaloriesData, [user_id]);

        const getData = await client.query(getSummaryData, [user_id]);

        await client.query('COMMIT');
        client.release();

        if (getData.rows.length === 0) {
            return res.status(404).json({ message: 'No data found' });
        }

        // Calculate total calories
        // const totalCalories = getData.rows.reduce((acc, item) => acc + item.calories, 0);

        res.status(200).json({
            dailySummaries: getData.rows
        });

        // res.status(200).json({
        //     items: getData.rows,
        //     totalCalories: totalCalories
        // });

    } catch (err) {
        console.error('Error retrieving data', err);
        res.status(500).send('Internal Server Error');
    }
});


export { getItems };