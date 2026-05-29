"use client";

import { Gamepad2, BarChart3, Trophy } from "lucide-react";

const steps = [
  {
    number: "01",
    Icon: Gamepad2,
    title: "Choose Your Game",
    desc: "Pick from Switch, Digit, Grid, Motion, Inductive, or Deductive challenges — the exact games used in Capgemini & Cognizant assessments.",
  },
  {
    number: "02",
    Icon: BarChart3,
    title: "Practice with Mock Tests",
    desc: "Play timed mock tests that replicate the real exam format. Build speed, sharpen accuracy, and get comfortable with every game type.",
  },
  {
    number: "03",
    Icon: Trophy,
    title: "Track & Improve",
    desc: "Monitor your scores on the leaderboard, identify weak spots, and repeat until you can clear every round with confidence.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-28 px-6 md:px-16">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          {/* Left column */}
          <div className="md:w-1/2 md:sticky md:top-32">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-white">
              How it works
            </h2>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 text-xl md:text-xl font-bold tracking-tight mb-4">
              Three steps to ace the test.
            </span>
            <p className="text-md md:text-lg text-white/60 max-w-2xl mt-10">
              We stripped away the noise. What remains is a clean path from
              zero to clearing Capgemini &amp; Cognizant game-based rounds.
            </p>
          </div>

          {/* Steps */}
          <div className="md:w-1/2 flex flex-col gap-5">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-white/5 p-7 hover:border-white/20 transition-colors duration-200"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-2.5 rounded-xl border border-white/10 bg-white/5 flex-shrink-0"
                  >
                    <step.Icon className="w-5 h-5 text-foreground/70" />
                  </div>
                  <div>
                    <span className="text-xs font-bold tracking-widest text-muted-foreground">
                      {step.number}
                    </span>
                    <h3 className="text-lg font-semibold text-white mt-1 mb-2">{step.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
