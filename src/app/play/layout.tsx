import type { Metadata } from "next";
import { getCachedSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserProvider } from "@/context/UserContext";
import Header from "@/components/common/Header";
import GameBackgroundGrid from "@/components/common/GameBackgroundGrid";

// Gameplay pages are not SEO targets — the /games/* pages are.
// noindex prevents Google from indexing auth-gated gameplay URLs.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: any = null;

  try {
    const session = await getCachedSession();

    if (!session) {
      return redirect("/register");
    }

    const sessionUser = session.user;
    user = { ...sessionUser };
  } catch (error) {
    if (error instanceof Error && (
      (error as any).digest === "DYNAMIC_SERVER_USAGE" || 
      (error as any).digest?.startsWith("NEXT_REDIRECT") ||
      error.message?.includes("Dynamic server usage")
    )) {
      throw error;
    }
    // DB unreachable — redirect to register as safe fallback
    return redirect("/register");
  }

  return (
    <UserProvider user={user}>
      <Header />
      <GameBackgroundGrid />
      
      <main className="relative z-10 flex-1 p-3 sm:p-6">{children}</main>

    </UserProvider>
  );
}
