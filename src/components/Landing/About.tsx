"use client";

import React from "react";
import { motion } from "framer-motion";
import { Puzzle, Brain, Zap, Target, TrendingUp, Users } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Container from "../common/Container";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="h-full"
    >
      <Card className="h-full  border-border/40 bg-card/40 backdrop-blur-md hover:border-primary/20 hover:bg-card/60 hover:shadow-lg transition-all duration-300 group">
        <CardHeader>
          <div className="mb-4 w-12 h-12 mt-4 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
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
    </motion.div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Why Practice Capgemini Games on Blync?
            </motion.h2>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Blync is built specifically for candidates preparing for Capgemini and Cognizant game-based aptitude tests. Our practice modules simulate the exact cognitive challenges from these placement rounds — so you walk in confident, not surprised.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.1 + index * 0.1}
            />
          ))}
        </div>
      </Container>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </section>
  );
}
