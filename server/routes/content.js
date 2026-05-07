const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/stats/summary', authenticateToken, (req, res) => {
  const db = getDb();
  const cp = db.findOne('creator_profiles', p => p.user_id === req.user.id);
  if (!cp) return res.json({});
  const items = db.find('content_items', i => i.creator_id === cp.id);
  res.json({ stats: { total: items.length, published: items.filter(i => i.status === 'published').length, scheduled: items.filter(i => i.status === 'scheduled').length, drafts: items.filter(i => i.status === 'draft').length } });
});

router.get('/', authenticateToken, (req, res) => {
  const db = getDb();
  const cp = db.findOne('creator_profiles', p => p.user_id === req.user.id);
  if (!cp) return res.json([]);
  let items = db.find('content_items', i => i.creator_id === cp.id);
  const { status, platform } = req.query;
  if (status) items = items.filter(i => i.status === status);
  if (platform) items = items.filter(i => i.platform === platform);
  res.json(items.sort((a, b) => new Date(a.scheduled_at || 0) - new Date(b.scheduled_at || 0)));
});

router.post('/', authenticateToken, (req, res) => {
  const db = getDb();
  const cp = db.findOne('creator_profiles', p => p.user_id === req.user.id);
  if (!cp) return res.status(403).json({ error: 'Creator profile required' });
  const { title, description, content_type, platform, status, scheduled_at, caption, hashtags } = req.body;
  const item = { id: uuidv4(), creator_id: cp.id, title, description, content_type, platform, status: status || 'draft', scheduled_at, caption, hashtags, created_at: new Date().toISOString() };
  db.insert('content_items', item);
  res.status(201).json(item);
});

router.put('/:id', authenticateToken, (req, res) => {
  const db = getDb();
  const updates = {};
  ['title', 'description', 'content_type', 'platform', 'status', 'scheduled_at', 'caption', 'hashtags'].forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
  const item = db.update('content_items', i => i.id === req.params.id, updates);
  res.json(item);
});

router.delete('/:id', authenticateToken, (req, res) => {
  getDb().remove('content_items', i => i.id === req.params.id);
  res.json({ success: true });
});

module.exports = router;
