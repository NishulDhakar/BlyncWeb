-- ============================================================================
-- Blync / cognitivegames.me — SUPABASE QUERY FILE
-- Project: cognitiveGames (kervmgpbthhebsmeltxn)
-- ============================================================================
-- Checked against the live database on 2026-09-09. Already present and
-- untouched by this file: "user", "session", "account", "verification",
-- "game_score", "game_attempt", "subscription" (+ their existing indexes).
-- Also present but NOT part of this app (leave alone): "users", "_prisma_migrations".
-- Poll / poll_option deliberately excluded — dropped on purpose, not needed.
--
-- Everything below SECTION 1 is what's actually missing right now.
-- ============================================================================


-- ============================================================================
-- SECTION 1 — RUN THIS NOW (one-time, safe to re-run)
-- ============================================================================
-- Three tables your code already reads/writes but that don't exist yet, plus
-- two indexes the leaderboard/profile queries need. Paste this whole block
-- into the SQL editor and run it once.
--
-- NOTE: poll / poll_option deliberately excluded — dropped from Supabase and
-- not needed. If Landing/Poll.tsx still imports getPoll()/submitVote(), remove
-- that usage too so the app doesn't call into a table that no longer exists
-- (getPoll() fails soft and returns null, so nothing crashes, but the poll
-- widget silently won't render).

-- ── User streaks (src/features/streak/actions.ts — StreakSync) ─────────────
CREATE TABLE IF NOT EXISTS "user_streak" (
  "userId"           text PRIMARY KEY REFERENCES "user"("id") ON DELETE CASCADE,
  "currentStreak"    integer NOT NULL DEFAULT 1,
  "longestStreak"    integer NOT NULL DEFAULT 1,
  "lastActivityDate" text NOT NULL,   -- 'YYYY-MM-DD' in UTC
  "updatedAt"        timestamp NOT NULL DEFAULT now()
);

-- ── Email broadcasts (src/features/admin/actions.ts — /admin/broadcast) ────
CREATE TABLE IF NOT EXISTS "broadcast" (
  "id"          text PRIMARY KEY,
  "subject"     text NOT NULL,
  "message"     text NOT NULL,
  "imageName"   text,
  "totalCount"  integer NOT NULL DEFAULT 0,
  "sentCount"   integer NOT NULL DEFAULT 0,
  "failedCount" integer NOT NULL DEFAULT 0,
  "createdAt"   timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "broadcast_recipient" (
  "id"          text PRIMARY KEY,
  "broadcastId" text NOT NULL REFERENCES "broadcast"("id") ON DELETE CASCADE,
  "userId"      text NOT NULL,
  "email"       text NOT NULL,
  "status"      text NOT NULL DEFAULT 'pending',  -- 'pending' | 'sent' | 'failed'
  "error"       text,
  "sentAt"      timestamp
);

CREATE INDEX IF NOT EXISTS "broadcast_recipient_broadcast_idx" ON "broadcast_recipient" ("broadcastId");
CREATE INDEX IF NOT EXISTS "broadcast_recipient_status_idx"    ON "broadcast_recipient" ("broadcastId", "status");

-- ── Missing performance indexes on the existing game_score table ───────────
-- Your leaderboard query (best score per game, sorted desc) and the profile's
-- score-history query (per user, sorted by date) are currently doing
-- sequential scans — only the original (userId, gameId) index exists.
CREATE INDEX IF NOT EXISTS "game_score_game_score_idx"   ON "game_score" ("gameId", "score" DESC);
CREATE INDEX IF NOT EXISTS "game_score_user_created_idx" ON "game_score" ("userId", "createdAt" DESC);


-- ============================================================================
-- SECTION 2 — new game slugs (2026 expansion): no DDL needed
-- ============================================================================
-- "game_score"."gameId" is free-form text, so every game added in
-- src/games/registry.ts (bubble-math, path-finder, key-and-door, grid-puzzle,
-- quick-math, gap-challenge, shape-switch-challenge, motion-challenge-advanced,
-- accenture-technical-quiz, debugging-assessment-1/2, read-aloud,
-- listen-and-repeat, grammar-round, comprehension-round, open-response) will
-- start recording scores with zero schema change. Current live gameIds and
-- play counts (checked 2026-09-09):
--   digit-challenge (3671) · switch-challenge (3365) · deductive-challenge (2900)
--   motion-challenge (743) · grid-challenge (732) · inductive-challenge (538)


-- ============================================================================
-- SECTION 3 — RUNTIME QUERIES (reference — the app runs these, don't run by hand)
-- ============================================================================
-- Reproduced here only for debugging with EXPLAIN ANALYZE in the SQL editor.

-- Save a score (src/features/scoring/actions.ts → saveScore)
-- INSERT INTO "game_score" ("id","userId","gameId","score","createdAt") VALUES (:id,:userId,:gameId,:score,now());

-- Leaderboard, one game (src/features/leaderboard/actions.ts → getLeaderboard(gameId))
-- SELECT "userId", MAX("score") AS "maxScore" FROM "game_score" WHERE "gameId"=:gameId GROUP BY "userId" ORDER BY 2 DESC LIMIT 30;

-- Streak upsert for today, UTC (src/features/streak/actions.ts → upsertStreak)
-- INSERT INTO "user_streak" ("userId","currentStreak","longestStreak","lastActivityDate","updatedAt")
-- VALUES (:userId,1,1,:today,now())
-- ON CONFLICT ("userId") DO UPDATE SET
--   "currentStreak" = CASE WHEN "user_streak"."lastActivityDate"=:today THEN "user_streak"."currentStreak"
--                          WHEN "user_streak"."lastActivityDate"=:yesterday THEN "user_streak"."currentStreak"+1
--                          ELSE 1 END,
--   "lastActivityDate" = :today, "updatedAt" = now();

-- Daily attempt claim (src/lib/daily-limits.ts, if/when free-tier limits are enforced)
-- INSERT INTO "game_attempt" ("id","userId","gameSlug","date","count") VALUES (:id,:userId,:gameSlug,:today,1)
-- ON CONFLICT ("userId","gameSlug","date") DO UPDATE SET "count" = "game_attempt"."count"+1 RETURNING "count";


-- ============================================================================
-- SECTION 4 — ON-DEMAND OPS (run by hand when you need the answer)
-- ============================================================================

-- Which games are actually being played?
-- SELECT "gameId", COUNT(*) plays, COUNT(DISTINCT "userId") players, ROUND(AVG("score")) avg_score
-- FROM "game_score" GROUP BY 1 ORDER BY plays DESC;

-- Active paying subscribers
-- SELECT u."id", u."email", s."planType", s."status", s."expiresAt"
-- FROM "user" u JOIN "subscription" s ON s."userId"=u."id" WHERE s."status"='active';

-- Delete a user and everything they own (GDPR erasure) — all app tables
-- cascade from "user", so one delete is enough.
-- DELETE FROM "user" WHERE "email" = :email;
