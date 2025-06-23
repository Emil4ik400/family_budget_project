const express = require('express');
const router = express.Router();
const incomesController = require('../controllers/incomesController');
const auth = require('../middleware/authMiddleware');


router.post('/',auth, incomesController.createIncome);
router.get('/', auth, async(req, res) => {const userId = req.user.user_id;});
router.get('/', incomesController.getAllIncomes);
router.get('/:id', incomesController.getIncomesByUser);
router.put('/:id',auth, incomesController.updateIncome);

module.exports = router;