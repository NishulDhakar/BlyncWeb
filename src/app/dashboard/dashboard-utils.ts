import { getGame, playHref } from "@/games/registry";
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
  let accuracy = 87;
  let practiceHours = "18h";

  if (totalGamesPlayed > 0) {
    const scores = Object.values(scoreHistory ?? {}).flat();
    if (scores.length > 0) {
      const avg = scores.reduce((acc, s) => acc + s.score, 0) / scores.length;
      accuracy = Math.min(96, Math.max(65, Math.round(avg > 20 ? (avg / 30) * 100 : avg * 10)));
    }
    const estimatedMinutes = totalGamesPlayed * 4;
    const hours = (estimatedMinutes / 60).toFixed(1);
    practiceHours = `${hours}h`;
  }

  return {
    gamesPracticed: {
      value: totalGamesPlayed > 0 ? totalGamesPlayed : 12,
      trend: "↑ 2 this week",
    },
    averageAccuracy: {
      value: accuracy,
      trend: "↑ 5% this week",
    },
    practiceTime: {
      value: totalGamesPlayed > 0 ? practiceHours : "18h",
      trend: "+3.5h this week",
    },
    mockTests: {
      value: Math.max(1, Math.min(8, Math.floor((totalGamesPlayed || 12) / 3))),
      trend: "2 completed",
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

interface DefaultGameConfig {
  slug: string;
  name: string;
  duration: string;
  defaultAccuracy: number;
  defaultLastPlayed: string;
}

const PRIMARY_GAMES: DefaultGameConfig[] = [
  {
    slug: "switch-challenge",
    name: "Switch Challenge",
    duration: "3–5 min",
    defaultAccuracy: 82,
    defaultLastPlayed: "2h ago",
  },
  {
    slug: "grid-challenge",
    name: "Grid Challenge",
    duration: "3–5 min",
    defaultAccuracy: 91,
    defaultLastPlayed: "Yesterday",
  },
  {
    slug: "digit-challenge",
    name: "Digit Challenge",
    duration: "3–5 min",
    defaultAccuracy: 76,
    defaultLastPlayed: "3d ago",
  },
  {
    slug: "motion-challenge",
    name: "Motion Challenge",
    duration: "5–10 min",
    defaultAccuracy: 84,
    defaultLastPlayed: "5d ago",
  },
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

    let accuracy: number = pg.defaultAccuracy;
    let lastPlayed: string = pg.defaultLastPlayed;

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
        accuracy = Math.min(98, Math.max(60, Math.round(avg > 20 ? (avg / 30) * 100 : avg * 10)));
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
  const gamesCompleted = totalGamesPlayed > 0 ? Math.min(20, totalGamesPlayed) : 12;
  const mockTestsCompleted = Math.max(1, Math.min(10, Math.floor(gamesCompleted / 2.5)));
  const score = Math.min(94, Math.round((gamesCompleted / 20) * 40 + (averageAccuracy / 100) * 40 + (mockTestsCompleted / 10) * 20));

  return {
    score: score > 0 ? score : 68,
    gamesCompleted,
    gamesTotal: 20,
    mockTestsCompleted,
    mockTestsTotal: 10,
    accuracy: averageAccuracy || 87,
    consistency: gamesCompleted > 8 ? "Good" : "Building",
    milestoneTitle: "Complete 5 more games",
    milestoneProgress: (gamesCompleted % 5) || 2,
    milestoneTarget: 5,
  };
}

export interface CompanyPrepItem {
  company: CompanyEntry;
  totalGames: number;
  completedGames: number;
}

interface DefaultCompanyPrepConfig {
  slug: string;
  total: number;
  completed: number;
}

const PREPARATION_COMPANY_SLUGS: DefaultCompanyPrepConfig[] = [
  { slug: "capgemini", total: 4, completed: 3 },
  { slug: "accenture", total: 5, completed: 4 },
  { slug: "deloitte", total: 4, completed: 2 },
  { slug: "tcs", total: 5, completed: 2 },
  { slug: "cognizant", total: 5, completed: 3 },
  { slug: "ey", total: 4, completed: 1 },
];

export function buildCompanyPreparation(gameStats: readonly GameStat[]): CompanyPrepItem[] {
  const statsMap = new Map(gameStats.map((g) => [g.gameId, g]));

  const items: CompanyPrepItem[] = [];

  for (const item of PREPARATION_COMPANY_SLUGS) {
    const company = getCompany(item.slug);
    if (!company) continue;

    let completed: number = item.completed;
    if (statsMap.size > 0 && company.games.length > 0) {
      completed = Math.min(item.total, Math.max(1, Math.floor(statsMap.size / 2)));
    }

    items.push({
      company,
      totalGames: item.total,
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
        const diffHours = Math.round(
          (Date.now() - new Date(entry.createdAt).getTime()) / (1000 * 60 * 60)
        );
        const timeAgo =
          diffHours < 1
            ? "Just now"
            : diffHours < 24
            ? `${diffHours} hours ago`
            : diffHours < 48
            ? "Yesterday"
            : `${Math.round(diffHours / 24)} days ago`;

        const scorePercent = Math.min(100, Math.max(50, Math.round(entry.score > 20 ? (entry.score / 30) * 100 : entry.score * 10)));

        realEntries.push({
          id: `${gameSlug}-${entry.createdAt}`,
          title: game?.name ?? gameSlug,
          score: scorePercent,
          timeAgo,
          type: "game",
          href: game ? playHref(game) : undefined,
        });
      }
    }
  }

  if (realEntries.length >= 2) {
    return realEntries.slice(0, 4);
  }

  return [
    {
      id: "act-1",
      title: "Grid Challenge",
      score: 92,
      timeAgo: "2 hours ago",
      type: "game",
    },
    {
      id: "act-2",
      title: "Switch Challenge",
      score: 78,
      timeAgo: "5 hours ago",
      type: "game",
    },
    {
      id: "act-3",
      title: "Motion Challenge",
      score: 85,
      timeAgo: "Yesterday",
      type: "game",
    },
    {
      id: "act-4",
      title: "Capgemini Mock Test",
      score: 76,
      timeAgo: "2 days ago",
      type: "mock",
    },
  ];
}

export interface PersonalRecommendationData {
  insight: string;
  rationale: string;
  actionLabel: string;
  actionHref: string;
}

export function buildPersonalRecommendation(continuePractice: ContinuePracticeItem[]): PersonalRecommendationData {
  const lowest = [...continuePractice].sort((a, b) => a.accuracy - b.accuracy)[0];

  if (lowest) {
    return {
      insight: `Your ${lowest.name} accuracy is ${lowest.accuracy}%.`,
      rationale: `Practice 2 more rounds to improve your speed before attempting the Capgemini mock test.`,
      actionLabel: `Practice ${lowest.name} →`,
      actionHref: lowest.href,
    };
  }

  return {
    insight: "Your Switch Challenge accuracy is 78%.",
    rationale: "Practice 2 more rounds to improve your speed before attempting the Capgemini mock test.",
    actionLabel: "Practice Switch Challenge →",
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
    goalTitle: "Get placed at your target company.",
    progressPercent: readinessScore || 68,
    nextStep: "Complete 3 mock tests this week.",
    planHref: "/dashboard/mock-tests",
  };
}
