const Pool = require('pg').Pool;

const pool = new Pool({
    user: "mhalkaaf",
    host: "localhost",
    database: "students",
    password: "Haikal123",
    port: 5432
});

module.exports = pool;