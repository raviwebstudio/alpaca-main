const db = require('better-sqlite3')('./prisma/alpaca.db');
const bcrypt = require('bcryptjs');

const hash = bcrypt.hashSync('Admin@1234', 12);
console.log('Generated hash:', hash);

// Delete existing admin if exists
db.prepare('DELETE FROM User WHERE email = ?').run('admin@alpaca.com');

// Insert fresh admin user
const id = 'admin_' + Date.now();
db.prepare(`
  INSERT INTO User (id, email, phone, passwordHash, role, isVerified, isActive, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`).run(id, 'admin@alpaca.com', '9999999999', hash, 'ADMIN', 1, 1);

// Verify
const user = db.prepare('SELECT id, email, role, isVerified, isActive FROM User WHERE email = ?').get('admin@alpaca.com');
console.log('Admin user created:', user);

// Test password match
const match = bcrypt.compareSync('Admin@1234', hash);
console.log('Password match test:', match);

// Seed customer user
const customerHash = bcrypt.hashSync('User@1234', 12);
db.prepare('DELETE FROM User WHERE email = ?').run('user@alpaca.com');

const custId = 'user_' + Date.now();
db.prepare(`
  INSERT INTO User (id, email, phone, passwordHash, role, isVerified, isActive, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`).run(custId, 'user@alpaca.com', `888888${Math.floor(Math.random()*10000)}`, customerHash, 'CUSTOMER', 1, 1);

const profileId = 'profile_' + Date.now();
const custUser = db.prepare('SELECT id FROM User WHERE email = ?').get('user@alpaca.com');
db.prepare(`
  INSERT OR IGNORE INTO CustomerProfile (id, userId, firstName, lastName, createdAt)
  VALUES (?, ?, ?, ?, datetime('now'))
`).run(profileId, custUser.id, 'Test', 'User');

console.log('User created:', db.prepare('SELECT id, email, role FROM User WHERE email = ?').get('user@alpaca.com'));

db.close();
