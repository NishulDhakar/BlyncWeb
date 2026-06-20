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
  async redirects() {
    return [
      // ── Leaderboard casing fix ────────────────────────────────────────────
      {
        source: "/Leaderboard",
        destination: "/leaderboard",
        permanent: true,
      },

      // ── Play route casing fixes ───────────────────────────────────────────
      {
        source: "/play/Motion-challenge",
        destination: "/play/motion-challenge",
        permanent: true,
      },
      {
        source: "/play/Motion-Challenge",
        destination: "/play/motion-challenge",
        permanent: true,
      },
      {
        source: "/play/Switch-challenge",
        destination: "/play/switch-challenge",
        permanent: true,
      },
      {
        source: "/play/Switch-Challenge",
        destination: "/play/switch-challenge",
        permanent: true,
      },
      {
        source: "/play/SwitchChallenge",
        destination: "/play/switch-challenge",
        permanent: true,
      },
      {
        source: "/play/Switchchallenge",
        destination: "/play/switch-challenge",
        permanent: true,
      },
      {
        source: "/play/Deductive-challenge",
        destination: "/play/deductive-challenge",
        permanent: true,
      },
      {
        source: "/play/Deductive-Challenge",
        destination: "/play/deductive-challenge",
        permanent: true,
      },
      {
        source: "/play/Deductivechallenge",
        destination: "/play/deductive-challenge",
        permanent: true,
      },
      {
        source: "/play/Digit-challenge",
        destination: "/play/digit-challenge",
        permanent: true,
      },
      {
        source: "/play/Digit-Challenge",
        destination: "/play/digit-challenge",
        permanent: true,
      },
      {
        source: "/play/Inductive-challenge",
        destination: "/play/inductive-challenge",
        permanent: true,
      },
      {
        source: "/play/Inductive-Challenge",
        destination: "/play/inductive-challenge",
        permanent: true,
      },
      {
        source: "/play/Grid-challenge",
        destination: "/play/grid-challenge",
        permanent: true,
      },
      {
        source: "/play/Grid-Challenge",
        destination: "/play/grid-challenge",
        permanent: true,
      },

      // ── Rules route casing & typo fixes ──────────────────────────────────
      {
        source: "/rules/Grid-Challenge",
        destination: "/rules/grid-challenge",
        permanent: true,
      },
      {
        source: "/rules/Grid-challenge",
        destination: "/rules/grid-challenge",
        permanent: true,
      },
      {
        source: "/rules/Motion-Challenge",
        destination: "/rules/motion-challenge",
        permanent: true,
      },
      {
        source: "/rules/Motion-challenge",
        destination: "/rules/motion-challenge",
        permanent: true,
      },
      {
        source: "/rules/Inductive-Challenge",
        destination: "/rules/inductive-challenge",
        permanent: true,
      },
      {
        source: "/rules/Inductive-challenge",
        destination: "/rules/inductive-challenge",
        permanent: true,
      },
      {
        source: "/rules/Swith-challenge", // Fixes typo "Swith"
        destination: "/rules/switch-challenge",
        permanent: true,
      },
      {
        source: "/rules/Switch-Challenge",
        destination: "/rules/switch-challenge",
        permanent: true,
      },

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
