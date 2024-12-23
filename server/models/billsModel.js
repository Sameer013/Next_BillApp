const connection = require('../config/dbconn');

module.exports.customQuery = async function (query) {
    try {
        const con = await connection;
        const [rows] = await con.query(query);
        return rows; 
    } catch (err) {
        throw err; 
    }
};
