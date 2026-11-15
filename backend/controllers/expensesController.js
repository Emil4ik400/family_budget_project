const pool = require('../db');

exports.createExpense = async (req, res) => {
  const user_id = req.user.user_id;
  const { amount, category, note, date } = req.body;

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }
  if (!category || typeof category !== 'string' || category.trim() === '') {
    return res.status(400).json({ error: 'category is required' });
  }
  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ error: 'date is required and must be a valid date' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO expenses (user_id, amount, category, note, date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, Number(amount), category.trim(), note || null, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error during adding expense:', error);
    res.status(500).json({ error: 'Server error during adding expense' });
  }
};

exports.getExpensesByUser = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const result = await pool.query(
      `SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching expenses by user:', error);
    res.status(500).json({ error: 'Server error while fetching user expenses' });
  }
};

exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.user_id;
  const { amount, category, note, date } = req.body;

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }
  if (!category || typeof category !== 'string' || category.trim() === '') {
    return res.status(400).json({ error: 'category is required' });
  }
  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ error: 'date is required and must be a valid date' });
  }

  try {
    const result = await pool.query(
      `UPDATE expenses
       SET amount = $1, category = $2, note = $3, date = $4
       WHERE id = $5 AND user_id = $6 RETURNING *`,
      [Number(amount), category.trim(), note || null, date, id, user_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error during updating expense:', error);
    res.status(500).json({ error: 'Server error during updating expense' });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.user_id;
  try {
    const result = await pool.query(
      `DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, user_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    console.error('Error during deleting expense:', error);
    res.status(500).json({ error: 'Server error during deleting expense' });
  }
};
