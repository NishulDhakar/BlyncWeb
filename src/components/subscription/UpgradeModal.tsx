"use client";

import { useState, useCallback } from "react";
import { Zap, Check, X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const PRO_FEATURES = [
  "Unlimited attempts on all games",
  "Full score history (last 30 sessions)",
  "Performance chart per game",
  "Pro badge on your profile",
];

const FREE_LIMITS = [
  "Only 3 attempts per game per day",
  "No score history",
];

export default function UpgradeModal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/subscription/create", { method: "POST" });
      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? "Failed to start checkout. Try again.");
        return;
      }
      const { subscriptionId, keyId, prefill } = await res.json();

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Could not load payment gateway. Check your connection.");
        return;
      }

      const rzp = new window.Razorpay({
        key: keyId,
        subscription_id: subscriptionId,
        name: "Blync",
        description: "Pro — ₹49/month",
        image: "/images/og/og-logo.png",
        prefill,
        theme: { color: "#000000" },
        handler: () => {
          window.location.reload();
        },
      });
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        {/* Lock badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border border-border text-xs font-medium text-muted-foreground">
            <Lock className="w-3 h-3" />
            Daily limit reached
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-yellow-500/25 bg-card/90 backdrop-blur-xl shadow-2xl overflow-hidden">

          {/* Top gradient strip */}
          <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-500" />

          <div className="p-8 space-y-7">

            {/* Icon + heading */}
            <div className="text-center space-y-3">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                <Zap className="w-7 h-7 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">You&apos;ve used your 3 free attempts today</h2>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
                  Upgrade to Pro and practice without limits — full history and performance charts included.
                </p>
              </div>
            </div>

            {/* Two-column feature comparison */}
            <div className="grid grid-cols-2 gap-4">
              {/* Pro */}
              <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-4 space-y-2.5">
                <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wide flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Pro
                </p>
                {PRO_FEATURES.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-xs text-foreground/80">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    {f}
                  </div>
                ))}
              </div>

              {/* Free */}
              <div className="rounded-xl bg-muted/30 border border-border/50 p-4 space-y-2.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Free
                </p>
                {FREE_LIMITS.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-xs text-muted-foreground/60">
                    <X className="w-3.5 h-3.5 text-red-400/60 shrink-0 mt-0.5" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Price + CTA */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">₹49</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              {error && <p className="text-sm text-red-400 text-center">{error}</p>}

              <Button
                className="w-full h-12 text-base font-semibold"
                onClick={handleUpgrade}
                disabled={loading}
              >
                {loading ? "Opening checkout…" : "Upgrade to Pro — ₹49/month"}
              </Button>

              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span>Cancel anytime</span>
                <span>·</span>
                <span>Secured by Razorpay</span>
                <span>·</span>
                <Link href="/pricing" className="underline underline-offset-2 hover:text-foreground transition-colors">
                  See full plans
                </Link>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
