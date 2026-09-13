"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center bg-background text-foreground">
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-6">
        <AlertTriangle className="h-7 w-7" />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
        Something went wrong
      </h1>
      <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed mb-8">
        An unexpected application error occurred. You can retry the current action or head back to safety.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
