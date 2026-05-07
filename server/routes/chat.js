const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/conversations', authenticateToken, (req, res) => {
  const db = getDb();
  const convs = db.find('conversations', c => c.participant_1 === req.user.id || c.participant_2 === req.user.id).map(c => {
    const u1 = db.findOne('users', u => u.id === c.participant_1);
    const u2 = db.findOne('users', u => u.id === c.participant_2);
    return { ...c, participant_1_name: u1?.full_name, participant_1_role: u1?.role, participant_2_name: u2?.full_name, participant_2_role: u2?.role };
  }).sort((a, b) => new Date(b.last_message_at || 0) - new Date(a.last_message_at || 0));
  res.json(convs);
});

router.post('/conversations', authenticateToken, (req, res) => {
  const db = getDb();
  const { participant_id } = req.body;
  let conv = db.findOne('conversations', c => (c.participant_1 === req.user.id && c.participant_2 === participant_id) || (c.participant_1 === participant_id && c.participant_2 === req.user.id));
  if (!conv) { conv = { id: uuidv4(), participant_1: req.user.id, participant_2: participant_id, last_message: null, last_message_at: null, created_at: new Date().toISOString() }; db.insert('conversations', conv); }
  res.json(conv);
});

router.get('/conversations/:id/messages', authenticateToken, (req, res) => {
  const db = getDb();
  const msgs = db.find('messages', m => m.conversation_id === req.params.id).map(m => {
    const u = db.findOne('users', u => u.id === m.sender_id);
    return { ...m, sender_name: u?.full_name };
  }).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  res.json(msgs);
});

router.post('/conversations/:id/messages', authenticateToken, (req, res) => {
  const db = getDb();
  const msg = { id: uuidv4(), conversation_id: req.params.id, sender_id: req.user.id, content: req.body.content, message_type: req.body.message_type || 'text', is_read: 0, created_at: new Date().toISOString() };
  db.insert('messages', msg);
  db.update('conversations', c => c.id === req.params.id, { last_message: req.body.content, last_message_at: msg.created_at });
  const u = db.findOne('users', u => u.id === req.user.id);
  res.status(201).json({ ...msg, sender_name: u?.full_name });
});

module.exports = router;
