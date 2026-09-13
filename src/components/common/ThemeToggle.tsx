"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { cn } from "@/lib/utils";

/**
 * Header theme switch. Controlled by next-themes so persistence + the blocking
 * anti-FOUC script stay in one place; AnimatedThemeToggler only owns the
 * View-Transitions circle wipe.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const base =
    "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary [&_svg]:size-[18px]";

  if (!mounted) {
    return <span className={cn(base, className)} aria-hidden="true" />;
  }

  const theme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <AnimatedThemeToggler
      variant="circle"
      theme={theme}
      onThemeChange={setTheme}
      className={cn(base, className)}
      aria-label="Toggle light and dark theme"
    />
  );
}
