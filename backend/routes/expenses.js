const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expensesController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, expensesController.createExpense);
router.get('/', auth, expensesController.getExpensesByUser);
router.put('/:id', auth, expensesController.updateExpense);
router.delete('/:id', auth, expensesController.deleteExpense);

module.exports = router;