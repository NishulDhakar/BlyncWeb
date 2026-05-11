import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";


// ── Better Auth Tables ──────────────────────────────────────────────────────
// Column names match the existing DB (Prisma without @map = camelCase columns)

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  // ── Subscription fields ───────────────────────────────────────────────────
  isPro: boolean("isPro").default(false).notNull(),
  razorpaySubscriptionId: text("razorpaySubscriptionId"),
  razorpayCustomerId: text("razorpayCustomerId"),
  // 'active' | 'halted' | 'cancelled' | null
  subscriptionStatus: text("subscriptionStatus"),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// ── App Tables ───────────────────────────────────────────────────────────────

export const gameScores = pgTable(
  "game_score",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    gameId: text("gameId").notNull(),
    score: integer("score").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("game_score_user_game_idx").on(table.userId, table.gameId)]
);

// ── Game Attempts (free-tier daily limit tracking) ────────────────────────────
export const gameAttempts = pgTable(
  "game_attempt",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // e.g. 'switch-challenge', 'digit-challenge'
    gameSlug: text("gameSlug").notNull(),
    // ISO date string YYYY-MM-DD (UTC)
    date: text("date").notNull(),
    count: integer("count").default(0).notNull(),
  },
  (table) => [
    unique("game_attempt_unique").on(table.userId, table.gameSlug, table.date),
    index("game_attempt_user_slug_date_idx").on(
      table.userId,
      table.gameSlug,
      table.date
    ),
  ]
);

export const polls = pgTable("poll", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const pollOptions = pgTable("poll_option", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  votes: integer("votes").default(0).notNull(),
  isInput: boolean("isInput").default(false).notNull(),
  pollId: text("pollId")
    .notNull()
    .references(() => polls.id, { onDelete: "cascade" }),
});

// ── User Streaks ─────────────────────────────────────────────────────────────
// One row per user. currentStreak resets to 1 if lastActivityDate is not yesterday.
export const userStreaks = pgTable("user_streak", {
  userId: text("userId")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  currentStreak: integer("currentStreak").default(1).notNull(),
  longestStreak: integer("longestStreak").default(1).notNull(),
  // YYYY-MM-DD in UTC — timezone-agnostic day comparison
  lastActivityDate: text("lastActivityDate").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ── Email Broadcasts ──────────────────────────────────────────────────────────
export const broadcasts = pgTable("broadcast", {
  id: text("id").primaryKey(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  imageName: text("imageName"),
  totalCount: integer("totalCount").default(0).notNull(),
  sentCount: integer("sentCount").default(0).notNull(),
  failedCount: integer("failedCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const broadcastRecipients = pgTable(
  "broadcast_recipient",
  {
    id: text("id").primaryKey(),
    broadcastId: text("broadcastId")
      .notNull()
      .references(() => broadcasts.id, { onDelete: "cascade" }),
    userId: text("userId").notNull(),
    email: text("email").notNull(),
    status: text("status").notNull().default("pending"), // 'pending' | 'sent' | 'failed'
    error: text("error"),
    sentAt: timestamp("sentAt"),
  },
  (t) => [
    index("broadcast_recipient_broadcast_idx").on(t.broadcastId),
    index("broadcast_recipient_status_idx").on(t.broadcastId, t.status),
  ]
);

// ── Premium Subscriptions ─────────────────────────────────────────────────────
// One row per subscription purchase. Users may have multiple over time.
// planType: 'monthly' (₹49/mo) | 'biannual' (₹199/6mo)
// status mirrors Razorpay: 'created' | 'active' | 'halted' | 'cancelled' | 'completed'
export const subscriptions = pgTable(
  "subscription",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planType: text("planType").notNull(), // 'monthly' | 'biannual'
    razorpaySubscriptionId: text("razorpaySubscriptionId").notNull().unique(),
    status: text("status").notNull().default("created"),
    // Set when subscription.activated fires; updated on each charge event
    expiresAt: timestamp("expiresAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (t) => [index("subscription_user_idx").on(t.userId)]
);
