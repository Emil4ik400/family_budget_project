const express = require('express');
const cors = require('cors');
const app = express();
const expensesRoutes = require('./routes/expenses');
const incomesRoutes = require('./routes/incomes');
const authRoutes = require('./routes/auth');
require('dotenv').config();

app.use(cors({
  origin:'http://localhost:5173',
  credentials: true
}))
app.use(express.json());
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Family Budget Backend',
    version: '1.0.0'
  });
});
app.use('/api/expenses', expensesRoutes);
app.use('/api/incomes', incomesRoutes);
app.use(authRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server runs on http://localhost:${PORT}`);
});
