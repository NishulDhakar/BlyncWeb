"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { grantPremiumAccess } from "@/features/admin/userActions";
import { Crown, Sparkles, Calendar, Tag, AlertCircle, CheckCircle2, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface GrantPremiumDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultEmail?: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const DURATION_PRESETS = [
  { label: "7 Days", days: 7, desc: "1 Week" },
  { label: "14 Days", days: 14, desc: "2 Weeks" },
  { label: "30 Days", days: 30, desc: "1 Month" },
  { label: "60 Days", days: 60, desc: "2 Months" },
  { label: "90 Days", days: 90, desc: "3 Months" },
  { label: "180 Days", days: 180, desc: "6 Months" },
  { label: "365 Days", days: 365, desc: "1 Year" },
];

const TAG_PRESETS = [
  "Given by Admin",
  "Contest Winner",
  "College Placement Drive",
  "Promotional Gift",
  "Special Access",
  "Beta Tester",
];

export function GrantPremiumDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  defaultEmail = "",
  trigger,
  onSuccess,
}: GrantPremiumDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled ? setControlledOpen! : setInternalOpen;

  const [email, setEmail] = useState(defaultEmail);
  const [days, setDays] = useState<number>(30);
  const [customDays, setCustomDays] = useState<string>("30");
  const [selectedTag, setSelectedTag] = useState<string>("Given by Admin");
  const [customTag, setCustomTag] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultEmail) {
      setEmail(defaultEmail);
    }
  }, [defaultEmail]);

  const activeTag = customTag.trim() ? customTag.trim() : selectedTag;

  // Calculate prospective expiration date
  const calculatedExpiry = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  const handleSelectDaysPreset = (presetDays: number) => {
    setDays(presetDays);
    setCustomDays(String(presetDays));
  };

  const handleCustomDaysChange = (val: string) => {
    setCustomDays(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setDays(parsed);
    }
  };

  const handleSelectTagPreset = (tag: string) => {
    setSelectedTag(tag);
    setCustomTag("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid student email address");
      return;
    }
    if (days <= 0 || isNaN(days)) {
      toast.error("Duration must be at least 1 day");
      return;
    }

    setLoading(true);
    try {
      const res = await grantPremiumAccess({
        email: email.trim(),
        days,
        reasonTag: activeTag,
      });

      if (res.success) {
        toast.success(
          `Granted Pro access to ${res.user.email} for ${res.days} days! (Tag: "${res.tag}")`
        );
        setIsOpen(false);
        if (!defaultEmail) {
          setEmail("");
        }
        setDays(30);
        setCustomDays("30");
        setSelectedTag("Given by Admin");
        setCustomTag("");
        if (onSuccess) {
          onSuccess();
        }
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to grant premium access");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {trigger && (
        <div onClick={() => setIsOpen(true)} className="inline-block">
          {trigger}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg border-border/60 bg-card p-6 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/20 shadow-sm">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  Grant Premium Access
                  <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Bestow unlimited Pro access to any student account with a custom duration and audit tag.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* 1. Email Address Input */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Student Email Address <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                placeholder="e.g. student@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-10 text-sm font-medium"
              />
            </div>

            {/* 2. Duration Preset Chips + Custom Days */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Premium Duration <span className="text-destructive">*</span>
                </label>
                <span className="text-[11px] font-medium text-amber-500 font-mono">
                  {days} days total
                </span>
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 mb-2.5">
                {DURATION_PRESETS.map((p) => {
                  const isSelected = days === p.days;
                  return (
                    <button
                      key={p.days}
                      type="button"
                      onClick={() => handleSelectDaysPreset(p.days)}
                      disabled={loading}
                      className={`h-9 px-1 rounded-md text-xs font-semibold transition-all border text-center flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? "bg-amber-500 text-black border-amber-500 shadow-sm"
                          : "bg-muted/40 hover:bg-muted text-foreground border-border/70"
                      }`}
                    >
                      <span className="text-[11px] font-bold leading-tight">{p.label.split(" ")[0]}d</span>
                      <span className="text-[9px] opacity-80 leading-tight">{p.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom days input */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground shrink-0">Custom Days:</span>
                <Input
                  type="number"
                  min="1"
                  max="3650"
                  value={customDays}
                  onChange={(e) => handleCustomDaysChange(e.target.value)}
                  disabled={loading}
                  className="h-8 text-xs font-mono w-24"
                />
                <span className="text-[11px] text-muted-foreground">
                  (Expires:{" "}
                  <strong className="text-foreground">
                    {calculatedExpiry.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </strong>
                  )
                </span>
              </div>
            </div>

            {/* 3. Reason Tag Selector ("given why admin this tag") */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                Reason / Admin Tag <span className="text-destructive">*</span>
              </label>

              {/* Tag preset pills */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {TAG_PRESETS.map((tag) => {
                  const isSelected = activeTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSelectTagPreset(tag)}
                      disabled={loading}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground border-border/70"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Custom tag input */}
              <Input
                type="text"
                placeholder="Or type a custom reason tag..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                disabled={loading}
                className="h-8 text-xs placeholder:text-muted-foreground/60"
                maxLength={60}
              />
            </div>

            {/* 4. Live Grant Preview Card */}
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-amber-600 dark:text-amber-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Grant Summary Preview
                </span>
                <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500">
                  Tag: {activeTag}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                User <strong className="text-foreground font-mono">{email || "(enter email)"}</strong> will receive{" "}
                <strong className="text-foreground">{days} days</strong> of Pro membership with unrestricted access to all placement games, company rounds, and mock assessments through{" "}
                <strong className="text-foreground font-mono">
                  {calculatedExpiry.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </strong>.
              </p>
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading || !email.trim() || days <= 0}
                className="h-9 text-xs font-semibold gap-1.5 bg-amber-500 hover:bg-amber-600 text-black border border-amber-600 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RotateCw className="h-3.5 w-3.5 animate-spin" />
                    Granting Pro Access...
                  </>
                ) : (
                  <>
                    <Crown className="h-3.5 w-3.5" />
                    Grant {days} Days Premium
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
