"use client";

import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Clock, ArrowRight, BookOpen } from "lucide-react";

export default function BlogPage() {
    const articles = [
        {
            slug: "complete-guide-capgemini-cognitive-games",
            title: "Complete Guide to Capgemini Cognitive Ability Games",
            description: "Everything you need to know about Capgemini's game-based aptitude tests, including detailed breakdowns of each game type, scoring strategies, and preparation tips.",
            category: "Placement Prep",
            readTime: "12 min read",
            date: "Feb 4, 2026",
            featured: true,
        },
        {
            slug: "master-pattern-recognition",
            title: "10 Strategies to Master Pattern Recognition in Cognitive Tests",
            description: "Learn proven techniques to identify patterns faster and more accurately. Boost your scores with these expert strategies used by top performers.",
            category: "Skills",
            readTime: "10 min read",
            date: "Feb 3, 2026",
        },
        {
            slug: "cognitive-games-problem-solving",
            title: "How Cognitive Games Improve Your Problem-Solving Skills",
            description: "Discover the science behind cognitive training and how regular practice with cognitive games enhances your problem-solving abilities for placements and beyond.",
            category: "Science",
            readTime: "8 min read",
            date: "Feb 2, 2026",
        },
        {
            slug: "success-stories-placement",
            title: "Success Stories: How Students Cleared Placement Games",
            description: "Real testimonials and success strategies from students who aced their Capgemini and Cognizant cognitive assessments using our platform.",
            category: "Success Stories",
            readTime: "9 min read",
            date: "Feb 1, 2026",
        },
        {
            slug: "deductive-vs-inductive-reasoning",
            title: "Understanding Deductive vs Inductive Reasoning in Cognitive Tests",
            description: "Master the difference between deductive and inductive reasoning with practical examples and exercises to excel in logical reasoning challenges.",
            category: "Fundamentals",
            readTime: "11 min read",
            date: "Jan 31, 2026",
        },
    ];

    const categories = [
        "All",
        "Placement Prep",
        "Skills",
        "Science",
        "Success Stories",
        "Fundamentals"
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
                <Container>
                    <motion.div
                        className="max-w-4xl mx-auto text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <BookOpen className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-primary">Knowledge Base</span>
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            Cognitive Games Blog
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Expert insights, strategies, and success stories to help you master cognitive ability tests and excel in your placement journey.
                        </p>
                    </motion.div>
                </Container>

                {/* Background decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            </section>

            {/* Categories */}
            <section className="py-8 border-b border-border/40">
                <Container>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Badge
                                    variant={index === 0 ? "default" : "outline"}
                                    className="cursor-pointer px-4 py-2 whitespace-nowrap hover:bg-primary/10 transition-colors"
                                >
                                    {category}
                                </Badge>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Articles Grid */}
            <section className="py-16 md:py-20">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article, index) => (
                            <motion.div
                                key={article.slug}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/blog/${article.slug}`}>
                                    <Card className={`h-full border-border/40 bg-card/40 backdrop-blur-sm hover:shadow-xl hover:border-primary/20 transition-all group cursor-pointer ${article.featured ? "md:col-span-2 lg:col-span-1" : ""
                                        }`}>
                                        <CardHeader>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge variant="secondary" className="text-xs">
                                                    {article.category}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {article.readTime}
                                                </span>
                                            </div>
                                            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                                                {article.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                                                {article.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">{article.date}</span>
                                                <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    Read More
                                                    <ArrowRight className="h-4 w-4" />
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-gradient-to-b from-background to-primary/5">
                <Container className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-2xl p-8 md:p-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Practice?</h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Put your knowledge into action. Start practicing with our cognitive games and see your skills improve.
                        </p>
                        <Link
                            href="/games/memory"
                            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                            Start Practicing
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Link>
                    </motion.div>
                </Container>
            </section>
        </div>
    );
}
