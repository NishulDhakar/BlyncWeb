import Link from "next/link";
import { ArrowRight, Clock, Crown, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

export interface GameCardProps {
  slug: string;
  name: string;
  duration: string;
  accuracy: number;
  lastPlayed?: string;
  href: string;
  attempts?: number;
  icon: LucideIcon;
  className?: string;
}

export function GameCard({
  name,
  duration,
  accuracy,
  lastPlayed,
  href,
  attempts = 0,
  icon: Icon,
  className,
}: GameCardProps) {
  const user = useUser();
  const isPro = user?.isPro ?? false;

  return (
    <div
      className={cn(
        "group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 transition-all duration-150 hover:border-border hover:shadow-2xs",
        className
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/40 text-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{duration}</span>
            </div>
            <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide flex items-center gap-0.5">
              <Crown className="h-2.5 w-2.5" />
              Pro
            </span>
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/50 pt-2.5 text-xs">
          <div>
            <span className="block text-[11px] text-muted-foreground">Accuracy</span>
            <span className="font-semibold text-foreground">{accuracy}%</span>
          </div>
          <div className="text-right">
            <span className="block text-[11px] text-muted-foreground">Last played</span>
            <span className="truncate font-medium text-muted-foreground">
              {lastPlayed || "Not played"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-1">
        <Link
          href={isPro ? href : "/pricing"}
          className={cn(
            "inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors cursor-pointer",
            isPro
              ? "border-border/80 bg-secondary/50 text-foreground hover:bg-secondary hover:text-foreground"
              : "border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25"
          )}
        >
          {!isPro && <Lock className="h-3 w-3" />}
          <span>{isPro ? (attempts > 0 ? "Continue" : "Start") : "Unlock with Pro"}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
