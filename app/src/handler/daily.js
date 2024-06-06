import jwt from 'jsonwebtoken';
import "dotenv/config.js";
import { pool } from '../database/db.js'
import { postDailyData, getDailyData, postDailyItemsData } from '../database/queries.js'


const addDaily = (async (req, res) => {

    try {
        
        // Extract userId from JWT token in request header
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Assuming JWT token is passed in Authorization header
        if (!token) {
            return res.status(401).send('Authorization token is missing');
        }

        let decodedToken;
        try {
            // decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode JWT token
            decodedToken = jwt.decode(token); // Verify and decode JWT token
        } catch (error) {
            return res.status(401).send('Invalid authorization token');
        }

        const user_id = decodedToken.user_id;

        if (!user_id) {
            return res.status(401).send('Invalid token, user_id not found');
        }

        // Extract title and meals array
        const { title, items } = req.body;
        console.log(title)
        console.log(items)

        // if (!title || !Array.isArray(meals)) {
        //     return res.status(400).send('Invalid input format');
        // }

        const client = await pool.connect();
        await client.query('BEGIN');

        const insertValues = [user_id, title];
        console.log('insertValues', insertValues)

        const Daily = await client.query(postDailyData, insertValues);

        await client.query('COMMIT');
        const daily = Daily.rows[0];

        for (let index = 0; index < items.length; index++) {
            const element = items[index];
            const DailyItems = await client.query(
                postDailyItemsData, 
                [daily.id, element.meals, element.amount]
            );
            console.log('DailyItems', DailyItems);
        }

        // console.log('calorieCalculation', calorieCalculation.rows[0])

        client.release();

        return res.status(201).json({
            data: 'ok'
        })
        // return res.status(201).json({
        //     data: calorieCalculation.rows,
        //     totalCalories: totalCalories
        // });

    } catch (err) {
        console.error('Error inserting data', err);
        res.status(500).send('Internal Server Error');
    }

});

const getDaily = (async (req, res) => {
    const client = await pool.connect();
    await client.query('BEGIN');


    // Extract userId from JWT token in request header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Assuming JWT token is passed in Authorization header
    if (!token) {
        return res.status(401).send('Authorization token is missing');
    }

    let decodedToken;
    try {
        // decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode JWT token
        decodedToken = jwt.decode(token); // Verify and decode JWT token
    } catch (error) {
        return res.status(401).send('Invalid authorization token');
    }

    const user_id = decodedToken.user_id;

    if (!user_id) {
        return res.status(401).send('Invalid token, user_id not found');
    }
    const Daily = await client.query(getDailyData, [user_id]);
    
    await client.query('COMMIT');
    client.release();

    return res.status(200).json({
        data: 'ok'
    })
})


export { addDaily, getDaily }