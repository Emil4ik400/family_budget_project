const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expensesController');

router.post('/', expensesController.createExpense);
router.get('/', expensesController.getAllExpenses);
router.get('/:id', expensesController.getExpensesByUser);
router.put('/:id', expensesController.updateExpense);

module.exports = router;