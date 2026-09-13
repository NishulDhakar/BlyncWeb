import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/features/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Admin Panel | CognitiveGames.me",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  // 1. Unauthenticated -> Redirect to login
  if (!session?.user) {
    redirect("/login?redirect=/admin");
  }

  // 2. Authenticated -> Check admin privileges
  const admin = await getCurrentAdmin();

  if (!admin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-4">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          403 — Access Denied
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
          Your account (<strong>{session.user.email}</strong>) is not authorized
          to access the CognitiveGames.me internal administrator console.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
