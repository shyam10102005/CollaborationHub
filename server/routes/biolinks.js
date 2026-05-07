const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/analytics/summary', authenticateToken, (req, res) => {
  const db = getDb();
  const cp = db.findOne('creator_profiles', p => p.user_id === req.user.id);
  if (!cp) return res.json({});
  const links = db.find('bio_links', l => l.creator_id === cp.id);
  const totalClicks = links.reduce((s, l) => s + (l.click_count || 0), 0);
  const topLinks = links.sort((a, b) => (b.click_count || 0) - (a.click_count || 0)).slice(0, 5);
  res.json({ totalClicks, topLinks });
});

router.get('/', authenticateToken, (req, res) => {
  const db = getDb();
  const cp = db.findOne('creator_profiles', p => p.user_id === req.user.id);
  if (!cp) return res.json([]);
  res.json(db.find('bio_links', l => l.creator_id === cp.id).sort((a, b) => a.sort_order - b.sort_order));
});

router.post('/', authenticateToken, (req, res) => {
  const db = getDb();
  const cp = db.findOne('creator_profiles', p => p.user_id === req.user.id);
  if (!cp) return res.status(403).json({ error: 'Creator profile required' });
  const { title, url, icon } = req.body;
  const links = db.find('bio_links', l => l.creator_id === cp.id);
  const maxOrder = links.reduce((m, l) => Math.max(m, l.sort_order || 0), 0);
  const link = { id: uuidv4(), creator_id: cp.id, title, url, icon, click_count: 0, sort_order: maxOrder + 1, is_active: 1, created_at: new Date().toISOString() };
  db.insert('bio_links', link);
  res.status(201).json(link);
});

router.delete('/:id', authenticateToken, (req, res) => {
  getDb().remove('bio_links', l => l.id === req.params.id);
  res.json({ success: true });
});

router.get('/public/:username', (req, res) => {
  const db = getDb();
  const cp = db.findOne('creator_profiles', p => p.username === req.params.username);
  if (!cp) return res.status(404).json({ error: 'Not found' });
  const u = db.findOne('users', u => u.id === cp.user_id);
  const links = db.find('bio_links', l => l.creator_id === cp.id && l.is_active).sort((a, b) => a.sort_order - b.sort_order);
  res.json({ creator: { ...cp, full_name: u?.full_name }, links });
});

module.exports = router;
