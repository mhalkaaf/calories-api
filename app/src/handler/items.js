import { pool } from '../database/db.js';
import { addItem, getItem, updateItem, deleteItem } from '../database/queries.js';

const addNewItem = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Not authenticated');
    }

    const user_id = req.session.userId;

    try {
        const { meal, amount } = req.body;

        const client = await pool.connect();

        await client.query('BEGIN');

        const newItem = await client.query(addItem, [user_id, meal, amount]);

        await client.query('COMMIT');
        client.release();

        res.status(201).json({ message: 'Meals saved successfully', Item: newItem.rows });

    } catch (err) {
        console.error('Error inserting data', err);
        res.status(500).json({ status: 'error', message: 'Internal server error!' });
    }
};

const getNewItem = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ status: 'error', message: 'Not authenticated' });
    }

    const user_id = req.session.userId;

    try {
        const client = await pool.connect();

        await client.query('BEGIN');

        const getItems = await client.query(getItem, [user_id]);

        await client.query('COMMIT');
        client.release();

        res.status(200).json({ message: 'Meals retrieved successfully', Item: getItems.rows });

    } catch (err) {
        console.error('Error retrieving data', err);
        res.status(500).json({ status: 'error', message: 'Internal server error!' });
    }
};

const updateNewItem = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Not authenticated');
    }

    const user_id = req.session.userId;

    try {
        const { id, meal, amount } = req.body;

        const client = await pool.connect();

        await client.query('BEGIN');

        const updatedItem = await client.query(updateItem, [meal, amount, user_id, id]);

        await client.query('COMMIT');
        client.release();

        if (updatedItem.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Meal not found or no change in data' });
        }

        res.status(200).json({ message: 'Meal updated successfully', Item: updatedItem.rows });

    } catch (err) {
        console.error('Error updating data', err);
        res.status(500).json({ status: 'error', message: 'Internal server error!' });
    }
};

const deleteNewItem = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ status: 'error', message: 'Not authenticated' });
    }

    const user_id = req.session.userId;

    try {
        const { id } = req.body;

        const client = await pool.connect();

        await client.query('BEGIN');

        const deletedItem = await client.query(deleteItem, [user_id, id]);

        await client.query('COMMIT');
        client.release();

        if (deletedItem.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Meal not found or already deleted' });
        }

        res.status(200).json({ message: 'Meal deleted successfully', Item: deletedItem.rows });

    } catch (err) {
        console.error('Error deleting data', err);
        res.status(500).json({ status: 'error', message: 'Internal server error!' });
    }
};

export { addNewItem, getNewItem, updateNewItem, deleteNewItem };