import type { MetadataRoute } from "next";
import { siteConfig, ruleSlugs } from "@/config/site";
import { activeCategories, liveGames, seoHref } from "@/games/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  // ── Core pages ─────────────────────────────────────────────────────────────
  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/leaderboard`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/Capgemini`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/Capgemini/capgemini-game-based-aptitude-test-questions`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/cognizant-games`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/iq-tests`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/docs`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/feedback`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms-of-service`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // ── /games/* — SEO money pages (fully indexed) ────────────────────────────
  // Both the hub list and the per-game list come from src/games/registry.ts, so
  // a new game is in the sitemap the moment it is registered. Before this, the
  // category list was hardcoded and new categories were never submitted.
  const gamesHubPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/games`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    ...activeCategories().map((category) => ({
      url: `${baseUrl}/games/${category}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];

  const gameDetailPages: MetadataRoute.Sitemap = liveGames().map((game) => ({
    url: `${baseUrl}${seoHref(game)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // ── Rules / guides (static content — good for long-tail SEO) ─────────────
  const rulePages: MetadataRoute.Sitemap = ruleSlugs.map((slug) => ({
    url: `${baseUrl}/rules/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  // ── Blog posts ────────────────────────────────────────────────────────────
  const blogPosts: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog/complete-guide-capgemini-cognitive-games`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/master-pattern-recognition`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/blog/cognitive-games-problem-solving`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
  ];

  // NOTE: /play/* is intentionally excluded — those pages are noindex
  // NOTE: /capgemini-games and /memorygames are excluded — they 301 to /games/*

  return [...corePages, ...gamesHubPages, ...gameDetailPages, ...rulePages, ...blogPosts];
}
