"use client";

import dynamic from "next/dynamic";

const ReactLenis = dynamic(() => import("lenis/react"), { ssr: false });

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  return <ReactLenis root>{children}</ReactLenis>;
}
