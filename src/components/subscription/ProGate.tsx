"use client";

/**
 * ProGate is kept for older imports. Paid access is enforced in the
 * server layouts for /play and /memory-game routes.
 */

interface Props {
  gameSlug: string;
  children: React.ReactNode;
}

export default function ProGate({ gameSlug: _gameSlug, children }: Props) {
  // All content is free and accessible to everyone — no gates needed
  return <>{children}</>;
}
