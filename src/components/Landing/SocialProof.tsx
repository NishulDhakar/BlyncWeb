"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Linkedin, Sparkles } from "lucide-react";
import Container from "../common/Container";

/* ── Social proof data ───────────────────────────────────────────────────── */

const linkedInEmbed = {
  src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7368738749461028864?compact=1",
  title: "Blync LinkedIn Post",
};

/* ── Main section ────────────────────────────────────────────────────────── */

export default function SocialProof() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeVisible, setIframeVisible] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  // Defer iframe loading until user scrolls near it
  useEffect(() => {
    const el = iframeContainerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIframeVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="social-proof" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[300px] bg-emerald-600/[0.03] rounded-full blur-3xl" />
      </div>

      <Container>
        {/* ── Section Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center max-w-3xl mx-auto relative z-10"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            See What People Say
          </h2>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50 text-xl md:text-xl font-bold tracking-tight mb-4">
            Real Posts, Real Feedback
          </span>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto mt-10">
            Don&apos;t just take our word for it — see genuine posts, success reviews, and community reactions from our LinkedIn network.
          </p>
        </motion.div>

        {/* ── Main grid: LinkedIn Embed + Success Review Image ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 relative z-10">
          {/* LinkedIn Embed */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
            ref={iframeContainerRef}
          >
            <div className="rounded-2xl border border-blue-800/20 bg-gradient-to-br from-blue-950/20 to-neutral-900/60 p-1.5 backdrop-blur-sm overflow-hidden">
              {/* Loading skeleton */}
              {!iframeLoaded && (
                <div
                  className="absolute inset-1.5 rounded-xl bg-neutral-900 flex items-center justify-center z-10"
                  style={{ minHeight: 450 }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <Linkedin className="w-8 h-8 text-blue-400 animate-pulse" />
                    <span className="text-sm text-muted-foreground">
                      {iframeVisible ? "Loading post..." : "Scroll to load"}
                    </span>
                  </div>
                </div>
              )}
              {iframeVisible && (
                <iframe
                  src={linkedInEmbed.src}
                  height="450"
                  width="100%"
                  frameBorder="0"
                  allowFullScreen
                  title={linkedInEmbed.title}
                  className="rounded-xl w-full"
                  onLoad={() => setIframeLoaded(true)}
                  loading="lazy"
                />
              )}
              {!iframeVisible && <div style={{ height: 450 }} />}
            </div>
            {/* Label */}
            <div className="flex items-center gap-2 mt-3 ml-1">
              <Linkedin className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">Live LinkedIn Post</span>
            </div>
          </motion.div>

          {/* Success Review Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div
              className="rounded-2xl border border-blue-800/20 bg-gradient-to-br from-blue-950/20 to-neutral-900/60 p-1.5 backdrop-blur-sm overflow-hidden flex flex-col justify-between"
              style={{ height: 450 }}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-neutral-950/40 flex items-center justify-center p-2">
                <img
                  src="/review/review.jpg"
                  alt="Student Placement Review Feedback"
                  className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
            </div>
            {/* Label */}
            <div className="flex items-center gap-2 mt-3 ml-1">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">
                Student Success Feedback
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 text-center relative z-10"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-3 px-6 py-3 rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm">
            <span className="text-sm text-muted-foreground">
              Join thousands of students already preparing with Blync
            </span>
            <span className="text-xs text-muted-foreground/50">•</span>
            <a
              href="https://www.linkedin.com/in/nishuldhakar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Follow us on LinkedIn
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
