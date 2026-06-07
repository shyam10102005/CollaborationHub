const path = require('path');
// Load .env from parent dir (local dev) — on Render, env vars are injected directly
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config(); // also check current dir
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const { initializeDatabase } = require('./database/init');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'https://collaborationhub.vercel.app',
  'https://collaboration-hub-ten.vercel.app'
].filter(Boolean);

const io = new Server(server, { cors: { origin: allowedOrigins, credentials: true } });

// Middleware
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/creators', require('./routes/creators'));
app.use('/api/collaborations', require('./routes/collaborations'));
app.use('/api/earnings', require('./routes/earnings'));
app.use('/api/content', require('./routes/content'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/mediakit', require('./routes/mediakit'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/biolinks', require('./routes/biolinks'));

// Root route
app.get('/', (req, res) => res.json({
  name: 'CollaborationHub API',
  version: '1.0.0',
  status: 'running',
  endpoints: '/api/health, /api/auth, /api/creators, /api/collaborations, /api/earnings, /api/content, /api/chat, /api/mediakit, /api/ai, /api/biolinks'
}));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Socket.io for real-time chat
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user_online', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });

  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('send_message', (data) => {
    io.to(data.conversation_id).emit('new_message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.conversation_id).emit('user_typing', data);
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) { onlineUsers.delete(userId); break; }
    }
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });
});

// Start server with async database initialization
const PORT = process.env.PORT || 5000;

async function start() {
  await initializeDatabase();
  server.listen(PORT, () => console.log(`🚀 CollaborationHub server running on port ${PORT}`));
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

