import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.ttbjypuqlcaqjbwfhtsr:RQfJuSjYjJKdbPx2@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
