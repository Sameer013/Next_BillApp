const connection = require('../config/testDb');


module.exports.customQuery = async function (query, callback) {
            try {
                const con = await connection; 
                const [rows] = await con.query(query); 
                callback(null, rows); 
            } catch (err) {
                callback(err, null); // Pass errors to the callback
            }
        };