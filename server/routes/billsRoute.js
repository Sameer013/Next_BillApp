const express = require('express');
const billsController = require('../controllers/billsController')

const router = express.Router();

// Route to get customer data
router.get('/getInfo', billsController.getAllRenters);

module.exports = router;
