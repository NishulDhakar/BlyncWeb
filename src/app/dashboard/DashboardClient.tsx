"use client";

import Link from "next/link";
import {
  ArrowRight,
  Target,
  Percent,
  Clock,
  FileCheck,
  Flame,
  ArrowRightLeft,
  LayoutGrid,
  Calculator,
  Move,
  Puzzle,
  Gamepad2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { GameCard } from "@/components/dashboard/GameCard";
import { CompanyCard } from "@/components/dashboard/CompanyCard";
import { ReadinessCard } from "@/components/dashboard/ReadinessCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { GoalCard } from "@/components/dashboard/GoalCard";
import type {
  PerformanceOverview,
  ContinuePracticeItem,
  PlacementReadinessData,
  CompanyPrepItem,
  RecentActivityItem,
  PersonalRecommendationData,
  UserGoalData,
} from "./dashboard-utils";
import type { StreakData } from "@/features/streak/actions";

const GAME_ICON_MAP: Record<string, LucideIcon> = {
  "switch-challenge": ArrowRightLeft,
  "grid-challenge": LayoutGrid,
  "digit-challenge": Calculator,
  "motion-challenge": Move,
  "deductive-challenge": Puzzle,
};

interface Props {
  firstName: string;
  streak: StreakData;
  overview: PerformanceOverview;
  continuePractice: ContinuePracticeItem[];
  readiness: PlacementReadinessData;
  companies: CompanyPrepItem[];
  recentActivity: RecentActivityItem[];
  recommendation: PersonalRecommendationData;
  goal: UserGoalData;
}

export default function DashboardClient({
  firstName,
  streak,
  overview,
  continuePractice,
  readiness,
  companies,
  recentActivity,
  recommendation,
  goal,
}: Props) {
  const currentStreakDays = streak.currentStreak > 0 ? streak.currentStreak : 7;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Good to see you again,
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Keep practicing, {firstName}.
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Small steps every day. Big results in placement season.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start rounded-xl border border-border/80 bg-card px-3.5 py-2.5 sm:self-auto shadow-2xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-500">
            <Flame className="h-4 w-4 fill-amber-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">
              {currentStreakDays} day streak
            </div>
            <Link
              href="/games"
              className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline cursor-pointer"
            >
              <span>Keep going</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Dashboard Layout ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
        {/* ── Primary Left Column ────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* SECTION 2 — CONTINUE PRACTICING (PRIMARY) */}
          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <h2 className="text-base font-bold tracking-tight text-foreground">
                  Continue Practicing
                </h2>
                <p className="text-xs text-muted-foreground">Pick up where you left off.</p>
              </div>
              <Link
                href="/dashboard/games"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
              >
                <span>View all games</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {continuePractice.map((game) => {
                const Icon = GAME_ICON_MAP[game.slug] ?? Gamepad2;
                return (
                  <GameCard
                    key={game.slug}
                    slug={game.slug}
                    name={game.name}
                    duration={game.duration}
                    accuracy={game.accuracy}
                    lastPlayed={game.lastPlayed}
                    attempts={game.attempts}
                    href={game.href}
                    icon={Icon}
                  />
                );
              })}
            </div>
          </section>

          {/* SECTION 1 — PERFORMANCE OVERVIEW */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Performance Overview
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricCard
                label="Games Practiced"
                value={overview.gamesPracticed.value}
                change={overview.gamesPracticed.trend}
                trend="up"
                icon={Target}
              />
              <MetricCard
                label="Average Accuracy"
                value={`${overview.averageAccuracy.value}%`}
                change={overview.averageAccuracy.trend}
                trend="up"
                icon={Percent}
              />
              <MetricCard
                label="Practice Time"
                value={overview.practiceTime.value}
                change={overview.practiceTime.trend}
                trend="up"
                icon={Clock}
              />
              <MetricCard
                label="Mock Tests"
                value={overview.mockTests.value}
                change={overview.mockTests.trend}
                trend="neutral"
                icon={FileCheck}
              />
            </div>
          </section>

          {/* SECTION 4 — PREPARE BY COMPANY */}
          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <h2 className="text-base font-bold tracking-tight text-foreground">
                  Prepare by Company
                </h2>
                <p className="text-xs text-muted-foreground">
                  Practice the game sets associated with specific hiring processes.
                </p>
              </div>
              <Link
                href="/dashboard/companies"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
              >
                <span>All companies</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((c) => (
                <CompanyCard
                  key={c.company.slug}
                  company={c.company}
                  totalGames={c.totalGames}
                  completedGames={c.completedGames}
                />
              ))}
            </div>
          </section>

          {/* SECTION 5 — RECENT ACTIVITY */}
          <section>
            <ActivityList activities={recentActivity} />
          </section>
        </div>

        {/* ── Secondary Right Rail ───────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* SECTION 3 — PLACEMENT READINESS */}
          <ReadinessCard
            score={readiness.score}
            gamesCompleted={readiness.gamesCompleted}
            gamesTotal={readiness.gamesTotal}
            mockTestsCompleted={readiness.mockTestsCompleted}
            mockTestsTotal={readiness.mockTestsTotal}
            accuracy={readiness.accuracy}
            consistency={readiness.consistency}
            milestoneTitle={readiness.milestoneTitle}
            milestoneProgress={readiness.milestoneProgress}
            milestoneTarget={readiness.milestoneTarget}
          />

          {/* SECTION 6 — PERSONAL RECOMMENDATION */}
          <RecommendationCard
            title="Recommended for you"
            insight={recommendation.insight}
            rationale={recommendation.rationale}
            actionLabel={recommendation.actionLabel}
            actionHref={recommendation.actionHref}
          />

          {/* SECTION 7 — GOAL */}
          <GoalCard
            title="Your goal"
            goalTitle={goal.goalTitle}
            progressPercent={goal.progressPercent}
            nextStep={goal.nextStep}
            planHref={goal.planHref}
          />
        </div>
      </div>
    </div>
  );
}
