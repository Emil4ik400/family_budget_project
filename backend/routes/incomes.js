const express = require('express');
const router = express.Router();
const incomesController = require('../controllers/incomesController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, incomesController.createIncome);
router.get('/', auth, incomesController.getIncomesByUser);
router.put('/:id', auth, incomesController.updateIncome);
router.delete('/:id', auth, incomesController.deleteIncome);

module.exports = router;