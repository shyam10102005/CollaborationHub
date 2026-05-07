const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/init');
const { generateToken, authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/signup', (req, res) => {
  try {
    const { email, password, full_name, role, profile_data } = req.body;
    const db = getDb();
    if (!email || !password || !full_name || !role) return res.status(400).json({ error: 'All fields required' });
    if (!['creator', 'brand'].includes(role)) return res.status(400).json({ error: 'Invalid role. Only creator and brand signups are allowed.' });
    if (db.findOne('users', u => u.email === email)) return res.status(409).json({ error: 'Email already registered' });

    const userId = uuidv4();
    const user = { id: userId, email, password: bcrypt.hashSync(password, 10), full_name, role, avatar_url: null, created_at: new Date().toISOString() };
    db.insert('users', user);

    if (role === 'creator') {
      db.insert('creator_profiles', { id: uuidv4(), user_id: userId, username: profile_data?.username || email.split('@')[0], bio: profile_data?.bio || '', niche: profile_data?.niche || '', location: profile_data?.location || '', follower_count: 0, engagement_rate: 0, avg_views: 0, is_verified: 0, created_at: user.created_at });
    } else if (role === 'brand') {
      db.insert('brand_profiles', { id: uuidv4(), user_id: userId, company_name: profile_data?.company_name || full_name, industry: profile_data?.industry || '', description: profile_data?.description || '', created_at: user.created_at });
    } else {
      db.insert('manager_profiles', { id: uuidv4(), user_id: userId, agency_name: profile_data?.agency_name || full_name, description: profile_data?.description || '', commission_rate: 15.0, created_at: user.created_at });
    }

    const { password: _, ...safe } = user;
    res.status(201).json({ token: generateToken(user), user: safe });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDb();
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = db.findOne('users', u => u.email === email);
    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });
    const { password: _, ...safe } = user;
    res.json({ token: generateToken(user), user: safe });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.get('/me', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const user = db.findOne('users', u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    const { password: _, ...safe } = user;
    let profile = null;
    if (user.role === 'creator') profile = db.findOne('creator_profiles', p => p.user_id === user.id);
    else if (user.role === 'brand') profile = db.findOne('brand_profiles', p => p.user_id === user.id);
    else if (user.role === 'manager') profile = db.findOne('manager_profiles', p => p.user_id === user.id);
    res.json({ user: safe, profile });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
