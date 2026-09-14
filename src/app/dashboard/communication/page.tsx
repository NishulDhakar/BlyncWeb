import type { Metadata } from "next";
import Link from "next/link";
import {
  Mic,
  Headphones,
  BookOpen,
  FileText,
  MessageSquare,
  ArrowRight,
  Clock,
  Sparkles,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { gamesInCategory, playHref } from "@/games/registry";

export const metadata: Metadata = {
  title: "Communication | Blync Dashboard",
  description:
    "Practice speaking, listening, grammar, and spoken response rounds used by Cognizant, Capgemini, and top tech recruiters.",
  robots: { index: false },
};

const MODULE_META: Record<
  string,
  {
    icon: typeof Mic;
    section: string;
    target: string;
  }
> = {
  "read-aloud": {
    icon: Mic,
    section: "Section 1",
    target: "Pacing & Pronunciation",
  },
  "listen-and-repeat": {
    icon: Headphones,
    section: "Section 2",
    target: "Verbal Working Memory",
  },
  "grammar-round": {
    icon: BookOpen,
    section: "Section 3",
    target: "Sentence Correction",
  },
  "comprehension-round": {
    icon: FileText,
    section: "Section 4",
    target: "Listening Comprehension",
  },
  "open-response": {
    icon: MessageSquare,
    section: "Section 5",
    target: "Spoken Response",
  },
};

export default function CommunicationDashboardPage() {
  const commGames = gamesInCategory("communication");

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span>Assessment Prep</span>
            <span>•</span>
            <span className="text-primary font-semibold">5 Modules</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Communication
          </h1>
          <p className="mt-1 text-xs text-muted-foreground max-w-xl">
            Practice the official 5-part spoken English, listening, and grammar assessment
            format evaluated by Cognizant, Capgemini, and top recruiters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/companies/cognizant"
            className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors shadow-2xs"
          >
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Cognizant</span>
          </Link>
          <Link
            href="/dashboard/companies/capgemini"
            className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors shadow-2xs"
          >
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Capgemini</span>
          </Link>
        </div>
      </div>

      {/* ── Modules Grid ───────────────────────────────────────────────── */}
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Assessment Rounds
            </h2>
            <p className="text-xs text-muted-foreground">
              All questions run locally in your browser with real-time speech processing.
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {commGames.length} rounds available
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {commGames.map((game) => {
            const meta = MODULE_META[game.slug] || {
              icon: Mic,
              section: "Round",
              target: "Communication",
            };
            const Icon = meta.icon;

            return (
              <div
                key={game.slug}
                className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 transition-all duration-150 hover:border-border hover:shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/40 text-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="rounded border border-border/80 bg-muted/30 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {meta.section}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{game.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {game.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {game.tagline}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border/50 pt-2.5">
                    {game.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="rounded border border-border/60 bg-muted/25 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-1">
                  <Link
                    href={playHref(game)}
                    className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-border/80 bg-secondary/50 px-3 text-xs font-medium text-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                  >
                    <span>Start Practice</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Minimal Exam Tips ───────────────────────────────────────────── */}
      <div className="rounded-xl border border-border/80 bg-card p-5 shadow-2xs">
        <h3 className="text-sm font-semibold tracking-tight text-foreground mb-3">
          Quick Exam Guidelines
        </h3>
        <div className="grid grid-cols-1 gap-4 text-xs text-muted-foreground md:grid-cols-3">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Quiet Environment</p>
              <p className="mt-0.5 text-muted-foreground">
                Ensure low background noise and allow microphone access when prompted.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Natural Pace</p>
              <p className="mt-0.5 text-muted-foreground">
                Speak steadily without rushing. Clear pronunciation scores higher than speed.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Privacy Guaranteed</p>
              <p className="mt-0.5 text-muted-foreground">
                Speech recognition runs directly in your browser. No voice recordings are stored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
