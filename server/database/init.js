const { MongoClient } = require('mongodb');
const dns = require('dns');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Use Google DNS for SRV record resolution (fixes corporate/ISP DNS that block SRV queries)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'collabhub';

let client = null;
let database = null;

// Collection name mapping
const COLLECTIONS = [
  'users', 'creator_profiles', 'brand_profiles', 'manager_profiles',
  'collaborations', 'earnings', 'content_items', 'messages',
  'conversations', 'bio_links', 'link_clicks', 'media_kits', 'notifications'
];

// MongoDB-backed query helpers that match the old in-memory API
// All route files use: db.find(), db.findOne(), db.insert(), db.update(), db.remove(), db.count(), db.sum()
// We keep these synchronous-looking by caching data in memory and syncing to MongoDB

let cache = {};

function col(table) {
  return database.collection(table);
}

const Q = {
  find: (table, fn) => cache[table]?.filter(fn) || [],
  findOne: (table, fn) => cache[table]?.find(fn) || null,
  insert: (table, record) => {
    if (!cache[table]) cache[table] = [];
    cache[table].push(record);
    // Async write to MongoDB (fire-and-forget for speed)
    col(table).insertOne({ ...record }).catch(err => console.error(`MongoDB insert error (${table}):`, err.message));
    return record;
  },
  update: (table, fn, updates) => {
    if (!cache[table]) return null;
    const idx = cache[table].findIndex(fn);
    if (idx !== -1) {
      Object.assign(cache[table][idx], updates);
      const record = cache[table][idx];
      // Async write to MongoDB
      col(table).updateOne({ id: record.id }, { $set: updates }).catch(err => console.error(`MongoDB update error (${table}):`, err.message));
      return cache[table][idx];
    }
    return null;
  },
  remove: (table, fn) => {
    if (!cache[table]) return;
    const toRemove = cache[table].filter(fn);
    cache[table] = cache[table].filter(r => !fn(r));
    // Async delete from MongoDB
    for (const record of toRemove) {
      col(table).deleteOne({ id: record.id }).catch(err => console.error(`MongoDB delete error (${table}):`, err.message));
    }
  },
  count: (table, fn) => fn ? (cache[table]?.filter(fn).length || 0) : (cache[table]?.length || 0),
  sum: (table, field, fn) => (cache[table]?.filter(fn || (() => true)) || []).reduce((s, r) => s + (r[field] || 0), 0),
};

function getDb() { return { ...Q, raw: cache }; }

async function loadFromMongoDB() {
  for (const name of COLLECTIONS) {
    try {
      const docs = await col(name).find({}).toArray();
      // Remove MongoDB's _id field to keep compatibility
      cache[name] = docs.map(doc => { const { _id, ...rest } = doc; return rest; });
    } catch (err) {
      cache[name] = [];
    }
  }
}

async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    client = new MongoClient(MONGODB_URI, {
      family: 4,                         // Force IPv4 (fixes Windows DNS SRV issues)
      serverSelectionTimeoutMS: 10000,   // 10s timeout
      connectTimeoutMS: 10000,
    });
    await client.connect();
    database = client.db(DB_NAME);

    // Verify connection
    await database.command({ ping: 1 });
    console.log('✅ Connected to MongoDB Atlas successfully!');

    // Load all data into cache
    await loadFromMongoDB();

    // Check if we need to seed
    const userCount = await col('users').countDocuments();
    if (userCount === 0) {
      console.log('📦 Seeding database with initial data...');
      await seedDatabase();
      console.log('✅ Database seeded successfully!');
    } else {
      console.log(`✅ Database loaded: ${userCount} users found`);
    }

    // Create indexes for common queries
    await createIndexes();

  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('⚠️  Falling back to empty in-memory database');
    for (const name of COLLECTIONS) {
      cache[name] = [];
    }
  }
}

async function createIndexes() {
  try {
    await col('users').createIndex({ email: 1 }, { unique: true });
    await col('users').createIndex({ id: 1 }, { unique: true });
    await col('creator_profiles').createIndex({ user_id: 1 });
    await col('creator_profiles').createIndex({ username: 1 });
    await col('brand_profiles').createIndex({ user_id: 1 });
    await col('manager_profiles').createIndex({ user_id: 1 });
    await col('collaborations').createIndex({ initiator_id: 1 });
    await col('collaborations').createIndex({ receiver_id: 1 });
    await col('earnings').createIndex({ user_id: 1 });
    await col('content_items').createIndex({ creator_id: 1 });
    await col('conversations').createIndex({ participant_1: 1 });
    await col('conversations').createIndex({ participant_2: 1 });
    await col('messages').createIndex({ conversation_id: 1 });
    await col('bio_links').createIndex({ creator_id: 1 });
  } catch (err) {
    // Indexes may already exist, that's fine
  }
}

async function seedDatabase() {
  const pw = bcrypt.hashSync('password123', 10);
  const now = new Date().toISOString();

  const creators = [
    { name: 'Alex Rivera', email: 'alex@creator.com', username: 'alexrivera', niche: 'Tech & Gaming', location: 'Los Angeles, CA', bio: 'Tech reviewer & gaming content creator. 500K+ community of tech enthusiasts.', followers: 520000, engagement: 4.8, views: 85000 },
    { name: 'Maya Chen', email: 'maya@creator.com', username: 'mayachen', niche: 'Fashion & Lifestyle', location: 'New York, NY', bio: 'Sustainable fashion advocate. Creating conscious content for modern living.', followers: 380000, engagement: 5.2, views: 62000 },
    { name: 'Jordan Blake', email: 'jordan@creator.com', username: 'jordanblake', niche: 'Fitness & Wellness', location: 'Miami, FL', bio: 'Certified trainer & wellness coach. Helping people transform their lives.', followers: 290000, engagement: 6.1, views: 45000 },
    { name: 'Priya Sharma', email: 'priya@creator.com', username: 'priyasharma', niche: 'Food & Travel', location: 'London, UK', bio: 'Global food explorer & travel vlogger. Discovering flavors around the world.', followers: 450000, engagement: 4.5, views: 72000 },
    { name: 'Marcus Johnson', email: 'marcus@creator.com', username: 'marcusj', niche: 'Music & Entertainment', location: 'Atlanta, GA', bio: 'Independent artist & music producer. Creating beats that move the culture.', followers: 180000, engagement: 7.3, views: 38000 },
    { name: 'Sofia Reyes', email: 'sofia@creator.com', username: 'sofiareyes', niche: 'Beauty & Skincare', location: 'Barcelona, Spain', bio: 'Licensed esthetician sharing science-backed skincare routines.', followers: 620000, engagement: 5.8, views: 95000 },
    { name: 'Kai Tanaka', email: 'kai@creator.com', username: 'kaitanaka', niche: 'Photography & Art', location: 'Tokyo, Japan', bio: 'Visual storyteller capturing urban landscapes and street culture.', followers: 340000, engagement: 4.9, views: 55000 },
    { name: 'Lena Osei', email: 'lena@creator.com', username: 'lenaosei', niche: 'Education & Motivation', location: 'Toronto, Canada', bio: 'EdTech enthusiast & motivational speaker. Making learning fun.', followers: 270000, engagement: 6.5, views: 48000 },
  ];

  const creatorUsers = [];
  for (const c of creators) {
    const userId = uuidv4(), creatorId = uuidv4();
    const user = { id: userId, email: c.email, password: pw, full_name: c.name, role: 'creator', avatar_url: null, created_at: now };
    const profile = { id: creatorId, user_id: userId, username: c.username, bio: c.bio, niche: c.niche, location: c.location, website: '', instagram_handle: '', youtube_handle: '', tiktok_handle: '', twitter_handle: '', follower_count: c.followers, engagement_rate: c.engagement, avg_views: c.views, is_verified: 1, created_at: now };
    await col('users').insertOne(user);
    await col('creator_profiles').insertOne(profile);
    cache.users.push(user);
    cache.creator_profiles.push(profile);
    creatorUsers.push(user);
  }

  // Brands
  const brands = [
    { name: 'Sarah Mitchell', email: 'sarah@brandcorp.com', company: 'NovaTech Industries', industry: 'Technology', desc: 'Leading consumer electronics brand.' },
    { name: 'David Park', email: 'david@fashionco.com', company: 'Luxe Apparel Co', industry: 'Fashion', desc: 'Premium sustainable fashion brand.' },
    { name: 'Emma Wilson', email: 'emma@healthbrand.com', company: 'VitalLife Wellness', industry: 'Health & Wellness', desc: 'Holistic wellness products.' },
  ];
  const brandUsers = [];
  for (const b of brands) {
    const userId = uuidv4(), brandId = uuidv4();
    const user = { id: userId, email: b.email, password: pw, full_name: b.name, role: 'brand', avatar_url: null, created_at: now };
    const profile = { id: brandId, user_id: userId, company_name: b.company, industry: b.industry, description: b.desc, created_at: now };
    await col('users').insertOne(user);
    await col('brand_profiles').insertOne(profile);
    cache.users.push(user);
    cache.brand_profiles.push(profile);
    brandUsers.push(user);
  }

  // Manager
  const mUserId = uuidv4();
  const managerUser = { id: mUserId, email: 'manager@agency.com', password: pw, full_name: 'Chris Anderson', role: 'manager', avatar_url: null, created_at: now };
  const managerProfile = { id: uuidv4(), user_id: mUserId, agency_name: 'CollaborationHub Admin', description: 'Platform administration team.', commission_rate: 15.0, created_at: now };
  await col('users').insertOne(managerUser);
  await col('manager_profiles').insertOne(managerProfile);
  cache.users.push(managerUser);
  cache.manager_profiles.push(managerProfile);

  // Collaborations
  const cr0 = creatorUsers[0], cr1 = creatorUsers[1], cr2 = creatorUsers[2];
  const br0 = brandUsers[0], br1 = brandUsers[1], br2 = brandUsers[2];

  const collabs = [
    { id: uuidv4(), title: 'Smart Home Product Review', description: 'Create an in-depth review video.', type: 'brand_deal', status: 'accepted', initiator_id: br0.id, receiver_id: cr0.id, budget: 5000, deliverables: '1 YouTube video, 2 Instagram stories', deadline: '2026-06-15', platform: 'youtube', created_at: now, updated_at: now },
    { id: uuidv4(), title: 'Summer Collection Campaign', description: 'Showcase our summer fashion line.', type: 'brand_deal', status: 'pending', initiator_id: br1.id, receiver_id: cr1.id, budget: 8000, deliverables: '3 Instagram posts, 1 Reel', deadline: '2026-07-01', platform: 'instagram', created_at: now, updated_at: now },
    { id: uuidv4(), title: 'Fitness Collaboration', description: 'Joint workout series.', type: 'peer_collab', status: 'in_creation', initiator_id: cr2.id, receiver_id: cr0.id, budget: 0, deliverables: '3 YouTube videos', deadline: '2026-06-30', platform: 'youtube', created_at: now, updated_at: now },
    { id: uuidv4(), title: 'Wellness Product Integration', description: 'Integrate supplements into fitness content.', type: 'brand_deal', status: 'completed', initiator_id: br2.id, receiver_id: cr2.id, budget: 3500, deliverables: '2 Reels, 1 Story', deadline: '2026-05-01', platform: 'instagram', created_at: now, updated_at: now },
  ];
  for (const c of collabs) {
    await col('collaborations').insertOne(c);
    cache.collaborations.push(c);
  }

  // Earnings
  const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05'];
  const types = ['sponsorship', 'affiliate', 'platform_bonus'];
  for (const creator of [cr0, cr1, cr2]) {
    for (const m of months) {
      for (const t of types) {
        const earning = { id: uuidv4(), user_id: creator.id, amount: Math.floor(Math.random() * 5000) + 500, type: t, status: 'completed', description: `${t} earnings for ${m}`, created_at: `${m}-15T00:00:00Z` };
        await col('earnings').insertOne(earning);
        cache.earnings.push(earning);
      }
    }
  }

  // Content items
  const cp0 = cache.creator_profiles.find(p => p.user_id === cr0.id);
  const contents = [
    { title: 'Tech Unboxing: Latest Smartphone', type: 'video', platform: 'youtube', status: 'scheduled', date: '2026-05-10T14:00:00', caption: 'The wait is over! Unboxing the most anticipated phone of 2026 🔥' },
    { title: 'Morning Routine Reel', type: 'reel', platform: 'instagram', status: 'draft', date: '2026-05-12T09:00:00', caption: 'My 5AM morning routine ☀️' },
    { title: 'Quick Fitness Tips', type: 'tweet', platform: 'twitter', status: 'published', date: '2026-05-08T12:00:00', caption: '5 exercises, no equipment 💪' },
    { title: 'Behind the Scenes Vlog', type: 'video', platform: 'youtube', status: 'scheduled', date: '2026-05-15T16:00:00', caption: 'A day in my life as a creator' },
    { title: 'Product Showcase Carousel', type: 'carousel', platform: 'instagram', status: 'draft', date: '2026-05-18T10:00:00', caption: 'Top 10 must-have gadgets 📱' },
    { title: 'Cooking Tutorial Short', type: 'short', platform: 'youtube', status: 'scheduled', date: '2026-05-20T11:00:00', caption: '60-second pasta recipe 🍝' },
  ];
  for (const c of contents) {
    const item = { id: uuidv4(), creator_id: cp0.id, title: c.title, description: '', content_type: c.type, platform: c.platform, status: c.status, scheduled_at: c.date, caption: c.caption, hashtags: '', created_at: now };
    await col('content_items').insertOne(item);
    cache.content_items.push(item);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (client) {
    await client.close();
  }
  process.exit(0);
});

module.exports = { getDb, initializeDatabase };
