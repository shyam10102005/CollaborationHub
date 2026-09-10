/**
 * Re-seed script: Drops all collections and re-seeds the database.
 * Run with: node scripts/reseed.js
 */
const path = require('path');

// Resolve modules from server/node_modules
module.paths.unshift(path.join(__dirname, '..', 'server', 'node_modules'));

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();

const { MongoClient } = require('mongodb');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'collabhub';

async function reseed() {
  console.log(`🔄 Connecting to MongoDB (${DB_NAME})...`);
  const client = new MongoClient(MONGODB_URI, {
    family: 4,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  await client.connect();
  const db = client.db(DB_NAME);
  await db.command({ ping: 1 });
  console.log('✅ Connected!\n');

  // Drop all known collections
  const collections = [
    'users', 'creator_profiles', 'brand_profiles', 'manager_profiles',
    'collaborations', 'earnings', 'content_items', 'messages',
    'conversations', 'bio_links', 'link_clicks', 'media_kits', 'notifications'
  ];

  for (const name of collections) {
    try {
      await db.collection(name).drop();
      console.log(`  🗑️  Dropped: ${name}`);
    } catch (err) {
      if (err.codeName === 'NamespaceNotFound') {
        console.log(`  ⏭️  Skipped (not found): ${name}`);
      } else {
        console.error(`  ❌ Error dropping ${name}:`, err.message);
      }
    }
  }

  console.log('\n✅ All collections dropped. The server will re-seed on next startup.');
  console.log('   Restart your server now (npm run dev) to populate fresh data.\n');

  await client.close();
}

reseed().catch(err => {
  console.error('❌ Failed:', err.message);
  process.exit(1);
});
