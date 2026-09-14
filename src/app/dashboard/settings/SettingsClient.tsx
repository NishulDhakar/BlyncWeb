"use client";

import { useState, useTransition } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { toast } from "sonner";
import {
  User,
  Sliders,
  Bell,
  Palette,
  ShieldCheck,
  Crown,
  AlertTriangle,
  Check,
  Copy,
  Download,
  Trash2,
  RotateCcw,
  Laptop,
  Smartphone,
  Globe,
  KeyRound,
  ExternalLink,
  Eye,
  EyeOff,
  Flame,
  Building,
  GraduationCap,
  Save,
  Loader2,
  Sparkles,
  Volume2,
  VolumeX,
  Gauge,
  HelpCircle,
  Clock,
  Briefcase,
  Monitor,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  type UserSettingsPayload,
  type ProfilePreferences,
  type GameplayPreferences,
  type NotificationPreferences,
  type AppearancePreferences,
  updateProfileSettings,
  updateGameplaySettings,
  updateNotificationSettings,
  updateAppearanceSettings,
  changePasswordAction,
  revokeSessionAction,
  revokeAllOtherSessionsAction,
  exportUserDataAction,
  resetGameHistoryAction,
  deleteAccountAction,
} from "@/features/settings/actions";

interface Props {
  initialData: UserSettingsPayload;
}

const PRESET_AVATARS = [
  { id: "brain", label: "Cognitive Ace", emoji: "🧠", color: "from-indigo-500 to-purple-600" },
  { id: "rocket", label: "Placement Rocket", emoji: "🚀", color: "from-blue-500 to-cyan-600" },
  { id: "lightning", label: "Speed Solver", emoji: "⚡", color: "from-amber-400 to-orange-500" },
  { id: "target", label: "Focus Master", emoji: "🎯", color: "from-rose-500 to-red-600" },
  { id: "shield", label: "Logic Sentinel", emoji: "🛡️", color: "from-emerald-500 to-teal-600" },
  { id: "trophy", label: "Rank Leader", emoji: "🏆", color: "from-yellow-400 to-amber-500" },
  { id: "crystal", label: "Pattern Seeker", emoji: "🔮", color: "from-fuchsia-500 to-pink-600" },
  { id: "terminal", label: "Algorithm Pro", emoji: "💻", color: "from-slate-700 to-slate-900" },
];

const TARGET_COMPANY_OPTIONS = [
  "Cognizant",
  "Capgemini",
  "Accenture",
  "TCS",
  "Infosys",
  "Deloitte",
  "Amazon",
  "McKinsey",
  "Wipro",
  "PwC",
  "EY",
  "Goldman Sachs",
];

const ROLE_OPTIONS = [
  "Software Development Engineer (SDE)",
  "Quantitative & Risk Analyst",
  "Associate Systems Engineer (ASE)",
  "Strategy & Management Consultant",
  "Data Scientist / AI Engineer",
  "Campus Placement Aspirant (General)",
];

const GRAD_YEAR_OPTIONS = ["2024", "2025", "2026", "2027", "2028+"];

export default function SettingsClient({ initialData }: Props) {
  const { theme, setTheme } = useTheme();

  // ── Profile State ──────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<ProfilePreferences>(initialData.profile);
  const [fullName, setFullName] = useState(initialData.user.name ?? "");
  const [avatarPreset, setAvatarPreset] = useState(initialData.profile.avatarPreset ?? "brain");
  const [customAvatarUrl, setCustomAvatarUrl] = useState(initialData.user.image ?? "");

  // ── Gameplay State ─────────────────────────────────────────────────────────
  const [gameplay, setGameplay] = useState<GameplayPreferences>(initialData.gameplay);

  // ── Notification State ─────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState<NotificationPreferences>(initialData.notifications);

  // ── Appearance State ───────────────────────────────────────────────────────
  const [appearance, setAppearance] = useState<AppearancePreferences>(initialData.appearance);

  // ── Password State ─────────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ── Session State ──────────────────────────────────────────────────────────
  const [activeSessions, setActiveSessions] = useState(initialData.activeSessions);

  // ── Dialog & Danger States ─────────────────────────────────────────────────
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // ── Pending Transitions ────────────────────────────────────────────────────
  const [isSavingProfile, startSavingProfile] = useTransition();
  const [isSavingGameplay, startSavingGameplay] = useTransition();
  const [isSavingNotifs, startSavingNotifs] = useTransition();
  const [isSavingPassword, startSavingPassword] = useTransition();
  const [isExporting, startExporting] = useTransition();
  const [isResetting, startResetting] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  // Helper: Copy text with toast
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  // ── Save Profile ───────────────────────────────────────────────────────────
  const handleSaveProfile = () => {
    startSavingProfile(async () => {
      try {
        await updateProfileSettings({
          name: fullName,
          image: customAvatarUrl.trim() ? customAvatarUrl.trim() : null,
          targetRole: profile.targetRole,
          gradYear: profile.gradYear,
          targetCompanies: profile.targetCompanies,
          bio: profile.bio,
          college: profile.college,
          avatarPreset,
        });
        toast.success("Profile preferences updated successfully");
      } catch (err: any) {
        toast.error(err?.message || "Failed to save profile settings");
      }
    });
  };

  // ── Toggle Target Company ──────────────────────────────────────────────────
  const toggleCompany = (company: string) => {
    setProfile((prev) => {
      const exists = prev.targetCompanies.includes(company);
      const targetCompanies = exists
        ? prev.targetCompanies.filter((c) => c !== company)
        : [...prev.targetCompanies, company];
      return { ...prev, targetCompanies };
    });
  };

  // ── Save Gameplay ──────────────────────────────────────────────────────────
  const handleSaveGameplay = () => {
    startSavingGameplay(async () => {
      try {
        await updateGameplaySettings(gameplay);
        toast.success("Assessment preferences saved");
      } catch (err: any) {
        toast.error(err?.message || "Failed to update gameplay settings");
      }
    });
  };

  // ── Save Notifications ─────────────────────────────────────────────────────
  const handleSaveNotifications = () => {
    startSavingNotifs(async () => {
      try {
        await updateNotificationSettings(notifications);
        toast.success("Notification preferences saved");
      } catch (err: any) {
        toast.error(err?.message || "Failed to update notification settings");
      }
    });
  };

  // ── Update Appearance ──────────────────────────────────────────────────────
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setAppearance((prev) => ({ ...prev, theme: newTheme }));
    updateAppearanceSettings({ ...appearance, theme: newTheme }).catch(() => {});
  };

  // ── Update Password ────────────────────────────────────────────────────────
  const handleChangePassword = () => {
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    startSavingPassword(async () => {
      const res = await changePasswordAction({
        currentPassword: currentPassword.trim() ? currentPassword.trim() : undefined,
        newPassword,
      });
      if (res.success) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.error || "Password update failed");
      }
    });
  };

  // ── Revoke Session ─────────────────────────────────────────────────────────
  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSessionAction(sessionId);
      setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success("Session revoked successfully");
    } catch {
      toast.error("Failed to revoke session");
    }
  };

  const handleRevokeOtherSessions = async () => {
    try {
      await revokeAllOtherSessionsAction();
      setActiveSessions((prev) => prev.filter((s) => s.isCurrent));
      toast.success("All other sessions logged out");
    } catch {
      toast.error("Failed to revoke other sessions");
    }
  };

  // ── Export User Data ───────────────────────────────────────────────────────
  const handleExportData = () => {
    startExporting(async () => {
      try {
        const data = await exportUserDataAction();
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cognitive-games-profile-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Portfolio data exported successfully!");
      } catch {
        toast.error("Could not export data. Please try again.");
      }
    });
  };

  // ── Reset Practice History ─────────────────────────────────────────────────
  const handleResetHistory = () => {
    startResetting(async () => {
      try {
        await resetGameHistoryAction();
        setResetDialogOpen(false);
        toast.success("Practice scores and attempt history reset.");
      } catch {
        toast.error("Failed to reset history.");
      }
    });
  };

  // ── Delete Account ─────────────────────────────────────────────────────────
  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm.');
      return;
    }
    startDeleting(async () => {
      try {
        await deleteAccountAction();
        window.location.href = "/";
      } catch {
        toast.error("Failed to delete account. Please try again or contact support.");
      }
    });
  };

  // Active avatar preset details
  const activePresetObj = PRESET_AVATARS.find((p) => p.id === avatarPreset) || PRESET_AVATARS[0];

  return (
    <div className="space-y-8 pb-20">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Settings & Preferences
            </h1>
            {initialData.user.isPro ? (
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30 gap-1 text-[11px] font-semibold py-0.5">
                <Crown className="h-3 w-3" />
                PRO
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground text-[11px] font-medium py-0.5">
                Free Tier
              </Badge>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Configure your candidate profile, assessment engine behavior, notification alerts, and security settings.
          </p>
        </div>

        {/* Quick summary chips */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-semibold text-foreground">{initialData.summary.currentStreak}</span>
            <span>day streak</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
            <Gamepad2Icon className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold text-foreground">{initialData.summary.totalGamesPlayed}</span>
            <span>games completed</span>
          </div>
        </div>
      </div>

      {/* ── Tabs Container ───────────────────────────────────────────────────── */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto p-1 bg-muted/50 border border-border/60 gap-1 rounded-xl">
          <TabsTrigger value="profile" className="flex items-center gap-2 py-2 text-xs font-medium cursor-pointer">
            <User className="h-3.5 w-3.5" />
            <span>Profile & Goals</span>
          </TabsTrigger>

          <TabsTrigger value="gameplay" className="flex items-center gap-2 py-2 text-xs font-medium cursor-pointer">
            <Sliders className="h-3.5 w-3.5" />
            <span>Assessment</span>
          </TabsTrigger>

          <TabsTrigger value="notifications" className="flex items-center gap-2 py-2 text-xs font-medium cursor-pointer">
            <Bell className="h-3.5 w-3.5" />
            <span>Notifications</span>
          </TabsTrigger>

          <TabsTrigger value="appearance" className="flex items-center gap-2 py-2 text-xs font-medium cursor-pointer">
            <Palette className="h-3.5 w-3.5" />
            <span>Appearance</span>
          </TabsTrigger>

          <TabsTrigger value="security" className="flex items-center gap-2 py-2 text-xs font-medium cursor-pointer">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Security</span>
          </TabsTrigger>

          <TabsTrigger value="plan" className="flex items-center gap-2 py-2 text-xs font-medium cursor-pointer">
            <Crown className="h-3.5 w-3.5" />
            <span>Plan & Billing</span>
          </TabsTrigger>

          <TabsTrigger value="privacy" className="flex items-center gap-2 py-2 text-xs font-medium cursor-pointer text-rose-500 data-[state=active]:text-rose-600">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Data & Privacy</span>
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════════════════
            TAB 1: PROFILE & GOALS
           ═══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Avatar & Identity card */}
            <div className="lg:col-span-1 rounded-2xl border border-border/80 bg-card p-5 space-y-5">
              <h2 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Candidate Identity
              </h2>

              <div className="flex flex-col items-center text-center p-4 rounded-xl border border-border/50 bg-muted/20">
                <div className="relative">
                  {customAvatarUrl ? (
                    <Avatar className="h-20 w-20 border-2 border-primary/50 shadow-md">
                      <AvatarImage src={customAvatarUrl} alt={fullName} />
                      <AvatarFallback className="text-lg font-bold">
                        {fullName.slice(0, 2).toUpperCase() || "CG"}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div
                      className={cn(
                        "h-20 w-20 rounded-full flex items-center justify-center text-3xl shadow-md border-2 border-border/70 bg-linear-to-br",
                        activePresetObj.color
                      )}
                    >
                      {activePresetObj.emoji}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 rounded-full bg-background p-1 shadow-xs border border-border">
                    <span className="block h-3 w-3 rounded-full bg-emerald-500" />
                  </span>
                </div>

                <div className="mt-3">
                  <div className="font-semibold text-foreground text-sm">{fullName || "Anonymous Student"}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {initialData.user.email}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                    {profile.targetRole || "Software Engineering"}
                  </div>
                </div>
              </div>

              {/* Avatar Preset Chooser */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">Choose Candidate Avatar Icon</Label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AVATARS.map((preset) => {
                    const isSelected = !customAvatarUrl && avatarPreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setAvatarPreset(preset.id);
                          setCustomAvatarUrl("");
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center rounded-xl p-2 transition-all cursor-pointer border",
                          isSelected
                            ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                            : "border-border/60 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        )}
                        title={preset.label}
                      >
                        <span className="text-lg">{preset.emoji}</span>
                        <span className="text-[9px] mt-0.5 truncate max-w-[50px]">{preset.label.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Image URL fallback */}
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <Label htmlFor="customAvatar" className="text-xs text-muted-foreground">
                  Or Custom Image URL
                </Label>
                <Input
                  id="customAvatar"
                  placeholder="https://example.com/avatar.jpg"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              {/* Account details summary */}
              <div className="space-y-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                <div className="flex justify-between">
                  <span>User ID:</span>
                  <button
                    onClick={() => copyToClipboard(initialData.user.id, "User ID")}
                    className="font-mono text-foreground/80 hover:text-foreground flex items-center gap-1 cursor-pointer"
                  >
                    {initialData.user.id.slice(0, 8)}...
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex justify-between">
                  <span>Joined Date:</span>
                  <span className="text-foreground">
                    {new Date(initialData.user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Check className="h-3 w-3" /> Active Candidate
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Personal details, career targets, companies */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-5">
                <h2 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Career Profile & Placement Objectives
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="h-9 text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium flex items-center justify-between">
                      <span>Registered Email</span>
                      {initialData.user.emailVerified && (
                        <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-0.5">
                          <Check className="h-2.5 w-2.5" /> Verified
                        </span>
                      )}
                    </Label>
                    <Input
                      id="email"
                      value={initialData.user.email}
                      disabled
                      className="h-9 text-xs sm:text-sm bg-muted/40 cursor-not-allowed opacity-80"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="targetRole" className="text-xs font-medium">
                      Primary Target Role
                    </Label>
                    <select
                      id="targetRole"
                      value={profile.targetRole}
                      onChange={(e) => setProfile((p) => ({ ...p, targetRole: e.target.value }))}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs sm:text-sm text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="gradYear" className="text-xs font-medium">
                      Graduation / Passing Year
                    </Label>
                    <select
                      id="gradYear"
                      value={profile.gradYear}
                      onChange={(e) => setProfile((p) => ({ ...p, gradYear: e.target.value }))}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs sm:text-sm text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                    >
                      {GRAD_YEAR_OPTIONS.map((yr) => (
                        <option key={yr} value={yr}>
                          Class of {yr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="college" className="text-xs font-medium flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                      College / University Name
                    </Label>
                    <Input
                      id="college"
                      value={profile.college}
                      onChange={(e) => setProfile((p) => ({ ...p, college: e.target.value }))}
                      placeholder="e.g. National Institute of Technology, Trichy"
                      className="h-9 text-xs sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="bio" className="text-xs font-medium">
                      Placement Focus / Objective
                    </Label>
                    <textarea
                      id="bio"
                      rows={3}
                      value={profile.bio}
                      onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                      placeholder="e.g. Preparing for Cognizant GenC Elevate, Capgemini, and Accenture game-based aptitude rounds. Aiming for top 5% speed and deductive accuracy."
                      className="w-full rounded-md border border-input bg-background p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                    />
                  </div>
                </div>

                {/* Target Company selection chips */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-primary" />
                      Target Assessment Batteries
                    </Label>
                    <span className="text-[11px] text-muted-foreground">
                      {profile.targetCompanies.length} selected
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Select the companies you are practicing for to calibrate benchmark comparisons and recommendations.
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {TARGET_COMPANY_OPTIONS.map((company) => {
                      const isSelected = profile.targetCompanies.includes(company);
                      return (
                        <button
                          key={company}
                          type="button"
                          onClick={() => toggleCompany(company)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer border",
                            isSelected
                              ? "border-primary bg-primary/15 text-primary font-semibold shadow-2xs"
                              : "border-border/70 bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                          {company}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="gap-2 cursor-pointer text-xs"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Saving Profile...
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        Save Profile Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════════
            TAB 2: ASSESSMENT ENGINE PREFERENCES
           ═══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="gameplay" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Audio & Visual Feedback */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Sensory & Feedback Engine</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Fine-tune audio cues and motion intensity during cognitive assessments.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-medium text-foreground">Game Sound Effects</Label>
                    <p className="text-[11px] text-muted-foreground">
                      Play acoustic ticks, card match sounds, and timer bells during gameplay.
                    </p>
                  </div>
                  <Switch
                    checked={gameplay.soundEffects}
                    onCheckedChange={(checked) => setGameplay((p) => ({ ...p, soundEffects: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-medium text-foreground">Reduced Motion & Confetti</Label>
                    <p className="text-[11px] text-muted-foreground">
                      Minimize particle effects and 3D rotations for minimal distraction and faster rendering.
                    </p>
                  </div>
                  <Switch
                    checked={gameplay.reducedMotion}
                    onCheckedChange={(checked) => setGameplay((p) => ({ ...p, reducedMotion: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-medium text-foreground">High-Contrast Shapes</Label>
                    <p className="text-[11px] text-muted-foreground">
                      Enhance border thickness and contrast in Switch Challenge and Shape Switch.
                    </p>
                  </div>
                  <Switch
                    checked={gameplay.highContrast}
                    onCheckedChange={(checked) => setGameplay((p) => ({ ...p, highContrast: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Timer & Pace Settings */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Timer & Pressure Mode</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Customize how the clock behaves to simulate real recruitment pressure or reduce anxiety.
              </p>

              <div className="space-y-3 pt-2">
                <Label className="text-xs font-medium text-foreground">Timer Presentation Style</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "countdown", label: "Countdown", desc: "Digital MM:SS" },
                    { id: "progress", label: "Zen Bar", desc: "Depleting line" },
                    { id: "stealth", label: "Stealth", desc: "Hidden until 15s" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setGameplay((p) => ({ ...p, timerStyle: mode.id as any }))}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-xl p-2.5 text-center transition-all cursor-pointer border",
                        gameplay.timerStyle === mode.id
                          ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary text-foreground"
                          : "border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="text-xs font-semibold">{mode.label}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">{mode.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-xs font-medium text-foreground">Daily Practice Commitment</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { target: 3, label: "3 Games", desc: "Casual (15m)" },
                    { target: 5, label: "5 Games", desc: "Recommended (25m)" },
                    { target: 10, label: "10 Games", desc: "Bootcamp (50m)" },
                  ].map((item) => (
                    <button
                      key={item.target}
                      type="button"
                      onClick={() => setGameplay((p) => ({ ...p, dailyGoal: item.target }))}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-xl p-2.5 text-center transition-all cursor-pointer border",
                        gameplay.dailyGoal === item.target
                          ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary text-foreground"
                          : "border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="text-xs font-semibold">{item.label}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Workflow & Shortcuts */}
            <div className="md:col-span-2 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Interaction & Learning Controls</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-1">
                <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border/60 bg-muted/20">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-medium text-foreground">Instant Pattern Explanations</Label>
                    <p className="text-[11px] text-muted-foreground">
                      Display logic explanation and inductive reasoning steps after finishing a round.
                    </p>
                  </div>
                  <Switch
                    checked={gameplay.immediateFeedback}
                    onCheckedChange={(checked) => setGameplay((p) => ({ ...p, immediateFeedback: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border/60 bg-muted/20">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-medium text-foreground">Rapid Keyboard Shortcuts</Label>
                    <p className="text-[11px] text-muted-foreground">
                      Use [Space] to proceed, [R] to replay, and numbers [1-4] for rapid answers.
                    </p>
                  </div>
                  <Switch
                    checked={gameplay.keyboardShortcuts}
                    onCheckedChange={(checked) => setGameplay((p) => ({ ...p, keyboardShortcuts: checked }))}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSaveGameplay}
                  disabled={isSavingGameplay}
                  className="gap-2 cursor-pointer text-xs"
                >
                  {isSavingGameplay ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving Preferences...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      Save Assessment Preferences
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════════
            TAB 3: NOTIFICATIONS & STREAK
           ═══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-6 max-w-3xl">
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Email Alerts & Streak Safeguards
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Control reminders to preserve your practice habit and stay on top of placement opportunities.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border/60 bg-muted/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-amber-500" />
                    <Label className="text-xs font-semibold text-foreground">Streak Freeze & Expiry Alert</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receive an email warning if you haven&apos;t played a cognitive game by evening, helping you preserve your {initialData.summary.currentStreak}-day streak.
                  </p>
                </div>
                <Switch
                  checked={notifications.emailStreakAlerts}
                  onCheckedChange={(checked) => setNotifications((p) => ({ ...p, emailStreakAlerts: checked }))}
                />
              </div>

              <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border/60 bg-muted/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-indigo-500" />
                    <Label className="text-xs font-semibold text-foreground">Weekly Performance Digest</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get a weekly summary detailing your percentile change, deductive accuracy, and target company readiness scores.
                  </p>
                </div>
                <Switch
                  checked={notifications.emailWeeklyReport}
                  onCheckedChange={(checked) => setNotifications((p) => ({ ...p, emailWeeklyReport: checked }))}
                />
              </div>

              <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border/60 bg-muted/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-emerald-500" />
                    <Label className="text-xs font-semibold text-foreground">Company Assessment Pattern Updates</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get alerted when hiring companies (Cognizant, Capgemini, Accenture) update their aptitude patterns or new mock test sets drop.
                  </p>
                </div>
                <Switch
                  checked={notifications.emailProductUpdates}
                  onCheckedChange={(checked) => setNotifications((p) => ({ ...p, emailProductUpdates: checked }))}
                />
              </div>

              {/* Time picker */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <Label htmlFor="reminderTime" className="text-xs font-medium text-foreground">
                  Preferred Daily Practice Reminder Time
                </Label>
                <select
                  id="reminderTime"
                  value={notifications.practiceReminderTime}
                  onChange={(e) => setNotifications((p) => ({ ...p, practiceReminderTime: e.target.value }))}
                  className="h-9 w-60 rounded-md border border-input bg-background px-3 py-1 text-xs sm:text-sm text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  <option value="08:00">08:00 AM (Morning kickstart)</option>
                  <option value="13:00">01:00 PM (Afternoon recharge)</option>
                  <option value="18:00">06:00 PM (Evening study hour)</option>
                  <option value="20:00">08:00 PM (Streak safeguard - Recommended)</option>
                  <option value="22:00">10:00 PM (Night owl recap)</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Reminders are calculated based on your local timezone.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button
                onClick={handleSaveNotifications}
                disabled={isSavingNotifs}
                className="gap-2 cursor-pointer text-xs"
              >
                {isSavingNotifs ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving Notifications...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    Save Notification Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════════
            TAB 4: APPEARANCE & DISPLAY
           ═══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="appearance" className="space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-6 max-w-3xl">
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                Theme & Interface Appearance
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Customize your viewing experience for high readability during prolonged practice sessions.
              </p>
            </div>

            {/* Theme mode cards */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">Color Theme</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "light", label: "Light", icon: Sun, desc: "Crisp daylight" },
                  { id: "dark", label: "Dark", icon: Moon, desc: "Eye-comfort dark" },
                  { id: "system", label: "System", icon: Monitor, desc: "Syncs with OS" },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = theme === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => handleThemeChange(mode.id as any)}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-xl p-4 transition-all cursor-pointer border",
                        isSelected
                          ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary text-foreground font-semibold"
                          : "border-border/70 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5 mb-2" />
                      <span className="text-xs font-medium">{mode.label}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">{mode.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Percentile precision toggle */}
            <div className="space-y-4 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="text-xs font-medium text-foreground">Percentile Display Format</Label>
                  <p className="text-[11px] text-muted-foreground">
                    Show exact decimal percentiles (e.g. &quot;Top 4.2% · 95.8th Percentile&quot;) versus rounded integers.
                  </p>
                </div>
                <select
                  value={appearance.percentilePrecision}
                  onChange={(e) => {
                    const val = e.target.value as "exact" | "rounded";
                    setAppearance((p) => ({ ...p, percentilePrecision: val }));
                    updateAppearanceSettings({ ...appearance, percentilePrecision: val }).catch(() => {});
                  }}
                  className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-hidden"
                >
                  <option value="exact">Exact (95.8%)</option>
                  <option value="rounded">Rounded (Top 5%)</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="text-xs font-medium text-foreground">Compact Navigation Tip</Label>
                  <p className="text-[11px] text-muted-foreground">
                    Press <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px] border border-border">⌘B</kbd> or <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px] border border-border">Ctrl+B</kbd> anytime to collapse the sidebar for wider game canvas area.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════════
            TAB 5: SECURITY & SESSIONS
           ═══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Password update */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" />
                  Update Account Password
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ensure your account is protected with a secure password of at least 6 characters.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {initialData.connectedProviders.includes("credential") && (
                  <div className="space-y-1">
                    <Label htmlFor="currentPass" className="text-xs font-medium">
                      Current Password
                    </Label>
                    <Input
                      id="currentPass"
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-9 text-xs"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="newPass" className="text-xs font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPass"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="h-9 text-xs pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmPass" className="text-xs font-medium">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPass"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="h-9 text-xs"
                  />
                </div>

                {newPassword.length > 0 && (
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span className={cn("h-1.5 w-1.5 rounded-full", newPassword.length >= 6 ? "bg-emerald-500" : "bg-muted-foreground")} />
                      <span>At least 6 characters</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span className={cn("h-1.5 w-1.5 rounded-full", newPassword === confirmPassword && confirmPassword.length > 0 ? "bg-emerald-500" : "bg-muted-foreground")} />
                      <span>Passwords match</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleChangePassword}
                  disabled={isSavingPassword || !newPassword || newPassword !== confirmPassword}
                  className="w-full mt-2 cursor-pointer text-xs"
                >
                  {isSavingPassword ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                      Updating Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </div>

            {/* Connected Authentication Providers */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Connected Sign-In Methods
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  View how you access your account and manage OAuth linkings.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background border border-border text-xs font-bold">
                      G
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">Google Account</div>
                      <div className="text-[11px] text-muted-foreground">
                        {initialData.connectedProviders.includes("google")
                          ? "Linked & active for instant sign-in"
                          : "Not linked"}
                      </div>
                    </div>
                  </div>
                  {initialData.connectedProviders.includes("google") ? (
                    <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-[10px]">
                      Optional
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background border border-border">
                      <KeyRound className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">Email & Password</div>
                      <div className="text-[11px] text-muted-foreground">
                        {initialData.user.email}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                    Active
                  </Badge>
                </div>
              </div>
            </div>

            {/* Active Sessions list */}
            <div className="lg:col-span-2 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-primary" />
                    Active Device Sessions ({activeSessions.length})
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Devices currently logged in to your Blync account.
                  </p>
                </div>

                {activeSessions.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRevokeOtherSessions}
                    className="text-xs text-rose-500 hover:text-rose-600 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-1.5" />
                    Log Out All Other Devices
                  </Button>
                )}
              </div>

              <div className="divide-y divide-border/50 border-t border-border/50">
                {activeSessions.map((sess) => {
                  const isMobile =
                    sess.userAgent?.toLowerCase().includes("mobile") ||
                    sess.userAgent?.toLowerCase().includes("android") ||
                    sess.userAgent?.toLowerCase().includes("iphone");

                  return (
                    <div key={sess.id} className="flex items-center justify-between py-3.5 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/40 border border-border text-muted-foreground">
                          {isMobile ? <Smartphone className="h-4 w-4" /> : <Laptop className="h-4 w-4" />}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground truncate">
                              {sess.userAgent ? sess.userAgent.split(" ")[0] : "Web Browser"}
                            </span>
                            {sess.isCurrent && (
                              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[9px] py-0 px-1.5">
                                Current Device
                              </Badge>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                            <span>IP: {sess.ipAddress || "127.0.0.1"}</span>
                            <span>•</span>
                            <span>
                              Active since {new Date(sess.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {!sess.isCurrent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeSession(sess.id)}
                          className="text-xs text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer shrink-0"
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════════
            TAB 6: PLAN & BILLING
           ═══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="plan" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Current Plan Card */}
            <div
              className={cn(
                "rounded-2xl p-6 lg:col-span-1 flex flex-col justify-between border",
                initialData.user.isPro
                  ? "border-amber-500/40 bg-amber-500/[0.04]"
                  : "border-border/80 bg-card"
              )}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Current Plan
                  </span>
                  {initialData.user.isPro ? (
                    <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40 text-[10px]">
                      Active Pro
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      Free Tier
                    </Badge>
                  )}
                </div>

                <div>
                  <div className="text-2xl font-bold text-foreground flex items-center gap-2">
                    {initialData.user.isPro ? (
                      <>
                        <Crown className="h-6 w-6 text-amber-500" />
                        Pro Member
                      </>
                    ) : (
                      "Free Learner"
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {initialData.user.isPro
                      ? `Access to all 15+ company batteries, detailed radar analytics, and unlimited practice runs.`
                      : `Standard access to cognitive mini-games with free daily limits.`}
                  </p>
                </div>

                {initialData.subscription && (
                  <div className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan Cycle:</span>
                      <span className="font-semibold capitalize text-foreground">
                        {initialData.subscription.planType}
                      </span>
                    </div>
                    {initialData.subscription.expiresAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Renews / Expiry:</span>
                        <span className="text-foreground">
                          {new Date(initialData.subscription.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-6">
                <Button asChild className="w-full cursor-pointer text-xs">
                  <Link href="/pricing">
                    {initialData.user.isPro ? "Manage Plan / Receipts" : "Upgrade to Pro (from ₹49)"}
                    <ExternalLink className="h-3.5 w-3.5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Feature comparison table */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 lg:col-span-2 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                Feature Access Breakdown
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground">
                      <th className="py-2.5 font-medium">Capability</th>
                      <th className="py-2.5 font-medium">Free Plan</th>
                      <th className="py-2.5 font-medium text-amber-500">Pro Plan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-3 font-medium text-foreground">Practice Cognitive Games</td>
                      <td className="py-3 text-muted-foreground">Limited attempts / day</td>
                      <td className="py-3 text-emerald-600 dark:text-emerald-400 font-semibold">Unlimited 24/7</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-foreground">Company Mock Test Batteries</td>
                      <td className="py-3 text-muted-foreground">1 basic sample test</td>
                      <td className="py-3 text-emerald-600 dark:text-emerald-400 font-semibold">All 15+ full batteries</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-foreground">Cognitive Radar & Skill Matrix</td>
                      <td className="py-3 text-muted-foreground">Basic score breakdown</td>
                      <td className="py-3 text-emerald-600 dark:text-emerald-400 font-semibold">In-depth percentile radar</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-foreground">Company Benchmark Comparison</td>
                      <td className="py-3 text-muted-foreground">—</td>
                      <td className="py-3 text-emerald-600 dark:text-emerald-400 font-semibold">Cognizant, Capgemini, Accenture</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-foreground">Detailed Question Explanations</td>
                      <td className="py-3 text-muted-foreground">Limited</td>
                      <td className="py-3 text-emerald-600 dark:text-emerald-400 font-semibold">Full step-by-step logic</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════════
            TAB 7: DATA & PRIVACY (DANGER ZONE)
           ═══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="privacy" className="space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-6 max-w-3xl">
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                <Download className="h-4 w-4 text-primary" />
                Data Portability & Export
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Download a complete portable archive of your cognitive test history, score timestamps, and preferences.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-muted/20">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-foreground">Candidate Portfolio Archive</div>
                <p className="text-[11px] text-muted-foreground">
                  Includes all {initialData.summary.totalGamesPlayed} game records, attempts, streak logs, and account profile metadata in JSON format.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                disabled={isExporting}
                className="cursor-pointer text-xs shrink-0"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Export (.json)
                  </>
                )}
              </Button>
            </div>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-rose-500/20 space-y-4">
              <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm">
                <AlertTriangle className="h-4 w-4" />
                Danger Zone
              </div>

              <div className="space-y-3">
                {/* Reset practice scores */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-rose-500/30 bg-rose-500/[0.03]">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-foreground">Reset Practice Score History</div>
                    <p className="text-[11px] text-muted-foreground">
                      Wipe all previous game scores and test attempt counts if you want a clean baseline. Your account remains active.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setResetDialogOpen(true)}
                    className="text-xs text-rose-600 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer shrink-0"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Reset Scores
                  </Button>
                </div>

                {/* Delete account */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-rose-500/40 bg-rose-500/[0.06]">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                      Permanently Delete Account
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Permanently delete your user profile, active subscription records, streak history, and all assessment scores.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="text-xs cursor-pointer shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Reset Scores Dialog ──────────────────────────────────────────────── */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <RotateCcw className="h-5 w-5 text-amber-500" />
              Reset Game Score History?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              This will permanently delete all {initialData.summary.totalGamesPlayed} recorded test runs and reset your daily game attempt counters. Your account, credentials, and streak will not be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResetDialogOpen(false)}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleResetHistory}
              disabled={isResetting}
              className="text-xs cursor-pointer"
            >
              {isResetting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
              Confirm Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Account Dialog ────────────────────────────────────────────── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Account Permanently?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground space-y-2">
              <p>
                This action is irreversible. All your test attempts, streaks, personal benchmark rankings, and credentials will be purged immediately.
              </p>
              <p className="font-semibold text-foreground">
                Type <span className="text-rose-500 underline">DELETE</span> below to confirm:
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="text-xs font-mono"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteConfirmText("");
              }}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "DELETE" || isDeleting}
              className="text-xs cursor-pointer"
            >
              {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
              Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Gamepad2Icon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" x2="10" y1="12" y2="12" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="15" x2="15.01" y1="13" y2="13" />
      <line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="6" />
    </svg>
  );
}
