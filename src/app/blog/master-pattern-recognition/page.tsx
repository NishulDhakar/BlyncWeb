"use client";

import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function PatternRecognitionPage() {
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

                            {/* Introduction */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Why Pattern Recognition Matters</h2>
                                <p className="leading-relaxed mb-4">
                                    Pattern recognition is the cornerstone of cognitive ability tests used by companies like Capgemini, Cognizant, and countless others. It's the ability to identify logical sequences, relationships, and structures within seemingly random information. This skill directly correlates with problem-solving ability, logical thinking, and intelligence—all qualities employers seek in candidates.
                                </p>
                                <p className="leading-relaxed">
                                    The good news? Pattern recognition is a learnable skill. While some people have natural advantages, everyone can dramatically improve their pattern recognition abilities through targeted practice and the right strategies. This article shares 10 proven techniques that will transform how you approach pattern-based challenges.
                                </p>
                            </section>

                            {/* Strategy 1 */}
                            <section>
                                <Card className="my-6 border-primary/20 bg-primary/5">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                                                1
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-foreground mb-3">Start with the Obvious: Look for Arithmetic Patterns</h3>
                                                <p className="mb-4">
                                                    When faced with a number sequence, always check for basic arithmetic progressions first. This includes addition (+), subtraction (-), multiplication (×), and division (÷) between consecutive terms.
                                                </p>
                                                <div className="bg-card p-4 rounded-lg mb-4">
                                                    <p className="font-semibold text-foreground mb-2">Example:</p>
                                                    <p className="font-mono">2, 5, 8, 11, 14, ?</p>
                                                    <p className="text-sm mt-2">Pattern: +3 each time → Answer: 17</p>
                                                </div>
                                                <p className="font-semibold text-foreground mb-2">Pro Tip:</p>
                                                <p>Calculate the differences between consecutive numbers. If the differences themselves form a pattern, you've found a second-order pattern (e.g., 1, 2, 4, 7, 11 has differences of +1, +2, +3, +4).</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Strategy 2 */}
                            <section>
                                <Card className="my-6 border-primary/20 bg-primary/5">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                                                2
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-foreground mb-3">Chunk Information: Break Down Complex Patterns</h3>
                                                <p className="mb-4">
                                                    Your working memory can only hold 5-7 items simultaneously. Instead of trying to process everything at once, break patterns into smaller, manageable chunks.
                                                </p>
                                                <div className="space-y-3">
                                                    <div className="bg-card p-4 rounded-lg">
                                                        <p className="font-semibold text-foreground mb-2">For Visual Patterns:</p>
                                                        <ul className="list-disc pl-6 space-y-1">
                                                            <li>Divide complex shapes into smaller sections</li>
                                                            <li>Look at corners, edges, and centers separately</li>
                                                            <li>Identify repeating elements before analyzing variations</li>
                                                        </ul>
                                                    </div>
                                                    <div className="bg-card p-4 rounded-lg">
                                                        <p className="font-semibold text-foreground mb-2">For Number Sequences:</p>
                                                        <ul className="list-disc pl-6 space-y-1">
                                                            <li>Analyze odd and even positions separately</li>
                                                            <li>Look for alternating patterns or sub-sequences</li>
                                                            <li>Group numbers by their digits (units, tens place)</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Strategy  3 */}
                            <section>
                                <Card className="my-6 border-primary/20 bg-primary/5">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                                                3
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-foreground mb-3">Use the Elimination Method</h3>
                                                <p className="mb-4">
                                                    In multiple-choice pattern questions, sometimes it's faster to eliminate obviously wrong answers than to solve the pattern directly. This strategy is particularly effective when you're running short on time.
                                                </p>
                                                <p className="font-semibold text-foreground mb-2">Elimination Checklist:</p>
                                                <ul className="list-disc pl-6 space-y-1">
                                                    <li>Eliminate answers that break obvious size/magnitude trends</li>
                                                    <li>Remove options that violate symmetry when symmetry is present</li>
                                                    <li>Cross out answers that use elements not present in the pattern</li>
                                                    <li>Eliminate based on color if color patterns are consistent</li>
                                                </ul>
                                                <p className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm">
                                                    <strong>Note:</strong> After elimination, if you're down to 2-3 options, your success rate improves dramatically even if you make an educated guess.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Strategy 4 */}
                            <section>
                                <Card className="my-6 border-primary/20 bg-primary/5">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                                                4
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-foreground mb-3">Build a Mental Library of Common Patterns</h3>
                                                <p className="mb-4">
                                                    Top performers recognize patterns instantly because they've seen similar patterns before. Build your own mental library by categorizing patterns you encounter. Here are the most common types:
                                                </p>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="bg-card p-4 rounded-lg">
                                                        <p className="font-semibold text-foreground mb-2">Numerical Patterns:</p>
                                                        <ul className="list-disc pl-6 space-y-1 text-sm">
                                                            <li>Fibonacci sequences (1, 1, 2, 3, 5, 8...)</li>
                                                            <li>Prime numbers (2, 3, 5, 7, 11...)</li>
                                                            <li>Perfect squares (1, 4, 9, 16, 25...)</li>
                                                            <li>Powers of 2 (2, 4, 8, 16, 32...)</li>
                                                            <li>Triangular numbers (1, 3, 6, 10...)</li>
                                                        </ul>
                                                    </div>
                                                    <div className="bg-card p-4 rounded-lg">
                                                        <p className="font-semibold text-foreground mb-2">Visual Patterns:</p>
                                                        <ul className="list-disc pl-6 space-y-1 text-sm">
                                                            <li>Rotation (clockwise/counterclockwise)</li>
                                                            <li>Reflection (horizontal/vertical/diagonal)</li>
                                                            <li>Size progression (growing/shrinking)</li>
                                                            <li>Color cycling</li>
                                                            <li>Shape morphing</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Strategy 5 */}
                            <section>
                                <Card className="my-6 border-primary/20 bg-primary/5">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                                                5
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-foreground mb-3">Practice the "What Changes, What Stays" Method</h3>
                                                <p className="mb-4">
                                                    For visual patterns especially, systematically identify what elements remain constant and what elements change across the sequence. This structured approach prevents you from overlooking subtle patterns.
                                                </p>
                                                <div className="bg-card p-4 rounded-lg">
                                                    <p className="font-semibold text-foreground mb-3">Systematic Analysis Checklist:</p>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-primary">✓</span>
                                                            <span><strong>Position:</strong> Do elements move or stay fixed?</span>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-primary">✓</span>
                                                            <span><strong>Rotation:</strong> Do shapes rotate? If so, by how much?</span>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-primary">✓</span>
                                                            <span><strong>Size:</strong> Do elements grow, shrink, or alternate sizes?</span>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-primary">✓</span>
                                                            <span><strong>Color/Shading:</strong> Does fill pattern change?</span>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-primary">✓</span>
                                                            <span><strong>Quantity:</strong> Number of elements increasing/decreasing?</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Remaining Strategies - Abbreviated for space */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">More Advanced Strategies</h2>

                                <div className="space-y-6">
                                    <div className="p-6 border-l-4 border-primary bg-card/40 rounded-r-lg">
                                        <h3 className="text-lg font-bold text-foreground mb-2">6. Time-Box Your Analysis</h3>
                                        <p>Don't spend more than 30-45 seconds on any single pattern question initially. If you can't see it quickly, flag it and move on. Fresh eyes often spot patterns you missed the first time.</p>
                                    </div>

                                    <div className="p-6 border-l-4 border-primary bg-card/40 rounded-r-lg">
                                        <h3 className="text-lg font-bold text-foreround mb-2">7. Look for Meta-Patterns</h3>
                                        <p>Sometimes the pattern isn't in the elements themselves but in how the pattern changes. For example, the rate of change might be accelerating, or alternating patterns might themselves follow a pattern.</p>
                                    </div>

                                    <div className="p-6 border-l-4 border-primary bg-card/40 rounded-r-lg">
                                        <h3 className="text-lg font-bold text-foreground mb-2">8. Practice Reverse Engineering</h3>
                                        <p>When you see a correct answer, work backwards to understand why it's correct. This deepens your pattern recognition intuition more effectively than simply moving to the next question.</p>
                                    </div>

                                    <div className="p-6 border-l-4 border-primary bg-card/40 rounded-r-lg">
                                        <h3 className="text-lg font-bold text-foreground mb-2">9. Develop Spatial Reasoning</h3>
                                        <p>For 3D pattern questions, practice mentally rotating objects. Play mobile games that involve spatial manipulation to build this specific skill set outside of formal practice.</p>
                                    </div>

                                    <div className="p-6 border-l-4 border-primary bg-card/40 rounded-r-lg">
                                        <h3 className="text-lg font-bold text-foreground mb-2">10. Use Spaced Repetition</h3>
                                        <p>Don't practice pattern recognition in marathon sessions. Distribute your practice over multiple days with breaks in between. Your brain consolidates pattern recognition skills during rest periods, making spaced practice significantly more effective than cramming.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Practice Recommendations */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Putting It All Together: Your Practice Plan</h2>
                                <p className="leading-relaxed mb-6">
                                    Knowing strategies isn't enough—you need deliberate practice to internalize them. Here's a structured approach to improving your pattern recognition:
                                </p>

                                <Card className="mb-6">
                                    <CardContent className="pt-6">
                                        <h3 className="text-xl font-bold text-foreground mb-4">Daily Practice Routine (30 minutes)</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="font-semibold text-foreground mb-2">• Minutes 0-5: Warm-up</p>
                                                <p className="text-sm pl-4">Start with simple sequences to activate pattern recognition. Focus on speed.</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground mb-2">• Minutes 5-15: Focused Practice</p>
                                                <p className="text-sm pl-4">Work on your weakest pattern type. Apply one specific strategy from this guide.</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground mb-2">• Minutes 15-25: Mixed Practice</p>
                                                <p className="text-sm pl-4">Random pattern types to build flexibility. Simulate test conditions.</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground mb-2">• Minutes 25-30: Review and Reflection</p>
                                                <p className="text-sm pl-4">Analyze mistakes. Which strategy would have worked? Update your mental library.</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20">
                                    <p className="font-semibold text-foreground mb-2">Expected Results:</p>
                                    <ul className="space-y-1">
                                        <li>• Week 1: 15-20% improvement in pattern recognition speed</li>
                                        <li>• Week 2: 30-35% improvement, noticeable intuition development</li>
                                        <li>• Week 3: 45-50% improvement, strategies become automatic</li>
                                        <li>• Week 4+: 60-70% improvement, expert-level pattern recognition</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Conclusion */}
                            <section className="mt-12">
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Final Thoughts</h2>
                                <p className="leading-relaxed mb-4">
                                    Pattern recognition is the single most important skill for cognitive ability tests, and these 10 strategies will dramatically accelerate your improvement. Remember that becoming skilled at pattern recognition isn't about being "naturally smart"—it's about having the right strategies and practicing them consistently.
                                </p>
                                <p className="leading-relaxed">
                                    Start implementing these techniques today in your practice sessions. Focus on mastering one strategy at a time rather than trying to use all of them simultaneously. With consistent practice and the right approach, you'll develop pattern recognition skills that not only help you ace placement tests but also enhance your problem-solving abilities for life.
                                </p>
                            </section>

                            {/* CTA */}
                            <section className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl border border-primary/20">
                                <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Practice These Strategies?</h3>
                                <p className="text-muted-foreground mb-6">
                                    Apply these pattern recognition techniques on our platform with hundreds of practice problems designed to build your skills systematically.
                                </p>
                                <Link
                                    href="/games/memory"
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
