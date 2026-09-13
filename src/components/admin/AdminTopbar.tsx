"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Shield, Bell, RefreshCw } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

export interface AdminTopbarProps {
  adminEmail: string;
}

export function AdminTopbar({ adminEmail }: AdminTopbarProps) {
  const pathname = usePathname();
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " UTC"
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute breadcrumbs
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((seg, idx, arr) => {
      const href = "/" + arr.slice(0, idx + 1).join("/");
      const label =
        seg === "admin"
          ? "Admin"
          : seg
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ");
      return { href, label };
    });

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-border/80 bg-card/80 backdrop-blur-md px-6 select-none">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {segments.map((seg, idx) => {
          const isLast = idx === segments.length - 1;
          return (
            <React.Fragment key={seg.href}>
              {idx > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
              {isLast ? (
                <span className="font-semibold text-foreground">
                  {seg.label}
                </span>
              ) : (
                <Link
                  href={seg.href}
                  className="hover:text-foreground transition-colors"
                >
                  {seg.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Status & Utilities */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-[11px] text-muted-foreground">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-foreground">Production</span>
          <span className="opacity-40">|</span>
          <span className="font-mono tabular-nums">{time || "Live"}</span>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
