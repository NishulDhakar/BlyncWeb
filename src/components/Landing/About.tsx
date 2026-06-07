// Server Component — no client JS shipped

import React from "react";
import { Puzzle, Brain, Zap, Target, TrendingUp, Users } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Container from "../common/Container";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="h-full">
      <Card className="h-full border-border/40 bg-card/40 hover:border-border/60 transition-colors duration-200">
        <CardHeader>
          <div className="mb-4 w-12 h-12 mt-4 rounded-lg bg-white/5 flex items-center justify-center text-foreground">
            {icon}
          </div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function About() {
  const features = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Precision Training",
      description:
        "Practice modules designed to mirror the exact logic and mechanics of actual cognitive assessments.",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Cognitive Enhancement",
      description:
        "Sharpen logical reasoning, pattern recognition, and critical thinking with scientifically designed puzzles.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Speed Improvement",
      description:
        "Build reaction time and accuracy through timed challenges that simulate real exam pressure.",
    },
    {
      icon: <Puzzle className="h-6 w-6" />,
      title: "Diverse Challenges",
      description: "Master varied game types including Deductive, Inductive, Grid, and Switch challenges."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Track Progress",
      description: "Monitor your improvement over time with detailed performance analytics and history."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Peer Comparison",
      description: "See where you stand among other candidates and strive for the top of the leaderboard."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <Container>
        <div className="mb-16 text-center max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Why ?
          </h2>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50 text-xl md:text-xl font-bold tracking-tight mb-4">Practice Capgemini Games on Blync?</span>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto mt-10">
            Blync is built specifically for candidates preparing for Capgemini and Cognizant game-based aptitude tests. Our practice modules simulate the exact cognitive challenges from these placement rounds so you walk in confident, not surprised.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
