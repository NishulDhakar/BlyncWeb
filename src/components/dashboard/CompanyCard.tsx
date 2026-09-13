import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompanyLogo } from "@/components/dashboard/CompanyLogo";
import type { CompanyEntry } from "@/data/companies";

export interface CompanyCardProps {
  company: CompanyEntry;
  totalGames: number;
  completedGames: number;
  href?: string;
  className?: string;
}

export function CompanyCard({
  company,
  totalGames,
  completedGames,
  href,
  className,
}: CompanyCardProps) {
  const percent = totalGames > 0 ? Math.min(100, Math.round((completedGames / totalGames) * 100)) : 0;
  const targetHref = href || `/dashboard/companies/${company.slug}`;

  return (
    <div
      className={cn(
        "group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 transition-all duration-150 hover:border-border hover:shadow-2xs",
        className
      )}
    >
      <div>
        <div className="flex items-center gap-3">
          <CompanyLogo company={company} size="sm" />
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-semibold tracking-tight text-foreground">
              {company.name}
            </h4>
            <p className="truncate text-xs text-muted-foreground">
              {totalGames} {totalGames === 1 ? "game" : "games"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">
              {completedGames} / {totalGames} completed
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-1">
        <Link
          href={targetHref}
          className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-border/70 bg-muted/30 px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
        >
          <span>Practice</span>
          <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
