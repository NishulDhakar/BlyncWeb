"use client";

import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function CapgeminiGuidePage() {
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
                            <Badge>Placement Prep</Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                12 min read
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Feb 4, 2026
                            </Badge>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                            Complete Guide to Capgemini Cognitive Ability Games
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                            Everything you need to know about Capgemini's game-based aptitude tests, including detailed breakdowns of each game type, scoring strategies, and preparation tips that actually work.
                        </p>

                        <div className="flex items-center gap-4 pt-6 border-t border-border/40">
                            <span className="text-sm text-muted-foreground">Share this article</span>
                            <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                                <Share2 className="h-4 w-4" />
                            </button>
                        </div>
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

                            {/* Introduction */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Introduction</h2>
                                <p className="leading-relaxed mb-4">
                                    Capgemini's cognitive ability games have become a crucial part of their recruitment process, replacing traditional aptitude tests with interactive, game-based assessments. These games are designed to evaluate your logical reasoning, pattern recognition, memory, and problem-solving skills in a more engaging format. Understanding how these games work and how to prepare for them can significantly improve your chances of success in Capgemini placements.
                                </p>
                                <p className="leading-relaxed">
                                    In this comprehensive guide, we'll break down each game type, provide proven strategies, and share insider tips that will help you perform at your best. Whether you're preparing for your first Capgemini assessment or looking to improve your scores, this guide has everything you need.
                                </p>
                            </section>

                            {/* Game Types */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Understanding the Game Types</h2>

                                <Card className="my-6 border-primary/20 bg-primary/5">
                                    <CardContent className="pt-6">
                                        <h3 className="text-xl font-bold text-foreground mb-3">1. Switch Challenge</h3>
                                        <p className="mb-3">
                                            The Switch Challenge tests your ability to follow complex rules and switch between different patterns quickly. You'll be presented with tiles that need to be arranged according to specific switching rules.
                                        </p>
                                        <p className="font-semibold text-foreground mb-2">Key Skills Tested:</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Pattern following and rule application</li>
                                            <li>Mental flexibility and adaptation</li>
                                            <li>Speed and accuracy under time pressure</li>
                                        </ul>
                                        <p className="font-semibold text-foreground mt-4 mb-2">Winning Strategy:</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Read the rules carefully before starting—understanding is more important than speed initially</li>
                                            <li>Practice recognizing patterns quickly through repetition</li>
                                            <li>Start with easier levels to build confidence and muscle memory</li>
                                            <li>Don't panic if you make mistakes—learn from them and adjust your approach</li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="my-6 border-primary/20 bg-primary/5">
                                    <CardContent className="pt-6">
                                        <h3 className="text-xl font-bold text-foreground mb-3">2. Grid Challenge</h3>
                                        <p className="mb-3">
                                            Grid Challenge evaluates your spatial reasoning and memory. You'll need to remember the positions of objects in a grid and recall them after they're hidden. This game directly tests your working memory capacity.
                                        </p>
                                        <p className="font-semibold text-foreground mb-2">Key Skills Tested:</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Visual-spatial memory</li>
                                            <li>Attention to detail and concentration</li>
                                            <li>Information retention under pressure</li>
                                        </ul>
                                        <p className="font-semibold text-foreground mt-4 mb-2">Winning Strategy:</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Create mental associations or stories to remember positions</li>
                                            <li>Divide the grid into quadrants for easier memorization</li>
                                            <li>Practice chunking—group items together rather than remembering individually</li>
                                            <li>Build your working memory capacity through daily practice</li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="my-6 border-primary/20 bg-primary/5">
                                    <CardContent className="pt-6">
                                        <h3 className="text-xl font-bold text-foreground mb-3">3. Digit Challenge</h3>
                                        <p className="mb-3">
                                            The Digit Challenge tests your numerical memory and processing speed. You'll be shown sequences of digits that you need to remember and reproduce accurately, often in reverse order or with manipulations.
                                        </p>
                                        <p className="font-semibold text-foreground mb-2">Key Skills Tested:</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Short-term memory for numbers</li>
                                            <li>Mental arithmetic and number manipulation</li>
                                            <li>Processing speed and accuracy</li>
                                        </ul>
                                        <p className="font-semibold text-foreground mt-4 mb-2">Winning Strategy:</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Use digit grouping techniques (e.g., phone number patterns)</li>
                                            <li>Practice with increasing sequence lengths gradually</li>
                                            <li>Develop number sense through mental math exercises</li>
                                            <li>Stay calm—anxiety significantly impairs number memory</li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="my-6 border-primary/20 bg-primary/5">
                                    <CardContent className="pt-6">
                                        <h3 className="text-xl font-bold text-foreground mb-3">4. Motion Challenge</h3>
                                        <p className="mb-3">
                                            Motion Challenge assesses your ability to track moving objects and predict their trajectories. This game tests your dynamic visual processing and predictive reasoning skills.
                                        </p>
                                        <p className="font-semibold text-foreground mb-2">Key Skills Tested:</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Dynamic visual tracking</li>
                                            <li>Predictive reasoning</li>
                                            <li>Hand-eye coordination and reaction time</li>
                                        </ul>
                                        <p className="font-semibold text-foreground mt-4 mb-2">Winning Strategy:</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Focus on one object at a time initially, then expand</li>
                                            <li>Use peripheral vision to track multiple objects</li>
                                            <li>Practice predicting motion paths mentally</li>
                                            <li>Improve reaction time through targeted exercises</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Preparation Timeline */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Preparation Timeline: 4-Week Plan</h2>
                                <p className="leading-relaxed mb-6">
                                    Structured preparation is key to success. Here's a proven 4-week plan that thousands of students have used to ace their Capgemini cognitive games:
                                </p>

                                <div className="space-y-6">
                                    <div className="pl-6 border-l-4 border-primary">
                                        <h3 className="text-xl font-bold text-foreground mb-2">Week 1: Familiarization</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Play each game type 3-5 times to understand mechanics</li>
                                            <li>Focus on accuracy over speed</li>
                                            <li>Note which games feel challenging—these need extra practice</li>
                                            <li>Establish a baseline score for each game type</li>
                                            <li>Expected improvement: 10-15% from baseline</li>
                                        </ul>
                                    </div>

                                    <div className="pl-6 border-l-4 border-primary">
                                        <h3 className="text-xl font-bold text-foreground mb-2">Week 2: Skill Building</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Practice 30-45 minutes daily with specific games</li>
                                            <li>Start incorporating time pressure gradually</li>
                                            <li>Focus on your weakest games for 60% of practice time</li>
                                            <li>Use spaced repetition—practice the same game at intervals</li>
                                            <li>Expected improvement: 25-30% from baseline</li>
                                        </ul>
                                    </div>

                                    <div className="pl-6 border-l-4 border-primary">
                                        <h3 className="text-xl font-bold text-foreground mb-2">Week 3: Speed and Accuracy</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Balance practice across all game types</li>
                                            <li>Set score targets and try to beat them</li>
                                            <li>Simulate test conditions with timed full practice sessions</li>
                                            <li>Track progress daily and adjust weak areas</li>
                                            <li>Expected improvement: 35-40% from baseline</li>
                                        </ul>
                                    </div>

                                    <div className="pl-6 border-l-4 border-primary">
                                        <h3 className="text-xl font-bold text-foreground mb-2">Week 4: Mastery and Confidence</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Maintain consistent practice but avoid burnout</li>
                                            <li>Take full mock tests under actual time constraints</li>
                                            <li>Review mistakes and refine strategies</li>
                                            <li>Practice stress management and test-day mindset</li>
                                            <li>Expected improvement: 45-50%+ from baseline</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Common Mistakes */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Common Mistakes to Avoid</h2>
                                <div className="space-y-4">
                                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                        <p className="font-semibold text-foreground mb-2">1. Rushing Through Instructions</p>
                                        <p>Many candidates skip or skim the game instructions to save time. This is a critical error. Understanding the rules thoroughly before starting is essential for success.</p>
                                    </div>

                                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                        <p className="font-semibold text-foreground mb-2">2. Practicing Only Your Strong Areas</p>
                                        <p>It's natural to gravitate toward games you're already good at, but improvement comes from working on weaknesses. Allocate 60% of practice time to challenging games.</p>
                                    </div>

                                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                        <p className="font-semibold text-foreground mb-2">3. Neglecting Mental Preparation</p>
                                        <p>Cognitive games are mentally taxing. Without proper rest and stress management, your performance will suffer regardless of practice. Get adequate sleep and manage test anxiety.</p>
                                    </div>

                                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                        <p className="font-semibold text-foreground mb-2">4. Inconsistent Practice</p>
                                        <p>Cramming all practice into the week before the test doesn't work. Cognitive skills need consistent, distributed practice to develop. Practice daily for best results.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Pro Tips */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Pro Tips from Top Performers</h2>
                                <div className="space-y-4">
                                    <Card className="border-l-4 border-l-primary bg-card/40">
                                        <CardContent className="pt-6">
                                            <p className="font-semibold text-foreground mb-2">💡 Warm Up Before Practice</p>
                                            <p>Spend 5 minutes on simple cognitive warm-up exercises before each practice session. This could be simple mental math, memory games, or pattern recognition puzzles. Your brain performs better when properly warmed up.</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-l-4 border-l-primary bg-card/40">
                                        <CardContent className="pt-6">
                                            <p className="font-semibold text-foreground mb-2">💡 Track Your Progress Visually</p>
                                            <p>Create a progress chart showing daily scores. Visual feedback is highly motivating and helps you identify trends. Seeing improvement reinforces positive practice habits.</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-l-4 border-l-primary bg-card/40">
                                        <CardContent className="pt-6">
                                            <p className="font-semibold text-foreground mb-2">💡 Practice at Different Times of Day</p>
                                            <p>You don't know when your actual test will be scheduled. Practice at various times to ensure you can perform well regardless of time. This also helps you identify your peak performance hours.</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-l-4 border-l-primary bg-card/40">
                                        <CardContent className="pt-6">
                                            <p className="font-semibold text-foreground mb-2">💡 Use the Leaderboard for Motivation</p>
                                            <p>Compete with other students on the platform leaderboard. Healthy competition drives improvement and shows you what scores are achievable with dedicated practice.</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </section>

                            {/* Conclusion */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Conclusion</h2>
                                <p className="leading-relaxed mb-4">
                                    Capgemini's cognitive ability games are challenging but entirely conquerable with the right preparation strategy. Success in these games comes down to three factors: understanding the game mechanics, consistent targeted practice, and maintaining the right mindset under pressure.
                                </p>
                                <p className="leading-relaxed mb-4">
                                    Remember that improvement takes time. Don't get discouraged if your initial scores are low—that's completely normal. With the 4-week preparation plan outlined in this guide and regular practice on our platform, you'll see significant improvement in your cognitive abilities and game performance.
                                </p>
                                <p className="leading-relaxed">
                                    The cognitive skills you develop through this preparation extend far beyond placement tests. You're building critical thinking, problem-solving, and mental agility that will benefit your entire career. Start practicing today, track your progress, and trust the process. Thousands of students have successfully cleared Capgemini's cognitive games using these strategies—you can too!
                                </p>
                            </section>

                            {/* CTA */}
                            <section className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl border border-primary/20">
                                <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Start Your Preparation?</h3>
                                <p className="text-muted-foreground mb-6">
                                    Practice all Capgemini cognitive games on our platform with realistic simulations, instant feedback, and progress tracking.
                                </p>
                                <Link
                                    href="/games/cognitive"
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
