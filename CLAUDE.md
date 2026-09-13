# CLAUDE.md — Blync Cognitive Games Platform

## Project Overview

**Blync** is a Next.js 16 (App Router) web platform for practicing game-based cognitive aptitude tests used by Capgemini and Cognizant during campus placements. Live at [cognitivegames.me](https://www.cognitivegames.me).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Animation | Framer Motion 12 |
| Auth | Better Auth (Google OAuth) |
| Database | PostgreSQL via Supabase + Drizzle ORM |
| AI | Google Gemini |
| Package manager | pnpm (use pnpm, NOT npm/yarn) |

## Project Structure

```
src/
├── app/                  # Next.js App Router — routes only, kept thin
│   ├── (root)/           # Main site layout (Header + Footer + UserProvider)
│   ├── (auth)/           # Auth layout (login / register)
│   ├── play/             # Gameplay routes (noindex, auth-gated)
│   │   ├── [slug]/       # Every React game module — one dynamic route
│   │   ├── assessments/  # HTML quiz + debugging assessments
│   │   ├── communication/# Cognizant communication rounds
│   │   └── brain-games/  # Embedded third-party puzzles
│   ├── games/            # SEO landing pages (static, indexable)
│   │   ├── [category]/          # Category hub
│   │   └── [category]/[slug]/    # Per-game landing page
│   ├── api/              # API routes (auth, scores, leaderboard, chat)
│   └── blog/             # Blog / guide articles
├── games/                # ★ THE GAME LAYER — see "Game architecture" below
│   ├── registry.ts       # Single source of truth: every game, one entry
│   ├── types.ts          # GameDefinition, GameCategory, CompanySlug…
│   ├── seo.ts            # Metadata + JSON-LD builders, registry-driven
│   ├── GameMount.tsx     # Client dynamic-import map (per-game code splitting)
│   ├── moduleRegistry.ts # Server-readable list of React game slugs
│   ├── shell/            # GameShell, start/result screens, HTML frame
│   ├── hooks/            # useCountdown, useDelayedTransition, useGameSession
│   ├── lib/              # random.ts, format.ts — shared game helpers
│   ├── html-assessments/ # Self-contained HTML assessment documents
│   └── <slug>/           # One self-contained module per game
├── components/
│   ├── Landing/          # Hero, About, FAQ, Testimonial, Poll
│   ├── common/           # Header, Footer, Container, RulePage, etc.
│   ├── games/            # GameGrid (registry-driven card grid), hub clients
│   ├── ui/               # shadcn/ui primitives + custom atoms
│   └── seo/              # JSON-LD structured data components
├── config/               # site.ts (derives from games/registry), navigation.ts
├── context/              # UserContext (auth session passed from server layout)
├── data/                 # Static data: Header nav, BlogData, rules, etc.
├── features/             # Domain logic: auth, leaderboard, scoring, streak…
├── lib/                  # auth.ts, auth-client.ts, db.ts, utils.ts, schema.ts
└── types/                # Global TypeScript types
```


## Dev Commands

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Production build
pnpm start        # Run production build
pnpm lint         # ESLint
pnpm db:push      # Drizzle push schema to Supabase
pnpm db:studio    # Open Drizzle Studio UI
```

## Environment Variables

Copy `.env.example` → `.env` and fill in:
- `DATABASE_URL` — Supabase PostgreSQL connection string
- `BETTER_AUTH_SECRET` — random secret for Better Auth
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth
- `GEMINI_API_KEY` — Google Gemini AI
- `NEXT_PUBLIC_UMAMI_ID` — Umami analytics ID
- `NEXT_PUBLIC_GA_ID` — Google Analytics ID
- `NEXT_PUBLIC_ADSENSE_ID` — Google AdSense publisher ID

## Architecture Decisions

### Auth Flow
- Auth-gated subtrees (`/play`, `/profile`) resolve the session server-side in
  their layout and pass it through `UserContext`.
- Public `/games/*` pages do **not** fetch the session server-side — that would
  make them dynamically rendered. `UserProvider` hydrates the session on the
  client via `authClient.useSession()`.
- In components, read the user from `useUser()`. It returns `null` rather than
  throwing when no provider is mounted, so a page rendered outside
  `UserProvider` still prerenders.

### Dynamic Imports
- Game modules are lazily imported in `src/games/GameMount.tsx` (one `next/dynamic`
  call each, so every game gets its own chunk). Add new games there.
- `ssr: false` is only legal inside a client module, and must never wrap a
  layout's `{children}` — see "Rules that keep these pages fast and indexable".
- Lenis (smooth scroll) still loads browser-only, via a dynamic `import()` inside
  an effect in `LenisProvider`. Keep it a sibling of the content, not a wrapper.

### Images
- Always use `next/image` (`<Image>`) for any image — never bare `<img>` tags
- Add any new external image hosts to `images.remotePatterns` in `next.config.ts`
- Prefer AVIF/WebP; format order in config is `["image/avif", "image/webp"]`

### Fonts
- Three custom fonts: Hanken Grotesk, Hanken Grotesk Italic, Press Start 2P
- All are self-hosted in `/public/fonts/` as `.ttf` with `font-display: swap`
- Use via CSS classes: `.font-one`, `.font-sec`, `.font-game`

### Performance Rules
- **Never** add `preload="auto"` on videos — and note `autoPlay` forces a fetch
  regardless of `preload="none"`. Decorative video goes through `AmbientVideo`,
  which paints the poster first and mounts the element on idle.
- **Never** use `<script>` tags directly in `<head>` for third-party scripts — use Next.js `<Script strategy="afterInteractive">`
- **Never** double-apply blur (both Tailwind `blur-3xl` class AND inline `filter:blur(...)` style)
- Background/decoration elements must have `aria-hidden="true"` and `pointer-events-none`

### Styling
- Dark-only theme (enforced via `<html className="dark">`)
- Tailwind v4 — no `tailwind.config.js`, config is in CSS via `@theme inline`
- Use `cn()` from `@/lib/utils` for conditional class merging

### SEO
- Every page needs its own `metadata`. A client-component page cannot export it —
  add a sibling `layout.tsx` that does (see `src/app/about/layout.tsx`).
- Game pages get metadata and JSON-LD from `src/games/seo.ts`; do not hand-write
  either for a game.
- `alternates.canonical` must be set per route and must be self-referencing.
  It is deliberately absent from the root layout.
- Only mark up FAQ content in JSON-LD when the same questions are visible on the
  page — marking up hidden content violates Google's structured data policy.

## Game architecture

Games are modules that plug into a shared shell. There are three kinds:

| Kind | Where the code lives | Route template |
|---|---|---|
| `react` | `src/games/<slug>/{logic,ui}.tsx` | `/play/<slug>` |
| `html` | `src/games/html-assessments/<folder>/` | `/play/assessments/<slug>` or `/play/communication/<slug>` |
| `embed` | external URL in the registry entry | `/play/brain-games/<slug>` |

**`src/games/registry.ts` is the single source of truth.** One `GameDefinition`
per game drives all of this, with no other file to touch:

- the play route and the indexable landing page at `/games/<category>/<slug>`
- `generateMetadata` (title, description, keywords, canonical, OG, Twitter)
- JSON-LD: `Game`, `BreadcrumbList`, and `FAQPage` when the entry has FAQ copy
- `sitemap.xml` entries and the category hubs
- the card grid (`components/games/GameGrid.tsx`) and footer link blocks
- the "More challenges" cross-links inside `GameShell`

### Adding a new game

1. Add one entry to `src/games/registry.ts`. Fill in `seo.keywords` with real
   search phrases — `keywords[0]` becomes the H1 and the `<title>`.
2. Create `src/games/<slug>/logic.tsx` (client state machine) and `ui.tsx`
   (presentational). Import shared helpers rather than re-implementing them:
   - `@/games/lib/random` — `randomInt`, `shuffle`, `pickOne`, `sample`, `roundTo`
   - `@/games/lib/format` — `formatTime`, `formatClock`, `toPercent`
   - `@/games/hooks/useCountdown` — one-second countdown, fires `onExpire` once
   - `@/games/hooks/useDelayedTransition` — the "pause then advance" timer
   - `@/games/hooks/useGameSession` — writes the final score exactly once
   - `@/games/shell/GameScreens` — `GameStartScreen`, `GameResultScreen`,
     `LivesRow`, `StatTile`, `TimerBar`
3. Register the lazy import in `src/games/GameMount.tsx` and add the slug to
   `src/games/moduleRegistry.ts`.
4. Optionally add a rules page at `src/app/rules/<slug>/page.tsx` and set
   `hasRulesPage: true` on the registry entry.

That is it — no new route file, no sitemap edit, no new card component.

### Rules that keep these pages fast and indexable

- **Never** put a `dynamic(..., { ssr: false })` component around `{children}`
  in a layout. Doing so makes the whole subtree bail out to client-side
  rendering — every page then prerenders to an empty document. `LenisProvider`
  sits *beside* the content for exactly this reason.
- **Never** read the session (`getCachedSession`, `getUserIsPro`, `getStreak`)
  in a layout that wraps public `/games/*` pages. It forces dynamic rendering on
  the pages the site ranks with, and `getUserIsPro` can make an outbound
  Razorpay request before the first byte. `UserProvider` re-fetches the session
  on the client anyway.
- **Never** set `alternates.canonical` on the root layout — every page without
  its own canonical inherits it and declares itself a duplicate of the homepage.
  Each route sets its own; client-component pages use a sibling `layout.tsx`.
- Every indexable page needs exactly one `<h1>` present in the server-rendered
  HTML. Content gated behind `authClient.useSession()` renders as a spinner
  during SSR, so put crawlable copy outside that gate.

## Database

All SQL lives in **`db/supabase-queries.sql`**, grouped by when to run it
(one-time setup, per-migration, seed, runtime, ops) with the run order at the
top of the file. Keep it in sync with `src/lib/schema.ts` when the schema
changes.

## Key External Services

- **Video CDN**: `d8j0ntlcm91z4.cloudfront.net` — hosts Hero background video
- **Auth callback**: configured in Google Cloud Console + Better Auth
- **Supabase**: database + connection pooling via `DATABASE_URL`
- **Vercel Analytics**: `@vercel/analytics` — no config needed, auto-injects
