import Image from "next/image";
import { cn } from "@/lib/utils";
import type { CompanyAccent, CompanyEntry } from "@/data/companies";

/**
 * Square company badge: a real logo asset when one exists in /public,
 * otherwise a monogram tile in the company's accent color. Most companies in
 * the directory have no logo asset (see src/data/companies.ts), so the
 * monogram is the common case, not a fallback for edge cases.
 */

const ACCENT_STYLE: Record<CompanyAccent, string> = {
  purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  sky: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  slate: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  indigo: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  rose: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  teal: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  orange: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  fuchsia: "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30",
  lime: "bg-lime-500/15 text-lime-400 border-lime-500/30",
  violet: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  pink: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  yellow: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  red: "bg-red-500/15 text-red-400 border-red-500/30",
  green: "bg-green-500/15 text-green-400 border-green-500/30",
};

const SIZE_STYLE = {
  sm: "h-9 w-9 rounded-lg text-xs",
  md: "h-12 w-12 rounded-xl text-sm",
  lg: "h-16 w-16 rounded-2xl text-base",
} as const;

export function CompanyLogo({
  company,
  size = "md",
  className,
}: {
  company: Pick<CompanyEntry, "name" | "monogram" | "accent" | "logo">;
  size?: keyof typeof SIZE_STYLE;
  className?: string;
}) {
  if (company.logo) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl border border-border/70 bg-white dark:bg-muted/20 p-1.5 shadow-2xs",
          SIZE_STYLE[size],
          className
        )}
      >
        <Image
          src={company.logo}
          alt={`${company.name} logo`}
          fill
          className="object-contain p-1"
          sizes="64px"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center border font-black leading-none tracking-tight",
        ACCENT_STYLE[company.accent],
        SIZE_STYLE[size],
        className
      )}
      aria-hidden="true"
    >
      {company.monogram}
    </div>
  );
}
