import { UserProvider } from "@/context/UserContext";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import StreakSync from "@/components/common/StreakSync";

/**
 * Layout for the public /games/* pages — the primary organic-search surface.
 *
 * This layout deliberately does NO server-side session work.
 *
 * It used to await getCachedSession(), getUserIsPro() and getStreak() before
 * rendering anything. Two consequences:
 *   1. reading headers() made every /games page dynamic, so the SEO pages were
 *      server-rendered on each request instead of prerendered at build time;
 *   2. getUserIsPro() can issue an outbound request to api.razorpay.com when a
 *      subscription webhook has not landed yet, putting a third-party HTTP
 *      round-trip in front of the first byte of a page whose content does not
 *      depend on the user at all.
 *
 * None of it was load-bearing: UserProvider already calls
 * authClient.useSession() on the client and overwrites whatever the server
 * passed in, and StreakSync refreshes the streak the same way. Dropping the
 * server fetch loses nothing and lets these pages ship as static HTML.
 *
 * Auth-gated routes (/play, /profile) still resolve the session server-side —
 * see src/app/play/layout.tsx.
 */
export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider user={null}>
      <Header />
      <StreakSync />
      <main>{children}</main>
      <Footer />
    </UserProvider>
  );
}
