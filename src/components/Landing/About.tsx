// Server Component — no client JS shipped

import { Puzzle, Brain, Zap, Target, TrendingUp, Users } from "lucide-react";
import Container from "../common/Container";
import { SectionHeading, PanelCard } from "./_ui";

const features = [
  {
    Icon: Target,
    title: "Exam-accurate practice",
    description:
      "Every module mirrors the logic, timing and difficulty curve of the real Capgemini and Cognizant rounds — no surprises on test day.",
  },
  {
    Icon: Brain,
    title: "Sharper reasoning",
    description:
      "Pattern recognition, working memory and rule inference, trained with puzzles designed around the exact skills recruiters score.",
  },
  {
    Icon: Zap,
    title: "Faster under pressure",
    description:
      "Timed challenges rebuild your reaction speed and accuracy so the clock stops working against you.",
  },
  {
    Icon: Puzzle,
    title: "Every game type",
    description:
      "Switch, Grid, Digit, Motion, Inductive and Deductive challenges — plus memory rounds and communication sets.",
  },
  {
    Icon: TrendingUp,
    title: "Visible progress",
    description:
      "Scores, streaks and history turn scattered practice into a clear picture of where you stand and what to fix.",
  },
  {
    Icon: Users,
    title: "Know your rank",
    description:
      "Compare focus times and streaks with other candidates on a global leaderboard, without the noise.",
  },
];

export default function About() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          kicker="Why Blync"
          title="Practice built for the"
          accent="round that actually decides it."
          description="Blync exists for one job — getting you through game-based aptitude tests. The practice is direct, relevant, and free of everything that isn't."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ Icon, title, description }) => (
            <PanelCard key={title} className="h-full">
              <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-secondary text-foreground">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </PanelCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
