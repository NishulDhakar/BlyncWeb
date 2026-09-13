import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GoalCardProps {
  title?: string;
  goalTitle: string;
  progressPercent: number;
  nextStep: string;
  planHref?: string;
  className?: string;
}

export function GoalCard({
  title = "Your goal",
  goalTitle = "Get placed at your target company.",
  progressPercent = 68,
  nextStep = "Complete 3 mock tests this week.",
  planHref = "/dashboard/mock-tests",
  className,
}: GoalCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card p-5 transition-all duration-150 hover:border-border hover:shadow-2xs",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Target className="h-4 w-4 text-primary shrink-0" />
          <span>{title}</span>
        </div>
        <span className="text-xs font-bold text-foreground">{progressPercent}%</span>
      </div>

      <p className="mt-3 text-xs font-medium text-foreground">{goalTitle}</p>

      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-3.5 border-t border-border/60 pt-3">
        <span className="block text-[11px] text-muted-foreground">Next priority</span>
        <p className="mt-0.5 text-xs font-medium text-foreground">{nextStep}</p>
      </div>

      <div className="mt-4 pt-1">
        <Link
          href={planHref}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
        >
          <span>View plan</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
