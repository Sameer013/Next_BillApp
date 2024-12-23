// require('dotenv').config({path: '../.env'});
// const mysql = require('mysql2');

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
    
// });

// console.log(process.env.DB_HOST,process.env.DB_USER);
// mysql.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });

// module.exports = db;

require('dotenv').config({path: '../.env'});
const mysql = require('mysql2/promise');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
});



module.exports = connection;