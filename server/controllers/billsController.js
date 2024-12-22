const billsModel = require('../models/customerModel');

// Controller to handle fetching customer data
const getAllReters = async (req, res) => {
    try {
        const bills = await billsModel.getAllBills();
        res.json(bills);
    } catch (error) {
        console.error('Error fetching customers:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllReters,
};
