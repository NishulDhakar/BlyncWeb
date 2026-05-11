"use client";

import { useState, useEffect, useRef } from "react";
import { sendBroadcast, retryFailed, getBroadcastHistory, getUserCount } from "@/features/admin/actions";
import { toast } from "sonner";
import Image from "next/image";

type Broadcast = {
  id: string;
  subject: string;
  message: string;
  totalCount: number;
  sentCount: number;
  failedCount: number;
  createdAt: Date;
};

export default function BroadcastPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [history, setHistory] = useState<Broadcast[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    const [countRes, histRes] = await Promise.all([getUserCount(), getBroadcastHistory()]);
    if (!countRes.success) { setUnauthorized(true); return; }
    setUserCount(countRes.count ?? null);
    if (histRes.success) setHistory(histRes.data as Broadcast[]);
  }

  useEffect(() => { refresh(); }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) { toast.error("Fill in both fields."); return; }
    if (!confirm(`Send this to all ${userCount ?? "?"} users?`)) return;

    setLoading(true);
    try {
      const res = await sendBroadcast({
        subject, message,
        imageBase64: imageBase64 ?? undefined,
        imageName: imageName ?? undefined,
      });
      if (res.success) {
        toast.success(`Sent ${res.sentCount}/${res.total}${res.failedCount ? ` · ${res.failedCount} failed` : ""}`);
        setSubject(""); setMessage(""); removeImage();
        await refresh();
      } else {
        toast.error(res.error ?? "Failed.");
      }
    } catch { toast.error("Unexpected error."); }
    finally { setLoading(false); }
  };

  const handleRetry = async (broadcastId: string) => {
    setRetryingId(broadcastId);
    try {
      const res = await retryFailed(broadcastId);
      if (res.success) {
        toast.success(`Retried: ${res.sentCount} sent${res.failedCount ? `, ${res.failedCount} still failing` : ""}`);
        await refresh();
      } else {
        toast.error(res.error ?? "Retry failed.");
      }
    } catch { toast.error("Unexpected error."); }
    finally { setRetryingId(null); }
  };

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-neutral-500 text-lg">Not authorized.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Compose */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Broadcast Email</h1>
            {userCount !== null && (
              <span className="text-sm text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full">
                {userCount} users
              </span>
            )}
          </div>

          <form onSubmit={handleSend} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="New game just dropped..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                placeholder="Plain text — write exactly what users will receive..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Attach Image <span className="text-neutral-500 font-normal">(optional)</span>
              </label>
              {imagePreview ? (
                <div className="relative inline-block">
                  <Image
                    src={imagePreview} alt="Preview"
                    width={200} height={120} unoptimized
                    className="rounded-lg object-cover border border-neutral-700"
                    style={{ maxHeight: 120, width: "auto" }}
                  />
                  <button
                    type="button" onClick={removeImage}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-rose-600 rounded-full text-white text-xs flex items-center justify-center hover:bg-rose-500"
                  >✕</button>
                  <p className="text-xs text-neutral-500 mt-1">{imageName}</p>
                </div>
              ) : (
                <label className="flex items-center gap-3 w-full cursor-pointer bg-neutral-800 border border-dashed border-neutral-600 rounded-lg px-4 py-3 hover:border-neutral-500 transition-colors">
                  <span className="text-neutral-400 text-sm">Click to upload PNG, JPG, GIF…</span>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-bold transition-all bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 disabled:text-neutral-500 text-white"
            >
              {loading ? `Sending to ${userCount} users…` : "Send Broadcast"}
            </button>
          </form>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
            <h2 className="text-lg font-semibold mb-5">Broadcast History</h2>
            <div className="space-y-3">
              {history.map((b) => (
                <div key={b.id} className="bg-neutral-800 rounded-xl px-5 py-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-white truncate">{b.subject}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {new Date(b.createdAt).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="text-emerald-400">✓ {b.sentCount} sent</span>
                      {b.failedCount > 0 && (
                        <span className="text-rose-400">✗ {b.failedCount} failed</span>
                      )}
                      <span className="text-neutral-500">of {b.totalCount}</span>
                    </div>
                  </div>

                  {b.failedCount > 0 && (
                    <button
                      onClick={() => handleRetry(b.id)}
                      disabled={retryingId === b.id}
                      className="shrink-0 text-xs px-3 py-1.5 bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-lg hover:bg-rose-500/25 disabled:opacity-50 transition-colors"
                    >
                      {retryingId === b.id ? "Retrying…" : `Retry ${b.failedCount}`}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
