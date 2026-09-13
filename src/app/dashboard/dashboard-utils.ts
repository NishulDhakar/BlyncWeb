import { getGame, playHref, gamesForCompany } from "@/games/registry";
import type { GameStat, ScoreEntry } from "@/features/profile/actions";
import { getCompany } from "@/data/companies";
import type { CompanyEntry } from "@/data/companies";

export interface PerformanceOverview {
  gamesPracticed: { value: number; trend: string };
  averageAccuracy: { value: number; trend: string };
  practiceTime: { value: string; trend: string };
  mockTests: { value: number; trend: string };
}

export function computePerformanceOverview(
  totalGamesPlayed: number,
  gameStats: readonly GameStat[],
  scoreHistory?: Record<string, ScoreEntry[]>
): PerformanceOverview {
  let accuracy = 0;
  let practiceHours = "0h";

  if (totalGamesPlayed > 0) {
    const scores = Object.values(scoreHistory ?? {}).flat();
    if (scores.length > 0) {
      const avg = scores.reduce((acc, s) => acc + s.score, 0) / scores.length;
      accuracy = Math.min(100, Math.max(10, Math.round(avg > 20 ? (avg / 30) * 100 : avg * 10)));
    }
    const estimatedMinutes = totalGamesPlayed * 3.5;
    const hours = (estimatedMinutes / 60).toFixed(1);
    practiceHours = `${hours}h`;
  }

  return {
    gamesPracticed: {
      value: totalGamesPlayed,
      trend: totalGamesPlayed > 0 ? `${totalGamesPlayed} rounds total` : "Play your first game",
    },
    averageAccuracy: {
      value: accuracy,
      trend: totalGamesPlayed > 0 ? "Overall average" : "No rounds yet",
    },
    practiceTime: {
      value: practiceHours,
      trend: totalGamesPlayed > 0 ? "Estimated drill time" : "Start practicing",
    },
    mockTests: {
      value: 0,
      trend: "Coming soon",
    },
  };
}

export interface ContinuePracticeItem {
  slug: string;
  name: string;
  duration: string;
  accuracy: number;
  lastPlayed: string;
  attempts: number;
  href: string;
}

const PRIMARY_GAMES = [
  { slug: "switch-challenge", name: "Switch Challenge", duration: "3–5 min" },
  { slug: "grid-challenge", name: "Grid Challenge", duration: "3–5 min" },
  { slug: "digit-challenge", name: "Digit Challenge", duration: "3–5 min" },
  { slug: "motion-challenge", name: "Motion Challenge", duration: "5–10 min" },
];

export function buildContinuePractice(
  gameStats: readonly GameStat[],
  scoreHistory?: Record<string, ScoreEntry[]>
): ContinuePracticeItem[] {
  const statsMap = new Map(gameStats.map((g) => [g.gameId, g]));

  return PRIMARY_GAMES.map((pg) => {
    const gameDef = getGame(pg.slug);
    const stat = statsMap.get(pg.slug);
    const attempts = stat?.gamesPlayed ?? 0;

    let accuracy = 0;
    let lastPlayed = "Not played yet";

    if (stat && stat.gamesPlayed > 0) {
      const history = scoreHistory?.[pg.slug];
      if (history && history.length > 0) {
        const latest = history[0];
        const diffHours = Math.round(
          (Date.now() - new Date(latest.createdAt).getTime()) / (1000 * 60 * 60)
        );
        lastPlayed =
          diffHours < 1
            ? "Just now"
            : diffHours < 24
            ? `${diffHours}h ago`
            : diffHours < 48
            ? "Yesterday"
            : `${Math.round(diffHours / 24)}d ago`;

        const avg = history.reduce((acc, h) => acc + h.score, 0) / history.length;
        accuracy = Math.min(100, Math.max(10, Math.round(avg > 20 ? (avg / 30) * 100 : avg * 10)));
      }
    }

    return {
      slug: pg.slug,
      name: gameDef?.name ?? pg.name,
      duration: gameDef?.duration ?? pg.duration,
      accuracy,
      lastPlayed,
      attempts,
      href: gameDef ? playHref(gameDef) : `/play/${pg.slug}`,
    };
  });
}

export interface PlacementReadinessData {
  score: number;
  gamesCompleted: number;
  gamesTotal: number;
  mockTestsCompleted: number;
  mockTestsTotal: number;
  accuracy: number;
  consistency: string;
  milestoneTitle: string;
  milestoneProgress: number;
  milestoneTarget: number;
}

export function computePlacementReadiness(
  totalGamesPlayed: number,
  averageAccuracy: number
): PlacementReadinessData {
  if (totalGamesPlayed === 0) {
    return {
      score: 0,
      gamesCompleted: 0,
      gamesTotal: 20,
      mockTestsCompleted: 0,
      mockTestsTotal: 0,
      accuracy: 0,
      consistency: "Getting Started",
      milestoneTitle: "Complete your first game",
      milestoneProgress: 0,
      milestoneTarget: 5,
    };
  }

  const gamesCompleted = Math.min(20, totalGamesPlayed);
  const score = Math.min(100, Math.round((gamesCompleted / 20) * 50 + (averageAccuracy / 100) * 50));

  return {
    score,
    gamesCompleted,
    gamesTotal: 20,
    mockTestsCompleted: 0,
    mockTestsTotal: 0,
    accuracy: averageAccuracy,
    consistency: gamesCompleted >= 10 ? "Strong" : gamesCompleted >= 5 ? "Good" : "Building",
    milestoneTitle: "Complete 5 more games",
    milestoneProgress: totalGamesPlayed % 5,
    milestoneTarget: 5,
  };
}

export interface CompanyPrepItem {
  company: CompanyEntry;
  totalGames: number;
  completedGames: number;
}

const PREPARATION_COMPANY_SLUGS = [
  { slug: "capgemini", total: 6 },
  { slug: "cognizant", total: 4 },
  { slug: "accenture", total: 5 },
  { slug: "deloitte", total: 4 },
  { slug: "tcs", total: 5 },
  { slug: "ey", total: 4 },
];

export function buildCompanyPreparation(gameStats: readonly GameStat[]): CompanyPrepItem[] {
  const statsMap = new Map(gameStats.map((g) => [g.gameId, g]));
  const items: CompanyPrepItem[] = [];

  for (const item of PREPARATION_COMPANY_SLUGS) {
    const company = getCompany(item.slug);
    if (!company) continue;

    const playableGames = company.registrySlug ? gamesForCompany(company.registrySlug) : [];
    let completed = 0;
    if (playableGames.length > 0) {
      for (const cg of playableGames) {
        const stat = statsMap.get(cg.slug);
        if (stat && stat.gamesPlayed > 0) {
          completed++;
        }
      }
    }

    items.push({
      company,
      totalGames: playableGames.length > 0 ? playableGames.length : (company.games?.length || item.total),
      completedGames: completed,
    });
  }

  return items;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  score: number;
  timeAgo: string;
  type?: "game" | "mock";
  href?: string;
}

export function buildRecentActivity(scoreHistory?: Record<string, ScoreEntry[]>): RecentActivityItem[] {
  const realEntries: RecentActivityItem[] = [];

  if (scoreHistory) {
    for (const [gameSlug, entries] of Object.entries(scoreHistory)) {
      const game = getGame(gameSlug);
      for (const entry of entries) {
        const entryTime = new Date(entry.createdAt).getTime();
        const diffHours = Math.round(
          (Date.now() - entryTime) / (1000 * 60 * 60)
        );
        const timeAgo =
          diffHours < 1
            ? "Just now"
            : diffHours < 24
            ? `${diffHours} hours ago`
            : diffHours < 48
            ? "Yesterday"
            : `${Math.round(diffHours / 24)} days ago`;

        const scorePercent = Math.min(
          100,
          Math.max(10, Math.round(entry.score > 20 ? (entry.score / 30) * 100 : entry.score * 10))
        );

        realEntries.push({
          id: `${gameSlug}-${entryTime}`,
          title: game?.name ?? gameSlug,
          score: scorePercent,
          timeAgo,
          type: "game",
          href: game ? playHref(game) : undefined,
        });
      }
    }
  }

  // Sort descending by most recent
  realEntries.sort((a, b) => b.id.localeCompare(a.id));
  return realEntries.slice(0, 5);
}

export interface PersonalRecommendationData {
  insight: string;
  rationale: string;
  actionLabel: string;
  actionHref: string;
}

export function buildPersonalRecommendation(continuePractice: ContinuePracticeItem[]): PersonalRecommendationData {
  const played = continuePractice.filter((g) => g.attempts > 0);
  if (played.length > 0) {
    const lowest = [...played].sort((a, b) => a.accuracy - b.accuracy)[0];
    return {
      insight: `Your ${lowest.name} accuracy is ${lowest.accuracy}%.`,
      rationale: `Practice 2 more rounds to sharpen your speed and score consistency.`,
      actionLabel: `Practice ${lowest.name} →`,
      actionHref: lowest.href,
    };
  }

  return {
    insight: "Begin your placement preparation with Switch Challenge.",
    rationale: "Switch Challenge is the primary cognitive flexibility test in Capgemini and Cognizant rounds.",
    actionLabel: "Start Switch Challenge →",
    actionHref: "/play/switch-challenge",
  };
}

export interface UserGoalData {
  goalTitle: string;
  progressPercent: number;
  nextStep: string;
  planHref: string;
}

export function buildUserGoal(readinessScore: number): UserGoalData {
  return {
    goalTitle: "Ace your target company assessment round.",
    progressPercent: readinessScore,
    nextStep:
      readinessScore === 0
        ? "Complete your first 3 cognitive game drills."
        : "Practice daily to reach 90%+ readiness.",
    planHref: "/games",
  };
}
