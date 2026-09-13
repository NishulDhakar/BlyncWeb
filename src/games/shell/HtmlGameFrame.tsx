"use client";

import { useEffect, useRef, useState } from "react";

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

  // The site is dark-only (<html class="dark">); tell the frame so its own
  // stylesheet paints to match instead of flashing white.
  useEffect(() => {
    if (!visible) return;
    frameRef.current?.contentWindow?.postMessage(
      { type: "blync-theme", theme: "dark" },
      "*"
    );
  }, [visible]);

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
