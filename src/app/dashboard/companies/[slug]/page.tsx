import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { CompanyLogo } from "@/components/dashboard/CompanyLogo";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
import { COMPANIES, getCompany, inferSkills, isCompanyLive } from "@/data/companies";
import { gamesForCompany, playHref } from "@/games/registry";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompany(slug);
  return { title: company?.name ?? "Company", robots: { index: false } };
}

export default async function CompanyDetailPage({ params }: Props) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) notFound();

  const live = isCompanyLive(company);
  const registryGames = company.registrySlug ? gamesForCompany(company.registrySlug) : [];
  const skills = inferSkills(company.games);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/companies"
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All companies
      </Link>

      <div className="flex flex-col items-start gap-4 rounded-2xl border border-border/60 bg-card/40 p-6 sm:flex-row sm:items-center">
        <CompanyLogo company={company} size="lg" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{company.name}</h1>
          <p className="text-sm text-muted-foreground">{company.assessmentLabel}</p>
        </div>
        <span
          className={
            live
              ? "ml-auto rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400"
              : "ml-auto rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground"
          }
        >
          {live ? "Live now" : "Coming soon"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-bold text-foreground">🎮 Games</h2>
          {live ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {registryGames.map((game) => (
                <Link
                  key={game.slug}
                  href={playHref(game)}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 px-4 py-3 transition-colors hover:border-border"
                >
                  <div>
                    <p className="text-sm font-bold text-foreground">{game.name}</p>
                    <p className="text-xs text-muted-foreground">{game.duration}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </Link>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap gap-2">
                {company.games.map((game) => (
                  <span
                    key={game}
                    className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {game}
                  </span>
                ))}
              </div>
              <ComingSoon
                title={`${company.name} practice is coming soon`}
                description="We're building playable games for this assessment. Practice a live company below in the meantime."
                backHref="/dashboard/companies"
                backLabel="Browse live companies"
              />
            </>
          )}
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
          <h2 className="mb-3 text-sm font-bold text-foreground">🧠 Skills Tested</h2>
          <ul className="flex flex-col gap-2">
            {skills.map((skill) => (
              <li
                key={skill}
                className="rounded-lg bg-muted/30 px-3 py-2 text-sm font-medium text-foreground"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
