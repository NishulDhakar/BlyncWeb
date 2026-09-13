import Link from "next/link";
import { ArrowRight, Lightbulb, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

export interface RecommendationCardProps {
  title?: string;
  insight: string;
  rationale: string;
  actionLabel: string;
  actionHref: string;
  className?: string;
}

export function RecommendationCard({
  title = "Recommended for you",
  insight,
  rationale,
  actionLabel,
  actionHref,
  className,
}: RecommendationCardProps) {
  const user = useUser();
  const isPro = user?.isPro ?? false;
  const isGameLink = actionHref.startsWith("/play/") || actionHref.startsWith("/memory-game/");
  const targetHref = !isPro && isGameLink ? "/pricing" : actionHref;
  const targetLabel = !isPro && isGameLink ? "Unlock with Pro" : actionLabel;

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card p-5 transition-all duration-150 hover:border-border hover:shadow-2xs",
        className
      )}
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
        <Lightbulb className="h-4 w-4 text-amber-500 shrink-0" />
        <span>{title}</span>
      </div>

      <p className="mt-3 text-xs font-semibold text-foreground">{insight}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{rationale}</p>

      <div className="mt-4 pt-1">
        <Link
          href={targetHref}
          className={cn(
            "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors cursor-pointer",
            !isPro && isGameLink
              ? "border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25"
              : "border-border/80 bg-secondary/50 text-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          {!isPro && isGameLink && <Lock className="h-3 w-3" />}
          <span>{targetLabel}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

