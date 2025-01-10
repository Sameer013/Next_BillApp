const dbModel = require('../models/billsModel');

async function executeQuery(sql, res) {
    try {
        console.log("SQL QUERY: ",sql," SUCCESS");
        const result = await dbModel.customQuery(sql);
        return res.json(result);
    } catch (err) {
        console.error(`ERROR: ${err.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


// GET Controllers

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


// POST Controller to insert a new renter
module.exports.insertRenter = async function (req, res) {
    const { renter_id, month, year, prevReading, currentReading, dues } = req.body;

    
    if (!renter_id || !month || !year || !prevReading || !currentReading || !dues) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `INSERT INTO bills (renter_id, month, year, prev_reading, curr_reading, previous_due)
                 VALUES  (?, ?, ?, ?, ?, ?)`;
    const values = [renter_id, month, year, prevReading, currentReading, dues];
    console.log(values);
    await executeQuery({sql, values},res);
};

// PUT Controller to update an existing renter
module.exports.updateRenter = async function (req, res) {
    let id = req.params.id;
    const { renter_id, month, year, prev_reading, curr_reading, previous_due } = req.body;

    
    // if (!renter_id || !month || !year || !prevReading || !currentReading) {
    //     return res.status(400).json({ error: 'Missing required fields' });
    // }

    const sql = `UPDATE bills
                 SET renter_id = ?, month = ?, year = ?, prev_reading = ?, curr_reading = ?, previous_due = ?
                 WHERE bill_id = ?`;
    const values = [renter_id, month, year, prev_reading, curr_reading, previous_due, id];

    await executeQuery({sql, values}, res);
};