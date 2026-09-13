"use client";

import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, ArrowLeft, Brain, Cpu, Zap, Target } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function CognitiveGamesProblemSolvingContent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="relative py-12 md:py-16 border-b border-border/40 bg-gradient-to-b from-primary/5 to-background">
        <Container className="max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge>Science</Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                8 min read
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Feb 2, 2026
              </Badge>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              How Cognitive Games Improve Your Problem-Solving Skills
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              Discover the neuroscience of gamified assessment preparation. Learn how regular practice with cognitive mini-games rewires neural pathways, sharpens executive function, and delivers breakthrough results in placement tests.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Article Content */}
      <section className="py-12 md:py-16">
        <Container className="max-w-4xl">
          <motion.article
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  The Neuroscience of Cognitive Training
                </h2>
                <p className="leading-relaxed mb-4">
                  For decades, psychologists considered general intelligence (specifically fluid intelligence—the ability to reason and solve novel problems independent of acquired knowledge) to be static throughout adulthood. However, modern neuroimaging and neuroplasticity studies demonstrate that targeted cognitive challenges induce structural and functional adaptations within the prefrontal cortex and parietal lobes.
                </p>
                <p className="leading-relaxed">
                  Companies like Capgemini, Cognizant, and Aon have replaced traditional multiple-choice questions with game-based assessments because games measure raw cognitive horsepower under dynamic stress, unpolluted by memorization or rote question banks.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  The 4 Core Mental Engines Enhanced by Cognitive Games
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-border/60 bg-card/40">
                    <CardContent className="pt-6 space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Brain className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">1. Working Memory Capacity</h3>
                      <p className="text-sm">
                        Working memory acts as your brain&apos;s mental scratchpad. Games like the <strong>Grid Challenge</strong> train you to hold complex visual coordinate structures while concurrently solving spatial sequence questions.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/60 bg-card/40">
                    <CardContent className="pt-6 space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Zap className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">2. Cognitive Flexibility & Task Switching</h3>
                      <p className="text-sm">
                        Task switching requires disengaging from one rule system and immediately executing another without mental lag. Games like the <strong>Switch Challenge</strong> condition rapid rule transposition without accuracy degradation.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/60 bg-card/40">
                    <CardContent className="pt-6 space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Cpu className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">3. Inductive & Deductive Reasoning</h3>
                      <p className="text-sm">
                        Inductive reasoning involves deriving generalized rules from incomplete data points, while deductive logic requires applying rigid constraints to eliminate impossibilities (as tested in the <strong>Deductive Challenge</strong>).
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/60 bg-card/40">
                    <CardContent className="pt-6 space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <Target className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">4. Perceptual Processing Speed</h3>
                      <p className="text-sm">
                        Under tight assessment clocks, the brain must filter sensory noise instantly. Cognitive games train your visual cortex to isolate pertinent stimuli within milliseconds, reducing decision latency.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Why Game-Based Practice Beats Passive Reading
                </h2>
                <p className="leading-relaxed mb-4">
                  Reading about problem-solving strategies triggers passive recognition, creating an illusion of competence. In contrast, interactive cognitive games require active retrieval, sensory-motor coordination, and rapid error correction under time pressure.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Instant Feedback Loop:</strong> Immediate visual feedback pinpoints exactly when and where your decision model failed.</li>
                  <li><strong>Stress Inoculation:</strong> Playing timed drills desensitizes candidates to test-day anxiety, preserving working memory bandwidth.</li>
                  <li><strong>Adaptive Difficulty:</strong> Repeated sessions push cognitive limits gradually, stimulating dendritic branching.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  How to Structure Your Cognitive Training
                </h2>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold text-foreground mb-3">The Optimal 20-Minute Daily Protocol</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-3">
                        <span className="font-semibold text-primary min-w-[80px]">Session 1:</span>
                        <span>5 minutes of Switch Challenge to calibrate task-switching agility.</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-semibold text-primary min-w-[80px]">Session 2:</span>
                        <span>5 minutes of Digit Challenge to sharpen quantitative estimation.</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-semibold text-primary min-w-[80px]">Session 3:</span>
                        <span>5 minutes of Grid Challenge for visuospatial memory training.</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-semibold text-primary min-w-[80px]">Session 4:</span>
                        <span>5 minutes reviewing score history and speed percentiles on your profile.</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl border border-primary/20">
                <h3 className="text-2xl font-bold text-foreground mb-4">Train Your Brain Today</h3>
                <p className="text-muted-foreground mb-6">
                  Practice all 6 Capgemini cognitive games completely free. Build real problem-solving instincts before your placement round.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/games/cognitive"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                  >
                    Play Cognitive Games Free
                  </Link>
                  <Link
                    href="/Capgemini"
                    className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium text-sm"
                  >
                    Capgemini Guide & Rules
                  </Link>
                </div>
              </section>
            </div>
          </motion.article>
        </Container>
      </section>
    </div>
  );
}
