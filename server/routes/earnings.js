const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/summary', authenticateToken, (req, res) => {
  const db = getDb();
  const mine = db.find('earnings', e => e.user_id === req.user.id);
  const total = { total_earnings: mine.reduce((s, e) => s + e.amount, 0), paid_earnings: mine.filter(e => e.status === 'completed').reduce((s, e) => s + e.amount, 0), pending_earnings: mine.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0), total_transactions: mine.length };

  const byTypeMap = {};
  mine.forEach(e => { if (!byTypeMap[e.type]) byTypeMap[e.type] = { type: e.type, total: 0, count: 0 }; byTypeMap[e.type].total += e.amount; byTypeMap[e.type].count++; });

  const monthlyMap = {};
  mine.forEach(e => { const m = e.created_at?.slice(0, 7); if (!monthlyMap[m]) monthlyMap[m] = { month: m, total: 0, transactions: 0 }; monthlyMap[m].total += e.amount; monthlyMap[m].transactions++; });

  res.json({ total, byType: Object.values(byTypeMap), monthly: Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month)) });
});

router.get('/', authenticateToken, (req, res) => {
  const db = getDb();
  let results = db.find('earnings', e => e.user_id === req.user.id);
  if (req.query.type) results = results.filter(e => e.type === req.query.type);
  res.json(results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

router.post('/', authenticateToken, (req, res) => {
  const db = getDb();
  const { amount, type, description, collaboration_id } = req.body;
  const earning = { id: uuidv4(), user_id: req.user.id, amount, type, status: 'pending', description, collaboration_id, created_at: new Date().toISOString() };
  db.insert('earnings', earning);
  res.status(201).json(earning);
});

module.exports = router;
