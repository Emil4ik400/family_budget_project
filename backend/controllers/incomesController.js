const pool = require('../db');

exports.createIncome = async (req, res) => {
  const user_id = req.user.user_id;
  const { amount, category, note, date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO incomes (user_id, amount, category, note, date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, amount, category, note, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error during adding income:', error);
    res.status(500).json({ error: 'Server error during adding income' });
  }
};

exports.getIncomesByUser = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const result = await pool.query(
      `SELECT * FROM incomes WHERE user_id = $1 ORDER BY date DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching incomes by user:', error);
    res.status(500).json({ error: 'Server error while fetching user incomes' });
  }
};

exports.updateIncome = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.user_id;
  const { amount, category, note, date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE incomes
       SET amount = $1, category = $2, note = $3, date = $4
       WHERE id = $5 AND user_id = $6 RETURNING *`,
      [amount, category, note, date, id, user_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Income not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error during updating income:', error);
    res.status(500).json({ error: 'Server error during updating income' });
  }
};

exports.deleteIncome = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.user_id;
  try {
    const result = await pool.query(
      `DELETE FROM incomes WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, user_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Income not found' });
    }
    res.json({ message: 'Income deleted' });
  } catch (error) {
    console.error('Error during deleting income:', error);
    res.status(500).json({ error: 'Server error during deleting income' });
  }
};
