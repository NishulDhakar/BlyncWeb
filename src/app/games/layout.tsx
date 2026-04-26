import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserProvider } from "@/context/UserContext";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { upsertStreak } from "@/features/streak/actions";
import { getUserIsPro } from "@/lib/subscription";

export default async function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const sessionUser = session?.user ?? null;

  const [isPro, streak] = await Promise.all([
    sessionUser ? getUserIsPro(sessionUser.id) : Promise.resolve(false),
    sessionUser
      ? upsertStreak(sessionUser.id)
      : Promise.resolve({ currentStreak: 0, longestStreak: 0 }),
  ]);

  const user = sessionUser ? { ...sessionUser, isPro } : null;

  return (
    <UserProvider user={user} streak={streak}>
      <Header />
      <main>{children}</main>
      <Footer />
    </UserProvider>
  );
}
