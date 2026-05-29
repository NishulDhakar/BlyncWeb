"use client";

import { navbarConfig } from "@/data/Header";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useUser, useStreak } from "@/context/UserContext";
import { Button } from "../ui/button";
import { LogIn, LogOut, Flame, Zap, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { signOut } from "@/features/auth/actions";
import { cn } from "@/lib/utils";
import { GitHubStarsButton } from "../ui/shadcn-io/github-stars-button";

// Simple hamburger icon with CSS transitions
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-5 h-4 flex flex-col justify-between relative" aria-hidden="true">
      <span
        className={cn(
          "block h-0.5 bg-foreground rounded-full transition-all duration-200 origin-center",
          open && "rotate-45 translate-y-[7.5px]"
        )}
      />
      <span
        className={cn(
          "block h-0.5 bg-foreground rounded-full transition-all duration-150",
          open && "opacity-0 scale-x-0"
        )}
      />
      <span
        className={cn(
          "block h-0.5 bg-foreground rounded-full transition-all duration-200 origin-center",
          open && "-rotate-45 -translate-y-[7.5px]"
        )}
      />
    </div>
  );
}

// Streak badge without animation
function StreakBadge({ count, className }: { count: number; className?: string }) {
  if (count === 0) return null;
  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
        "bg-orange-500/15 border border-orange-500/30 text-orange-400",
        className
      )}
      title={`${count}-day streak! Keep it up.`}
    >
      <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
      {count}
    </div>
  );
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = useUser();
  const streak = useStreak();
  const pathname = usePathname();

  const altText = pathname === "/" ? "Blync" : "Dashboard";

  // Close menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    window.location.reload();
  }, []);

  const close = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* Tap-outside backdrop (mobile only) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-200"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <header className="fixed top-4 inset-x-0 z-50 flex flex-col items-center px-4">
        {/* Pill navbar */}
        <div
          className={cn(
            "w-full md:max-w-7xl flex items-center justify-between px-5 h-14 md:h-16 rounded-full border transition-colors duration-300",
            scrolled || mobileOpen
              ? "bg-background/95 backdrop-blur-xl border-border/60 shadow-lg shadow-black/10"
              : "bg-background/20 backdrop-blur-md border-border/20"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={navbarConfig.logo.src}
                alt="Blync logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-bold text-base md:text-xl tracking-tight text-foreground">
              {altText}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navbarConfig.navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-medium py-1.5 px-3 rounded-lg transition-colors duration-200",
                    isActive
                      ? "text-foreground bg-white/10"
                      : "text-foreground/60 hover:text-foreground hover:bg-white/5"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* GitHub stars — desktop only */}
            <div className="hidden md:flex">
              <GitHubStarsButton username="NishulDhakar" repo="BlyncWeb" />
            </div>

            {/* Streak — desktop, authenticated only */}
            {user && <StreakBadge count={streak.currentStreak} className="hidden md:flex" />}

            {/* Auth */}
            {!user ? (
              <Button
                asChild
                variant="default"
                size="sm"
                className="h-9 px-4 md:h-10 md:px-6 text-sm font-semibold"
              >
                <Link href="/register">
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Sign In
                </Link>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 w-9 rounded-full p-0 border border-border/50 hover:border-border transition-colors"
                  >
                    <Avatar className="h-8 w-8 border border-border/40">
                      <AvatarImage src={user.image || undefined} alt={user.email} />
                      <AvatarFallback className="bg-muted text-foreground text-xs">
                        {user.email?.[0]?.toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <div className="flex items-center gap-1.5">
                      {user.name && <p className="text-sm font-medium truncate">{user.name}</p>}
                      {user?.isPro && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 shrink-0">
                          <Zap className="w-2.5 h-2.5" />
                          PRO
                        </span>
                      )}
                    </div>
                    {user.email && (
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    )}
                    {user?.isPro && (
                      <p className="text-[11px] text-yellow-400/70 mt-0.5">Active subscription</p>
                    )}
                    {streak.currentStreak > 0 && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                        <span className="text-xs text-orange-300 font-semibold">
                          {streak.currentStreak} day streak
                        </span>
                        <span className="text-xs text-muted-foreground">
                          · best {streak.longestStreak}
                        </span>
                      </div>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  {user?.isPro ? (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/pricing" className="flex items-center">
                        <Crown className="w-4 h-4 mr-2 text-yellow-400" />
                        <span>Manage Plan</span>
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/pricing" className="flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">Upgrade to Pro</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={handleSignOut}
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div className="md:hidden absolute top-[72px] inset-x-4 rounded-2xl bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden">
            {/* Streak banner — mobile, authenticated only */}
            {user && streak.currentStreak > 0 && (
              <div className="mx-3 mt-3 flex items-center justify-between px-4 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span className="text-sm font-bold text-orange-300">
                    {streak.currentStreak}-day streak!
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Best: {streak.longestStreak}
                </span>
              </div>
            )}

            {/* Nav links */}
            <nav className="flex flex-col p-3 gap-1">
              {navbarConfig.navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={close}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150",
                      isActive
                        ? "bg-white/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <span className="w-1 h-4 bg-foreground rounded-full shrink-0" />
                    )}
                    <span className={cn(!isActive && "ml-4")}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Divider + GitHub stars */}
            <div className="px-4 pb-4 pt-1 border-t border-border/40 flex flex-col gap-6">
              <GitHubStarsButton
                username="NishulDhakar"
                repo="BlyncWeb"
                className="w-full justify-center"
              />

              {!user && (
                <Button asChild variant="outline" className="w-full h-10">
                  <Link href="/register" onClick={close}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}

              {user && (
                <div className="flex items-center gap-3 px-1">
                  <Avatar className="h-8 w-8 border border-border/40 shrink-0">
                    <AvatarImage src={user.image || undefined} alt={user.email} />
                    <AvatarFallback className="bg-muted text-foreground text-xs">
                      {user.email?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {user.name && <p className="text-sm font-medium truncate">{user.name}</p>}
                      {user?.isPro && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 shrink-0">
                          <Zap className="w-2.5 h-2.5" />
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-red-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default React.memo(Navbar);
