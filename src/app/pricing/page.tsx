import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing — Blync Pro",
  description:
    "Upgrade to Blync Pro for ₹49/month. Unlimited game attempts, full score history, and performance charts.",
  alternates: { canonical: `${siteConfig.url}/pricing` },
};

export default function PricingPage() {
  return <PricingClient />;
}
