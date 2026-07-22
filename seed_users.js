require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const Database = require('better-sqlite3');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const bcrypt = require('bcryptjs');

const sqlite = new Database('prisma/alpaca.db');
const adapter = new PrismaBetterSqlite3(sqlite);
const db = new PrismaClient({ adapter });

async function main() {
  const hash = bcrypt.hashSync('Admin@1234', 12);
  const userHash = bcrypt.hashSync('User@1234', 12);
  
  await db.user.deleteMany({ where: { email: 'admin@alpaca.com' }});
  const admin = await db.user.create({
    data: {
      email: 'admin@alpaca.com',
      phone: '9999999999',
      passwordHash: hash,
      role: 'ADMIN',
      isVerified: true,
      isActive: true
    }
  });
  console.log('Admin user created:', admin);

  await db.user.deleteMany({ where: { email: 'user@alpaca.com' }});
  const user = await db.user.create({
    data: {
      email: 'user@alpaca.com',
      phone: '8888888888',
      passwordHash: userHash,
      role: 'CUSTOMER',
      isVerified: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'Test',
          lastName: 'User'
        }
      }
    }
  });
  console.log('User created:', user);

  console.log('Seeded successfully!');
}

main().catch(console.error).finally(() => db.$disconnect());
