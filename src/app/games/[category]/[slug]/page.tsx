import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig, gamesConfig } from "@/config/site";
import GameJsonLd from "@/components/seo/GameJsonLd";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

// Static generation — one page per game at build time
export function generateStaticParams() {
  return gamesConfig.map((game) => ({
    category: game.category,
    slug: game.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const game = gamesConfig.find((g) => g.slug === slug && g.category === category);
  if (!game) return {};

  const canonicalUrl = `${siteConfig.url}/games/${game.category}/${game.slug}`;

  return {
    title: `${game.headline} | Blync`,
    description: game.description,
    keywords: [...game.keywords, "free", "online", "cognitive", "brain training"],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: game.headline,
      description: game.description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${game.name} — Blync Cognitive Games`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: game.headline,
      description: game.description,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function GameSeoPage({ params }: Props) {
  const { category, slug } = await params;
  const game = gamesConfig.find((g) => g.slug === slug && g.category === category);
  if (!game) notFound();

  const canonicalUrl = `${siteConfig.url}/games/${game.category}/${game.slug}`;
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  const relatedGames = gamesConfig.filter(
    (g) => (game.related as readonly string[]).includes(g.slug)
  );

  return (
    <>
      <GameJsonLd
        name={game.name}
        description={game.description}
        url={canonicalUrl}
        breadcrumbs={[
          { name: "Home", href: siteConfig.url },
          { name: "Games", href: `${siteConfig.url}/games` },
          { name: categoryLabel, href: `${siteConfig.url}/games/${category}` },
          { name: game.name, href: canonicalUrl },
        ]}
      />

      <main className="max-w-4xl mx-auto px-4 py-12 mt-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/games" className="hover:underline">
                Games
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/games/${category}`} className="hover:underline capitalize">
                {categoryLabel}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground font-medium">{game.name}</li>
          </ol>
        </nav>

        {/* H1 — exact format requested */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{game.headline}</h1>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">{game.description}</p>

        {/* Primary CTA */}
        <div className="flex flex-wrap gap-3 mb-12">
          <Link
            href={`/play/${game.slug}`}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Play Free Now
          </Link>
          {/* <Link
            href={`/rules/${game.slug}`}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border hover:bg-accent transition-colors font-medium"
          >
            View Rules
          </Link> */}
        </div>

        {/* About section */}
        <section className="mb-12 prose prose-sm max-w-none dark:prose-invert">
          <h2>What is {game.name}?</h2>
          <p>
            {game.name} is a free online {category} game designed to train your{" "}
            {category === "memory" ? "working memory and recall" : "cognitive flexibility and reasoning"}{" "}
            skills. It closely mirrors the format used in Capgemini and Cognizant game-based
            aptitude tests, making it ideal for 2025 placement preparation.
          </p>
          <p>
            You can play {game.name} directly in your browser — no download, no app installation
            required. The game is completely free and accessible after a quick sign-in.
          </p>
        </section>

        {/* Keywords — target "free cognitive games online" etc. */}
        <section className="mb-12 p-5 rounded-xl bg-muted/40 border border-border">
          <h2 className="text-lg font-semibold mb-3">Why Practice {game.name}?</h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Matches the real {game.name} format used in Capgemini & Cognizant assessments</li>
            <li>Free online — no download, no payment required</li>
            <li>Timed sessions that simulate actual test pressure</li>
            <li>Instant scoring and performance feedback after each session</li>
            <li>Practice as many times as you need before your placement interview</li>
          </ul>
        </section>

        {/* Internal links — 3 related games (SEO: internal link graph) */}
        {relatedGames.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Related Free Games</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedGames.map((related) => (
                <li key={related.slug}>
                  <Link
                    href={`/games/${related.category}/${related.slug}`}
                    className="flex flex-col h-full p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <span className="font-medium text-sm">{related.name}</span>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {related.description.slice(0, 90)}…
                    </p>
                    <span className="mt-2 text-xs text-primary font-medium">Play Free →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
