"use client";

import { useEffect, useState } from "react";

/**
 * Decorative background video for the gameplay routes.
 *
 * The play layout previously rendered this <video> inline with `autoPlay`.
 * `preload="none"` does not help there — `autoPlay` makes the browser fetch the
 * media immediately regardless, so every play route pulled a CloudFront MP4
 * that competed for bandwidth with the game chunk while a timed test was
 * starting.
 *
 * Now the poster paints instantly as a CSS background and the video element is
 * only created once the browser is idle. Anyone who has asked for reduced
 * motion, or is on a connection that reports itself as slow or metered, never
 * gets the video at all — they keep the poster, which is what the video mostly
 * looks like anyway.
 */
export default function AmbientVideo({
  src,
  poster,
}: {
  src: string;
  poster: string;
}) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /2g/.test(connection.effectiveType)) return;

    const idle =
      window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const handle = idle(() => setShowVideo(true));

    return () => {
      if (window.cancelIdleCallback && typeof handle === "number") {
        window.cancelIdleCallback(handle);
      } else {
        clearTimeout(handle as number);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${poster})` }}
    >
      {showVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={poster}
          src={src}
          className="gpu-accelerated pointer-events-none h-full w-full object-cover"
        />
      )}
    </div>
  );
}
