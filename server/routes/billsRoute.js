const express = require('express');
const billsController = require('../controllers/billsController')

const router = express.Router();

// GET Route for customer data
router.get('/getInfo', billsController.getAllRenters);
router.get('/getRenterId', billsController.getRenterId);
router.get('/getRenter/:id', billsController.getRenter);



// POST Route for inserting customer dat
router.post('/insertRenter', billsController.insertRenter);


// PUT Route for updating customer data
router.put('/updateRenter/:id', billsController.updateRenter);

module.exports = router;
