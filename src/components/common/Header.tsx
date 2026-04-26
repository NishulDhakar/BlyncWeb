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
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { GitHubStarsButton } from "../ui/shadcn-io/github-stars-button";

// Animated hamburger — three lines morph into an X
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-5 h-4 flex flex-col justify-between" aria-hidden="true">
      <motion.span
        className="block h-0.5 bg-foreground rounded-full origin-center"
        animate={open ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring" as const, stiffness: 260, damping: 20 }}
      />
      <motion.span
        className="block h-0.5 bg-foreground rounded-full"
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.span
        className="block h-0.5 bg-foreground rounded-full origin-center"
        animate={open ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring" as const, stiffness: 260, damping: 20 }}
      />
    </div>
  );
}

const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 28, staggerChildren: 0.055, delayChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -10,
    transition: { duration: 0.18, ease: "easeIn" as const, staggerChildren: 0.03, staggerDirection: -1 },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.12 } },
};

// Animated flame streak badge
function StreakBadge({ count, className }: { count: number; className?: string }) {
  if (count === 0) return null;
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
        "bg-orange-500/15 border border-orange-500/30 text-orange-400",
        className
      )}
      title={`${count}-day streak! Keep it up.`}
    >
      <motion.span
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
      </motion.span>
      {count}
    </motion.div>
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
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={close}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <header className="fixed top-4 inset-x-0 z-50 flex flex-col items-center px-4">
        {/* ── Pill navbar ── */}
        <motion.div
          className={cn(
            "w-full md:max-w-7xl flex items-center justify-between px-5 h-14 md:h-16 rounded-full border transition-colors duration-300",
            scrolled || mobileOpen
              ? "bg-background/95 backdrop-blur-xl border-border/60 shadow-lg shadow-black/10"
              : "bg-background/20 backdrop-blur-md border-border/20"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Image
                src={navbarConfig.logo.src}
                alt="Blync logo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <span className="font-bold text-base md:text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
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
                      ? "text-primary bg-primary/10"
                      : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="desktop-indicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                      initial={false}
                      transition={{ type: "spring" as const, stiffness: 380, damping: 30 }}
                    />
                  )}
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
                    className="h-9 w-9 rounded-full p-0 border border-border/50 hover:border-primary/50 transition-colors"
                  >
                    <Avatar className="h-8 w-8 border-2 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                      <AvatarImage src={user.image || undefined} alt={user.email} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
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
        </motion.div>

        {/* ── Mobile dropdown menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden absolute top-[72px] inset-x-4 rounded-2xl bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden"
            >
              {/* Streak banner — mobile, authenticated only */}
              {user && streak.currentStreak > 0 && (
                <motion.div
                  variants={navItemVariants}
                  className="mx-3 mt-3 flex items-center justify-between px-4 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20"
                >
                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" as const }}
                    >
                      <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                    </motion.span>
                    <span className="text-sm font-bold text-orange-300">
                      {streak.currentStreak}-day streak!
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Best: {streak.longestStreak}
                  </span>
                </motion.div>
              )}

              {/* Nav links */}
              <nav className="flex flex-col p-3 gap-1">
                {navbarConfig.navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div key={item.label} variants={navItemVariants}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="mobile-indicator"
                            className="w-1 h-4 bg-primary rounded-full shrink-0"
                          />
                        )}
                        <span className={cn(!isActive && "ml-4")}>{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Divider + GitHub stars */}
              <motion.div
                variants={navItemVariants}
                className="px-4 pb-4 pt-1 border-t border-border/40 flex flex-col gap-6"
              >
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
                    <Avatar className="h-8 w-8 border-2 border-yellow-500 shrink-0">
                      <AvatarImage src={user.image || undefined} alt={user.email} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default React.memo(Navbar);
