"use server";

import { db } from "@/lib/db";
import { mockTests, mockTestAttempts, companies, games } from "@/lib/schema";
import { requireAdmin } from "./auth";
import { logAdminAction } from "./audit";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface MockTestItemWithStats {
  id: string;
  name: string;
  slug: string;
  companySlug: string;
  companyName: string | null;
  gameSlugs: string[];
  orderIndex: number | null;
  timeLimit: number;
  difficulty: string;
  passingScore: number;
  status: string;
  createdAt: Date;
  totalAttempts: number;
  passedAttempts: number;
  passRate: number;
  avgScore: number;
}

export async function getMockTestsList(): Promise<MockTestItemWithStats[]> {
  await requireAdmin("support");

  const rawTests = await db
    .select({
      id: mockTests.id,
      name: mockTests.name,
      slug: mockTests.slug,
      companySlug: mockTests.companySlug,
      companyName: companies.name,
      gameSlugs: mockTests.gameSlugs,
      orderIndex: mockTests.orderIndex,
      timeLimit: mockTests.timeLimit,
      difficulty: mockTests.difficulty,
      passingScore: mockTests.passingScore,
      status: mockTests.status,
      createdAt: mockTests.createdAt,
    })
    .from(mockTests)
    .leftJoin(companies, eq(mockTests.companySlug, companies.slug))
    .orderBy(mockTests.orderIndex);

  // Aggregate attempt stats
  const attemptStats = await db
    .select({
      mockTestId: mockTestAttempts.mockTestId,
      total: sql<number>`count(*)::int`,
      passed: sql<number>`count(*) filter (where passed = true)::int`,
      avgScore: sql<number>`coalesce(avg(score), 0)::float`,
    })
    .from(mockTestAttempts)
    .groupBy(mockTestAttempts.mockTestId);

  const statsMap = new Map(
    attemptStats.map((s) => [
      s.mockTestId,
      {
        total: s.total,
        passed: s.passed,
        passRate: s.total > 0 ? Number(((s.passed / s.total) * 100).toFixed(1)) : 0,
        avg: Number(s.avgScore.toFixed(1)),
      },
    ])
  );

  return rawTests.map((t) => {
    const s = statsMap.get(t.id) || {
      total: 0,
      passed: 0,
      passRate: 0,
      avg: 0,
    };
    return {
      ...t,
      gameSlugs: (t.gameSlugs as string[]) || [],
      totalAttempts: s.total,
      passedAttempts: s.passed,
      passRate: s.passRate,
      avgScore: s.avg,
    };
  });
}

export async function createMockTest(data: {
  name: string;
  slug: string;
  companySlug: string;
  gameSlugs: string[];
  timeLimit: number;
  difficulty: string;
  passingScore: number;
}) {
  const admin = await requireAdmin("admin");

  const slug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  await db.insert(mockTests).values({
    id: slug,
    slug,
    name: data.name,
    companySlug: data.companySlug,
    gameSlugs: data.gameSlugs,
    timeLimit: data.timeLimit,
    difficulty: data.difficulty,
    passingScore: data.passingScore,
    status: "published",
  });

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "mock_test.created",
    targetType: "mock_test",
    targetId: slug,
    metadata: { name: data.name, companySlug: data.companySlug },
  });

  revalidatePath("/admin/mock-tests");
  return { success: true, slug };
}

export async function updateMockTest(
  id: string,
  data: {
    name?: string;
    companySlug?: string;
    gameSlugs?: string[];
    timeLimit?: number;
    difficulty?: string;
    passingScore?: number;
    status?: string;
  }
) {
  const admin = await requireAdmin("admin");

  await db
    .update(mockTests)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(mockTests.id, id));

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "mock_test.updated",
    targetType: "mock_test",
    targetId: id,
    metadata: data,
  });

  revalidatePath("/admin/mock-tests");
  return { success: true };
}

export async function duplicateMockTest(id: string) {
  const admin = await requireAdmin("admin");

  const [orig] = await db
    .select()
    .from(mockTests)
    .where(eq(mockTests.id, id))
    .limit(1);

  if (!orig) throw new Error("Mock test not found");

  const newSlug = `${orig.slug}-copy-${Math.floor(Math.random() * 1000)}`;

  await db.insert(mockTests).values({
    id: newSlug,
    slug: newSlug,
    name: `${orig.name} (Copy)`,
    companySlug: orig.companySlug,
    gameSlugs: orig.gameSlugs,
    timeLimit: orig.timeLimit,
    difficulty: orig.difficulty,
    passingScore: orig.passingScore,
    status: "draft",
  });

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "mock_test.duplicated",
    targetType: "mock_test",
    targetId: newSlug,
  });

  revalidatePath("/admin/mock-tests");
  return { success: true, newSlug };
}

export async function deleteMockTest(id: string) {
  const admin = await requireAdmin("super_admin");

  await db.delete(mockTests).where(eq(mockTests.id, id));

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "mock_test.deleted",
    targetType: "mock_test",
    targetId: id,
  });

  revalidatePath("/admin/mock-tests");
  return { success: true };
}
