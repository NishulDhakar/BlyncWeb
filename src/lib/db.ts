import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// ── Singleton guard ────────────────────────────────────────────────────────────
// Next.js re-evaluates modules on every hot-reload and serverless invocation.
// Without this, each invocation creates a new postgres connection pool, which
// exhausts Supabase's PgBouncer Session-mode pool_size cap (MaxClientsInSessionMode).
declare global {
    // eslint-disable-next-line no-var
    var _pgClient: ReturnType<typeof postgres> | undefined;
}

const client =
    global._pgClient ??
    postgres(process.env.DATABASE_URL!, {
        prepare: false,    // required for Supabase PgBouncer pooled connection
        ssl: "require",
        max: 10,           // allow concurrent queries (Supabase pooler port 6543 in Transaction mode supports this)
        idle_timeout: 20,  // release idle connections quickly
        connect_timeout: 10,
    });

// Cache client on global scope to preserve connection pool across hot reloads and warm instances
global._pgClient = client;

export const db = drizzle(client, { schema });

