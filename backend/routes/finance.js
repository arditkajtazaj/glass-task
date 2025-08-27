import express from 'express';
import Finance from '../models/Finance.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Get all finance records
router.get('/', auth, async (req, res) => {
  const records = await Finance.find({ user: req.userId });
  res.json(records);
});

// Add finance record
router.post('/', auth, async (req, res) => {
  const record = new Finance({ ...req.body, user: req.userId });
  await record.save();
  res.status(201).json(record);
});

// Update finance record
router.put('/:id', auth, async (req, res) => {
  const record = await Finance.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true });
  res.json(record);
});

// Delete finance record
router.delete('/:id', auth, async (req, res) => {
  await Finance.findOneAndDelete({ _id: req.params.id, user: req.userId });
  res.json({ message: 'Finance record deleted' });
});

// Budget summary
router.get('/budget/summary', auth, async (req, res) => {
  const records = await Finance.find({ user: req.userId });
  const income = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const expense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  res.json({ income, expense, balance: income - expense });
});

export default router;
