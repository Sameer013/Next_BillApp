const express = require('express');
const billsController = require('../controllers/billsController')

const router = express.Router();

// GET Route for customer data
router.get('/getInfo', billsController.getAllRenters);
router.get('/getRenterId', billsController.getRenterId);
router.get('/getRenter/:id', billsController.getRenter);

module.exports = router;
