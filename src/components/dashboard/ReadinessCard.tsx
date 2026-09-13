import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReadinessCardProps {
  score: number; // e.g. 68
  gamesCompleted: number;
  gamesTotal: number;
  mockTestsCompleted: number;
  mockTestsTotal: number;
  accuracy: number;
  consistency: string;
  milestoneTitle: string;
  milestoneProgress: number; // e.g. 2
  milestoneTarget: number; // e.g. 5
  className?: string;
}

export function ReadinessCard({
  score = 68,
  gamesCompleted = 12,
  gamesTotal = 20,
  mockTestsCompleted = 5,
  mockTestsTotal = 10,
  accuracy = 87,
  consistency = "Good",
  milestoneTitle = "Complete 5 more games",
  milestoneProgress = 2,
  milestoneTarget = 5,
  className,
}: ReadinessCardProps) {
  const milestonePercent = Math.min(
    100,
    Math.round((milestoneProgress / milestoneTarget) * 100)
  );

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card p-5 transition-all duration-150 hover:border-border hover:shadow-2xs",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          Placement Readiness
        </h3>
        <span className="text-xs font-medium text-muted-foreground">Overall</span>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-extrabold tracking-tight text-foreground">
          {score}%
        </span>
        <span className="text-xs text-muted-foreground">benchmark ready</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-y border-border/60 py-3 text-xs">
        <div>
          <span className="block text-[11px] text-muted-foreground">Games</span>
          <span className="font-semibold text-foreground">
            {gamesCompleted} / {gamesTotal}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-muted-foreground">Mock Tests</span>
          <span className="font-semibold text-foreground">
            {mockTestsCompleted} / {mockTestsTotal}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-muted-foreground">Accuracy</span>
          <span className="font-semibold text-foreground">{accuracy}%</span>
        </div>
        <div>
          <span className="block text-[11px] text-muted-foreground">Consistency</span>
          <span className="font-semibold text-foreground">{consistency}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Next milestone</span>
          <span className="font-medium text-foreground">
            {milestoneProgress} / {milestoneTarget}
          </span>
        </div>
        <p className="mt-1 text-xs font-medium text-foreground">{milestoneTitle}</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${milestonePercent}%` }}
          />
        </div>
      </div>

      <div className="mt-5 pt-1">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
        >
          <span>View progress</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
