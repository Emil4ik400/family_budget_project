const express = require('express');
const router = express.Router();
const incomesController = require('../controllers/incomesController');

router.post('/', incomesController.createIncome);
router.get('/', incomesController.getAllIncomes);
router.get('/:id', incomesController.getIncomesByUser);
router.put('/:id',incomesController.updateIncome);

module.exports = router;