"use client";

import { useEffect, useRef, useState } from 'react';

interface HlsVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function HlsVideo({ src, className, style }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Only start loading when the video enters the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // start loading 200px before visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Dynamically import hls.js only when visible
  useEffect(() => {
    if (!isVisible) return;
    const video = videoRef.current;
    if (!video) return;

    let hls: any;

    import('hls.js').then((HlsModule) => {
      const Hls = HlsModule.default;
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      }
    });

    return () => {
      if (hls) hls.destroy();
    };
  }, [src, isVisible]);

  return (
    <div ref={containerRef} className={className} style={style}>
      {isVisible && (
        <video
          ref={videoRef}
          className="w-full h-full object-cover gpu-accelerated"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        />
      )}
    </div>
  );
}
