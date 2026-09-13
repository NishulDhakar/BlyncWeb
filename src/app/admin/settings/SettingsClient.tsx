"use client";

import React, { useState } from "react";
import {
  updateSystemSettings,
  updateAdminRole,
  assignAdminByEmail,
} from "@/features/admin/settingsActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  Settings,
  Shield,
  CreditCard,
  Mail,
  UserPlus,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Headphones,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AdminRole } from "@/features/admin/auth";

export interface SettingsClientProps {
  settings: Record<string, any>;
  admins: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    status: string;
    createdAt: Date;
  }[];
  currentAdminEmail: string;
}

export function SettingsClient({
  settings: initialSettings,
  admins: initialAdmins,
  currentAdminEmail,
}: SettingsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "general" | "payments" | "email" | "features" | "admins" | "security"
  >("general");

  // General Settings State
  const [general, setGeneral] = useState({
    platformName: initialSettings.general?.platformName || "CognitiveGames.me",
    supportEmail: initialSettings.general?.supportEmail || "blyncgames@gmail.com",
    maintenanceMode: initialSettings.general?.maintenanceMode || false,
    allowRegistrations: initialSettings.general?.allowRegistrations ?? true,
  });

  // Feature Flags State
  const [features, setFeatures] = useState({
    enableRazorpay: initialSettings.features?.enableRazorpay ?? true,
    enableMockTests: initialSettings.features?.enableMockTests ?? true,
    enableAiChatbot: initialSettings.features?.enableAiChatbot ?? true,
    dailyFreeGameLimit: initialSettings.features?.dailyFreeGameLimit || 3,
  });

  const [saving, setSaving] = useState(false);

  // Admin Management State
  const [adminsList, setAdminsList] = useState(initialAdmins);
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>("admin");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [confirmRole, setConfirmRole] = useState<{
    open: boolean;
    userId: string;
    newRole: AdminRole | "user";
    title: string;
  }>({ open: false, userId: "", newRole: "admin", title: "" });

  const handleSaveGeneral = async () => {
    setSaving(true);
    try {
      await updateSystemSettings("general", general);
      toast.success("General settings saved");
      router.refresh();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFeatures = async () => {
    setSaving(true);
    try {
      await updateSystemSettings("features", features);
      toast.success("Feature configuration saved");
      router.refresh();
    } catch {
      toast.error("Failed to save feature configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingAdmin(true);
    try {
      await assignAdminByEmail(newAdminEmail, newAdminRole);
      toast.success(`Assigned ${newAdminRole} role to ${newAdminEmail}`);
      setAddAdminOpen(false);
      setNewAdminEmail("");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to assign role");
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleRoleChange = (userId: string, targetRole: AdminRole | "user") => {
    setConfirmRole({
      open: true,
      userId,
      newRole: targetRole,
      title: `Change role to ${targetRole.replace("_", " ").toUpperCase()}?`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Platform Settings & Governance
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure global platform variables, Razorpay settings, feature toggles, and role-based admin access.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border/80 pb-2 text-xs font-medium">
        {(
          [
            { id: "general", label: "General", icon: Settings },
            { id: "payments", label: "Payments", icon: CreditCard },
            { id: "email", label: "Email & SMTP", icon: Mail },
            { id: "features", label: "Features", icon: Sliders },
            { id: "admins", label: "Admin Team", icon: ShieldCheck },
            { id: "security", label: "Security & Policy", icon: Shield },
          ] as const
        ).map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors cursor-pointer ${
                activeTab === t.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* 1. General Settings Tab */}
      {activeTab === "general" && (
        <div className="max-w-2xl rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            General Application Parameters
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-medium text-foreground block mb-1">
                Platform Name
              </label>
              <Input
                value={general.platformName}
                onChange={(e) =>
                  setGeneral({ ...general, platformName: e.target.value })
                }
                className="h-8 text-xs font-sans"
              />
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">
                Public Support Email
              </label>
              <Input
                type="email"
                value={general.supportEmail}
                onChange={(e) =>
                  setGeneral({ ...general, supportEmail: e.target.value })
                }
                className="h-8 text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <div>
                <span className="font-medium text-foreground block">
                  Maintenance Mode
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Temporarily disable public gameplay for scheduled updates
                </span>
              </div>
              <Switch
                checked={general.maintenanceMode}
                onCheckedChange={(v) =>
                  setGeneral({ ...general, maintenanceMode: v })
                }
              />
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <div>
                <span className="font-medium text-foreground block">
                  Allow Student Signups
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Accept new registrations via Google OAuth and Email
                </span>
              </div>
              <Switch
                checked={general.allowRegistrations}
                onCheckedChange={(v) =>
                  setGeneral({ ...general, allowRegistrations: v })
                }
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              size="sm"
              onClick={handleSaveGeneral}
              disabled={saving}
              className="h-8 text-xs gap-1.5 cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Save General Settings
            </Button>
          </div>
        </div>
      )}

      {/* 2. Payments Tab */}
      {activeTab === "payments" && (
        <div className="max-w-2xl rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Razorpay Payment Gateway Integration
          </h3>

          <div className="rounded-lg border border-border/60 p-3 bg-muted/20 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground font-sans">Razorpay Status:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                ACTIVE & VERIFIED
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-sans">Monthly Plan (₹49):</span>
              <span className="font-mono text-foreground">plan_PzLqQcW40w2W1E</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-sans">Biannual Plan (₹199):</span>
              <span className="font-mono text-foreground">plan_PzLqQcW40w2W1E (6M)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-sans">Webhook Handler:</span>
              <span className="font-mono text-foreground">/api/subscription/webhook</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            API keys and webhook secrets are loaded directly from server environment variables (<code>.env</code>) and are never exposed to browser clients.
          </p>
        </div>
      )}

      {/* 3. Email Tab */}
      {activeTab === "email" && (
        <div className="max-w-2xl rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Email & SMTP Transmission
          </h3>

          <div className="rounded-lg border border-border/60 p-3 bg-muted/20 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">SMTP Transport:</span>
              <span className="font-mono text-foreground">smtp.gmail.com (Port 587)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sender Account:</span>
              <span className="font-mono text-foreground">blyncgames@gmail.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Welcome Email Hook:</span>
              <span className="text-emerald-600 font-semibold">Enabled on signup</span>
            </div>
          </div>

          <div className="flex justify-start">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push("/admin/broadcast")}
              className="h-8 text-xs cursor-pointer"
            >
              Open Email Broadcast Console →
            </Button>
          </div>
        </div>
      )}

      {/* 4. Features Tab */}
      {activeTab === "features" && (
        <div className="max-w-2xl rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Platform Feature Toggles
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="font-medium text-foreground block">
                  Enable Razorpay Pro Upgrades
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Allow students to upgrade to Pro plans via checkout modal
                </span>
              </div>
              <Switch
                checked={features.enableRazorpay}
                onCheckedChange={(v) =>
                  setFeatures({ ...features, enableRazorpay: v })
                }
              />
            </div>

            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="font-medium text-foreground block">
                  Enable Placement Mock Tests
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Allow students to take full-length company assessments
                </span>
              </div>
              <Switch
                checked={features.enableMockTests}
                onCheckedChange={(v) =>
                  setFeatures({ ...features, enableMockTests: v })
                }
              />
            </div>

            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="font-medium text-foreground block">
                  Enable AI Chatbot
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Display the interactive Blync placement guidance assistant
                </span>
              </div>
              <Switch
                checked={features.enableAiChatbot}
                onCheckedChange={(v) =>
                  setFeatures({ ...features, enableAiChatbot: v })
                }
              />
            </div>

            <div className="pt-1">
              <label className="font-medium text-foreground block mb-1">
                Daily Free Game Attempts Limit
              </label>
              <Input
                type="number"
                value={features.dailyFreeGameLimit}
                onChange={(e) =>
                  setFeatures({
                    ...features,
                    dailyFreeGameLimit: Number(e.target.value),
                  })
                }
                className="h-8 text-xs font-mono w-32"
              />
              <span className="text-[11px] text-muted-foreground mt-1 block">
                Number of free challenge game sessions per game per day for non-Pro users
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              size="sm"
              onClick={handleSaveFeatures}
              disabled={saving}
              className="h-8 text-xs gap-1.5 cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Save Feature Toggles
            </Button>
          </div>
        </div>
      )}

      {/* 5. Admins Management Tab */}
      {activeTab === "admins" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Authorized Administrative Team
              </h3>
              <p className="text-xs text-muted-foreground">
                Manage roles and system privileges across Super Admin, Admin, and Support.
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => setAddAdminOpen(true)}
              className="h-8 text-xs gap-1.5 cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Assign Admin Role
            </Button>
          </div>

          <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  <th className="px-4 py-2.5">Administrator</th>
                  <th className="px-4 py-2.5">Email</th>
                  <th className="px-4 py-2.5 text-center">Assigned Role</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {adminsList.map((a) => {
                  const isCurrent =
                    a.email.toLowerCase() === currentAdminEmail.toLowerCase();
                  return (
                    <tr key={a.id} className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-medium text-foreground">
                        {a.name || "Administrator"} {isCurrent && "(You)"}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-muted-foreground">
                        {a.email}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            a.role === "super_admin"
                              ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                              : a.role === "admin"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {a.role.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {!isCurrent && (
                          <div className="flex items-center justify-end gap-1">
                            <select
                              value={a.role}
                              onChange={(e) =>
                                handleRoleChange(a.id, e.target.value as any)
                              }
                              className="h-7 rounded border border-border bg-card px-2 text-[11px]"
                            >
                              <option value="super_admin">Super Admin</option>
                              <option value="admin">Admin</option>
                              <option value="support">Support</option>
                              <option value="user">Remove (Demote)</option>
                            </select>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Security Tab */}
      {activeTab === "security" && (
        <div className="max-w-2xl rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Security & Authentication Policy
          </h3>

          <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
            <div className="rounded-lg border border-border/60 p-3 bg-muted/20 space-y-2">
              <div className="flex justify-between text-foreground">
                <span className="font-medium">Authentication Framework:</span>
                <span className="font-mono">Better Auth 1.3.7</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span className="font-medium">Session Duration:</span>
                <span className="font-mono">30 Days (Rolling renewal)</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span className="font-medium">Admin Endpoint Protection:</span>
                <span className="text-emerald-600 font-semibold">Strict Server-Side Verify</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span className="font-medium">Immutable Audit Trail:</span>
                <span className="text-emerald-600 font-semibold">Enabled</span>
              </div>
            </div>

            <p>
              Every administrator action (changing student plans, processing Razorpay refunds, suspending accounts, creating challenge games) triggers an automatic record in the <code>audit_log</code> table with timestamp, admin ID, and metadata.
            </p>
          </div>
        </div>
      )}

      {/* Add Admin Dialog */}
      <Dialog open={addAdminOpen} onOpenChange={setAddAdminOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Assign Administrator Privileges
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddAdmin} className="space-y-3 mt-2 text-xs">
            <div>
              <label className="font-medium text-foreground block mb-1">
                Registered User Email
              </label>
              <Input
                required
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="admin.user@gmail.com"
                className="h-8 text-xs font-mono"
              />
              <span className="text-[10px] text-muted-foreground mt-1 block">
                The account must already be registered on CognitiveGames.me.
              </span>
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">
                Assigned Role
              </label>
              <select
                value={newAdminRole}
                onChange={(e) => setNewAdminRole(e.target.value as AdminRole)}
                className="w-full h-8 rounded-md border border-border bg-card px-2 text-xs"
              >
                <option value="super_admin">Super Admin (Full platform & finance control)</option>
                <option value="admin">Admin (Users, Games, Companies, Mock Tests, Analytics)</option>
                <option value="support">Support (User view, Feedback resolution)</option>
              </select>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAddAdminOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={addingAdmin}>
                {addingAdmin ? "Assigning..." : "Confirm Role Assignment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmRole.open}
        onOpenChange={(open) => setConfirmRole((s) => ({ ...s, open }))}
        title={confirmRole.title}
        description="This will immediately update administrative permissions for this user."
        onConfirm={async () => {
          await updateAdminRole(confirmRole.userId, confirmRole.newRole);
          toast.success("Role updated");
          router.refresh();
        }}
      />
    </div>
  );
}
