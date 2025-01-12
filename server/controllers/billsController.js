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
const sql = `SELECT renter_id, curr_reading as prev_reading, month, year, previous_due FROM bills 
             WHERE bill_id IN 
             ( SELECT MAX(bill_id) FROM bills GROUP BY renter_id )
             ORDER BY renter_id;`;
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
    const {  renter_id, month, year, prev_reading, curr_reading, previous_due } = req.body;

    
    if (!renter_id || !month || !year || !prev_reading || !curr_reading ) {
        const values = [renter_id, month, year, prev_reading, curr_reading, previous_due];
        console.log('Inside Error Block: ',values);
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `INSERT INTO bills (renter_id, month, year, prev_reading, curr_reading, previous_due)
                 VALUES  (?, ?, ?, ?, ?, ?)`;
    const values = [renter_id, month, year, prev_reading, curr_reading, previous_due];
    // console.log(values);
    await executeQuery({sql, values},res);
};

// PUT Controller to update an existing renter
module.exports.updateRenter = async function (req, res) {
    let id = req.params.id;
    const { renter_id, month, year, prev_reading, curr_reading, previous_due, is_paid } = req.body;

    const sql = `UPDATE bills
                 SET renter_id = ?, month = ?, year = ?, prev_reading = ?, curr_reading = ?, previous_due = ?, is_paid = ?
                 WHERE bill_id = ?`;
    const values = [renter_id, month, year, prev_reading, curr_reading, previous_due, is_paid, id];

    await executeQuery({sql, values}, res);
};