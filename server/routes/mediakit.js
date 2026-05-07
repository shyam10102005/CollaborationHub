const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const db = getDb();
  const cp = db.findOne('creator_profiles', p => p.user_id === req.user.id);
  if (!cp) return res.status(404).json({ error: 'Creator profile required' });
  let kit = db.findOne('media_kits', k => k.creator_id === cp.id);
  if (!kit) { kit = { id: uuidv4(), creator_id: cp.id, title: 'My Media Kit', tagline: '', about: '', highlights: '', past_brands: '', rates: '', is_public: 1, view_count: 0, created_at: new Date().toISOString() }; db.insert('media_kits', kit); }
  const u = db.findOne('users', u => u.id === req.user.id);
  res.json({ ...kit, creator: cp, user: { full_name: u?.full_name, email: u?.email } });
});

router.put('/', authenticateToken, (req, res) => {
  const db = getDb();
  const cp = db.findOne('creator_profiles', p => p.user_id === req.user.id);
  if (!cp) return res.status(404).json({ error: 'Creator profile required' });
  const updates = {};
  ['title', 'tagline', 'about', 'highlights', 'past_brands', 'rates', 'is_public'].forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
  updates.updated_at = new Date().toISOString();
  const kit = db.update('media_kits', k => k.creator_id === cp.id, updates);
  res.json(kit);
});

module.exports = router;
