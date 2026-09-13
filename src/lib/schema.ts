import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  index,
  unique,
  jsonb,
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
  // ── Admin & Status fields ─────────────────────────────────────────────────
  role: text("role").default("user").notNull(), // 'super_admin' | 'admin' | 'support' | 'user'
  status: text("status").default("active").notNull(), // 'active' | 'suspended' | 'cancelled'
  notes: text("notes"),
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

// ── Payments Table ────────────────────────────────────────────────────────────
export const payments = pgTable(
  "payment",
  {
    id: text("id").primaryKey(),
    userId: text("userId").references(() => users.id, { onDelete: "set null" }),
    subscriptionId: text("subscriptionId").references(() => subscriptions.id, { onDelete: "set null" }),
    razorpayPaymentId: text("razorpayPaymentId").unique(),
    amount: integer("amount").notNull(), // in paise (e.g. 4900 = ₹49)
    currency: text("currency").default("INR").notNull(),
    planType: text("planType"), // 'monthly' | 'biannual'
    provider: text("provider").default("razorpay").notNull(),
    status: text("status").default("succeeded").notNull(), // 'succeeded' | 'pending' | 'failed' | 'refunded'
    method: text("method"), // upi, card, netbanking, etc.
    email: text("email"),
    contact: text("contact"),
    refundedAmount: integer("refundedAmount").default(0),
    refundId: text("refundId"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (t) => [
    index("payment_user_idx").on(t.userId),
    index("payment_status_idx").on(t.status),
    index("payment_created_idx").on(t.createdAt),
  ]
);

// ── Companies Table ───────────────────────────────────────────────────────────
export const companies = pgTable("company", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  logo: text("logo"),
  website: text("website"),
  description: text("description"),
  assessmentType: text("assessmentType"),
  status: text("status").default("active").notNull(), // 'active' | 'archived'
  region: text("region").default("india"),
  monogram: text("monogram"),
  accent: text("accent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ── Games Table ───────────────────────────────────────────────────────────────
export const games = pgTable("game", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'cognitive' | 'memory' | 'brain' | 'quiz' | 'communication'
  difficulty: text("difficulty").default("medium").notNull(), // 'easy' | 'medium' | 'hard'
  duration: text("duration"),
  timeLimit: integer("timeLimit"), // in seconds
  rounds: integer("rounds"),
  skills: jsonb("skills"),
  companySlug: text("companySlug"),
  kind: text("kind").default("react").notNull(),
  status: text("status").default("active").notNull(), // 'active' | 'draft' | 'archived' | 'inactive'
  hasRulesPage: boolean("hasRulesPage").default(false),
  pro: boolean("pro").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ── Mock Tests & Assessment Table ─────────────────────────────────────────────
export const mockTests = pgTable("mock_test", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  companySlug: text("companySlug").notNull(),
  gameSlugs: jsonb("gameSlugs").notNull(), // array of strings
  orderIndex: integer("orderIndex").default(0),
  timeLimit: integer("timeLimit").default(45).notNull(), // in minutes
  difficulty: text("difficulty").default("medium").notNull(),
  passingScore: integer("passingScore").default(70).notNull(),
  status: text("status").default("published").notNull(), // 'published' | 'draft' | 'archived'
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const mockTestAttempts = pgTable(
  "mock_test_attempt",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mockTestId: text("mockTestId")
      .notNull()
      .references(() => mockTests.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    maxScore: integer("maxScore").default(100).notNull(),
    passed: boolean("passed").default(false).notNull(),
    timeSpent: integer("timeSpent").default(0).notNull(), // in seconds
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [
    index("mock_attempt_user_idx").on(t.userId),
    index("mock_attempt_test_idx").on(t.mockTestId),
  ]
);

// ── Content Management Table ──────────────────────────────────────────────────
export const contentItems = pgTable("content_item", {
  id: text("id").primaryKey(),
  type: text("type").notNull(), // 'instruction' | 'question' | 'explanation' | 'tutorial' | 'resource'
  gameSlug: text("gameSlug"),
  companySlug: text("companySlug"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status").default("published").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ── Support & Feedback Table ──────────────────────────────────────────────────
export const supportTickets = pgTable(
  "support_ticket",
  {
    id: text("id").primaryKey(),
    userId: text("userId").references(() => users.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    type: text("type").default("feedback").notNull(), // 'report' | 'feedback' | 'bug' | 'contact'
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    rating: integer("rating"),
    status: text("status").default("open").notNull(), // 'open' | 'in_progress' | 'resolved' | 'closed'
    priority: text("priority").default("medium").notNull(), // 'low' | 'medium' | 'high' | 'urgent'
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (t) => [index("support_status_idx").on(t.status)]
);

// ── Audit Logs Table (Immutable) ──────────────────────────────────────────────
export const auditLogs = pgTable(
  "audit_log",
  {
    id: text("id").primaryKey(),
    adminId: text("adminId").notNull(),
    adminEmail: text("adminEmail").notNull(),
    adminName: text("adminName"),
    action: text("action").notNull(), // e.g. 'user.plan_change', 'payment.refund', 'game.edit'
    targetType: text("targetType").notNull(), // 'user' | 'payment' | 'company' | 'game' | 'mock_test' | 'setting'
    targetId: text("targetId").notNull(),
    metadata: jsonb("metadata"),
    ipAddress: text("ipAddress"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [
    index("audit_admin_idx").on(t.adminId),
    index("audit_action_idx").on(t.action),
    index("audit_created_idx").on(t.createdAt),
  ]
);

// ── System Settings Table ─────────────────────────────────────────────────────
export const systemSettings = pgTable("system_setting", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedBy: text("updatedBy"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
