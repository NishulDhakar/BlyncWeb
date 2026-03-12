import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "games.nishul.dev" },
      { protocol: "https", hostname: "www.nishul.dev" },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },

  // ── 301 REDIRECTS ────────────────────────────────────────────────────────────
  // All permanent=true → 301. Preserves Google PageRank from old URLs.
  async redirects() {
    return [
      // ── Play route casing fixes (mixed-case = different URL to Google) ──────
      // {
      //   source: "/play/Motion-challenge",
      //   destination: "/play/motion-challenge",
      //   permanent: true,
      // },
      // {
      //   source: "/play/Motion-Challenge",
      //   destination: "/play/motion-challenge",
      //   permanent: true,
      // },
      // {
      //   source: "/play/Switch-challenge",
      //   destination: "/play/switch-challenge",
      //   permanent: true,
      // },
      // {
      //   source: "/play/Switch-Challenge",
      //   destination: "/play/switch-challenge",
      //   permanent: true,
      // },
      // {
      //   source: "/play/SwitchChallenge",
      //   destination: "/play/switch-challenge",
      //   permanent: true,
      // },
      // {
      //   source: "/play/Switchchallenge",
      //   destination: "/play/switch-challenge",
      //   permanent: true,
      // },
      // {
      //   source: "/play/Deductive-challenge",
      //   destination: "/play/deductive-challenge",
      //   permanent: true,
      // },
      // {
      //   source: "/play/Deductive-Challenge",
      //   destination: "/play/deductive-challenge",
      //   permanent: true,
      // },
      // {
      //   source: "/play/Digit-challenge",
      //   destination: "/play/digit-challenge",
      //   permanent: true,
      // },
      // {
      //   source: "/play/Digit-Challenge",
      //   destination: "/play/digit-challenge",
      //   permanent: true,
      // },
      // {
      //   source: "/play/Inductive-challenge",
      //   destination: "/play/inductive-challenge",
      //   permanent: true,
      // },
      // {
      //   source: "/play/Inductive-Challenge",
      //   destination: "/play/inductive-challenge",
      //   permanent: true,
      // },
      // {
      //   source: "/play/Grid-challenge",
      //   destination: "/play/grid-challenge",
      //   permanent: true,
      // },
      // {
      //   source: "/play/Grid-Challenge",
      //   destination: "/play/grid-challenge",
      //   permanent: true,
      // },

      // ── Leaderboard casing fix ────────────────────────────────────────────
      // {
      //   source: "/Leaderboard",
      //   destination: "/leaderboard",
      //   permanent: true,
      // },

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
