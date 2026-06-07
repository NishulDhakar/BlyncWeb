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
        max: 1,            // one connection per pool — safe for Session-mode PgBouncer
        idle_timeout: 20,  // release idle connections quickly
        connect_timeout: 3,
    });

if (process.env.NODE_ENV !== "production") {
    // Only cache in dev — production serverless functions are single-use anyway
    global._pgClient = client;
}

export const db = drizzle(client, { schema });

