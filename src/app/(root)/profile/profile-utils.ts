import type { GameStat, ScoreEntry } from "@/features/profile/actions";
import { getCompany } from "@/data/companies";
import type { CompanyEntry } from "@/data/companies";

export function formatMemberSince(date: Date | string | null | undefined): string {
  if (!date) return "Recent Member";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function computePercentile(rank: number | null, totalCandidates = 2099): string {
  if (!rank || rank <= 0) return "Unranked (Play to get ranked)";
  const pct = Math.max(1, Math.round((rank / totalCandidates) * 100));
  if (pct <= 1) return "Top 1% Candidate";
  if (pct <= 5) return "Top 5% Candidate";
  if (pct <= 10) return "Top 10% Candidate";
  if (pct <= 20) return "Top 20% Candidate";
  return `Top ${pct}% Candidate`;
}

export interface CognitiveSkill {
  name: string;
  category: string;
  score: number;
  level: "Advanced" | "Proficient" | "Developing" | "Not assessed";
  gamesAssociated: string[];
}

interface CognitiveDomainConfig {
  name: string;
  category: string;
  match: string[];
}

export const COGNITIVE_DOMAINS: CognitiveDomainConfig[] = [
  {
    name: "Deductive & Logic",
    category: "Analytical Reasoning",
    match: ["switch-challenge", "deductive-challenge"],
  },
  {
    name: "Spatial & Pattern",
    category: "Visual Cognition",
    match: ["grid-challenge", "inductive-challenge", "motion-challenge"],
  },
  {
    name: "Numerical Reasoning",
    category: "Quantitative Speed",
    match: ["digit-challenge", "quick-math", "bubble-math"],
  },
  {
    name: "Working Memory",
    category: "Information Retention",
    match: ["grid-challenge", "grid-puzzle", "path-finder"],
  },
  {
    name: "Perceptual Speed",
    category: "Reaction & Reflexes",
    match: ["switch-challenge", "bubble-math", "key-and-door"],
  },
  {
    name: "Attention Switching",
    category: "Cognitive Flexibility",
    match: ["motion-challenge", "switch-challenge"],
  },
];

export function computeCognitiveSkills(gameStats: readonly GameStat[]): CognitiveSkill[] {
  const statsMap = new Map(gameStats.map((g) => [g.gameId, g]));

  return COGNITIVE_DOMAINS.map((domain) => {
    const relevantScores: number[] = [];

    for (const slug of domain.match) {
      const stat = statsMap.get(slug);
      if (stat && stat.gamesPlayed > 0 && stat.bestScore > 0) {
        const normalized =
          stat.bestScore > 20
            ? Math.min(100, Math.round((stat.bestScore / 30) * 100))
            : Math.min(100, stat.bestScore * 10);
        relevantScores.push(normalized);
      }
    }

    const hasPlayed = relevantScores.length > 0;
    const score = hasPlayed
      ? Math.round(relevantScores.reduce((a, b) => a + b, 0) / relevantScores.length)
      : 0;

    const level: "Advanced" | "Proficient" | "Developing" | "Not assessed" = !hasPlayed
      ? "Not assessed"
      : score >= 85
      ? "Advanced"
      : score >= 70
      ? "Proficient"
      : "Developing";

    return {
      name: domain.name,
      category: domain.category,
      score,
      level,
      gamesAssociated: domain.match,
    };
  });
}

export interface CompanyReadinessItem {
  company: CompanyEntry;
  totalGames: number;
  qualifiedGames: number;
  readinessScore: number;
}

interface TargetCompanyConfig {
  slug: string;
  total: number;
}

const TARGET_COMPANIES: TargetCompanyConfig[] = [
  { slug: "capgemini", total: 6 },
  { slug: "accenture", total: 5 },
  { slug: "deloitte", total: 4 },
  { slug: "tcs", total: 5 },
  { slug: "cognizant", total: 4 },
  { slug: "ey", total: 4 },
];

import { gamesForCompany } from "@/games/registry";

export function computeCompanyReadiness(gameStats: readonly GameStat[]): CompanyReadinessItem[] {
  const statsMap = new Map(gameStats.map((g) => [g.gameId, g]));
  const list: CompanyReadinessItem[] = [];

  for (const item of TARGET_COMPANIES) {
    const company = getCompany(item.slug);
    if (!company) continue;

    const playableGames = company.registrySlug ? gamesForCompany(company.registrySlug) : [];
    const total = playableGames.length > 0 ? playableGames.length : (company.games?.length || item.total);
    let qualified = 0;

    if (playableGames.length > 0) {
      for (const cg of playableGames) {
        const stat = statsMap.get(cg.slug);
        if (stat && stat.gamesPlayed > 0) {
          qualified++;
        }
      }
    }

    const score = total > 0 ? Math.round((qualified / total) * 100) : 0;

    list.push({
      company,
      totalGames: total,
      qualifiedGames: qualified,
      readinessScore: score,
    });
  }

  return list;
}

export interface ChartSession {
  sessionNumber: number;
  score: number;
  dateStr: string;
}

export function formatGameHistoryChart(
  history: Record<string, ScoreEntry[]>,
  selectedGameId: string
): ChartSession[] {
  let entries: ScoreEntry[] = [];

  if (selectedGameId === "all") {
    entries = Object.values(history).flat();
  } else {
    entries = history[selectedGameId] || [];
  }

  if (entries.length === 0) {
    return [];
  }

  const sorted = [...entries]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-10);

  return sorted.map((entry, idx) => ({
    sessionNumber: idx + 1,
    score: Math.min(100, Math.max(10, entry.score > 20 ? Math.round((entry.score / 30) * 100) : entry.score * 10)),
    dateStr: new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));
}
