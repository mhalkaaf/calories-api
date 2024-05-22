import { pool } from './db.js';
import * as queries from './queries.js';

const getUser = (req, res) => {
    pool.query(queries.getUser, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const getUserById = (req, res) => {

    const id = parseInt(req.params.id);

    pool.query(queries.getUserById, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

export { 
    getUser,
    getUserById
};