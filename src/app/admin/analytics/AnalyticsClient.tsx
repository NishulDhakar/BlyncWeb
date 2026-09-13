"use client";

import React, { useState } from "react";
import { MetricCard } from "@/components/admin/MetricCard";
import type { AnalyticsData } from "@/features/admin/analyticsActions";
import {
  Users,
  Activity,
  UserCheck,
  TrendingUp,
  Percent,
  Gamepad2,
  Building2,
  IndianRupee,
  Calendar,
  Layers,
} from "lucide-react";

export function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const [activeTab, setActiveTab] = useState<"users" | "revenue" | "games" | "companies">("users");
  const { userStats, revenueStats, gameAnalytics, companyAnalytics } = data;

  const totalGameAttempts = gameAnalytics.reduce((sum, g) => sum + g.attempts, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Platform Business Intelligence
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified database analytics across user engagement, monetization, game challenges, and company practice.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-lg border border-border/80 bg-muted/40 p-0.5 text-xs font-medium">
          <button
            onClick={() => setActiveTab("users")}
            className={`rounded-md px-3 py-1.5 transition-colors cursor-pointer ${
              activeTab === "users"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("revenue")}
            className={`rounded-md px-3 py-1.5 transition-colors cursor-pointer ${
              activeTab === "revenue"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setActiveTab("games")}
            className={`rounded-md px-3 py-1.5 transition-colors cursor-pointer ${
              activeTab === "games"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Games
          </button>
          <button
            onClick={() => setActiveTab("companies")}
            className={`rounded-md px-3 py-1.5 transition-colors cursor-pointer ${
              activeTab === "companies"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Companies
          </button>
        </div>
      </div>

      {/* Tab 1: User Analytics */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              label="Daily Active Users (DAU)"
              value={userStats.dau.toLocaleString("en-IN")}
              subtext="Active in last 24 hours"
              icon={Activity}
            />
            <MetricCard
              label="Weekly Active Users (WAU)"
              value={userStats.wau.toLocaleString("en-IN")}
              subtext="Active in last 7 days"
              icon={Users}
            />
            <MetricCard
              label="Monthly Active Users (MAU)"
              value={userStats.mau.toLocaleString("en-IN")}
              subtext="Active in last 30 days"
              icon={UserCheck}
            />
            <MetricCard
              label="Total User Base"
              value={userStats.totalUsers.toLocaleString("en-IN")}
              subtext="All registered accounts"
              icon={Users}
            />
            <MetricCard
              label="Activation Rate"
              value={`${userStats.activationRate}%`}
              subtext="Registered users who played ≥ 1 game"
              icon={Percent}
            />
            <MetricCard
              label="DAU / MAU Stickiness"
              value={`${userStats.retentionRate}%`}
              subtext="Platform engagement ratio"
              icon={Layers}
            />
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              User Activity Distribution
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="rounded-lg border border-border/60 p-3 bg-muted/20">
                <span className="text-muted-foreground block text-[11px] font-sans">
                  Active in 24h
                </span>
                <span className="text-xl font-bold text-foreground mt-1 block">
                  {userStats.dau}
                </span>
                <span className="text-[10px] text-muted-foreground font-sans">
                  {((userStats.dau / Math.max(1, userStats.mau)) * 100).toFixed(1)}% of monthly active
                </span>
              </div>
              <div className="rounded-lg border border-border/60 p-3 bg-muted/20">
                <span className="text-muted-foreground block text-[11px] font-sans">
                  Active in 7 Days
                </span>
                <span className="text-xl font-bold text-foreground mt-1 block">
                  {userStats.wau}
                </span>
                <span className="text-[10px] text-muted-foreground font-sans">
                  {((userStats.wau / Math.max(1, userStats.mau)) * 100).toFixed(1)}% of monthly active
                </span>
              </div>
              <div className="rounded-lg border border-border/60 p-3 bg-muted/20">
                <span className="text-muted-foreground block text-[11px] font-sans">
                  Inactive Students
                </span>
                <span className="text-xl font-bold text-muted-foreground mt-1 block">
                  {(userStats.totalUsers - userStats.mau).toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-muted-foreground font-sans">
                  Candidate pool for email broadcast re-engagement
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Revenue Analytics */}
      {activeTab === "revenue" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              label="Gross Collected Revenue"
              value={`₹${revenueStats.grossRevenueINR.toLocaleString("en-IN")}`}
              subtext={`Refunds: ₹${revenueStats.refundsINR.toLocaleString("en-IN")}`}
              icon={IndianRupee}
            />
            <MetricCard
              label="Net Retained Revenue"
              value={`₹${revenueStats.netRevenueINR.toLocaleString("en-IN")}`}
              subtext="Gross minus processed refunds"
              icon={TrendingUp}
            />
            <MetricCard
              label="Monthly Recurring Revenue (MRR)"
              value={`₹${revenueStats.mrrINR.toLocaleString("en-IN")}`}
              subtext="From active auto-renewing subscriptions"
              icon={TrendingUp}
            />
            <MetricCard
              label="Annual Runrate (ARR)"
              value={`₹${revenueStats.arrINR.toLocaleString("en-IN")}`}
              subtext="Normalized 12-month projection"
              icon={TrendingUp}
            />
            <MetricCard
              label="Free-to-Paid Conversion"
              value={`${revenueStats.conversionRate}%`}
              subtext="Pro subscribers / Total users"
              icon={Percent}
            />
            <MetricCard
              label="Subscriber Churn Rate"
              value={`${revenueStats.churnRate}%`}
              subtext="Cancelled / Total churn base"
              icon={Activity}
            />
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Monetization Model Health
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              CognitiveGames.me runs on two recurring tier structures: Monthly Pro (₹49/month) and Biannual Pro (₹199/6 months). Payments are processed and auto-renewed directly via Razorpay Subscriptions.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Game Analytics */}
      {activeTab === "games" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Cognitive Game Challenge Popularity & Performance
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Total attempts recorded: {totalGameAttempts.toLocaleString("en-IN")}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border/60 text-[11px] text-muted-foreground uppercase font-semibold">
                    <th className="py-2.5">Game Name</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5 text-right">Total Attempts</th>
                    <th className="py-2.5">Volume Distribution</th>
                    <th className="py-2.5 text-right">Avg Score</th>
                    <th className="py-2.5 text-right">High Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {gameAnalytics.map((g) => {
                    const maxAttempts = Math.max(...gameAnalytics.map((x) => x.attempts), 1);
                    const pct = Math.min(100, (g.attempts / maxAttempts) * 100);

                    return (
                      <tr key={g.gameId} className="hover:bg-muted/30">
                        <td className="py-2.5 font-semibold text-foreground">
                          {g.gameName}
                        </td>
                        <td className="py-2.5 capitalize text-muted-foreground font-medium">
                          {g.category}
                        </td>
                        <td className="py-2.5 text-right font-mono font-bold text-foreground">
                          {g.attempts.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2.5 w-48">
                          <div className="w-full bg-muted/40 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-2.5 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          {g.avgScore}
                        </td>
                        <td className="py-2.5 text-right font-mono text-muted-foreground">
                          {g.maxScore}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Company Analytics */}
      {activeTab === "companies" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Most Practiced Employer Placement Assessments
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Student preparation volume grouped by hiring company
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border/60 text-[11px] text-muted-foreground uppercase font-semibold">
                    <th className="py-2.5">Company</th>
                    <th className="py-2.5 text-center">Rounds</th>
                    <th className="py-2.5 text-right">Practice Attempts</th>
                    <th className="py-2.5">Demand Share</th>
                    <th className="py-2.5 text-right">Average Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {companyAnalytics.map((c) => {
                    const maxComp = Math.max(...companyAnalytics.map((x) => x.totalAttempts), 1);
                    const pct = Math.min(100, (c.totalAttempts / maxComp) * 100);

                    return (
                      <tr key={c.companySlug} className="hover:bg-muted/30">
                        <td className="py-2.5 font-semibold text-foreground">
                          {c.companyName}
                        </td>
                        <td className="py-2.5 text-center font-mono text-muted-foreground">
                          {c.gamesCount}
                        </td>
                        <td className="py-2.5 text-right font-mono font-bold text-foreground">
                          {c.totalAttempts.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2.5 w-48">
                          <div className="w-full bg-muted/40 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sky-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-2.5 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          {c.avgScore}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
