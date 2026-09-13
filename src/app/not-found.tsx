import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Blync",
  description:
    "The page you're looking for doesn't exist. Explore our cognitive games and aptitude practice challenges.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center bg-background text-foreground">
      <div className="relative mb-6">
        <h1 className="text-8xl md:text-9xl font-extrabold text-foreground/15 select-none font-mono tracking-tighter">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl md:text-2xl font-bold text-foreground">
            Page Not Found
          </span>
        </div>
      </div>
      <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed mb-8">
        The page you&apos;re looking for doesn&apos;t exist, was renamed, or has been moved. Let&apos;s get you back to practicing.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          Go Home
        </Link>
        <Link
          href="/games"
          className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors"
        >
          Explore Games
        </Link>
      </div>
    </div>
  );
}
