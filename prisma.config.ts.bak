import "dotenv/config";
import { defineConfig } from "prisma/config";

const defaultDbUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres.ttbjypuqlcaqjbwfhtsr:RQfJuSjYjJKdbPx2@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: defaultDbUrl,
  },
});
