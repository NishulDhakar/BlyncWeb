"use client";

import { useEffect, useState } from "react";
import { checkAttemptLimit, recordAttempt } from "@/features/subscription/actions";
import UpgradeModal from "./UpgradeModal";

interface Props {
  gameSlug: string;
  children: React.ReactNode;
}

type GateState = "loading" | "allowed" | "blocked";

export default function ProGate({ gameSlug, children }: Props) {
  const [state, setState] = useState<GateState>("loading");

  useEffect(() => {
    checkAttemptLimit(gameSlug).then(({ allowed }) => {
      if (allowed) {
        recordAttempt(gameSlug);
        setState("allowed");
      } else {
        setState("blocked");
      }
    });
  }, [gameSlug]);

  if (state === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (state === "blocked") {
    return <UpgradeModal />;
  }

  return <>{children}</>;
}
