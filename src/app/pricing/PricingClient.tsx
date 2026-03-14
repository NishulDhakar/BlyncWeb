"use client";

import { useState, useCallback } from "react";
import { Check, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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

const FREE_FEATURES = [
  { text: "3 attempts per game per day", included: true },
  { text: "Score shown after each game", included: true },
  { text: "All 6 cognitive games", included: true },
  { text: "Unlimited attempts", included: false },
  { text: "Full score history", included: false },
  { text: "Performance chart", included: false },
  { text: "Pro badge on profile", included: false },
];

const PRO_FEATURES = [
  { text: "Unlimited attempts on all games", included: true },
  { text: "Score shown after each game", included: true },
  { text: "All 6 cognitive games", included: true },
  { text: "Full score history (last 30 sessions)", included: true },
  { text: "Performance chart per game", included: true },
  { text: "Pro badge on profile", included: true },
  { text: "Cancel anytime", included: true },
];

export default function PricingClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/subscription/create", { method: "POST" });
      if (!res.ok) {
        const body = await res.json();
        if (body.error === "Already subscribed") {
          setError("You already have an active Pro subscription.");
        } else if (body.error === "Unauthorized") {
          window.location.href = "/register?redirect=/pricing";
        } else {
          setError(body.error ?? "Failed to start checkout.");
        }
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
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-3"
        >
          <h1 className="text-3xl sm:text-4xl font-bold">Simple pricing</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start free. Upgrade when you want unlimited practice.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-6">

          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-2xl border border-border/50 bg-card/60 p-8 space-y-6"
          >
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Free</p>
              <p className="mt-2 text-4xl font-bold">₹0</p>
              <p className="text-sm text-muted-foreground mt-1">Forever free</p>
            </div>

            <ul className="space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm">
                  {f.included
                    ? <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    : <X className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                  }
                  <span className={f.included ? "" : "text-muted-foreground/50"}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>

            <Button variant="outline" className="w-full" disabled>
              Current plan
            </Button>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-yellow-500/40 bg-yellow-500/5 p-8 space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                <Zap className="w-3 h-3" />
                PRO
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Pro</p>
              <div className="mt-2 flex items-end gap-1">
                <p className="text-4xl font-bold">₹49</p>
                <p className="text-muted-foreground mb-1">/month</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Billed monthly, cancel anytime</p>
            </div>

            <ul className="space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  {f.text}
                </li>
              ))}
            </ul>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button
              className="w-full h-11 font-semibold"
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? "Opening checkout…" : "Upgrade to Pro — ₹49/month"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Secured by Razorpay · Cancel anytime from dashboard
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
