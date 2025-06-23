const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expensesController');
const auth = require('../middleware/authMiddleware');

router.post('/',auth, expensesController.createExpense);
router.get('/', auth, async (req, res) => { const userId = req.user.user_id;});
router.get('/', expensesController.getAllExpenses);
router.get('/:id', expensesController.getExpensesByUser);
router.put('/:id', expensesController.updateExpense);

module.exports = router;