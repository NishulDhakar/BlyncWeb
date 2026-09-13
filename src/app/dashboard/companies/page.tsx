import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CompanyLogo } from "@/components/dashboard/CompanyLogo";
import { COMPANIES, companiesByRegion, isCompanyLive } from "@/data/companies";

export const metadata: Metadata = {
  title: "Companies",
  robots: { index: false },
};

function CompanyCard({ company }: { company: (typeof COMPANIES)[number] }) {
  const live = isCompanyLive(company);
  return (
    <Link
      href={`/dashboard/companies/${company.slug}`}
      className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card/40 p-4 text-center transition-colors hover:border-border"
    >
      <CompanyLogo company={company} size="md" />
      <p className="truncate text-sm font-bold text-foreground">{company.name}</p>
      <p className="text-xs text-muted-foreground">{company.assessmentLabel}</p>
      <span
        className={
          live
            ? "mt-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400"
            : "mt-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
        }
      >
        {live ? "Live now" : "Coming soon"}
      </span>
    </Link>
  );
}

export default function CompaniesPage() {
  const india = companiesByRegion("india");
  const global = companiesByRegion("global");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Companies</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {COMPANIES.length} employers whose game-based aptitude round we track. Practice the ones
          marked &ldquo;Live now&rdquo; today — the rest are being built.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-bold text-foreground">India / Campus Hiring</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {india.map((c) => (
            <CompanyCard key={c.slug} company={c} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-foreground">Global Companies</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {global.map((c) => (
            <CompanyCard key={c.slug} company={c} />
          ))}
        </div>
      </section>

      <Link
        href="/dashboard"
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowRight className="h-3.5 w-3.5 rotate-180" /> Back to dashboard
      </Link>
    </div>
  );
}
