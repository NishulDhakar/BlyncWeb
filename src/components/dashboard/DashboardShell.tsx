"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Gamepad2,
  ClipboardList,
  FileQuestion,
  LineChart,
  Bookmark,
  BookOpen,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  Crown,
  PanelLeftClose,
  PanelLeftOpen,
  PanelLeft,
  Trophy,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { navbarConfig } from "@/data/Header";
import { useUser } from "@/context/UserContext";
import { signOut } from "@/features/auth/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ThemeToggle from "@/components/common/ThemeToggle";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Companies", href: "/dashboard/companies", icon: Building2 },
  { label: "Games", href: "/dashboard/games", icon: Gamepad2 },
  {label:"Leaderboard",href:"/dashboard/leaderboard",icon:Trophy},
  // { label: "Practice", href: "/games", icon: ClipboardList },
  { label: "Mock Tests", href: "/dashboard/mock-tests", icon: FileQuestion },
  { label: "Progress", href: "/profile", icon: LineChart },
  // { label: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
] as const;

const OTHER_ITEMS = [
  { label: "Documentation", href: "/docs", icon: BookOpen },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  pathname,
  isCollapsed = false,
  onClick,
}: {
  item: { label: string; href: string; icon: React.ComponentType<{ className?: string }> };
  pathname: string;
  isCollapsed?: boolean;
  onClick?: () => void;
}) {
  const active = isActive(pathname, item.href);
  const Icon = item.icon;

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            onClick={onClick}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors cursor-pointer",
              active
                ? "bg-secondary text-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
            aria-label={item.label}
          >
            <Icon className="h-4 w-4 shrink-0" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={12}>
          <span>{item.label}</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer",
        active
          ? "bg-secondary text-foreground font-semibold shadow-2xs"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function SidebarInner({
  pathname,
  isCollapsed = false,
  onToggleCollapse,
  onNavigate,
}: {
  pathname: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
}) {
  const user = useUser();

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Logo / Header */}
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted cursor-pointer"
                  onClick={onNavigate}
                >
                  <div className="relative h-7 w-7 shrink-0">
                    <Image
                      src={navbarConfig.logo.src}
                      alt="CognitiveGames"
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12}>
                <span>CognitiveGames</span>
              </TooltipContent>
            </Tooltip>

            {onToggleCollapse && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onToggleCollapse}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Expand sidebar (⌘B)"
                  >
                    <PanelLeftOpen className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12}>
                  <span>Expand sidebar (⌘B)</span>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between px-1 py-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 min-w-0 cursor-pointer"
              onClick={onNavigate}
            >
              <div className="relative h-8 w-8 shrink-0">
                <Image
                  src={navbarConfig.logo.src}
                  alt="CognitiveGames"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold tracking-tight text-foreground truncate block leading-tight">
                  CognitiveGames<span className="text-primary font-semibold"></span>
                </span>
                <span className="text-[10px] text-muted-foreground truncate block">
                  Placement Prep
                </span>
              </div>
            </Link>

            {/* {onToggleCollapse && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onToggleCollapse}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
                    aria-label="Collapse sidebar (⌘B)"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={8}>
                  <span>Collapse sidebar (⌘B)</span>
                </TooltipContent>
              </Tooltip>
            )} */}
          </div>
        )}

        {/* Navigation */}
        <nav
          className={cn(
            "mt-6 flex flex-col gap-0.5",
            isCollapsed && "items-center"
          )}
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              pathname={pathname}
              isCollapsed={isCollapsed}
              onClick={onNavigate}
            />
          ))}
        </nav>

        {/* Secondary navigation */}
        <div className="mt-6 border-t border-border/60 pt-4">
          {!isCollapsed && (
            <span className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              General
            </span>
          )}
          <div
            className={cn(
              "flex flex-col gap-0.5",
              isCollapsed && "items-center"
            )}
          >
            {OTHER_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                pathname={pathname}
                isCollapsed={isCollapsed}
                onClick={onNavigate}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pro Membership / Upgrade Callout */}
      <div className="mt-4">
        {user?.isPro ? (
          isCollapsed ? (
            <div className="flex justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-500">
                    <Crown className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12}>
                  <span>Pro Member (Active)</span>
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-3.5">
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Crown className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>Pro Member</span>
                </div>
                <span className="rounded border border-amber-500/40 bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                  Active
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                All mock tests, detailed analytics, and company batteries unlocked.
              </p>
            </div>
          )
        ) : isCollapsed ? (
          <div className="flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/pricing"
                  onClick={onNavigate}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-card text-foreground transition-colors hover:bg-muted cursor-pointer"
                  aria-label="Upgrade to Pro"
                >
                  <Crown className="h-4 w-4 text-amber-500" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12}>
                <span>Upgrade to Pro</span>
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5">
            <div className="flex items-center justify-between gap-1.5">
              <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                All Access
              </span>
            </div>
            <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
              Full access to company mock test batteries and in-depth performance analytics.
            </p>
            <Link
              href="/pricing"
              onClick={onNavigate}
              className="mt-3 flex h-7 items-center justify-center rounded-lg border border-border/80 bg-foreground px-3 text-xs font-semibold text-background transition-opacity hover:opacity-90 cursor-pointer"
            >
              Upgrade Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("blync_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // localStorage fallback
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("blync_sidebar_collapsed", String(next));
      } catch {
        // localStorage fallback
      }
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleCollapse();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U";

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex min-h-screen bg-background">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 border-r border-border/80 bg-card/60 transition-all duration-200 ease-in-out lg:flex flex-col",
            isCollapsed ? "w-16 px-2.5 py-4" : "w-60 px-3.5 py-4"
          )}
        >
          <SidebarInner
            pathname={pathname}
            isCollapsed={isCollapsed}
            onToggleCollapse={toggleCollapse}
          />
        </aside>

        {/* Mobile sidebar */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <aside className="relative h-full w-72 bg-card px-4 py-5 shadow-2xl">
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarInner
                pathname={pathname}
                isCollapsed={false}
                onNavigate={() => setMobileOpen(false)}
              />
            </aside>
          </div>
        )}

        <div className="flex min-h-screen flex-1 min-w-0 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border/80 bg-background/90 px-4 backdrop-blur-md sm:px-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground lg:hidden cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Desktop sidebar collapse toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleCollapse}
                    className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={isCollapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
                  >
                    {isCollapsed ? (
                      <PanelLeftOpen className="h-4 w-4" />
                    ) : (
                      <PanelLeft className="h-4 w-4" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={8}>
                  <span>{isCollapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}</span>
                </TooltipContent>
              </Tooltip>

              <div className="relative hidden w-72 items-center sm:flex md:w-80">
                <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search games, companies or topics..."
                  className="h-8 w-full rounded-lg border border-border/80 bg-muted/30 py-1 pl-8 pr-12 text-xs text-foreground placeholder:text-muted-foreground focus:border-border focus:bg-background focus:outline-none"
                />
                <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-4 select-none items-center gap-0.5 rounded border border-border/70 bg-muted/60 px-1 font-mono text-[9px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <button
                className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-card hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="h-3.5 w-3.5" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-muted/60 transition-colors cursor-pointer border border-transparent hover:border-border/60">
                    <Avatar className="h-7 w-7 border border-border/70">
                      <AvatarImage src={user?.image || undefined} alt={user?.email ?? "User"} />
                      <AvatarFallback className="bg-muted text-[10px] font-bold text-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-xs font-semibold text-foreground sm:inline">
                      {user?.name?.split(" ")[0] ?? "Student"}
                    </span>
                    <span className="hidden sm:inline-flex items-center rounded-md border border-border/70 bg-muted/60 px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wide">
                      {user?.isPro ? "PRO" : "FREE"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild className="cursor-pointer text-xs">
                    <Link href="/profile">Profile & Statistics</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer text-xs">
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={handleSignOut}
                    className="cursor-pointer text-xs text-rose-500 focus:text-rose-500"
                  >
                    <LogOut className="mr-2 h-3.5 w-3.5" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
