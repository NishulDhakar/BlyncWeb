import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserProvider } from "@/context/UserContext";
import Header from "@/components/common/Header";

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/register");
  }

  const user = session?.user;
  
  return (
    <UserProvider user={user}>
              <Header />

                    <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disableRemotePlayback
            webkit-playsinline="true"
            x5-playsinline="true"
            poster="https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=60"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
         >
            <source
               src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260330_145725_08886141-ed95-4a8e-8d6d-b75eaadce638.mp4"
               type="video/mp4"
            />
         </video>
      <main className="flex-1 p-6">{children}</main>

    </UserProvider>
  );
}
