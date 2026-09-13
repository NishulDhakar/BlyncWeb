import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Gauge, Play, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getGame, liveGames, playHref, relatedGames, seoHref } from "@/games/registry";
import {
  breadcrumbSchema,
  faqSchema,
  gameLandingMetadata,
  gameSchema,
} from "@/games/seo";

/**
 * The indexable landing page for a single game — the page that has to rank.
 *
 * Everything on it comes from the registry entry, so the copy, the keywords,
 * the FAQ and the structured data cannot drift apart the way they did when
 * each page carried its own hardcoded metadata block.
 *
 * Statically generated: `generateStaticParams` enumerates every live game and
 * nothing here reads cookies, headers, or the database, so each page is
 * prerendered HTML at build time rather than server-rendered per request.
 */

type Props = { params: Promise<{ category: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return liveGames().map((game) => ({ category: game.category, slug: game.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const game = getGame(slug);
  if (!game || game.category !== category) return {};
  return gameLandingMetadata(slug);
}

export default async function GameLandingPage({ params }: Props) {
  const { category, slug } = await params;

  const game = getGame(slug);
  if (!game || game.category !== category || game.comingSoon) notFound();

  const related = relatedGames(slug);
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const faq = faqSchema(game);
  const playUrl = playHref(game);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema(game)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(game)) }}
      />
      {faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
        />
      )}

      <main className="mx-auto mt-14 max-w-4xl px-4 py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:underline">Home</Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/games" className="hover:underline">Games</Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/games/${category}`} className="capitalize hover:underline">
                {categoryLabel}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-foreground" aria-current="page">{game.name}</li>
          </ol>
        </nav>

        {/* Exactly one h1, carrying the primary keyword. */}
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">{game.seo.headline}</h1>

        <p className="mb-6 max-w-2xl text-lg text-muted-foreground">{game.seo.description}</p>

        <dl className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="size-4" aria-hidden="true" />
            <dt className="sr-only">Session length</dt>
            <dd>{game.duration}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="size-4" aria-hidden="true" />
            <dt className="sr-only">Difficulty</dt>
            <dd className="capitalize">{game.difficulty}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4" aria-hidden="true" />
            <dt className="sr-only">Skills trained</dt>
            <dd>{game.skills.join(" · ")}</dd>
          </div>
        </dl>

        <div className="mb-14 flex flex-wrap gap-3">
          <Link
            href={playUrl}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Play className="size-4" aria-hidden="true" />
            Play {game.name} Free
          </Link>
          {game.hasRulesPage && (
            <Link
              href={`/rules/${game.slug}`}
              className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 font-medium transition-colors hover:bg-accent"
            >
              Read the rules
            </Link>
          )}
        </div>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">What is {game.name}?</h2>
          <p className="leading-7 text-muted-foreground">
            {game.name} is a free, browser-based {category} exercise: {game.tagline.toLowerCase()}{" "}
            It trains {game.skills.map((s) => s.toLowerCase()).join(", ")}, and mirrors the format
            used in real placement assessments, so the pacing you practise against is the pacing
            you will face.
          </p>
          <p className="mt-4 leading-7 text-muted-foreground">
            A session runs about {game.duration}. Nothing to download or install — it runs in the
            browser on desktop and mobile, and you can repeat it as often as you like.
          </p>
        </section>

        <section className="mb-12 rounded-xl border border-border bg-muted/40 p-5">
          <h2 className="mb-3 text-lg font-semibold">Why practise {game.name}?</h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>Matches the {game.name} format used in real assessment rounds</li>
            <li>Free and unlimited — no payment, no download</li>
            <li>Timed sessions that reproduce actual test pressure</li>
            <li>Instant scoring and a leaderboard placement after every run</li>
            <li>Trains {game.skills.slice(0, 2).map((s) => s.toLowerCase()).join(" and ")} directly</li>
          </ul>
        </section>

        {/* Visible FAQ. The FAQPage JSON-LD above marks up exactly this copy —
            marking up questions that are not on the page breaks Google's
            structured data policy. */}
        {game.seo.faq && game.seo.faq.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">
              {game.name} — frequently asked questions
            </h2>
            <dl className="space-y-5">
              {game.seo.faq.map((entry) => (
                <div
                  key={entry.question}
                  className="rounded-xl border border-border/50 bg-muted/20 p-5"
                >
                  <dt className="mb-2 font-semibold text-foreground">
                    <h3 className="text-base font-semibold">{entry.question}</h3>
                  </dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground">{entry.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {related.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-semibold">Related free games</h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={seoHref(item)}
                    className="flex h-full flex-col rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                  >
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {item.tagline}
                    </span>
                    <span className="mt-2 text-xs font-medium text-primary">Play free →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-12 border-t border-border/40 pt-6 text-xs text-muted-foreground">
          More practice:{" "}
          <Link href={`/games/${category}`} className="underline hover:text-foreground">
            all {categoryLabel.toLowerCase()} games
          </Link>{" "}
          ·{" "}
          <Link href="/games" className="underline hover:text-foreground">
            every game on {siteConfig.shortName}
          </Link>
          {" · "}
          <Link href="/leaderboard" className="underline hover:text-foreground">
            leaderboard
          </Link>
        </p>
      </main>
    </>
  );
}
