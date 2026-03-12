import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Googlebot gets the full SEO picture
        userAgent: "Googlebot",
        allow: ["/games/", "/blog/", "/leaderboard", "/rules/", "/capgemini/", "/cognizant-games/"],
        disallow: ["/play/", "/api/", "/admin/", "/profile/"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/play/", "/api/", "/admin/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
