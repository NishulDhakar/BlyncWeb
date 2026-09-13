import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

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
          href={actionHref}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border/80 bg-secondary/50 px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
