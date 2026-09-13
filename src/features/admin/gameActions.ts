"use server";

import { db } from "@/lib/db";
import { games, gameScores, gameAttempts } from "@/lib/schema";
import { requireAdmin } from "./auth";
import { logAdminAction } from "./audit";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export interface GameItemWithStats {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  difficulty: string;
  duration: string | null;
  timeLimit: number | null;
  rounds: number | null;
  companySlug: string | null;
  kind: string;
  status: string;
  hasRulesPage: boolean | null;
  pro: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  totalAttempts: number;
  averageScore: number;
  maxScore: number;
}

export async function getGamesList(): Promise<GameItemWithStats[]> {
  await requireAdmin("support");

  const allGames = await db.select().from(games).orderBy(games.name);

  // Aggregate scores and attempts per game
  const scoreStats = await db
    .select({
      gameId: gameScores.gameId,
      attemptsCount: sql<number>`count(*)::int`,
      avgScore: sql<number>`coalesce(avg(score), 0)::float`,
      maxScore: sql<number>`coalesce(max(score), 0)::int`,
    })
    .from(gameScores)
    .groupBy(gameScores.gameId);

  const statsMap = new Map(
    scoreStats.map((s) => [
      s.gameId,
      {
        attempts: s.attemptsCount,
        avg: Number(s.avgScore.toFixed(1)),
        max: s.maxScore,
      },
    ])
  );

  return allGames.map((g) => {
    const s = statsMap.get(g.slug) || { attempts: 0, avg: 0, max: 0 };
    return {
      ...g,
      totalAttempts: s.attempts,
      averageScore: s.avg,
      maxScore: s.max,
    };
  });
}

export async function createGame(data: {
  name: string;
  slug: string;
  description?: string;
  category: string;
  difficulty: string;
  duration?: string;
  timeLimit?: number;
  rounds?: number;
  companySlug?: string;
  pro?: boolean;
}) {
  const admin = await requireAdmin("admin");

  const slug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  await db.insert(games).values({
    id: slug,
    slug,
    name: data.name,
    description: data.description || null,
    category: data.category,
    difficulty: data.difficulty,
    duration: data.duration || "3-5 min",
    timeLimit: data.timeLimit || 180,
    rounds: data.rounds || 15,
    companySlug: data.companySlug || null,
    pro: data.pro || false,
    status: "active",
    kind: "react",
  });

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "game.created",
    targetType: "game",
    targetId: slug,
    metadata: { name: data.name, slug },
  });

  revalidatePath("/admin/games");
  return { success: true, slug };
}

export async function updateGame(
  id: string,
  data: {
    name?: string;
    description?: string;
    category?: string;
    difficulty?: string;
    duration?: string;
    timeLimit?: number;
    rounds?: number;
    companySlug?: string;
    status?: string;
    pro?: boolean;
  }
) {
  const admin = await requireAdmin("admin");

  await db
    .update(games)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(games.id, id));

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "game.updated",
    targetType: "game",
    targetId: id,
    metadata: data,
  });

  revalidatePath("/admin/games");
  return { success: true };
}

export async function duplicateGame(id: string) {
  const admin = await requireAdmin("admin");

  const [orig] = await db.select().from(games).where(eq(games.id, id)).limit(1);
  if (!orig) throw new Error("Game not found");

  const newSlug = `${orig.slug}-copy-${Math.floor(Math.random() * 1000)}`;

  await db.insert(games).values({
    id: newSlug,
    slug: newSlug,
    name: `${orig.name} (Copy)`,
    description: orig.description,
    category: orig.category,
    difficulty: orig.difficulty,
    duration: orig.duration,
    timeLimit: orig.timeLimit,
    rounds: orig.rounds,
    companySlug: orig.companySlug,
    pro: orig.pro,
    status: "draft",
    kind: orig.kind,
  });

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "game.duplicated",
    targetType: "game",
    targetId: newSlug,
    metadata: { originalSlug: orig.slug },
  });

  revalidatePath("/admin/games");
  return { success: true, newSlug };
}

export async function deleteGame(id: string) {
  const admin = await requireAdmin("super_admin");

  await db.delete(games).where(eq(games.id, id));

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "game.deleted",
    targetType: "game",
    targetId: id,
  });

  revalidatePath("/admin/games");
  return { success: true };
}
