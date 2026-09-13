import Link from "next/link";
import { Crown, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccountPlanCardProps {
  isPro: boolean;
  planType?: string;
  expiresAt?: Date | null;
  className?: string;
}

export function AccountPlanCard({
  isPro,
  planType,
  expiresAt,
  className,
}: AccountPlanCardProps) {
  const expiryStr = expiresAt
    ? `Renews ${new Date(expiresAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`
    : "Active plan";

  return (
    <div
      className={cn(
        "rounded-xl border p-4 sm:p-5 shadow-2xs transition-all",
        isPro
          ? "border-amber-500/25 bg-amber-500/[0.03] dark:bg-amber-500/[0.03]"
          : "border-border/60 bg-card",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
              isPro
                ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                : "border-border/60 bg-muted/40 text-muted-foreground"
            )}
          >
            {isPro ? <Crown className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-foreground">
                {isPro
                  ? `Pro Student Plan (${planType === "biannual" ? "6 Months" : "Monthly"})`
                  : "Free Candidate Tier"}
              </h3>
              <span
                className={cn(
                  "rounded px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider",
                  isPro
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    : "bg-muted text-muted-foreground border border-border/50"
                )}
              >
                {isPro ? "Active" : "Standard"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isPro
                ? expiryStr
                : "Standard aptitude drills. Upgrade for full company mock tests."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/pricing"
            className={cn(
              "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors cursor-pointer",
              isPro
                ? "border border-border/60 bg-card text-foreground hover:bg-muted/60 shadow-2xs"
                : "border border-transparent bg-foreground text-background hover:bg-foreground/90"
            )}
          >
            {isPro ? (
              <span>Manage Plan</span>
            ) : (
              <>
                <Zap className="h-3 w-3 text-amber-400" />
                <span>Upgrade to Pro</span>
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}

