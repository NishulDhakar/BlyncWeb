import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserProvider } from "@/context/UserContext";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { upsertStreak } from "@/features/streak/actions";

export default async function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user ?? null;
  const streak = user
    ? await upsertStreak(user.id)
    : { currentStreak: 0, longestStreak: 0 };

  return (
    <UserProvider user={user} streak={streak}>
      <Header />
      <main>{children}</main>
      <Footer />
    </UserProvider>
  );
}
