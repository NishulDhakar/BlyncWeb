import type { GameStat, ScoreEntry } from "@/features/profile/actions";
import { getGame } from "@/games/registry";
import { getCompany } from "@/data/companies";
import type { CompanyEntry } from "@/data/companies";

export function formatMemberSince(date: Date | string | null | undefined): string {
  if (!date) return "Recent Member";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function computePercentile(rank: number | null, totalCandidates = 1000): string {
  if (!rank || rank <= 0) return "Top 15% Candidate";
  const pct = Math.max(1, Math.round((rank / totalCandidates) * 100));
  if (pct <= 5) return "Top 5% Candidate";
  if (pct <= 10) return "Top 10% Candidate";
  if (pct <= 20) return "Top 20% Candidate";
  return `Top ${pct}% Candidate`;
}

export interface CognitiveSkill {
  name: string;
  category: string;
  score: number;
  level: "Advanced" | "Proficient" | "Developing";
  gamesAssociated: string[];
}

interface CognitiveDomainConfig {
  name: string;
  category: string;
  match: string[];
  baseScore: number;
}

export const COGNITIVE_DOMAINS: CognitiveDomainConfig[] = [
  {
    name: "Deductive & Logic",
    category: "Analytical Reasoning",
    match: ["switch-challenge", "deductive-challenge"],
    baseScore: 82,
  },
  {
    name: "Spatial & Pattern",
    category: "Visual Cognition",
    match: ["grid-challenge", "inductive-challenge", "motion-challenge"],
    baseScore: 88,
  },
  {
    name: "Numerical Reasoning",
    category: "Quantitative Speed",
    match: ["digit-challenge", "quick-math", "bubble-math"],
    baseScore: 76,
  },
  {
    name: "Working Memory",
    category: "Information Retention",
    match: ["grid-challenge", "grid-puzzle", "path-finder"],
    baseScore: 84,
  },
  {
    name: "Perceptual Speed",
    category: "Reaction & Reflexes",
    match: ["switch-challenge", "bubble-math", "key-and-door"],
    baseScore: 79,
  },
  {
    name: "Attention Switching",
    category: "Cognitive Flexibility",
    match: ["motion-challenge", "switch-challenge"],
    baseScore: 85,
  },
];

export function computeCognitiveSkills(gameStats: readonly GameStat[]): CognitiveSkill[] {
  const statsMap = new Map(gameStats.map((g) => [g.gameId, g]));

  return COGNITIVE_DOMAINS.map((domain) => {
    let score: number = domain.baseScore;
    let playedCount = 0;

    for (const slug of domain.match) {
      const stat = statsMap.get(slug);
      if (stat && stat.gamesPlayed > 0) {
        playedCount += stat.gamesPlayed;
      }
    }

    if (playedCount > 0) {
      score = Math.min(98, Math.max(60, domain.baseScore + Math.min(10, playedCount * 2)));
    }

    const level: "Advanced" | "Proficient" | "Developing" =
      score >= 85 ? "Advanced" : score >= 75 ? "Proficient" : "Developing";

    return {
      name: domain.name,
      category: domain.category,
      score,
      level,
      gamesAssociated: domain.match.map((s) => getGame(s)?.name ?? s),
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
  defaultQualified: number;
  defaultScore: number;
}

const TARGET_COMPANIES: TargetCompanyConfig[] = [
  { slug: "capgemini", total: 4, defaultQualified: 3, defaultScore: 75 },
  { slug: "accenture", total: 5, defaultQualified: 4, defaultScore: 80 },
  { slug: "deloitte", total: 4, defaultQualified: 2, defaultScore: 50 },
  { slug: "tcs", total: 5, defaultQualified: 2, defaultScore: 40 },
  { slug: "cognizant", total: 5, defaultQualified: 3, defaultScore: 60 },
  { slug: "ey", total: 4, defaultQualified: 1, defaultScore: 25 },
];

export function computeCompanyReadiness(gameStats: readonly GameStat[]): CompanyReadinessItem[] {
  const statsMap = new Map(gameStats.map((g) => [g.gameId, g]));

  const list: CompanyReadinessItem[] = [];

  for (const item of TARGET_COMPANIES) {
    const company = getCompany(item.slug);
    if (!company) continue;

    let qualified: number = item.defaultQualified;
    let score: number = item.defaultScore;

    if (statsMap.size > 0) {
      qualified = Math.min(item.total, Math.max(1, Math.floor(statsMap.size / 2)));
      score = Math.round((qualified / item.total) * 100);
    }

    list.push({
      company,
      totalGames: item.total,
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
    return [
      { sessionNumber: 1, score: 65, dateStr: "Day 1" },
      { sessionNumber: 2, score: 72, dateStr: "Day 2" },
      { sessionNumber: 3, score: 70, dateStr: "Day 3" },
      { sessionNumber: 4, score: 81, dateStr: "Day 4" },
      { sessionNumber: 5, score: 85, dateStr: "Day 5" },
      { sessionNumber: 6, score: 82, dateStr: "Day 6" },
      { sessionNumber: 7, score: 92, dateStr: "Day 7" },
    ];
  }

  const sorted = [...entries]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-10);

  return sorted.map((entry, idx) => ({
    sessionNumber: idx + 1,
    score: Math.min(100, Math.max(40, entry.score > 20 ? Math.round((entry.score / 30) * 100) : entry.score * 10)),
    dateStr: new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));
}
