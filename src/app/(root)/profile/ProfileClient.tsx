"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { signOut } from "@/features/auth/actions";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { CandidateKpis } from "@/components/profile/CandidateKpis";
import { CognitiveMatrix } from "@/components/profile/CognitiveMatrix";
import { CompanyReadinessGrid } from "@/components/profile/CompanyReadinessGrid";
import { ScoreHistoryChart } from "@/components/profile/ScoreHistoryChart";
import { GamePerformanceTable } from "@/components/profile/GamePerformanceTable";
import { AccountPlanCard } from "@/components/profile/AccountPlanCard";
import type { ProfileStats } from "@/features/profile/actions";
import type { StreakData } from "@/features/streak/actions";
import type { User } from "@/types/user";
import type {
  CognitiveSkill,
  CompanyReadinessItem,
} from "./profile-utils";

interface Subscription {
  planType: string;
  expiresAt: Date | null;
}

interface Props {
  user: User & { isPro?: boolean };
  stats: ProfileStats;
  streak: StreakData;
  subscription: Subscription | null;
  percentile: string;
  cognitiveSkills: CognitiveSkill[];
  companyReadiness: CompanyReadinessItem[];
  averageAccuracy: number;
}

const AVAILABLE_GAMES = [
  { slug: "switch-challenge", name: "Switch Challenge" },
  { slug: "grid-challenge", name: "Grid Challenge" },
  { slug: "digit-challenge", name: "Digit Challenge" },
  { slug: "motion-challenge", name: "Motion Challenge" },
];

export default function ProfileClient({
  user,
  stats,
  streak,
  subscription,
  percentile,
  cognitiveSkills,
  companyReadiness,
  averageAccuracy,
}: Props) {
  const handleSignOut = useCallback(async () => {
    await signOut();
    window.location.href = "/";
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 max-w-4xl mx-auto flex flex-col gap-6">
      {/* ── Top Navigation Bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Dashboard</span>
        </Link>
        <span className="text-[11px] font-medium text-muted-foreground/80">
          Candidate Assessment Dossier
        </span>
      </div>

      {/* ── Candidate Profile Header ───────────────────────────────────── */}
      <ProfileHeader
        user={user}
        percentile={percentile}
        memberSince={stats.memberSince}
        onSignOut={handleSignOut}
      />

      {/* ── Candidate Performance KPIs Strip ───────────────────────────── */}
      <CandidateKpis
        rank={stats.rank}
        totalScore={stats.totalScore}
        gamesPlayed={stats.totalGamesPlayed}
        streakDays={streak.currentStreak}
        averageAccuracy={averageAccuracy}
      />

      {/* ── Cognitive Competencies Matrix ──────────────────────────────── */}
      <CognitiveMatrix skills={cognitiveSkills} />

      {/* ── Target Company Readiness ───────────────────────────────────── */}
      <CompanyReadinessGrid companies={companyReadiness} />

      {/* ── Performance Progression Chart ──────────────────────────────── */}
      <ScoreHistoryChart
        scoreHistory={stats.scoreHistory}
        availableGames={AVAILABLE_GAMES}
      />

      {/* ── Assessment Games Breakdown Table ───────────────────────────── */}
      <GamePerformanceTable gameStats={stats.gameStats} />

      {/* ── Account & Subscription Plan ────────────────────────────────── */}
      <AccountPlanCard
        isPro={Boolean(user.isPro)}
        planType={subscription?.planType}
        expiresAt={subscription?.expiresAt}
      />

      {/* ── Minimal Footer ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-4 text-xs text-muted-foreground">
        <span>CognitiveGames.me</span>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/mock-tests"
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Mock Tests
          </Link>
          <span>•</span>
          <Link
            href="/dashboard/games"
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            All Games
          </Link>
          <span>•</span>
          <Link
            href="/leaderboard"
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}

