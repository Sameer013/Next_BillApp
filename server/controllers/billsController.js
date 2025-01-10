const dbModel = require('../models/billsModel');

async function executeQuery(sql, res) {
    try {
        console.log(`SQL QUERY: ${sql}`);
        const result = await dbModel.customQuery(sql);
        return res.json(result);
    } catch (err) {
        console.error(`ERROR: ${err.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports.getAllRenters = async function (req, res) {
    const sql = "SELECT * FROM BILLS";
    await executeQuery(sql, res);
};


module.exports.getRenterId = async function (req, res) {
    const sql = "SELECT * FROM renters";
    await executeQuery(sql, res);
};

module.exports.getRenter = async function (req, res) {
    let id = req.params.id;
    const sql = "SELECT * FROM bills WHERE bill_id = ?";
    const values = [id];
    await executeQuery({ sql, values }, res);
    // await executeQuery(sql, res);
};
