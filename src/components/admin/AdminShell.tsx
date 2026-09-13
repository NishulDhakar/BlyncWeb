"use client";

import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import type { AdminRole } from "@/features/admin/auth";

export interface AdminShellProps {
  admin: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    role: AdminRole;
  };
  children: React.ReactNode;
}

export function AdminShell({ admin, children }: AdminShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground antialiased font-sans">
      <AdminSidebar admin={admin} />
      <div className="flex flex-1 flex-col min-w-0">
        <AdminTopbar adminEmail={admin.email} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
