import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  title: string;
  score: number;
  timeAgo: string;
  type?: "game" | "mock";
  href?: string;
}

export interface ActivityListProps {
  activities: ActivityItem[];
  className?: string;
}

export function ActivityList({ activities, className }: ActivityListProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card p-5 transition-all duration-150 hover:border-border hover:shadow-2xs",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Recent Activity
          </h3>
          <p className="text-xs text-muted-foreground">Latest assessment attempts</p>
        </div>
        <Link
          href="/profile"
          className="text-xs font-medium text-primary hover:underline cursor-pointer"
        >
          View all
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs text-muted-foreground">
            No assessment activity recorded yet.
          </p>
          <Link
            href="/games"
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            <span>Play your first challenge</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-border/60">
          {activities.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 pr-3">
                <p className="truncate text-xs font-medium text-foreground">{item.title}</p>
                <p className="text-[11px] text-muted-foreground">{item.timeAgo}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-xs font-semibold tabular-nums text-foreground">
                  Score {item.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
