"use client";

import React, { useState } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import type { UserRow } from "@/features/admin/userActions";
import { bulkUpdateUsers, getUsers } from "@/features/admin/userActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export interface UserTableClientProps {
  initialData: {
    users: UserRow[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export function UserTableClient({ initialData }: UserTableClientProps) {
  const router = useRouter();
  const [usersList, setUsersList] = useState<UserRow[]>(initialData.users);
  const [total, setTotal] = useState(initialData.total);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => Promise<void>;
  }>({
    open: false,
    title: "",
    description: "",
    action: async () => {},
  });

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Free", value: "free" },
    { label: "Pro", value: "pro" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Suspended", value: "suspended" },
  ];

  const handleFilterChange = async (val: string) => {
    setActiveFilter(val);
    setLoading(true);
    try {
      const res = await getUsers({ filter: val, page: 1 });
      setUsersList(res.users);
      setTotal(res.total);
    } catch {
      toast.error("Failed to filter users");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    if (usersList.length === 0) return;
    const headers = [
      "ID",
      "Name",
      "Email",
      "Plan",
      "Status",
      "Games",
      "Mock Tests",
      "Revenue (INR)",
      "Joined",
    ];
    const rows = usersList.map((u) => [
      `"${u.id}"`,
      `"${u.name || ""}"`,
      `"${u.email}"`,
      u.isPro ? "Pro" : "Free",
      u.status,
      u.gamesCount,
      u.mockTestsCount,
      u.revenue,
      `"${new Date(u.createdAt).toISOString()}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded");
  };

  const columns: Column<UserRow>[] = [
    {
      key: "name",
      header: "User",
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar className="h-7 w-7 rounded-md border border-border/60 shrink-0">
            <AvatarImage src={u.image || undefined} />
            <AvatarFallback className="rounded-md bg-muted text-[10px] font-bold">
              {(u.name || u.email).slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex flex-col">
            <span className="font-semibold text-foreground truncate max-w-[150px]">
              {u.name || "No name"}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[150px]">
              {u.id.slice(0, 8)}...
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      render: (u) => (
        <span className="font-mono text-muted-foreground truncate max-w-[180px] block">
          {u.email}
        </span>
      ),
    },
    {
      key: "isPro",
      header: "Plan",
      align: "center",
      render: (u) =>
        u.isPro ? (
          <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
            PRO
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            Free
          </span>
        ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (u) =>
        u.status === "suspended" ? (
          <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/20">
            Suspended
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Active
          </span>
        ),
    },
    {
      key: "gamesCount",
      header: "Games",
      align: "right",
      sortable: true,
      render: (u) => <span>{u.gamesCount.toLocaleString()}</span>,
    },
    {
      key: "mockTestsCount",
      header: "Mock Tests",
      align: "right",
      render: (u) => <span>{u.mockTestsCount}</span>,
    },
    {
      key: "revenue",
      header: "Revenue",
      align: "right",
      render: (u) => (
        <span className={u.revenue > 0 ? "font-semibold text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
          ₹{u.revenue.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      align: "right",
      sortable: true,
      render: (u) => (
        <span className="text-muted-foreground text-[11px]">
          {new Date(u.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  const bulkActions = [
    {
      label: "Suspend",
      variant: "destructive" as const,
      action: (selectedIds: string[]) => {
        setConfirmState({
          open: true,
          title: `Suspend ${selectedIds.length} users?`,
          description: "Suspended users will immediately lose access to games and dashboard features.",
          action: async () => {
            const res = await bulkUpdateUsers(selectedIds, "suspend");
            if (res.success) {
              toast.success(`Suspended ${selectedIds.length} users`);
              router.refresh();
            }
          },
        });
      },
    },
    {
      label: "Reactivate",
      action: async (selectedIds: string[]) => {
        const res = await bulkUpdateUsers(selectedIds, "reactivate");
        if (res.success) {
          toast.success(`Reactivated ${selectedIds.length} users`);
          router.refresh();
        }
      },
    },
    {
      label: "Make Pro",
      action: async (selectedIds: string[]) => {
        const res = await bulkUpdateUsers(selectedIds, "make_pro");
        if (res.success) {
          toast.success(`Granted Pro access to ${selectedIds.length} users`);
          router.refresh();
        }
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            User Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage student registrations, plans, cognitive test access, and account status. Total: {total.toLocaleString()}
          </p>
        </div>
      </div>

      <DataTable
        data={usersList}
        columns={columns}
        keyExtractor={(u) => u.id}
        searchPlaceholder="Search by name or email..."
        searchKey={(u) => `${u.name || ""} ${u.email}`}
        filterOptions={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        bulkActions={bulkActions}
        onExportCsv={handleExportCsv}
        loading={loading}
        onRowClick={(u) => router.push(`/admin/users/${u.id}`)}
      />

      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={(open) => setConfirmState((s) => ({ ...s, open }))}
        title={confirmState.title}
        description={confirmState.description}
        onConfirm={confirmState.action}
      />
    </div>
  );
}
