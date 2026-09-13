"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { refundPayment } from "@/features/admin/paymentActions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  RotateCcw,
  CreditCard,
  User,
  Calendar,
  ShieldCheck,
  Tag,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export interface PaymentDetailClientProps {
  payment: {
    id: string;
    userId: string | null;
    userName: string | null;
    userEmail: string | null;
    razorpayPaymentId: string | null;
    subscriptionId: string | null;
    amount: number;
    currency: string;
    planType: string | null;
    provider: string;
    status: string;
    method: string | null;
    email: string | null;
    contact: string | null;
    refundedAmount: number | null;
    refundId: string | null;
    metadata: any;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function PaymentDetailClient({ payment }: PaymentDetailClientProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [refunding, setRefunding] = useState(false);

  const canRefund =
    payment.status === "succeeded" && (payment.refundedAmount || 0) < payment.amount;

  const handleRefund = async () => {
    setRefunding(true);
    try {
      const res = await refundPayment(payment.id);
      if (res.success) {
        toast.success(`Payment refunded successfully via Razorpay (Refund ID: ${res.refundId})`);
        router.refresh();
      }
    } catch (e: any) {
      toast.error(e.message || "Refund failed");
    } finally {
      setRefunding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/payments"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Payments
        </Link>

        {canRefund && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
            disabled={refunding}
            className="h-8 text-xs cursor-pointer"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Issue Full Refund (₹{payment.amount / 100})
          </Button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Summary */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Transaction Summary
                </span>
                <h2 className="text-lg font-bold font-mono text-foreground mt-0.5">
                  {payment.id}
                </h2>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider ${
                  payment.status === "succeeded"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : payment.status === "refunded"
                    ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {payment.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-muted-foreground block text-[11px] font-sans">
                  Total Amount
                </span>
                <span className="text-lg font-bold text-foreground">
                  ₹{(payment.amount / 100).toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px] font-sans">
                  Refunded
                </span>
                <span className="text-lg font-bold text-rose-500">
                  ₹{((payment.refundedAmount || 0) / 100).toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px] font-sans">
                  Net Retained
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{((payment.amount - (payment.refundedAmount || 0)) / 100).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="border-t border-border/60 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Payment Provider:</span>
                <span className="font-mono text-foreground ml-2 capitalize">
                  {payment.provider}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-mono text-foreground ml-2 uppercase">
                  {payment.method || "UPI / CARD"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Plan Product:</span>
                <span className="font-semibold text-foreground ml-2 capitalize">
                  {payment.planType === "biannual" ? "6-Month Pro" : "Monthly Pro"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Currency:</span>
                <span className="font-mono text-foreground ml-2">
                  {payment.currency}
                </span>
              </div>
              {payment.refundId && (
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground">Refund ID:</span>
                  <span className="font-mono text-foreground ml-2 font-semibold text-purple-600">
                    {payment.refundId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Raw Metadata card */}
          {payment.metadata && (
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Payment Metadata & Gateway Logs
              </h3>
              <pre className="rounded-lg bg-muted/50 p-3 text-[11px] font-mono text-muted-foreground overflow-x-auto">
                {JSON.stringify(payment.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right Column: User / Payer details */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Payer Information
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Name / Email
                </span>
                <span className="font-semibold text-foreground">
                  {payment.userName || payment.email || "Guest"}
                </span>
                <div className="font-mono text-muted-foreground text-[11px]">
                  {payment.email || payment.userEmail || "No email"}
                </div>
              </div>

              {payment.contact && (
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Phone Number
                  </span>
                  <span className="font-mono text-foreground">
                    {payment.contact}
                  </span>
                </div>
              )}

              {payment.userId && (
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Linked User Account
                  </span>
                  <Link
                    href={`/admin/users/${payment.userId}`}
                    className="font-mono text-primary hover:underline text-[11px]"
                  >
                    View User Profile ({payment.userId.slice(0, 10)}...)
                  </Link>
                </div>
              )}

              <div className="border-t border-border/60 pt-3">
                <span className="text-muted-foreground block text-[11px]">
                  Created Timestamp
                </span>
                <span className="font-mono text-foreground text-[11px]">
                  {new Date(payment.createdAt).toUTCString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Refund ₹${payment.amount / 100} to customer?`}
        description="This will send an immediate refund instruction to Razorpay and revoke the user's Pro privileges."
        confirmLabel="Process Refund"
        onConfirm={handleRefund}
      />
    </div>
  );
}
