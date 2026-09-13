import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  className?: string;
}

export function MetricCard({
  label,
  value,
  change,
  trend = "up",
  icon: Icon,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 transition-all duration-150 hover:border-border hover:shadow-2xs",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
        {change && (
          <span
            className={cn(
              "text-[11px] font-medium tracking-tight",
              trend === "up" && "text-emerald-600 dark:text-emerald-400",
              trend === "down" && "text-rose-600 dark:text-rose-400",
              trend === "neutral" && "text-muted-foreground"
            )}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
