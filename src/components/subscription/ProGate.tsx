"use client";

/**
 * ProGate — All games are 100% free with unlimited access.
 * This component simply renders its children without any restrictions.
 * No attempt limits, no upgrade prompts — play as much as you want!
 */

interface Props {
  gameSlug: string;
  children: React.ReactNode;
}

export default function ProGate({ gameSlug: _gameSlug, children }: Props) {
  // All content is free and accessible to everyone — no gates needed
  return <>{children}</>;
}
