import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Use DIRECT_URL (non-pooled) for migrations with Supabase
    url: process.env.DIRECT_URL!,
    ssl: true,
  },
});
