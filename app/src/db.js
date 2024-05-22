import pg from 'pg';

const pool = new pg.Pool({
    user: "postgres",
    host: "database",
    database: "calories-api",
    password: "aTinsELrONveMONSITCHUcKeTCHeNT",
    port: 5432
});


export { pool };