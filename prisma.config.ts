import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({


  schema: "prisma/schema.prisma",
  datasource: {
    url: env("postgresql://postgres.ttbjypuqlcaqjbwfhtsr:RQfJuSjYjJKdbPx2@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"),
  },
});

