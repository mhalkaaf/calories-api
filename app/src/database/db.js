import pg from 'pg';
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' 
    ? '.env.production' 
    : process.env.NODE_ENV === 'staging' 
    ? '.env.staging' 
    : '.env';

dotenv.config({ path: envFile });

const pool = new pg.Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE
});


export { pool };