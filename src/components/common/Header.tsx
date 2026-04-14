"use client";

import { navbarConfig } from "@/data/Header";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Button } from "../ui/button";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { signOut } from "@/features/auth/actions";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GitHubStarsButton } from "../ui/shadcn-io/github-stars-button";

function Navbar() {


  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = useUser();


  const pathname = usePathname();
  const altText = pathname === "/" ? "Blync" : "Dashboard";

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    window.location.reload();
  }, []);

  return (
    <header
      className={cn(
        "fixed top-4 inset-x-0 z-50 flex justify-center px-4 transition-all duration-300 ease-in-out"
      )}
    >
      <div
        className={cn(
          "w-full md:max-w-7xl flex items-center justify-between px-6 h-16 rounded-full border transition-all duration-300",
          scrolled || mobileOpen
            ? "bg-background backdrop-blur-xl border-border/50 shadow-lg shadow-black/5"
            : "bg-background/20 backdrop-blur-md border-border/20"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-12 h-12 md:w-14 md:h-14 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Image
              src={navbarConfig.logo.src}
              alt={altText}
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
          <span className="font-bold text-lg md:text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {altText}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navbarConfig.navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 relative py-1 px-3 rounded-lg",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                )}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side (Sign In / Avatar / Stars) */}
        <div className="flex items-center gap-3">


          {!user ? (
            <Button
              asChild
              variant="default"
              className="font-semibold hover:scale-100 hover:translate-y-0 transition-all duration-300 h-9 px-4 md:h-11 md:px-8 md:text-base"
            >
              <Link href="/register">
                <LogIn className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="text-sm md:text-base">Sign In</span>
              </Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full overflow-hidden border border-border/50 hover:border-primary/50 transition-colors"
                >
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                    <AvatarImage src={user.image || undefined} alt={user.email} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.email?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-effect">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <div className="flex items-center gap-2">
                      {user.name && (
                        <p className="font-medium">{user.name}</p>
                      )}
                    </div>
                    {user.email && (
                      <p className="w-[200px] truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile">
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                </DropdownMenuItem> */}
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

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex gap-4 hidden md:block">
            {/* Standard display with full numbers */}
            <GitHubStarsButton
              username="NishulDhakar"
              repo="BlyncWeb"
            ></GitHubStarsButton></div>

        </div>
      </div>

      {/* Animated Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 inset-x-0 mx-4 p-4 rounded-2xl bg-background/90 backdrop-blur-xl border border-border/50 shadow-2xl md:hidden z-40 overflow-hidden"
          >
            <nav className="flex flex-col gap-2">
              {navbarConfig.navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-2 sm:hidden flex justify-center w-full">
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default React.memo(Navbar);
