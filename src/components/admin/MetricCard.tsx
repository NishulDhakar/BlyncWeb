import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number; // e.g. +8.4 or -2.1
  changeLabel?: string; // e.g. "vs last month"
  subtext?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function MetricCard({
  label,
  value,
  change,
  changeLabel,
  subtext,
  icon: Icon,
  className,
}: MetricCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card p-5 text-card-foreground shadow-xs transition-colors hover:border-border",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted/60 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-2xl font-semibold tracking-tight text-foreground font-mono">
          {value}
        </div>
      </div>

      {(change !== undefined || subtext) && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          {change !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium tabular-nums",
                isPositive && "text-emerald-600 dark:text-emerald-400",
                isNegative && "text-rose-600 dark:text-rose-400",
                isNeutral && "text-muted-foreground"
              )}
            >
              {isPositive && <ArrowUpRight className="h-3.5 w-3.5" />}
              {isNegative && <ArrowDownRight className="h-3.5 w-3.5" />}
              {isNeutral && <Minus className="h-3.5 w-3.5" />}
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
          )}
          {changeLabel && (
            <span className="text-muted-foreground">{changeLabel}</span>
          )}
          {subtext && !changeLabel && (
            <span className="text-muted-foreground">{subtext}</span>
          )}
        </div>
      )}
    </div>
  );
}
