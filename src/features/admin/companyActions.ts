"use server";

import { db } from "@/lib/db";
import { companies, games, mockTests, gameScores, mockTestAttempts } from "@/lib/schema";
import { requireAdmin } from "./auth";
import { logAdminAction } from "./audit";
import { eq, desc, sql, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCompanies() {
  await requireAdmin("support");

  const companyList = await db
    .select()
    .from(companies)
    .orderBy(companies.name);

  // Compute stats per company: associated games count, mock tests count
  const allGames = await db
    .select({
      id: games.id,
      slug: games.slug,
      companySlug: games.companySlug,
    })
    .from(games);

  const allMockTests = await db
    .select({
      id: mockTests.id,
      companySlug: mockTests.companySlug,
    })
    .from(mockTests);

  const gamesCountMap = new Map<string, number>();
  for (const g of allGames) {
    if (g.companySlug) {
      gamesCountMap.set(g.companySlug, (gamesCountMap.get(g.companySlug) || 0) + 1);
    }
  }

  const mocksCountMap = new Map<string, number>();
  for (const m of allMockTests) {
    if (m.companySlug) {
      mocksCountMap.set(m.companySlug, (mocksCountMap.get(m.companySlug) || 0) + 1);
    }
  }

  return companyList.map((c) => ({
    ...c,
    gamesCount: gamesCountMap.get(c.slug) || 0,
    mockTestsCount: mocksCountMap.get(c.slug) || 0,
  }));
}

export async function getCompanyDetails(idOrSlug: string) {
  await requireAdmin("support");

  const [company] = await db
    .select()
    .from(companies)
    .where(sql`${companies.id} = ${idOrSlug} OR ${companies.slug} = ${idOrSlug}`)
    .limit(1);

  if (!company) return null;

  // Games for this company
  const companyGames = await db
    .select()
    .from(games)
    .where(eq(games.companySlug, company.slug));

  const gameSlugs = companyGames.map((g) => g.slug);

  // Mock tests for this company
  const companyMockTests = await db
    .select()
    .from(mockTests)
    .where(eq(mockTests.companySlug, company.slug));

  // Compute attempts & average score across this company's games
  let totalAttempts = 0;
  let averageScore = 0;

  if (gameSlugs.length > 0) {
    const [scoreAgg] = await db
      .select({
        count: sql<number>`count(*)::int`,
        avgScore: sql<number>`coalesce(avg(score), 0)::float`,
      })
      .from(gameScores)
      .where(inArray(gameScores.gameId, gameSlugs));

    totalAttempts = scoreAgg?.count ?? 0;
    averageScore = Number((scoreAgg?.avgScore ?? 0).toFixed(1));
  }

  return {
    company,
    games: companyGames,
    mockTests: companyMockTests,
    stats: {
      totalAttempts,
      averageScore,
      gamesCount: companyGames.length,
      mockTestsCount: companyMockTests.length,
    },
  };
}

export async function createCompany(data: {
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  description?: string;
  assessmentType?: string;
  region?: string;
}) {
  const admin = await requireAdmin("admin");

  const id = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  await db.insert(companies).values({
    id,
    slug: id,
    name: data.name,
    logo: data.logo || null,
    website: data.website || null,
    description: data.description || null,
    assessmentType: data.assessmentType || "Cognitive Assessment",
    region: data.region || "india",
    status: "active",
  });

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "company.created",
    targetType: "company",
    targetId: id,
    metadata: { name: data.name, slug: id },
  });

  revalidatePath("/admin/companies");
  return { success: true, id };
}

export async function updateCompany(
  id: string,
  data: {
    name?: string;
    logo?: string;
    website?: string;
    description?: string;
    assessmentType?: string;
    status?: string;
  }
) {
  const admin = await requireAdmin("admin");

  await db
    .update(companies)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(companies.id, id));

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "company.updated",
    targetType: "company",
    targetId: id,
    metadata: data,
  });

  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${id}`);
  return { success: true };
}

export async function deleteCompany(id: string) {
  const admin = await requireAdmin("super_admin");

  await db.delete(companies).where(eq(companies.id, id));

  await logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    action: "company.deleted",
    targetType: "company",
    targetId: id,
  });

  revalidatePath("/admin/companies");
  return { success: true };
}
