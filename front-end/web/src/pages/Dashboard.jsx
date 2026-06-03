import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';

const API = 'http://localhost:3000';

function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [form, setForm] = useState({ type: 'income', amount: '', category: '', note: '', date: '' });
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
    if (res.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
      return null;
    }
    return res;
  };

  const loadData = async () => {
    const [expRes, incRes] = await Promise.all([
      authFetch(`${API}/api/expenses`),
      authFetch(`${API}/api/incomes`),
    ]);
    if (!expRes || !incRes) return;
    setExpenses(await expRes.json());
    setIncomes(await incRes.json());
  };

  useEffect(() => { loadData(); }, []);

  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const balance = totalIncome - totalExpense;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const url = form.type === 'income' ? `${API}/api/incomes` : `${API}/api/expenses`;
    const res = await authFetch(url, {
      method: 'POST',
      body: JSON.stringify({
        amount: form.amount,
        category: form.category,
        note: form.note,
        date: form.date,
      }),
    });
    if (!res) return;
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Ошибка при добавлении записи');
      return;
    }
    setForm({ ...form, amount: '', category: '', note: '', date: '' });
    loadData();
  };

  const handleDelete = async (type, id) => {
    const url = type === 'income' ? `${API}/api/incomes/${id}` : `${API}/api/expenses/${id}`;
    const res = await authFetch(url, { method: 'DELETE' });
    if (!res) return;
    loadData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatDate = dateStr => new Date(dateStr).toLocaleDateString('ru-RU');

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Семейный бюджет</h1>
        <button className="btn-logout" onClick={handleLogout}>Выйти</button>
      </header>

      <div className={`balance-card ${balance >= 0 ? 'positive' : 'negative'}`}>
        <span className="balance-label">Баланс</span>
        <span className="balance-amount">{balance.toFixed(2)} ₪</span>
        <div className="balance-details">
          <span className="income-total">+ {totalIncome.toFixed(2)} ₪</span>
          <span className="expense-total">− {totalExpense.toFixed(2)} ₪</span>
        </div>
      </div>

      <form className="add-form" onSubmit={handleSubmit}>
        <div className="form-type-toggle">
          <button
            type="button"
            className={form.type === 'income' ? 'active' : ''}
            onClick={() => setForm({ ...form, type: 'income' })}
          >Доход</button>
          <button
            type="button"
            className={form.type === 'expense' ? 'active' : ''}
            onClick={() => setForm({ ...form, type: 'expense' })}
          >Расход</button>
        </div>
        <div className="form-fields">
          <input name="amount" type="number" placeholder="Сумма" value={form.amount} onChange={handleChange} required min="0.01" step="0.01" />
          <input name="category" type="text" placeholder="Категория" value={form.category} onChange={handleChange} required />
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
          <input name="note" type="text" placeholder="Заметка (необязательно)" value={form.note} onChange={handleChange} />
          <button type="submit" className="btn-add">Добавить</button>
        </div>
        {error && <p className="form-error">{error}</p>}
      </form>

      <div className="lists-container">
        <section className="list-section">
          <h2>Доходы</h2>
          {incomes.length === 0 ? (
            <p className="empty">Нет записей</p>
          ) : (
            <ul>
              {incomes.map(item => (
                <li key={item.id} className="record-item income-item">
                  <div className="record-info">
                    <span className="record-category">{item.category}</span>
                    <span className="record-date">{formatDate(item.date)}</span>
                    {item.note && <span className="record-note">{item.note}</span>}
                  </div>
                  <div className="record-right">
                    <span className="record-amount income-amount">+{Number(item.amount).toFixed(2)} ₪</span>
                    <button className="btn-delete" onClick={() => handleDelete('income', item.id)}>✕</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="list-section">
          <h2>Расходы</h2>
          {expenses.length === 0 ? (
            <p className="empty">Нет записей</p>
          ) : (
            <ul>
              {expenses.map(item => (
                <li key={item.id} className="record-item expense-item">
                  <div className="record-info">
                    <span className="record-category">{item.category}</span>
                    <span className="record-date">{formatDate(item.date)}</span>
                    {item.note && <span className="record-note">{item.note}</span>}
                  </div>
                  <div className="record-right">
                    <span className="record-amount expense-amount">−{Number(item.amount).toFixed(2)} ₪</span>
                    <button className="btn-delete" onClick={() => handleDelete('expense', item.id)}>✕</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
