"use client";

import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function PatternRecognitionPageContent() {
    return (
        <div className="min-h-screen bg-background">
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
                            <Badge>Skills</Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                10 min read
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Feb 3, 2026
                            </Badge>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                            10 Strategies to Master Pattern Recognition in Cognitive Tests
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                            Learn proven techniques used by top performers to identify patterns faster and more accurately in cognitive ability tests. These strategies will transform your pattern recognition skills and significantly boost your scores.
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
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Why Pattern Recognition Matters</h2>
                                <p className="leading-relaxed mb-4">
                                    Pattern recognition is the cornerstone of cognitive ability tests used by companies like Capgemini and Cognizant. It's the ability to identify logical sequences, relationships, and structures within seemingly random information. This skill directly correlates with problem-solving ability—a quality every employer seeks.
                                </p>
                                <p className="leading-relaxed">
                                    The good news? Pattern recognition is a learnable skill that dramatically improves with targeted practice and the right strategies. This guide shares 10 proven techniques used by top performers.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">The 10 Essential Strategies</h2>
                                <div className="space-y-6">
                                    {[
                                        { num: 1, title: "Look for Arithmetic Patterns First", desc: "Check for basic addition, subtraction, multiplication, and division between consecutive numbers. Differences themselves may form patterns." },
                                        { num: 2, title: "Chunk Information: Break Down Complex Patterns", desc: "Your working memory can only hold 5-7 items. Break patterns into smaller chunks for easier processing." },
                                        { num: 3, title: "Use the Elimination Method", desc: "In multiple-choice questions, eliminate obviously wrong answers to improve your success rate significantly." },
                                        { num: 4, title: "Build a Mental Library of Common Patterns", desc: "Recognize Fibonacci sequences, prime numbers, perfect squares, and visual pattern types instantly." },
                                        { num: 5, title: "Practice the \"What Changes, What Stays\" Method", desc: "Systematically identify constant elements and changing elements to spot subtle patterns." },
                                        { num: 6, title: "Time-Box Your Analysis", desc: "Don't spend more than 30-45 seconds per question. Fresh eyes often spot patterns you initially missed." },
                                        { num: 7, title: "Look for Meta-Patterns", desc: "Sometimes the pattern isn't in elements themselves but in how the pattern changes over time." },
                                        { num: 8, title: "Practice Reverse Engineering", desc: "When you see correct answers, work backwards to understand why. This deepens your intuition significantly." },
                                        { num: 9, title: "Develop Spatial Reasoning", desc: "Practice mentally rotating objects. Mobile games involving spatial manipulation build this skill effectively." },
                                        { num: 10, title: "Use Spaced Repetition", desc: "Distribute practice over multiple days. Your brain consolidates pattern recognition during rest periods." }
                                    ].map((strategy) => (
                                        <Card key={strategy.num} className="border-l-4 border-l-primary bg-card/40">
                                            <CardContent className="pt-6">
                                                <div className="flex gap-4">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                                                        {strategy.num}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-foreground mb-2">{strategy.title}</h3>
                                                        <p className="text-sm">{strategy.desc}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Your Practice Plan</h2>
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="text-lg font-bold text-foreground mb-4">Daily Practice Routine (30 minutes)</h3>
                                        <ul className="space-y-3">
                                            <li><strong>Minutes 0-5:</strong> Warm-up with simple sequences (focus on speed)</li>
                                            <li><strong>Minutes 5-15:</strong> Focused practice on your weakest pattern type</li>
                                            <li><strong>Minutes 15-25:</strong> Mixed pattern types under simulated test conditions</li>
                                            <li><strong>Minutes 25-30:</strong> Review mistakes and update your strategy knowledge</li>
                                        </ul>
                                        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg">
                                            <p className="font-semibold text-foreground mb-2">Expected Results:</p>
                                            <ul className="space-y-1 text-sm">
                                                <li>Week 1: 15-20% improvement</li>
                                                <li>Week 2: 30-35% improvement, intuition develops</li>
                                                <li>Week 3: 45-50% improvement, strategies become automatic</li>
                                                <li>Week 4+: 60-70% improvement, expert-level recognition</li>
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Final Thoughts</h2>
                                <p className="leading-relaxed mb-4">
                                    Pattern recognition isn't about being naturally talented—it's about having the right strategies and practicing them consistently. These 10 techniques form the foundation of expert-level pattern recognition.
                                </p>
                                <p className="leading-relaxed">
                                    Start implementing one strategy at a time in your practice sessions. With consistent effort and the right approach, you'll develop pattern recognition skills that help you excel at placement tests and enhance your life-long problem-solving abilities.
                                </p>
                            </section>

                            <section className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl border border-primary/20">
                                <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Practice?</h3>
                                <p className="text-muted-foreground mb-6">
                                    Apply these pattern recognition techniques with hundreds of practice problems on our platform.
                                </p>
                                <Link
                                    href="/games"
                                    className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                                >
                                    Start Practicing Now
                                </Link>
                            </section>
                        </div>
                    </motion.article>
                </Container>
            </section>
        </div>
    );
}
