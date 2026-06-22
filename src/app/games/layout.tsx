import { getCachedSession } from "@/lib/auth";
import { UserProvider } from "@/context/UserContext";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { getStreak } from "@/features/streak/actions";
import { getUserIsPro } from "@/lib/subscription";
import StreakSync from "@/components/common/StreakSync";

export default async function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: any = null;
  let streak = { currentStreak: 0, longestStreak: 0 };

  try {
    const session = await getCachedSession();
    const sessionUser = session?.user ?? null;

    const [isPro, streakResult] = await Promise.all([
      sessionUser ? getUserIsPro(sessionUser.id) : Promise.resolve(false),
      sessionUser
        ? getStreak(sessionUser.id)
        : Promise.resolve({ currentStreak: 0, longestStreak: 0 }),
    ]);

    user = sessionUser ? { ...sessionUser, isPro } : null;
    streak = streakResult;
  } catch (error) {
    if (error instanceof Error && ((error as any).digest === "DYNAMIC_SERVER_USAGE" || error.message?.includes("Dynamic server usage"))) {
      throw error;
    }
    // DB unreachable — render as guest
  }

  return (
    <UserProvider user={user} streak={streak}>
      <Header />
      <StreakSync />
      <main>{children}</main>
      <Footer />
    </UserProvider>
  );
}
