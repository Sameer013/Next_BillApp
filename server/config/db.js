require('dotenv').config({path: '../.env'});
const db = require('mysql2');

const pool = db.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
});


module.exports = pool.promise();

