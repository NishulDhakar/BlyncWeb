"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Repeat,
  Building2,
  Gamepad2,
  FileCheck2,
  BarChart3,
  BookOpen,
  LifeBuoy,
  ShieldAlert,
  Settings,
  Mail,
  ArrowUpRight,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ShieldCheck,
  Shield,
  Headphones,
} from "lucide-react";
import { signOut } from "@/features/auth/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AdminRole } from "@/features/admin/auth";

export interface AdminSidebarProps {
  admin: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    role: AdminRole;
  };
}

const NAV_SECTIONS = [
  {
    title: "Operations",
    items: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Payments", href: "/admin/payments", icon: CreditCard },
      { label: "Subscriptions", href: "/admin/subscriptions", icon: Repeat },
    ],
  },
  {
    title: "Curriculum",
    items: [
      { label: "Companies", href: "/admin/companies", icon: Building2 },
      { label: "Games", href: "/admin/games", icon: Gamepad2 },
      { label: "Mock Tests", href: "/admin/mock-tests", icon: FileCheck2 },
      { label: "Content", href: "/admin/content", icon: BookOpen },
    ],
  },
  {
    title: "Intelligence & Control",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Support", href: "/admin/support", icon: LifeBuoy },
      { label: "Broadcast", href: "/admin/broadcast", icon: Mail },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const roleLabel =
    admin.role === "super_admin"
      ? "Super Admin"
      : admin.role === "admin"
      ? "Admin"
      : "Support";

  const RoleIcon =
    admin.role === "super_admin"
      ? ShieldCheck
      : admin.role === "admin"
      ? Shield
      : Headphones;

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border/80 bg-card transition-all duration-200 select-none z-30 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between border-b border-border/80 px-3.5">
        {!collapsed && (
          <Link
            href="/admin"
            className="flex items-center gap-2 font-semibold text-foreground tracking-tight text-sm"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono text-xs font-bold shadow-xs">
              CG
            </div>
            <div className="flex flex-col">
              <span className="leading-tight text-xs font-bold">
                CognitiveGames
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                Admin Console
              </span>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono text-xs font-bold">
            CG
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer",
            collapsed && "mx-auto mt-1"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <h4 className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {section.title}
              </h4>
            )}
            {section.items.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  (pathname.startsWith(item.href + "/") &&
                    item.href !== "/admin");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / Profile */}
      <div className="border-t border-border/80 p-2.5 space-y-2">
        {!collapsed ? (
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 p-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-7 w-7 rounded-md border border-border/80 shrink-0">
                <AvatarImage src={admin.image || undefined} />
                <AvatarFallback className="rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                  {admin.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex flex-col">
                <span className="truncate font-medium text-foreground leading-tight text-xs">
                  {admin.name}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <RoleIcon className="h-2.5 w-2.5 text-primary" />
                  {roleLabel}
                </span>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="rounded-md p-1 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => signOut()}
              className="rounded-md p-2 text-muted-foreground hover:text-rose-600 hover:bg-muted transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

        <Link
          href="/dashboard"
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg border border-border/70 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
            collapsed ? "px-0" : "px-2"
          )}
          title="Return to Student Platform"
        >
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          {!collapsed && <span>Return to App</span>}
        </Link>
      </div>
    </aside>
  );
}
