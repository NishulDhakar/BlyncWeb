"use client";

import React, { useState } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import type { PaymentItem } from "@/features/admin/paymentActions";
import { getPayments, syncRazorpayPayments } from "@/features/admin/paymentActions";
import { Button } from "@/components/ui/button";
import { RefreshCw, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface PaymentTableClientProps {
  initialData: {
    payments: PaymentItem[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export function PaymentTableClient({ initialData }: PaymentTableClientProps) {
  const router = useRouter();
  const [paymentsList, setPaymentsList] = useState<PaymentItem[]>(initialData.payments);
  const [total, setTotal] = useState(initialData.total);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Succeeded", value: "succeeded" },
    { label: "Pending", value: "pending" },
    { label: "Failed", value: "failed" },
    { label: "Refunded", value: "refunded" },
  ];

  const handleFilterChange = async (val: string) => {
    setActiveFilter(val);
    setLoading(true);
    try {
      const res = await getPayments({ status: val, page: 1 });
      setPaymentsList(res.payments);
      setTotal(res.total);
    } catch {
      toast.error("Failed to filter payments");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await syncRazorpayPayments();
      toast.success(`Successfully synced ${res.count} transactions from Razorpay`);
      router.refresh();
      const updated = await getPayments({ status: activeFilter, page: 1 });
      setPaymentsList(updated.payments);
      setTotal(updated.total);
    } catch (e: any) {
      toast.error(e.message || "Failed to sync with Razorpay");
    } finally {
      setSyncing(false);
    }
  };

  const columns: Column<PaymentItem>[] = [
    {
      key: "id",
      header: "Transaction ID",
      sortable: true,
      render: (p) => (
        <div className="flex flex-col">
          <span className="font-mono font-medium text-foreground">{p.id}</span>
          <span className="text-[10px] text-muted-foreground capitalize">
            via {p.provider} {p.method ? `(${p.method})` : ""}
          </span>
        </div>
      ),
    },
    {
      key: "user",
      header: "User / Payer",
      render: (p) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground truncate max-w-[170px]">
            {p.userName || p.email || "Guest checkout"}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[170px]">
            {p.email || p.userEmail || p.contact || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      sortable: true,
      render: (p) => (
        <div className="flex flex-col items-end">
          <span className="font-mono font-bold text-foreground">
            ₹{(p.amount / 100).toLocaleString("en-IN")}
          </span>
          {(p.refundedAmount || 0) > 0 && (
            <span className="text-[10px] text-rose-500 font-mono">
              -₹{((p.refundedAmount || 0) / 100).toLocaleString("en-IN")} refunded
            </span>
          )}
        </div>
      ),
    },
    {
      key: "planType",
      header: "Plan",
      align: "center",
      render: (p) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
          {p.planType === "biannual" ? "6-Month Pro" : "Monthly Pro"}
        </span>
      ),
    },
    {
      key: "provider",
      header: "Provider",
      align: "center",
      render: (p) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
          <CreditCard className="h-3 w-3" />
          {p.provider}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (p) => {
        const styles: Record<string, string> = {
          succeeded:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          pending:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          failed:
            "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          refunded:
            "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        };
        return (
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
              styles[p.status] || "bg-muted text-muted-foreground"
            }`}
          >
            {p.status.toUpperCase()}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "Created",
      align: "right",
      sortable: true,
      render: (p) => (
        <span className="text-muted-foreground text-[11px]">
          {new Date(p.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Payment Transactions
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real captured transactions and charge events directly verified with Razorpay. Total: {total.toLocaleString()}
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleSync}
          disabled={syncing}
          className="h-8 text-xs gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
          Sync with Razorpay
        </Button>
      </div>

      <DataTable
        data={paymentsList}
        columns={columns}
        keyExtractor={(p) => p.id}
        searchPlaceholder="Search by transaction ID, email, or phone..."
        searchKey={(p) => `${p.id} ${p.email || ""} ${p.contact || ""}`}
        filterOptions={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        loading={loading}
        onRowClick={(p) => router.push(`/admin/payments/${p.id}`)}
      />
    </div>
  );
}
