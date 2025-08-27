import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import GlobalHeader from '../../components/ui/GlobalHeader';
import { useNavigate } from 'react-router-dom';

const FinanceTracker = () => {
  const navigate = useNavigate();
  // Category icons
  const categoryIcons = {
    Food: 'Utensils',
    Transport: 'Car',
    Shopping: 'ShoppingBag',
    Salary: 'DollarSign',
    Health: 'Heart',
    Entertainment: 'Film',
    Other: 'Circle',
  };
  // Dummy user for header (replace with real user logic if needed)
  const user = null;
  const [records, setRecords] = useState([]);
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

  const token = localStorage.getItem('token');

  useEffect(() => {
    // If guest or new user, reset to zero/empty
    if (!token) {
      setRecords([]);
      setSummary({ income: 0, expense: 0, balance: 0 });
      return;
    }
    fetch('/api/finance', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setRecords);
    fetch('/api/finance/budget/summary', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setSummary);
  }, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type, amount: Number(amount), category, description })
    });
    if (res.ok) {
      setAmount(''); setCategory(''); setDescription('');
      const newRecord = await res.json();
      setRecords(r => [newRecord, ...r]);
      fetch('/api/finance/budget/summary', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(setSummary);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-xl p-8 rounded-xl glass shadow-lg">
        {/* Global Header */}
        <div className="mb-4">
          <GlobalHeader user={user} />
        </div>
        {/* Back Button */}
        <button
          type="button"
          className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-primary text-sm font-medium"
          onClick={() => navigate(-1)}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 10H5m0 0l5-5m-5 5l5 5"/></svg>
          Back
        </button>
        <h1 className="text-2xl font-bold mb-6">Finance Tracker</h1>
        <div className="mb-6 p-4 rounded-xl glass-light shadow flex items-center justify-between">
          <div>
            <div className="text-lg">Income: <span className="text-success">${summary.income}</span></div>
            <div className="text-lg">Expense: <span className="text-error">${summary.expense}</span></div>
          </div>
          <div className="text-xl font-bold">Balance: <span className="text-primary">${summary.balance}</span></div>
        </div>
        <form className="mb-8 flex flex-col md:flex-row gap-4" onSubmit={handleAdd}>
          <select value={type} onChange={e => setType(e.target.value)} className="p-3 rounded-lg border border-border bg-input text-foreground">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="p-3 rounded-lg border border-border bg-input text-foreground" required />
          <select value={category} onChange={e => setCategory(e.target.value)} className="p-3 rounded-lg border border-border bg-input text-foreground">
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Salary">Salary</option>
            <option value="Health">Health</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="p-3 rounded-lg border border-border bg-input text-foreground" />
          <Button type="submit" variant="default">Add</Button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {records.map(r => (
            <div key={r._id} className="p-4 rounded-xl glass-light shadow border border-border flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className={`font-bold ${r.type === 'income' ? 'text-success' : 'text-error'}`}>{r.type}</span>
                <span className="text-lg">${r.amount}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                {categoryIcons[r.category] && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted/30">
                    <Icon name={categoryIcons[r.category]} size={16} />
                  </span>
                )}
                <span>{r.category}</span>
              </div>
              <div className="text-muted-foreground">{r.description}</div>
              <div className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FinanceTracker;
