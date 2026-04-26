"use client";

import { useState, useCallback } from "react";
import { Check, X, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
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

const FREE_FEATURES = [
  { text: "Switch Challenge (unlimited)", included: true },
  { text: "Memory / Recall games (unlimited)", included: true },
  { text: "Leaderboard access", included: true },
  { text: "Digit Challenge", included: false },
  { text: "Deductive Challenge", included: false },
  { text: "Motion Challenge", included: false },
  { text: "Inductive Challenge", included: false },
];

const PRO_FEATURES = [
  { text: "All free games (unlimited)", included: true },
  { text: "Digit Challenge", included: true },
  { text: "Deductive Challenge", included: true },
  { text: "Motion Challenge", included: true },
  { text: "Inductive Challenge", included: true },
  { text: "Full score history", included: true },
  { text: "Cancel anytime", included: true },
];

const PLANS = [
  {
    id: "monthly" as const,
    label: "Monthly",
    price: "₹49",
    period: "/month",
    sub: "Billed monthly · cancel anytime",
    badge: null,
  },
  {
    id: "biannual" as const,
    label: "6 Months",
    price: "₹199",
    period: "/6 months",
    sub: "Save ₹95 vs monthly · billed once",
    badge: "Best Value",
  },
];

export default function PricingClient() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "biannual">("biannual");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activePlan = PLANS.find((p) => p.id === selectedPlan)!;

  const handleUpgrade = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/subscription/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      if (!res.ok) {
        const body = await res.json();
        if (body.error === "Already subscribed") {
          setError("You already have an active subscription.");
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
        description:
          selectedPlan === "monthly" ? "Pro — ₹49/month" : "Pro — ₹199/6 months",
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
  }, [selectedPlan]);

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
            Free forever for Switch &amp; Memory games. Upgrade to unlock all 5 cognitive games.
          </p>
        </motion.div>

        {/* Plan toggle */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-1 bg-muted/50 border border-border/50 rounded-xl p-1">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  "relative px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  selectedPlan === plan.id
                    ? "bg-background text-foreground shadow-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {plan.label}
                {plan.badge && (
                  <span className="absolute -top-2.5 -right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-500 text-black leading-none">
                    {plan.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-6">

          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
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

            <Link href="/games" className="w-full">
              <Button variant="default" className="w-full">
              Play now 
            </Button>
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
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
                <p className="text-4xl font-bold">{activePlan.price}</p>
                <p className="text-muted-foreground mb-1">{activePlan.period}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{activePlan.sub}</p>
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
              className="w-full h-11 font-semibold gap-2"
              onClick={handleUpgrade}
              disabled={loading}
            >
              <Crown className="w-4 h-4" />
              {loading
                ? "Opening checkout…"
                : `Upgrade — ${activePlan.price}${activePlan.period}`}
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
