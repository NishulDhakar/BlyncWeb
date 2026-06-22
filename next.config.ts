import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "games.nishul.dev" },
      { protocol: "https", hostname: "www.nishul.dev" },
      // Avatar images from Google OAuth
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "@phosphor-icons/react", "react-icons"],
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },

  // Long-lived cache headers for static assets
  async headers() {
    return [
      {
        source: "/fonts/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*\\.(?:png|jpg|jpeg|gif|webp|avif|ico|svg))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // ── 301 REDIRECTS ────────────────────────────────────────────────────────────
  // All permanent=true → 301. Preserves Google PageRank from old URLs.
  //
  // NOTE: Case-fixing redirects (e.g. /play/Switch-challenge → /play/switch-challenge)
  // were removed because Next.js 16 matches redirect sources case-insensitively,
  // causing infinite redirect loops (ERR_TOO_MANY_REDIRECTS).
  async redirects() {
    return [
      // ── Legacy/Malformed games/ route redirects ─────────────────────────
      {
        source: "/games/gridchallenge",
        destination: "/games/cognitive/grid-challenge",
        permanent: true,
      },
      {
        source: "/games/digitchallenge",
        destination: "/games/cognitive/digit-challenge",
        permanent: true,
      },
      {
        source: "/games/motionchallenge",
        destination: "/games/cognitive/motion-challenge",
        permanent: true,
      },
      {
        source: "/games/deductivechallenge",
        destination: "/games/cognitive/deductive-challenge",
        permanent: true,
      },
      {
        source: "/games/inductivechallenge",
        destination: "/games/cognitive/inductive-challenge",
        permanent: true,
      },

      // ── Legacy URL migrations → new /games/ structure ────────────────────
      // /capgemini-games has 35 real visitors — preserve that SEO juice
      {
        source: "/capgemini-games",
        destination: "/games/cognitive",
        permanent: true,
      },
      {
        source: "/capgemini-cognitive-ability-games",
        destination: "/games/cognitive",
        permanent: true,
      },
      {
        source: "/memorygames",
        destination: "/games/memory",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
