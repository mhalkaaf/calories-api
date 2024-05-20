const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "database",
    database: "calories-api",
    password: "aTinsELrONveMONSITCHUcKeTCHeNT",
    port: 5432
});

module.exports = pool;