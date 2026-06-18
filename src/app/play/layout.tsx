import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserProvider } from "@/context/UserContext";
import Header from "@/components/common/Header";
import { getUserIsPro } from "@/lib/subscription";
import HlsVideo from "@/components/common/HlsVideo";

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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return redirect("/register");
    }

    const sessionUser = session.user;
    const isPro = await getUserIsPro(sessionUser.id);
    user = { ...sessionUser, isPro };
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

                   <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none gpu-accelerated"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260330_145725_08886141-ed95-4a8e-8d6d-b75eaadce638.mp4"
      />
      
      <main className="flex-1 p-3 sm:p-6">{children}</main>

    </UserProvider>
  );
}
