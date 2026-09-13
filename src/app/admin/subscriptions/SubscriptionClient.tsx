"use client";

import React, { useState } from "react";
import { MetricCard } from "@/components/admin/MetricCard";
import { DataTable, type Column } from "@/components/admin/DataTable";
import type { SubscriptionItem } from "@/features/admin/subscriptionActions";
import { getSubscriptions } from "@/features/admin/subscriptionActions";
import { Repeat, UserCheck, UserX, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export interface SubscriptionClientProps {
  initialData: {
    subscriptions: SubscriptionItem[];
    total: number;
    page: number;
    totalPages: number;
  };
  metrics: {
    activeSubscriptions: number;
    newSubscriptionsMonth: number;
    cancelledSubscriptions: number;
    mrrINR: number;
    churnRate: number;
  };
}

export function SubscriptionClient({
  initialData,
  metrics,
}: SubscriptionClientProps) {
  const [subsList, setSubsList] = useState<SubscriptionItem[]>(initialData.subscriptions);
  const [total, setTotal] = useState(initialData.total);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Created", value: "created" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Halted", value: "halted" },
  ];

  const handleFilterChange = async (val: string) => {
    setActiveFilter(val);
    setLoading(true);
    try {
      const res = await getSubscriptions({ status: val, page: 1 });
      setSubsList(res.subscriptions);
      setTotal(res.total);
    } catch {
      toast.error("Failed to filter subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<SubscriptionItem>[] = [
    {
      key: "user",
      header: "Subscriber",
      render: (s) => (
        <div className="flex flex-col">
          <Link
            href={`/admin/users/${s.userId}`}
            className="font-medium text-foreground hover:underline truncate max-w-[170px]"
          >
            {s.userName || "Subscriber"}
          </Link>
          <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[170px]">
            {s.userEmail || s.userId.slice(0, 10) + "..."}
          </span>
        </div>
      ),
    },
    {
      key: "planType",
      header: "Plan",
      align: "center",
      render: (s) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
          {s.planType === "biannual" ? "6-Month Pro" : "Monthly Pro"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Rate",
      align: "right",
      render: (s) => (
        <span className="font-mono font-semibold text-foreground">
          ₹{s.amount}/{s.billingInterval}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (s) => {
        const styles: Record<string, string> = {
          active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          created: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          cancelled: "bg-rose-500/10 text-rose-600 border-rose-500/20",
          halted: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        };
        return (
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
              styles[s.status] || "bg-muted text-muted-foreground"
            }`}
          >
            {s.status.toUpperCase()}
          </span>
        );
      },
    },
    {
      key: "razorpaySubscriptionId",
      header: "Razorpay Sub ID",
      render: (s) => (
        <span className="font-mono text-muted-foreground text-[11px]">
          {s.razorpaySubscriptionId}
        </span>
      ),
    },
    {
      key: "expiresAt",
      header: "Renewal / Expiry",
      align: "right",
      render: (s) => (
        <span className="font-mono text-[11px] text-muted-foreground">
          {s.expiresAt
            ? new Date(s.expiresAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Started",
      align: "right",
      render: (s) => (
        <span className="font-mono text-[11px] text-muted-foreground">
          {new Date(s.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Subscriptions & Recurring Revenue
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Real subscription lifecycle managed via Razorpay webhooks. Total registered subscriptions: {total.toLocaleString()}
        </p>
      </div>

      {/* 5 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricCard
          label="Active Subscriptions"
          value={metrics.activeSubscriptions.toLocaleString("en-IN")}
          subtext="Paying recurring students"
          icon={UserCheck}
        />
        <MetricCard
          label="New This Month"
          value={`+${metrics.newSubscriptionsMonth}`}
          subtext="Activated in last 30D"
          icon={Repeat}
        />
        <MetricCard
          label="Cancelled Subscriptions"
          value={metrics.cancelledSubscriptions.toLocaleString("en-IN")}
          subtext="Total churned accounts"
          icon={UserX}
        />
        <MetricCard
          label="Normalized MRR"
          value={`₹${metrics.mrrINR.toLocaleString("en-IN")}`}
          subtext="Monthly recurring runrate"
          icon={TrendingUp}
        />
        <MetricCard
          label="Estimated Churn"
          value={`${metrics.churnRate}%`}
          subtext="Cancelled / Total churn base"
          icon={AlertTriangle}
        />
      </div>

      {/* Table */}
      <DataTable
        data={subsList}
        columns={columns}
        keyExtractor={(s) => s.id}
        searchPlaceholder="Search by Razorpay Sub ID or subscriber..."
        searchKey={(s) => `${s.razorpaySubscriptionId} ${s.userName || ""} ${s.userEmail || ""}`}
        filterOptions={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        loading={loading}
      />
    </div>
  );
}
