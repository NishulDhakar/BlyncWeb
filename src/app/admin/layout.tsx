import type { Metadata } from "next";

/**
 * The admin area must never be indexed. It had no robots directive and no
 * canonical, so it was crawlable and eligible for the index.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
