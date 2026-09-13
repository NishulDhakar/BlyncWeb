// Server Component — no client JS shipped

import { Gamepad2, BarChart3, Trophy } from "lucide-react";
import Container from "../common/Container";
import { Kicker, landingHeadingClass, landingSubtitleClass } from "./_ui";

const steps = [
  {
    number: "01",
    Icon: Gamepad2,
    title: "Choose your game",
    desc: "Pick from Switch, Digit, Grid, Motion, Inductive or Deductive — the exact games in the Capgemini and Cognizant assessments.",
  },
  {
    number: "02",
    Icon: BarChart3,
    title: "Run timed mocks",
    desc: "Play rounds that replicate the real exam format. Build speed, sharpen accuracy, and get comfortable with every mechanic.",
  },
  {
    number: "03",
    Icon: Trophy,
    title: "Track and improve",
    desc: "Watch your scores on the leaderboard, spot the weak rounds, and repeat until you can clear each one on the first try.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-12 md:flex-row md:gap-16">
          <div className="md:w-1/2 md:sticky md:top-32 md:self-start">
            <Kicker>How it works</Kicker>
            <h2 className={`mt-5 ${landingHeadingClass}`}>
              Three steps from zero to{" "}
              <span>clearing the round.</span>
            </h2>
            <p className={`${landingSubtitleClass} mx-0`}>
              We stripped away the noise. What is left is a clean path through
              Capgemini and Cognizant game-based rounds.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:w-1/2">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-foreground">
                    <step.Icon className="size-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {step.number}
                    </span>
                    <h3 className="mt-1 font-heading text-lg font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
