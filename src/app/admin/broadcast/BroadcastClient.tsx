"use client";

import React, { useState, useRef } from "react";
import {
  sendBroadcast,
  retryFailed,
  getBroadcastHistory,
  getUserCount,
} from "@/features/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  Radio,
  Send,
  Users,
  Image as ImageIcon,
  X,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  History,
  Info,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface BroadcastItem {
  id: string;
  subject: string;
  message: string;
  imageName: string | null;
  totalCount: number;
  sentCount: number;
  failedCount: number;
  createdAt: Date;
}

export interface BroadcastClientProps {
  initialCount: number;
  initialHistory: BroadcastItem[];
}

export function BroadcastClient({
  initialCount,
  initialHistory,
}: BroadcastClientProps) {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number>(initialCount);
  const [history, setHistory] = useState<BroadcastItem[]>(initialHistory);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    try {
      const [countRes, histRes] = await Promise.all([
        getUserCount(),
        getBroadcastHistory(),
      ]);
      if (countRes.success && typeof countRes.count === "number") {
        setUserCount(countRes.count);
      }
      if (histRes.success && histRes.data) {
        setHistory(histRes.data as BroadcastItem[]);
      }
    } catch {
      // ignore
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file is too large (max 5MB)");
      return;
    }
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setImageName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTriggerSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast.error("Please enter an email subject line");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter the email body content");
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmSend = async () => {
    setConfirmOpen(false);
    setLoading(true);
    try {
      const res = await sendBroadcast({
        subject: subject.trim(),
        message: message.trim(),
        imageBase64: imageBase64 ?? undefined,
        imageName: imageName ?? undefined,
      });

      if (res.success) {
        toast.success(
          `Broadcast delivered! ${res.sentCount}/${res.total} sent successfully.`
        );
        setSubject("");
        setMessage("");
        removeImage();
        await refresh();
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to transmit broadcast.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred while sending.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (broadcastId: string) => {
    setRetryingId(broadcastId);
    try {
      const res = await retryFailed(broadcastId);
      if (res.success) {
        toast.success(
          `Retried: ${res.sentCount} resent${
            res.failedCount ? ` · ${res.failedCount} still unresolved` : ""
          }`
        );
        await refresh();
      } else {
        toast.error(res.error ?? "Retry operation failed.");
      }
    } catch {
      toast.error("Unexpected error during retry.");
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Broadcast Center
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-500 border border-blue-500/20">
              <Radio className="h-3 w-3" />
              Live Delivery
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Deliver product announcements, syllabus updates, or platform advisories to registered students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-1.5 shadow-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Target Audience:</span>
            <span className="text-xs font-bold text-foreground">
              {userCount.toLocaleString("en-IN")} students
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Compose form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
            <h2 className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              Compose Message
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              Messages will be dispatched directly from the configured system email server.
            </p>

            <form onSubmit={handleTriggerSend} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Subject Line <span className="text-destructive">*</span>
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. New Capgemini Game Round Released + Free Practice Access"
                  className="h-10 text-sm"
                  maxLength={150}
                  disabled={loading}
                />
                <p className="text-[11px] text-muted-foreground mt-1 text-right">
                  {subject.length}/150
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Email Message Body <span className="text-destructive">*</span>
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={9}
                  placeholder="Type the message to all students here...

Hi there,

We're excited to announce brand new mock tests for your upcoming cognitive challenges..."
                  className="font-mono text-xs leading-relaxed resize-none"
                  disabled={loading}
                />
                <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
                  <span>Plain text formatted for maximum inbox delivery & spam protection.</span>
                  <span>{message.trim().split(/\s+/).filter(Boolean).length} words</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Banner Attachment <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                {imagePreview ? (
                  <div className="relative inline-block rounded-lg border border-border/70 overflow-hidden bg-muted/40 p-2">
                    <Image
                      src={imagePreview}
                      alt="Banner Preview"
                      width={220}
                      height={120}
                      unoptimized
                      className="rounded object-cover"
                      style={{ maxHeight: 120, width: "auto" }}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors shadow-sm"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <p className="text-[10px] text-muted-foreground mt-1.5 font-mono truncate max-w-[220px]">
                      {imageName}
                    </p>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/80 bg-muted/20 px-4 py-5 hover:bg-muted/40 cursor-pointer transition-colors">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">
                      Click to attach promotional image
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      PNG, JPG, or WebP up to 5MB
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={loading}
                    />
                  </label>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading || !subject.trim() || !message.trim()}
                  className="w-full h-11 text-sm font-semibold gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RotateCw className="h-4 w-4 animate-spin" />
                      Broadcasting to {userCount.toLocaleString("en-IN")} Students...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Broadcast ({userCount.toLocaleString("en-IN")} Recipients)
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right column: Delivery History & Stats */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                Dispatch History
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={refresh}
              >
                <RotateCw className="h-3 w-3" />
                Refresh
              </Button>
            </div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                <Clock className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm font-medium">No broadcasts sent yet</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Delivered campaigns and delivery stats will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {history.map((b) => {
                  const hasFailed = b.failedCount > 0;
                  const isRetrying = retryingId === b.id;
                  const successRate =
                    b.totalCount > 0
                      ? Math.round((b.sentCount / b.totalCount) * 100)
                      : 100;

                  return (
                    <div
                      key={b.id}
                      className="rounded-lg border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {b.subject}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {new Date(b.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        {hasFailed && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 text-xs px-2.5 shrink-0 gap-1 cursor-pointer"
                            onClick={() => handleRetry(b.id)}
                            disabled={isRetrying}
                          >
                            <RotateCw
                              className={`h-3 w-3 ${
                                isRetrying ? "animate-spin" : ""
                              }`}
                            />
                            {isRetrying ? "Retrying..." : `Retry ${b.failedCount}`}
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/40 text-xs">
                        <span className="inline-flex items-center gap-1 text-emerald-500 font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          {b.sentCount.toLocaleString("en-IN")} sent
                        </span>

                        {hasFailed ? (
                          <span className="inline-flex items-center gap-1 text-rose-500 font-medium">
                            <AlertCircle className="h-3 w-3" />
                            {b.failedCount.toLocaleString("en-IN")} failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground text-[11px]">
                            100% delivered
                          </span>
                        )}

                        <span className="ml-auto text-[11px] text-muted-foreground font-mono">
                          {b.totalCount.toLocaleString("en-IN")} total
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Delivery Policy Note */}
          <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-foreground">Delivery Safeguards Active</p>
                <p className="text-muted-foreground leading-relaxed">
                  Batched SMTP queuing with throttled intervals is enforced automatically to ensure high domain reputation and prevent inbox spam-flagging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Send Broadcast to ${userCount.toLocaleString("en-IN")} Students?`}
        description={`This action will queue an immediate outbound email with subject "${subject}" to all active registered accounts. It cannot be cancelled once initiated.`}
        confirmLabel="Confirm & Transmit Broadcast"
        variant="destructive"
        onConfirm={handleConfirmSend}
      />
    </div>
  );
}
