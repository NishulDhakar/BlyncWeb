"use client";

import React, { useState } from "react";
import { MetricCard } from "@/components/admin/MetricCard";
import {
  Users,
  UserPlus,
  Activity,
  Crown,
  IndianRupee,
  TrendingUp,
  Gamepad2,
  FileCheck2,
  Percent,
  CreditCard,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import type {
  OverviewMetrics,
  RevenuePoint,
  UserGrowthPoint,
  ActivityItem,
} from "@/features/admin/overviewActions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface OverviewClientProps {
  initialData: {
    metrics: OverviewMetrics;
    revenuePoints: RevenuePoint[];
    userGrowthPoints: UserGrowthPoint[];
    activity: ActivityItem[];
  };
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function OverviewClient({ initialData }: OverviewClientProps) {
  const { metrics, revenuePoints, userGrowthPoints, activity } = initialData;
  const [revenueRange, setRevenueRange] = useState<"7d" | "30d" | "90d" | "12m">("30d");
  const [growthRange, setGrowthRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  const formatRupees = (paise: number) => {
    return "₹" + (paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Platform Overview
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time business performance, user engagement, and revenue analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/users">
            <Button size="sm" variant="outline" className="h-8 text-xs cursor-pointer">
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/broadcast">
            <Button size="sm" className="h-8 text-xs gap-1.5 cursor-pointer">
              <Sparkles className="h-3.5 w-3.5" />
              New Broadcast
            </Button>
          </Link>
        </div>
      </div>

      {/* 9 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label="Total Registered Users"
          value={metrics.totalUsers.toLocaleString("en-IN")}
          change={metrics.newUsersGrowth}
          changeLabel="vs prior month"
          icon={Users}
        />
        <MetricCard
          label="New Users (Last 30D)"
          value={metrics.newUsersMonth.toLocaleString("en-IN")}
          subtext={`${((metrics.newUsersMonth / Math.max(1, metrics.totalUsers)) * 100).toFixed(1)}% of total platform base`}
          icon={UserPlus}
        />
        <MetricCard
          label="Active Users (Last 30D)"
          value={metrics.activeUsers30d.toLocaleString("en-IN")}
          subtext="Played at least 1 cognitive test"
          icon={Activity}
        />
        <MetricCard
          label="Pro Subscribers"
          value={metrics.proSubscribers.toLocaleString("en-IN")}
          subtext="Active premium access"
          icon={Crown}
        />
        <MetricCard
          label="Gross Revenue"
          value={formatRupees(metrics.grossRevenuePaise)}
          subtext={`Net: ${formatRupees(metrics.netRevenuePaise)} (Refunds: ${formatRupees(metrics.refundedRevenuePaise)})`}
          icon={IndianRupee}
        />
        <MetricCard
          label="Current MRR"
          value={formatRupees(metrics.mrrPaise)}
          subtext="Normalized monthly recurring"
          icon={TrendingUp}
        />
        <MetricCard
          label="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          subtext="Pro subscribers / Total users"
          icon={Percent}
        />
        <MetricCard
          label="Total Games Played"
          value={metrics.gamesPlayed.toLocaleString("en-IN")}
          subtext="Across all cognitive challenge rounds"
          icon={Gamepad2}
        />
        <MetricCard
          label="Mock Tests Completed"
          value={
            metrics.mockTestsCompleted > 0
              ? metrics.mockTestsCompleted.toLocaleString("en-IN")
              : "0"
          }
          subtext="Capgemini, Cognizant, Accenture"
          icon={FileCheck2}
        />
      </div>

      {/* Charts & Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Growth Overview (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Performance Card */}
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Revenue Breakdown
                </h3>
                <p className="text-xs text-muted-foreground">
                  Captured transactions and subscription cashflow
                </p>
              </div>

              <div className="flex items-center rounded-lg border border-border/70 bg-muted/40 p-0.5 text-xs">
                {(["7d", "30d", "90d", "12m"] as const).map((rng) => (
                  <button
                    key={rng}
                    onClick={() => setRevenueRange(rng)}
                    className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                      revenueRange === rng
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {rng.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Revenue Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-y border-border/60 py-3 mb-4 text-xs font-mono">
              <div>
                <span className="text-muted-foreground block text-[11px] font-sans">
                  Gross Revenue
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {formatRupees(metrics.grossRevenuePaise)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px] font-sans">
                  Refunds
                </span>
                <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                  {formatRupees(metrics.refundedRevenuePaise)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px] font-sans">
                  Net Revenue
                </span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatRupees(metrics.netRevenuePaise)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px] font-sans">
                  Monthly MRR
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {formatRupees(metrics.mrrPaise)}
                </span>
              </div>
            </div>

            {/* Visual Bars for Recent Days */}
            <div className="space-y-2">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                Daily Trend (Recent Days)
              </span>
              {revenuePoints.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No captured payment events in this interval
                </div>
              ) : (
                <div className="space-y-1.5">
                  {revenuePoints.slice(-7).map((pt) => {
                    const maxGross = Math.max(...revenuePoints.map((p) => p.gross), 1);
                    const pct = Math.min(100, Math.max(10, (pt.gross / maxGross) * 100));
                    return (
                      <div key={pt.date} className="flex items-center gap-3 text-xs">
                        <span className="w-20 shrink-0 font-mono text-muted-foreground text-[11px]">
                          {pt.date}
                        </span>
                        <div className="flex-1 bg-muted/40 h-5 rounded-md overflow-hidden relative flex items-center px-2">
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-primary/20 rounded-md"
                            style={{ width: `${pct}%` }}
                          />
                          <span className="relative z-10 font-mono text-[11px] font-medium text-foreground">
                            ₹{pt.gross.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex justify-end">
              <Link
                href="/admin/payments"
                className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                View full payment ledger <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* User Signups Trend */}
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  User Acquisition Trend
                </h3>
                <p className="text-xs text-muted-foreground">
                  Daily student registrations over the past 30 days
                </p>
              </div>
              <div className="flex items-center rounded-lg border border-border/70 bg-muted/40 p-0.5 text-xs">
                {(["7d", "30d", "90d", "1y"] as const).map((rng) => (
                  <button
                    key={rng}
                    onClick={() => setGrowthRange(rng)}
                    className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                      growthRange === rng
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {rng.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              {userGrowthPoints.slice(-7).map((pt) => {
                const maxUsers = Math.max(...userGrowthPoints.map((p) => p.newUsers), 1);
                const pct = Math.min(100, Math.max(12, (pt.newUsers / maxUsers) * 100));
                return (
                  <div key={pt.date} className="flex items-center gap-3 text-xs">
                    <span className="w-20 shrink-0 font-mono text-muted-foreground text-[11px]">
                      {pt.date}
                    </span>
                    <div className="flex-1 bg-muted/40 h-5 rounded-md overflow-hidden relative flex items-center px-2">
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-emerald-500/20 rounded-md"
                        style={{ width: `${pct}%` }}
                      />
                      <span className="relative z-10 font-mono text-[11px] font-medium text-foreground">
                        +{pt.newUsers} users
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Activity Feed (1 Col) */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Recent Activity
                </h3>
                <p className="text-xs text-muted-foreground">
                  Live operational events from database
                </p>
              </div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="divide-y divide-border/60">
              {activity.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No activity recorded yet
                </div>
              ) : (
                activity.map((act) => (
                  <div key={act.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="font-medium text-foreground truncate">
                        {act.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate font-mono">
                        {act.subtitle}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {act.amount && (
                        <div className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                          {act.amount}
                        </div>
                      )}
                      <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {timeAgo(act.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-border/60">
              <Link
                href="/admin/audit-logs"
                className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                View system audit logs <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Quick Access Control */}
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Direct Controls
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/admin/companies"
                className="flex items-center gap-2 rounded-lg border border-border/60 p-2.5 hover:bg-muted/40 transition-colors"
              >
                <div className="h-2 w-2 rounded-full bg-sky-500" />
                <span className="font-medium">Companies</span>
              </Link>
              <Link
                href="/admin/games"
                className="flex items-center gap-2 rounded-lg border border-border/60 p-2.5 hover:bg-muted/40 transition-colors"
              >
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="font-medium">Games</span>
              </Link>
              <Link
                href="/admin/mock-tests"
                className="flex items-center gap-2 rounded-lg border border-border/60 p-2.5 hover:bg-muted/40 transition-colors"
              >
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="font-medium">Mock Tests</span>
              </Link>
              <Link
                href="/admin/support"
                className="flex items-center gap-2 rounded-lg border border-border/60 p-2.5 hover:bg-muted/40 transition-colors"
              >
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="font-medium">Support</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
