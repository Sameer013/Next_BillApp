const db = require('../config/db');

// Fetch All Bills
const getAllBills = async () => {
    const [rows] = await db.query('SELECT * FROM bills');
    return rows;
};

module.exports = {
    getAllBills,
};
