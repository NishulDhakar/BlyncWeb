
import { Metadata } from "next";
import { getCachedSession } from "@/lib/auth";
import { UserProvider } from "@/context/UserContext";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { siteConfig } from "@/config/site";
import { getStreak } from "@/features/streak/actions";
import { getUserIsPro } from "@/lib/subscription";
import type { User } from "@/types/user";
import StreakSync from "@/components/common/StreakSync";

export const metadata: Metadata = {
   title: "Free Game-Based Aptitude Practice for Capgemini & Cognizant | Blync",
   description:
      "Practice Capgemini game-based aptitude tests online. Play Switch, Grid, Digit, Motion, Inductive & Deductive challenges — the exact cognitive games used in Capgemini & Cognizant placement rounds. No signup needed.",
   keywords: [
      "capgemini gaming",
      "capgemini games",
      "capgemini game based aptitude",
      "game based aptitude test",
      "capgemini cognitive ability games",
      "game based aptitude test free practice",
      "aptitude games",
      "capgemini gaming round",
   ],
   alternates: {
      canonical: siteConfig.url,
   },
};


export default async function HomeLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   let user: (User & { isPro?: boolean }) | null = null;
   let streak = { currentStreak: 0, longestStreak: 0 };

   try {
      const session = await getCachedSession();
      const sessionUser = session?.user ?? null;

      user = sessionUser;
      if (sessionUser) {
         // Run isPro check and read-only streak check in parallel — saves ~1 DB round-trip and avoids write locks
         const [isPro, streakResult] = await Promise.all([
            getUserIsPro(sessionUser.id),
            getStreak(sessionUser.id),
         ]);
         user = { ...sessionUser, isPro };
         streak = streakResult;
      }
   } catch (error) {
      if (error instanceof Error && ((error as any).digest === "DYNAMIC_SERVER_USAGE" || error.message?.includes("Dynamic server usage"))) {
         throw error;
      }
      // Gracefully degrade to guest mode when DB is unreachable (e.g. Supabase timeout)
      console.warn("[HomeLayout] Session fetch failed, falling back to guest mode:", (error as Error)?.message ?? error);
      user = null;
      streak = { currentStreak: 0, longestStreak: 0 };
   }

   return (
      <UserProvider user={user} streak={streak}>
         <Header />
         <StreakSync />
         <main className="">
            {children}
         </main>
         <Footer />
      </UserProvider>
   );
}
