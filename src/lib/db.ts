import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Use `prepare: false` for Supabase (PgBouncer pooled connection)
// `ssl: 'require'` is required for Supabase connections
const client = postgres(process.env.DATABASE_URL!, { prepare: false, ssl: "require" });

export const db = drizzle(client, { schema });
