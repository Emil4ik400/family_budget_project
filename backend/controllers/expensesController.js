const pool = require('../db');

exports.createExpense = async (req, res) => {
  const user_id = req.user.user_id;
  const { amount, category, note, date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO expenses (user_id, amount, category, note, date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, amount, category, note, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error during adding expense:', error);
    res.status(500).json({ error: 'Server error during adding expense' });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses');
    res.json(result.rows);
  } catch (error) {
    console.error('Error during fetching expenses data:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getExpensesByUser = async (req, res) => {
  const  user_id  = req.user.user_id;
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
  const { amount, category, note, date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE expenses 
       SET amount = $1, category = $2, note = $3, date = $4
       WHERE id = $5 RETURNING *`,
      [amount, category, note, date, id]
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
