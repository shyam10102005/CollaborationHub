const { spawn } = require('child_process');
const path = require('path');

const isWin = process.platform === 'win32';
const shell = isWin ? true : false;

console.log('🚀 Starting CollaborationOS...\n');

// Start server
const server = spawn('node', ['index.js'], {
  cwd: path.join(__dirname, '..', 'server'),
  stdio: 'pipe',
  shell,
});

server.stdout.on('data', (d) => process.stdout.write(`[SERVER] ${d}`));
server.stderr.on('data', (d) => process.stderr.write(`[SERVER] ${d}`));
server.on('error', (e) => console.error('[SERVER] Failed to start:', e.message));

// Start client after a short delay to let server initialize
setTimeout(() => {
  const client = spawn('npx', ['vite', '--host'], {
    cwd: path.join(__dirname, '..', 'client'),
    stdio: 'pipe',
    shell,
  });

  client.stdout.on('data', (d) => process.stdout.write(`[CLIENT] ${d}`));
  client.stderr.on('data', (d) => process.stderr.write(`[CLIENT] ${d}`));
  client.on('error', (e) => console.error('[CLIENT] Failed to start:', e.message));

  process.on('SIGINT', () => {
    server.kill();
    client.kill();
    process.exit();
  });

  process.on('SIGTERM', () => {
    server.kill();
    client.kill();
    process.exit();
  });
}, 1000);
