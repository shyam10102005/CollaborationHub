const express = require('express');
const { getDb } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const db = getDb();
  let results = db.find('creator_profiles', () => true).map(cp => {
    const u = db.findOne('users', u => u.id === cp.user_id);
    return { ...cp, full_name: u?.full_name, email: u?.email, avatar_url: u?.avatar_url };
  });
  const { niche, location, search, sort } = req.query;
  if (niche) results = results.filter(r => r.niche?.toLowerCase().includes(niche.toLowerCase()));
  if (location) results = results.filter(r => r.location?.toLowerCase().includes(location.toLowerCase()));
  if (search) { const s = search.toLowerCase(); results = results.filter(r => r.full_name?.toLowerCase().includes(s) || r.username?.toLowerCase().includes(s) || r.bio?.toLowerCase().includes(s) || r.niche?.toLowerCase().includes(s)); }
  if (sort === 'followers') results.sort((a, b) => b.follower_count - a.follower_count);
  else if (sort === 'engagement') results.sort((a, b) => b.engagement_rate - a.engagement_rate);
  res.json(results);
});

router.get('/:id', authenticateToken, (req, res) => {
  const db = getDb();
  const cp = db.findOne('creator_profiles', p => p.id === req.params.id || p.user_id === req.params.id || p.username === req.params.id);
  if (!cp) return res.status(404).json({ error: 'Not found' });
  const u = db.findOne('users', u => u.id === cp.user_id);
  res.json({ ...cp, full_name: u?.full_name, email: u?.email, avatar_url: u?.avatar_url });
});

router.get('/:id/stats', authenticateToken, (req, res) => {
  const db = getDb();
  const cp = db.findOne('creator_profiles', p => p.user_id === req.params.id || p.id === req.params.id);
  if (!cp) return res.status(404).json({ error: 'Not found' });
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const followerGrowth = months.map((m, i) => ({ month: m, followers: Math.floor(cp.follower_count * (0.85 + i * 0.04)), engagement: +(cp.engagement_rate * (0.9 + Math.random() * 0.2)).toFixed(1) }));
  res.json({ followerGrowth });
});

module.exports = router;
