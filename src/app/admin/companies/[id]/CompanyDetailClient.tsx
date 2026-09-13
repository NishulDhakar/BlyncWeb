"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2, Gamepad2, FileCheck2, Globe, ExternalLink, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CompanyDetailClientProps {
  data: {
    company: {
      id: string;
      slug: string;
      name: string;
      logo: string | null;
      website: string | null;
      description: string | null;
      assessmentType: string | null;
      status: string;
      region: string | null;
      monogram: string | null;
      accent: string | null;
    };
    games: any[];
    mockTests: any[];
    stats: {
      totalAttempts: number;
      averageScore: number;
      gamesCount: number;
      mockTestsCount: number;
    };
  };
}

export function CompanyDetailClient({ data }: CompanyDetailClientProps) {
  const { company, games, mockTests, stats } = data;

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/companies"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Companies
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-xl border border-border/80 bg-card p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border/80 bg-muted/30 p-2 overflow-hidden relative shrink-0">
            {company.logo ? (
              <Image
                src={company.logo}
                alt={company.name}
                width={56}
                height={56}
                className="object-contain"
              />
            ) : (
              <span className="font-bold text-base text-foreground font-mono">
                {company.monogram || company.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">{company.name}</h1>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                  company.status === "active"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {company.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{company.assessmentType || "Cognitive Assessment"}</span>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <Globe className="h-3 w-3" /> Website
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/${company.slug}`} target="_blank">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
              <ExternalLink className="h-3.5 w-3.5" /> View Public Page
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs text-xs">
          <span className="text-muted-foreground block text-[11px]">Associated Games</span>
          <span className="text-xl font-bold font-mono text-foreground mt-1 block">
            {stats.gamesCount}
          </span>
        </div>
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs text-xs">
          <span className="text-muted-foreground block text-[11px]">Mock Assessments</span>
          <span className="text-xl font-bold font-mono text-foreground mt-1 block">
            {stats.mockTestsCount}
          </span>
        </div>
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs text-xs">
          <span className="text-muted-foreground block text-[11px]">Total Student Attempts</span>
          <span className="text-xl font-bold font-mono text-foreground mt-1 block">
            {stats.totalAttempts.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs text-xs">
          <span className="text-muted-foreground block text-[11px]">Average Score</span>
          <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
            {stats.averageScore}
          </span>
        </div>
      </div>

      {/* Games & Mock Tests Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Games Table */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Gamepad2 className="h-3.5 w-3.5" /> Included Cognitive Games ({games.length})
            </h3>
            <Link
              href="/admin/games"
              className="text-xs text-primary hover:underline"
            >
              Manage all games
            </Link>
          </div>

          {games.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No games assigned to this company yet
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {games.map((g) => (
                <div key={g.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-foreground block">
                      {g.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground capitalize">
                      {g.difficulty} · {g.duration || "3-5 min"}
                    </span>
                  </div>
                  <Link
                    href={`/play/${g.slug}`}
                    target="_blank"
                    className="text-primary hover:underline text-[11px]"
                  >
                    Test Game →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mock Tests Table */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileCheck2 className="h-3.5 w-3.5" /> Mock Assessments ({mockTests.length})
            </h3>
            <Link
              href="/admin/mock-tests"
              className="text-xs text-primary hover:underline"
            >
              Manage mock tests
            </Link>
          </div>

          {mockTests.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No full mock assessment created for this company yet
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {mockTests.map((m) => (
                <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-foreground block">
                      {m.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {m.timeLimit} mins · Pass: {m.passingScore}%
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    {m.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
