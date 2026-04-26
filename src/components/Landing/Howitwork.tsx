"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Gamepad2, BarChart3, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "01",
    Icon: Gamepad2,
    title: "Choose Your Game",
    desc: "Pick from Switch, Digit, Grid, Motion, Inductive, or Deductive challenges — the exact games used in Capgemini & Cognizant assessments.",
    color: "#FF3F8F",
  },
  {
    number: "02",
    Icon: BarChart3,
    title: "Practice with Mock Tests",
    desc: "Play timed mock tests that replicate the real exam format. Build speed, sharpen accuracy, and get comfortable with every game type.",
    color: "#0586C8",
  },
  {
    number: "03",
    Icon: Trophy,
    title: "Track & Improve",
    desc: "Monitor your scores on the leaderboard, identify weak spots, and repeat until you can clear every round with confidence.",
    color: "#7C3AED",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section className="relative overflow-hidden py-28 px-6 md:px-16">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260411_104032_69319010-2458-492b-b04d-b40a5dfa4482.mp4"
      />
      <div className="absolute inset-0  z-[1]" aria-hidden="true" />

      <div ref={sectionRef} className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          {/* Sticky left column */}
          <div className="md:w-1/2 md:sticky md:top-32">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" as const }}
            >
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-primary/30 bg-primary/5">
                         ❓ How it works
                       </Badge>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05] mb-5">
                Three steps to{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, #FF3F8F)" }}
                >
                  ace the test.
                </span>
              </h2>

              <p className="text-white/60 text-sm md:text-base max-w-md leading-relaxed">
                We stripped away the noise. What remains is a clean path from
                zero to clearing Capgemini &amp; Cognizant game-based rounds.
              </p>
            </motion.div>
          </div>

          {/* Steps */}
          <div className="md:w-1/2 flex flex-col gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: 32 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.12, ease: "easeOut" as const }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-7 hover:border-white/20 hover:bg-white/8 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-2.5 rounded-xl border flex-shrink-0"
                    style={{ backgroundColor: `${step.color}15`, borderColor: `${step.color}30` }}
                  >
                    <step.Icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>
                  <div>
                    <span
                      className="text-xs font-bold tracking-widest"
                      style={{ color: `${step.color}90` }}
                    >
                      {step.number}
                    </span>
                    <h3 className="text-lg font-semibold text-white mt-1 mb-2">{step.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
