"use client";

import { useEffect } from "react";

/**
 * Installs Lenis smooth scrolling on the document.
 *
 * This used to be `dynamic(() => import("lenis/react"), { ssr: false })`
 * wrapping `{children}` in the root layout. Because a component with
 * `ssr: false` cannot render on the server, wrapping the whole tree in it made
 * every page bail out to client-side rendering — the prerendered HTML for every
 * route contained a BAILOUT_TO_CLIENT_SIDE_RENDERING marker and none of the
 * actual page content. Static generation was doing no work, first paint waited
 * on the full JS bundle, and crawlers that do not execute JavaScript saw an
 * empty document on the pages the site ranks with.
 *
 * Lenis does not need to own the React tree. It attaches to `window` and
 * `document.documentElement`, so it works just as well from an effect. The
 * component renders nothing and sits beside the content rather than around it,
 * which keeps `ssr: false`-equivalent behaviour (the library is still only
 * loaded in the browser, via the dynamic import below) without dragging the
 * page tree client-side with it.
 *
 * Respects prefers-reduced-motion: hijacking scroll is exactly what that
 * setting is asking us not to do.
 */
export default function LenisProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let instance: { destroy: () => void } | null = null;
    let cancelled = false;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      instance = new Lenis({ autoRaf: true });
    });

    return () => {
      cancelled = true;
      instance?.destroy();
    };
  }, []);

  return null;
}
