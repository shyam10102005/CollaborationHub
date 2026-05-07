const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/stats/summary', authenticateToken, (req, res) => {
  const db = getDb();
  const mine = db.find('collaborations', c => c.initiator_id === req.user.id || c.receiver_id === req.user.id);
  res.json({
    total: mine.length,
    pending: mine.filter(c => c.status === 'pending').length,
    active: mine.filter(c => ['accepted', 'in_creation'].includes(c.status)).length,
    completed: mine.filter(c => c.status === 'completed').length,
    rejected: mine.filter(c => c.status === 'rejected').length,
    total_brand_value: mine.filter(c => c.type === 'brand_deal').reduce((s, c) => s + (c.budget || 0), 0),
  });
});

router.get('/', authenticateToken, (req, res) => {
  const db = getDb();
  const { status, type } = req.query;
  let results = db.find('collaborations', c => c.initiator_id === req.user.id || c.receiver_id === req.user.id);
  if (status) results = results.filter(c => c.status === status);
  if (type) results = results.filter(c => c.type === type);
  results = results.map(c => ({
    ...c,
    initiator_name: db.findOne('users', u => u.id === c.initiator_id)?.full_name,
    receiver_name: db.findOne('users', u => u.id === c.receiver_id)?.full_name,
  })).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  res.json(results);
});

router.post('/', authenticateToken, (req, res) => {
  const db = getDb();
  const { title, description, type, receiver_id, budget, deliverables, deadline, platform } = req.body;
  const collab = { id: uuidv4(), title, description, type, status: 'pending', initiator_id: req.user.id, receiver_id, budget: budget || 0, deliverables, deadline, platform, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  db.insert('collaborations', collab);
  db.insert('notifications', { id: uuidv4(), user_id: receiver_id, type: 'collaboration', title: 'New Collaboration Request', message: `New request: ${title}`, is_read: 0, created_at: new Date().toISOString() });
  res.status(201).json({ ...collab, initiator_name: db.findOne('users', u => u.id === req.user.id)?.full_name, receiver_name: db.findOne('users', u => u.id === receiver_id)?.full_name });
});

router.put('/:id/status', authenticateToken, (req, res) => {
  const db = getDb();
  const updated = db.update('collaborations', c => c.id === req.params.id, { status: req.body.status, updated_at: new Date().toISOString() });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json({ ...updated, initiator_name: db.findOne('users', u => u.id === updated.initiator_id)?.full_name, receiver_name: db.findOne('users', u => u.id === updated.receiver_id)?.full_name });
});

module.exports = router;
