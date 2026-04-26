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
├── app/                  # Next.js App Router — routes, layouts, API handlers
│   ├── (root)/           # Main site layout (Header + Footer + UserProvider)
│   ├── (auth)/           # Auth layout (login / register)
│   ├── play/             # Game pages (switch, digit, grid, motion, etc.)
│   ├── games/            # Game listing pages
│   ├── api/              # API routes (auth, scores, leaderboard, chat)
│   └── blog/             # Blog / guide articles
├── components/
│   ├── Landing/          # Hero, About, FAQ, Testimonial, Poll
│   ├── common/           # Header, Footer, Container, GamePage, etc.
│   ├── games/            # Game UI components (one per game type)
│   ├── ui/               # shadcn/ui primitives + custom atoms
│   └── seo/              # JSON-LD structured data components
├── config/               # site.ts (URLs, meta, IDs), navigation.ts, About.tsx
├── context/              # UserContext (auth session passed from server layout)
├── data/                 # Static data: Header nav, GamesData, BlogData, etc.
├── features/             # Domain logic: auth actions, leaderboard, scoring
├── lib/                  # auth.ts, auth-client.ts, db.ts, utils.ts, schema.ts
└── types/                # Global TypeScript types (game.ts, user.ts)
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
- Server-side session fetch in `(root)/layout.tsx` → passed via `UserContext` to all client components
- Never fetch session on the client — read from `useUser()` context

### Dynamic Imports
- Heavy game UI components are centrally managed in `src/lib/dynamic-components.tsx`
- When adding a new heavy component, add it there with a loading fallback
- Lenis (smooth scroll) uses `{ ssr: false }` — do not remove this

### Images
- Always use `next/image` (`<Image>`) for any image — never bare `<img>` tags
- Add any new external image hosts to `images.remotePatterns` in `next.config.ts`
- Prefer AVIF/WebP; format order in config is `["image/avif", "image/webp"]`

### Fonts
- Three custom fonts: Hanken Grotesk, Hanken Grotesk Italic, Press Start 2P
- All are self-hosted in `/public/fonts/` as `.ttf` with `font-display: swap`
- Use via CSS classes: `.font-one`, `.font-sec`, `.font-game`

### Performance Rules
- **Never** add `preload="auto"` on videos — use `preload="none"` and lazy-load via IntersectionObserver
- **Never** use `<script>` tags directly in `<head>` for third-party scripts — use Next.js `<Script strategy="afterInteractive">`
- **Never** double-apply blur (both Tailwind `blur-3xl` class AND inline `filter:blur(...)` style)
- Background/decoration elements must have `aria-hidden="true"` and `pointer-events-none`

### Styling
- Dark-only theme (enforced via `<html className="dark">`)
- Tailwind v4 — no `tailwind.config.js`, config is in CSS via `@theme inline`
- Use `cn()` from `@/lib/utils` for conditional class merging

### SEO
- Every page exports `metadata` from Next.js — follow the existing pattern
- JSON-LD structured data is injected via `<Script type="application/ld+json">` in page files
- Canonical URLs must always be set in `alternates.canonical`

## Adding a New Game

1. Create `src/app/play/<game-name>/page.tsx` + game component file
2. Add game data to `src/data/GamesData.tsx`
3. Export the UI component from `src/lib/dynamic-components.tsx`
4. Add rules page at `src/app/rules/<game-name>/page.tsx` using `RulePage` component
5. Add JSON-LD game schema in `src/components/seo/GameJsonLd.tsx`

## Key External Services

- **Video CDN**: `d8j0ntlcm91z4.cloudfront.net` — hosts Hero background video
- **Auth callback**: configured in Google Cloud Console + Better Auth
- **Supabase**: database + connection pooling via `DATABASE_URL`
- **Vercel Analytics**: `@vercel/analytics` — no config needed, auto-injects
