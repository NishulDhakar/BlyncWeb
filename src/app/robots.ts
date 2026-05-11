import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Googlebot and Google's AI overview crawler
        userAgent: ["Googlebot", "Googlebot-Extended"],
        allow: ["/games/", "/blog/", "/leaderboard", "/rules/", "/Capgemini/", "/cognizant-games/", "/iq-tests/", "/memory-game/", "/how-it-works/"],
        disallow: ["/play/", "/api/", "/admin/", "/profile/"],
      },
      {
        // Bing and Microsoft Copilot
        userAgent: ["Bingbot", "Copilot"],
        allow: "/",
        disallow: ["/play/", "/api/", "/admin/", "/profile/"],
      },
      {
        // Perplexity search
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/play/", "/api/", "/admin/", "/profile/"],
      },
      {
        // OpenAI GPT crawlers
        userAgent: ["GPTBot", "ChatGPT-User"],
        allow: "/",
        disallow: ["/play/", "/api/", "/admin/", "/profile/"],
      },
      {
        // Anthropic Claude
        userAgent: ["ClaudeBot", "anthropic-ai"],
        allow: "/",
        disallow: ["/play/", "/api/", "/admin/", "/profile/"],
      },
      {
        // All other crawlers
        userAgent: "*",
        allow: "/",
        disallow: ["/play/", "/api/", "/admin/", "/profile/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
