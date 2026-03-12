"use client";

import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import {
    Target,
    Users,
    Lightbulb,
    TrendingUp,
    Brain,
    Zap,
    Award,
    BookOpen,
    Shield
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function AboutPage() {
    const values = [
        {
            icon: <Target className="h-6 w-6" />,
            title: "Excellence in Preparation",
            description: "We're committed to providing the most accurate and effective cognitive ability practice platform to help students excel in their placement assessments.",
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Student-First Approach",
            description: "Every feature we build is designed with students in mind. We listen to feedback and continuously improve based on real user experiences and needs.",
        },
        {
            icon: <Lightbulb className="h-6 w-6" />,
            title: "Innovation in Learning",
            description: "We combine cognitive science, game design, and educational psychology to create engaging and effective practice tools that actually work.",
        },
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Trust and Transparency",
            description: "We believe in honest preparation. Our platform provides realistic practice without shortcuts, building genuine skills that translate to real assessments.",
        },
    ];

    const stats = [
        { number: "5000+", label: "Active Students", icon: <Users className="h-5 w-5" /> },
        { number: "4+", label: "Cognitive Games", icon: <Brain className="h-5 w-5" /> },
        { number: "98%", label: "Success Rate", icon: <Award className="h-5 w-5" /> },
        { number: "24/7", label: "Platform Access", icon: <Zap className="h-5 w-5" /> },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <Container>
                    <motion.div
                        className="max-w-4xl mx-auto text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full  mb-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <BookOpen className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-primary">Our Story</span>
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            Empowering Students to Ace
                            <span className="block text-primary mt-2">Cognitive Assessments</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                            We're on a mission to democratize cognitive ability test preparation, making high-quality practice accessible to every student preparing for placement assessments.
                        </p>
                    </motion.div>
                </Container>

                {/* Background decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] -z-10" />
            </section>

            {/* Stats Section */}
            <section className="py-12 md:py-16">
                <Container>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <Card className="border-border/40 bg-card/40 backdrop-blur-sm hover:shadow-lg transition-all">
                                    <CardContent className="pt-6 pb-8">
                                        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-3">
                                            {stat.icon}
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</h3>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Story Section */}
            <section className="py-16 md:py-24">
                <Container className="max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Our Journey</h2>
                        <div className="prose prose-lg max-w-none text-muted-foreground">
                            <p className="leading-relaxed mb-6">
                                Cognitive Games was born from a simple observation: students preparing for placement drives needed better resources to practice for cognitive ability assessments. Traditional study materials weren't cutting it, and there was a clear gap between what students needed and what was available.
                            </p>
                            <p className="leading-relaxed mb-6">
                                Our founder, having experienced the challenges of placement preparation firsthand, recognized that companies like Capgemini and Cognizant use sophisticated game-based assessments that test logical reasoning, pattern recognition, and problem-solving skills. These tests require specific practice that goes beyond textbook learning.
                            </p>
                            <p className="leading-relaxed mb-6">
                                In 2025, we launched Cognitive Games with a clear mission: create an accessible, effective platform where students can practice cognitive ability tests in a realistic, engaging environment. We studied the actual assessment patterns used by top companies, consulted with cognitive psychology experts, and developed games that mirror real placement tests.
                            </p>
                            <p className="leading-relaxed">
                                Today, thousands of students use our platform to prepare for their placements. We've helped students from over 100+ colleges improve their cognitive skills, build confidence, and successfully clear placement assessments. But we're just getting started. We continue to add new games, improve our algorithms, and enhance the learning experience based on student feedback.
                            </p>
                        </div>
                    </motion.div>
                </Container>
            </section>

            {/* Values Section */}
            <section className="py-16 md:py-20 ">
                <Container>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <Badge variant="outline" className="mb-4 px-4 py-2">Our Values</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Stand For</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our core values guide everything we do, from product development to student support.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full border-border/40 bg-card/40 backdrop-blur-sm hover:shadow-lg transition-all group">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                {value.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {value.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Technology Section */}
            <section className="py-16 md:py-20">
                <Container className="max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Built with Modern Technology</h2>
                        <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
                            <p className="leading-relaxed text-center max-w-3xl mx-auto mb-12">
                                We leverage cutting-edge web technologies to deliver a fast, reliable, and engaging learning experience. Our platform is built with performance, accessibility, and user experience at the forefront.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "Next.js & React",
                                    description: "Lightning-fast performance with server-side rendering and optimized client-side navigation for seamless user experience.",
                                },
                                {
                                    title: "TypeScript",
                                    description: "Type-safe code ensures reliability and reduces bugs, providing a stable platform for your practice sessions.",
                                },
                                {
                                    title: "Responsive Design",
                                    description: "Practice anywhere, anytime. Our platform works flawlessly on desktop, tablet, and mobile devices.",
                                },
                            ].map((tech, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="h-full border-border/40 bg-card/40 backdrop-blur-sm">
                                        <CardContent className="p-6">
                                            <h3 className="text-lg font-semibold mb-3">{tech.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {tech.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </Container>
            </section>

            {/* Team Section */}
            <section className="py-16 md:py-20 ">
                <Container className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet the Founder</h2>
                        <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                                        <Image
                                            src="/nishul.jpg"
                                            alt="Nishul Dhakar - Founder"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-2xl font-bold mb-2">Nishul Dhakar</h3>
                                        <p className="text-primary font-medium mb-4">Founder & Lead Developer</p>
                                        <p className="text-muted-foreground leading-relaxed mb-4">
                                            A passionate developer and educator dedicated to helping students succeed in their placement journeys. With experience in web development and a deep understanding of cognitive assessments, Nishul built Cognitive Games to bridge the gap between preparation needs and available resources.
                                        </p>
                                        <div className="flex gap-4 justify-center md:justify-start">
                                            <a
                                                href="https://www.nishul.dev"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                Portfolio →
                                            </a>
                                            <a
                                                href="https://twitter.com/nishuldhakar"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                Twitter →
                                            </a>
                                            <a
                                                href="https://github.com/Nishuldhakar"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                GitHub →
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20">
                <Container className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-2xl p-8 md:p-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Thousands of Successful Students</h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Start your preparation journey today and build the cognitive skills you need to excel in placement assessments.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/games/memory"
                                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                            >
                                Start Practicing
                            </a>
                            {/* <a
                                href="/contact"
                                className="inline-flex items-center justify-center px-8 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                            >
                                Contact Us
                            </a> */}
                        </div>
                    </motion.div>
                </Container>
            </section>
        </div>
    );
}
