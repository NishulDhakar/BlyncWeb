import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { CompanyLogo } from "@/components/dashboard/CompanyLogo";
import type { CompanyReadinessItem } from "@/app/(root)/profile/profile-utils";
import { cn } from "@/lib/utils";

export interface CompanyReadinessGridProps {
  companies: CompanyReadinessItem[];
  className?: string;
}

export function CompanyReadinessGrid({
  companies,
  className,
}: CompanyReadinessGridProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card p-4 sm:p-5 shadow-2xs",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary shrink-0" />
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Target Company Readiness
          </h2>
        </div>
        <Link
          href="/dashboard/companies"
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          All employers →
        </Link>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Preparation readiness benchmarks for employer aptitude rounds.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {companies.map((c) => (
          <Link
            key={c.company.slug}
            href={`/dashboard/companies/${c.company.slug}`}
            className="group flex flex-col justify-between rounded-lg border border-border/40 bg-muted/20 p-3 transition-colors hover:border-border/80 hover:bg-muted/40 cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-2.5">
                <CompanyLogo company={c.company} size="sm" />
                <div className="min-w-0 flex-1">
                  <span className="truncate block text-xs font-semibold text-foreground">
                    {c.company.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {c.qualifiedGames}/{c.totalGames} rounds
                  </span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Readiness</span>
                <span className="font-semibold tabular-nums text-foreground">
                  {c.readinessScore}%
                </span>
              </div>

              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted/70">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${c.readinessScore}%` }}
                />
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors">
              <span>View tests</span>
              <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

