import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth";
import { getStreak } from "@/features/streak/actions";
import { UserProvider } from "@/context/UserContext";
import DashboardShell from "@/components/dashboard/DashboardShell";
import type { User } from "@/types/user";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

/**
 * Auth-gated app shell for /dashboard and everything under it (companies,
 * mock tests, bookmarks, achievements, settings). Session is resolved here
 * via getCachedSession, so page.tsx re-reading it costs nothing extra —
 * everything nested just reads the user back out of UserContext.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getCachedSession();

  if (!session) redirect("/register");

  const streak = await getStreak(session.user.id).catch(() => ({
    currentStreak: 0,
    longestStreak: 0,
  }));

  return (
    <UserProvider user={session.user as User} streak={streak}>
      <DashboardShell>{children}</DashboardShell>
    </UserProvider>
  );
}
