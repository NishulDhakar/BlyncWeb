"use client";

import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import {
    Brain,
    Target,
    TrendingUp,
    Award,
    Play,
    BarChart3,
    Users,
    BookOpen,
    Clock,
    Zap,
    CheckCircle
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function HowItWorksPage() {
    const steps = [
        {
            number: "01",
            icon: <Play className="h-8 w-8" />,
            title: "Choose Your Challenge",
            description: "Browse our collection of cognitive games designed to match real placement assessments. Select from Memory Games, Pattern Recognition, Grid Challenges, and more.",
            details: [
                "Multiple game categories including Capgemini and Cognizant styles",
                "Difficulty levels from beginner to advanced",
                "Clear game rules and objectives before you start",
            ],
        },
        {
            number: "02",
            icon: <Brain className="h-8 w-8" />,
            title: "Practice with Purpose",
            description: "Engage with scientifically designed games that replicate actual cognitive ability tests. Each game targets specific mental skills used in placement assessments.",
            details: [
                "Timed challenges to build speed and accuracy",
                "Progressive difficulty that adapts to your skill level",
                "Instant feedback on your performance",
            ],
        },
        {
            number: "03",
            icon: <BarChart3 className="h-8 w-8" />,
            title: "Track Your Progress",
            description: "Monitor your improvement with detailed analytics and performance metrics. See how your skills develop over time and identify areas for improvement.",
            details: [
                "Personal dashboard with performance history",
                "Score tracking and improvement trends",
                "Comparison with other users on leaderboards",
            ],
        },
        {
            number: "04",
            icon: <Award className="h-8 w-8" />,
            title: "Master the Skills",
            description: "Build confidence through repetition and targeted practice. By the time you face the actual assessment, you'll be fully prepared and confident.",
            details: [
                "Muscle memory for common patterns and logic",
                "Reduced test anxiety through familiarity",
                "Competition-ready speed and accuracy",
            ],
        },
    ];

    const cognitiveSkills = [
        {
            icon: <Target className="h-6 w-6" />,
            title: "Pattern Recognition",
            description: "Identify visual and logical patterns quickly and accurately—a core skill tested in cognitive assessments.",
        },
        {
            icon: <Zap className="h-6 w-6" />,
            title: "Processing Speed",
            description: "Improve your ability to process information rapidly under time constraints, crucial for timed assessments.",
        },
        {
            icon: <Brain className="h-6 w-6" />,
            title: "Working Memory",
            description: "Enhance your short-term memory capacity to hold and manipulate information during complex tasks.",
        },
        {
            icon: <TrendingUp className="h-6 w-6" />,
            title: "Logical Reasoning",
            description: "Develop deductive and inductive reasoning skills to solve puzzles and make logical connections.",
        },
        {
            icon: <CheckCircle className="h-6 w-6" />,
            title: "Decision Making",
            description: "Strengthen your ability to make quick, accurate decisions under pressure—essential for success.",
        },
        {
            icon: <Clock className="h-6 w-6" />,
            title: "Time Management",
            description: "Learn to allocate your time wisely across different challenges to maximize your overall score.",
        },
    ];

    const sciencePoints = [
        {
            title: "Neuroplasticity in Action",
            content: "Your brain is highly adaptable. Regular practice with cognitive games literally rewires neural pathways, making pattern recognition and logical thinking more automatic. Studies show that targeted cognitive training can improve performance by 20-30% in just 2-3 weeks of consistent practice.",
        },
        {
            title: "The Science of Cognitive Load",
            content: "Cognitive ability tests are designed to push your working memory to its limits. Our games progressively increase cognitive load, training your brain to handle complex information more efficiently. This process, known as 'chunking,' allows you to process more information simultaneously.",
        },
        {
            title: "Deliberate Practice Principles",
            content: "Unlike passive studying, active practice on our platform follows the principles of deliberate practice: focused attention, immediate feedback, and progressive difficulty. Research by Anders Ericsson shows this approach is far more effective than traditional study methods for skill acquisition.",
        },
        {
            title: "Transfer of Learning",
            content: "Skills developed through our games transfer directly to real assessments. The logical thinking, pattern recognition, and processing speed you build here apply not just to placement tests, but to problem-solving in general—making you a stronger candidate overall.",
        },
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
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <BookOpen className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-primary">Learn the Process</span>
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            How Cognitive Games
                            <span className="block text-primary mt-2">Transforms Your Preparation</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Discover the science-backed methodology behind our platform and learn how targeted cognitive practice can dramatically improve your placement test performance.
                        </p>
                    </motion.div>
                </Container>

                {/* Background decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] -z-10" />
            </section>

            {/* Steps Section */}
            <section className="py-16 md:py-24">
                <Container>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <Badge variant="outline" className="mb-4 px-4 py-2">Simple 4-Step Process</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Path to Success</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Follow our proven methodology to build cognitive skills systematically and effectively.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.15 }}
                            >
                                <Card className="h-full border-border/40 bg-card/40 backdrop-blur-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                    {/* Step Number Background */}
                                    <div className="absolute top-4 right-4 text-8xl font-bold text-primary/5 leading-none">
                                        {step.number}
                                    </div>

                                    <CardContent className="p-8 relative z-10">
                                        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-6">
                                            {step.icon}
                                        </div>

                                        <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed mb-6">
                                            {step.description}
                                        </p>

                                        <ul className="space-y-2">
                                            {step.details.map((detail, detailIndex) => (
                                                <li key={detailIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                                    <span>{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Cognitive Skills Section */}
            <section className="py-16 md:py-24">
                <Container>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills You'll Develop</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our games are designed to target the exact cognitive abilities tested in placement assessments.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {cognitiveSkills.map((skill, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full border-border/40 bg-card/40 backdrop-blur-sm hover:shadow-lg transition-all group">
                                    <CardContent className="p-6">
                                        <div className="inline-flex items-center justify-center p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-4">
                                            {skill.icon}
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">{skill.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {skill.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Science Behind It */}
            <section className="py-16 md:py-24">
                <Container className="max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <Badge variant="outline" className="mb-4 px-4 py-2">Research-Backed</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">The Cognitive Science Behind Our Platform</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Our approach is grounded in decades of cognitive psychology research and neuroscience. Here's why it works.
                        </p>
                    </motion.div>

                    <div className="space-y-8">
                        {sciencePoints.map((point, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="border-border/40 bg-card/40 backdrop-blur-sm hover:shadow-lg transition-all">
                                    <CardContent className="p-6 pb-6">
                                        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            {point.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed pl-10">
                                            {point.content}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Timeline/Expectations */}
            <section className="py-16 md:py-20">
                <Container className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What to Expect: Your Progress Timeline</h2>
                        <p className="text-lg text-muted-foreground">
                            Consistent practice yields measurable results. Here's what students typically experience:
                        </p>
                    </motion.div>

                    <div className="space-y-6">
                        {[
                            {
                                period: "Week 1",
                                title: "Familiarization",
                                description: "Get comfortable with game mechanics and test patterns. Learn the rules and develop initial strategies.",
                                improvement: "10-15% score improvement",
                            },
                            {
                                period: "Week 2-3",
                                title: "Skill Building",
                                description: "Notice significant improvements in speed and accuracy. Pattern recognition becomes more intuitive.",
                                improvement: "25-35% score improvement",
                            },
                            {
                                period: "Week 4+",
                                title: "Mastery",
                                description: "Achieve consistent high scores. Feel confident and prepared for actual assessments.",
                                improvement: "40-50%+ score improvement",
                            },
                        ].map((phase, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                            >
                                <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
                                    <CardContent className="p-6 pb-6">
                                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                                            <div className="flex-shrink-0">
                                                <Badge className="text-base px-4 py-2">{phase.period}</Badge>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold mb-2">{phase.title}</h3>
                                                <p className="text-muted-foreground mb-2">{phase.description}</p>
                                                <p className="text-sm font-medium text-primary">
                                                    Expected: {phase.improvement}
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

            {/* CTA Section */}
            <section className="py-16 md:py-20">
                <Container className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center rounded-2xl p-8 md:p-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of students who have improved their cognitive skills and aced their placement assessments.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/games/memory"
                                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                            >
                                <Play className="h-5 w-5 mr-2" />
                                Start Practicing Now
                            </Link>
                            <Link
                                href="/about"
                                className="inline-flex items-center justify-center px-8 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                            >
                                <Users className="h-5 w-5 mr-2" />
                                Learn More About Us
                            </Link>
                        </div>
                    </motion.div>
                </Container>
            </section>
        </div>
    );
}
