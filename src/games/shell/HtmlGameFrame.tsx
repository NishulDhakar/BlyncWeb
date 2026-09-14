"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "next-themes";

/**
 * Sandboxed host for the self-contained HTML assessments (debugging rounds,
 * the Accenture technical quiz, the Cognizant communication rounds).
 *
 * The frame is mounted only once it scrolls into view. The assessments carry
 * their own CSS and a few hundred KB of question data inline, so eagerly
 * mounting them cost the route its LCP for markup the player had not asked
 * for yet.
 */
export default function HtmlGameFrame({
  srcDoc,
  title,
  allow,
}: {
  srcDoc: string;
  title: string;
  /** e.g. "microphone; autoplay" for the speaking rounds. */
  allow?: string;
}) {
  const holderRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(false);
  const { resolvedTheme } = useTheme();

  const syncTheme = useCallback(() => {
    // Determine active theme from resolvedTheme or direct parent DOM class
    const isDark =
      resolvedTheme === "dark" ||
      (typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark"));
    const currentTheme = isDark ? "dark" : "light";

    // 1. Direct same-origin DOM access (instant, zero lag, no race condition)
    try {
      const frameDoc = frameRef.current?.contentDocument;
      if (frameDoc && frameDoc.documentElement) {
        frameDoc.documentElement.dataset.theme = currentTheme;
        frameDoc.documentElement.style.colorScheme = currentTheme;
        frameDoc.documentElement.classList.toggle("dark", isDark);
        if (frameDoc.body) {
          frameDoc.body.classList.toggle("dark", isDark);
          frameDoc.body.style.colorScheme = currentTheme;
        }
      }
    } catch {
      // Ignored if cross-origin
    }

    // 2. Post message backup
    try {
      frameRef.current?.contentWindow?.postMessage(
        { type: "blync-theme", theme: currentTheme },
        "*"
      );
    } catch {
      // Ignored
    }
  }, [resolvedTheme]);

  useEffect(() => {
    const node = holderRef.current;
    if (!node) return;

    // Older Safari has no IntersectionObserver — mount immediately there.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Sync theme to iframe on visibility, mount, and theme changes
  useEffect(() => {
    if (!visible) return;
    syncTheme();
  }, [visible, syncTheme]);

  // Observe root class changes when user clicks the theme toggle
  useEffect(() => {
    if (typeof MutationObserver === "undefined" || !visible) return;
    const observer = new MutationObserver(() => {
      syncTheme();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => observer.disconnect();
  }, [visible, syncTheme]);

  const frameClass =
    "block h-[calc(100vh-4rem)] min-h-[720px] w-full border-0 bg-background sm:h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)]";

  return (
    <div ref={holderRef}>
      {visible ? (
        <iframe
          ref={frameRef}
          srcDoc={srcDoc}
          title={title}
          className={frameClass}
          allow={allow}
          onLoad={syncTheme}
          // allow-same-origin is required, not incidental: the debugging
          // assessments persist progress to localStorage (cm_debug_state_*) and
          // the speaking rounds call navigator.mediaDevices.getUserMedia, both of
          // which are blocked in an opaque-origin frame. The framed documents are
          // first-party assets under src/games/html-assessments, never user input,
          // so sharing the origin does not widen the attack surface.
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        />
      ) : (
        <div className={`${frameClass} grid place-items-center`} aria-hidden="true">
          <p className="text-sm text-muted-foreground">Loading assessment…</p>
        </div>
      )}
    </div>
  );
}
