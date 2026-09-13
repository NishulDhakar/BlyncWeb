"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateUserPlan,
  updateUserStatus,
  updateUserNotes,
  deleteUser,
} from "@/features/admin/userActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  Crown,
  ShieldAlert,
  CreditCard,
  Gamepad2,
  FileCheck2,
  Calendar,
  Flame,
  Save,
  Trash2,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export interface UserDetailClientProps {
  data: {
    user: {
      id: string;
      name: string | null;
      email: string;
      emailVerified: boolean;
      image: string | null;
      role: string;
      status: string;
      notes: string | null;
      isPro: boolean;
      subscriptionStatus: string | null;
      razorpaySubscriptionId: string | null;
      razorpayCustomerId: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
    stats: {
      gamesPlayed: number;
      mockTestsCompleted: number;
      totalRevenueINR: number;
      currentStreak: number;
      longestStreak: number;
    };
    subscriptions: any[];
    payments: any[];
    gameScores: any[];
    mockTests: any[];
  };
}

export function UserDetailClient({ data }: UserDetailClientProps) {
  const router = useRouter();
  const { user, stats, subscriptions: subs, payments: pmts, gameScores: scores, mockTests: mcks } = data;
  const [notes, setNotes] = useState(user.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
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

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await updateUserNotes(user.id, notes);
      toast.success("Admin notes saved");
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleChangePlan = () => {
    const newPlan = !user.isPro;
    setConfirmDialog({
      open: true,
      title: `Change plan to ${newPlan ? "PRO" : "FREE"}?`,
      description: `This will ${
        newPlan ? "grant unlimited" : "revoke premium"
      } access to placement games and mock tests.`,
      action: async () => {
        await updateUserPlan(user.id, newPlan);
        toast.success(`Plan updated to ${newPlan ? "Pro" : "Free"}`);
        router.refresh();
      },
    });
  };

  const handleToggleStatus = () => {
    const newStatus = user.status === "suspended" ? "active" : "suspended";
    setConfirmDialog({
      open: true,
      title: `${newStatus === "suspended" ? "Suspend" : "Reactivate"} account?`,
      description:
        newStatus === "suspended"
          ? "The user will be immediately blocked from signing in or playing any games."
          : "The user's access will be fully restored.",
      action: async () => {
        await updateUserStatus(user.id, newStatus);
        toast.success(`User is now ${newStatus}`);
        router.refresh();
      },
    });
  };

  const handleDelete = () => {
    setConfirmDialog({
      open: true,
      title: "Permanently delete user?",
      description:
        "WARNING: This action is irreversible. All scores, streaks, attempts, and account data will be permanently removed.",
      action: async () => {
        await deleteUser(user.id);
        toast.success("User deleted");
        router.push("/admin/users");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Back button & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Users
        </Link>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleChangePlan}
            className="h-8 text-xs cursor-pointer"
          >
            <Crown className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
            {user.isPro ? "Demote to Free" : "Upgrade to Pro"}
          </Button>
          <Button
            size="sm"
            variant={user.status === "suspended" ? "default" : "outline"}
            onClick={handleToggleStatus}
            className="h-8 text-xs cursor-pointer"
          >
            <ShieldAlert className="mr-1.5 h-3.5 w-3.5 text-rose-500" />
            {user.status === "suspended" ? "Reactivate" : "Suspend"}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            className="h-8 text-xs cursor-pointer"
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-1 rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-lg border border-border/70 shrink-0">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">
                {(user.name || user.email).slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex flex-col">
              <h2 className="text-base font-bold text-foreground truncate">
                {user.name || "Unnamed User"}
              </h2>
              <span className="text-xs font-mono text-muted-foreground truncate">
                {user.email}
              </span>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID:</span>
              <span className="font-mono text-foreground">{user.id.slice(0, 12)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span
                className={`font-semibold ${
                  user.status === "suspended" ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {user.status.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan:</span>
              <span className="font-semibold text-foreground">
                {user.isPro ? "PRO" : "FREE"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Joined:</span>
              <span className="text-foreground font-mono">
                {new Date(user.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            {user.razorpayCustomerId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer ID:</span>
                <span className="font-mono text-foreground text-[11px]">
                  {user.razorpayCustomerId}
                </span>
              </div>
            )}
            {user.razorpaySubscriptionId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sub ID:</span>
                <span className="font-mono text-foreground text-[11px]">
                  {user.razorpaySubscriptionId}
                </span>
              </div>
            )}
          </div>

          {/* Admin Notes */}
          <div className="border-t border-border/60 pt-3 space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Internal Admin Notes
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add confidential notes on this user..."
              rows={3}
              className="text-xs font-sans"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="w-full text-xs h-7 gap-1"
            >
              <Save className="h-3.5 w-3.5" />
              Save Notes
            </Button>
          </div>
        </div>

        {/* Stats Grid & History (2 Cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-border/80 bg-card p-3 text-xs">
              <span className="text-muted-foreground block text-[11px]">
                Total Revenue
              </span>
              <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                ₹{stats.totalRevenueINR}
              </span>
            </div>
            <div className="rounded-lg border border-border/80 bg-card p-3 text-xs">
              <span className="text-muted-foreground block text-[11px]">
                Games Played
              </span>
              <span className="text-base font-bold font-mono text-foreground">
                {stats.gamesPlayed}
              </span>
            </div>
            <div className="rounded-lg border border-border/80 bg-card p-3 text-xs">
              <span className="text-muted-foreground block text-[11px]">
                Mock Tests
              </span>
              <span className="text-base font-bold font-mono text-foreground">
                {stats.mockTestsCompleted}
              </span>
            </div>
            <div className="rounded-lg border border-border/80 bg-card p-3 text-xs">
              <span className="text-muted-foreground block text-[11px]">
                Current Streak
              </span>
              <span className="text-base font-bold font-mono text-amber-500">
                {stats.currentStreak} days
              </span>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" /> Payment History
            </h3>
            {pmts.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No payment transactions recorded for this user
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border/60 text-[11px] text-muted-foreground uppercase">
                      <th className="py-2">Transaction ID</th>
                      <th className="py-2">Plan</th>
                      <th className="py-2 text-right">Amount</th>
                      <th className="py-2 text-center">Status</th>
                      <th className="py-2 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    {pmts.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2 text-foreground font-medium truncate max-w-[150px]">
                          {p.id}
                        </td>
                        <td className="py-2 font-sans capitalize">{p.planType}</td>
                        <td className="py-2 text-right text-emerald-600">
                          ₹{p.amount / 100}
                        </td>
                        <td className="py-2 text-center">
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600">
                            {p.status}
                          </span>
                        </td>
                        <td className="py-2 text-right text-muted-foreground text-[11px]">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Game Scores Table */}
          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Gamepad2 className="h-3.5 w-3.5" /> Recent Game Scores
            </h3>
            {scores.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No game scores recorded yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border/60 text-[11px] text-muted-foreground uppercase">
                      <th className="py-2">Game Challenge</th>
                      <th className="py-2 text-right">Score</th>
                      <th className="py-2 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {scores.map((s) => (
                      <tr key={s.id}>
                        <td className="py-2 font-medium text-foreground">
                          {s.gameId.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                        </td>
                        <td className="py-2 text-right font-mono font-bold text-foreground">
                          {s.score}
                        </td>
                        <td className="py-2 text-right text-muted-foreground font-mono text-[11px]">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((s) => ({ ...s, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.action}
      />
    </div>
  );
}
