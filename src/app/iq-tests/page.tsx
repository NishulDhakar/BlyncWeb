"use client";

import IQTestContainer from "@/components/iq-test/IQTestContainer";
import BackToDashboard from "@/components/common/BackToDashboard";
import { motion } from "framer-motion";
import Link from "next/link";

export default function IQTestPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden flex flex-col">
            {/* Subtle Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 p-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-4"
                >
                    <BackToDashboard />
                </motion.div>

                {/* Server-rendered intro.
                    IQTestContainer gates its content on authClient.useSession(),
                    which is always "pending" during SSR — so the prerendered HTML
                    for this page used to contain a loading spinner and no heading
                    at all. This section is plain markup, so the page now ships a
                    real H1 and indexable copy whether or not JS has run. */}
                <section className="mx-auto mb-10 max-w-3xl">
                    <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                        Online IQ Assessment — Logical Reasoning &amp; Pattern Recognition
                    </h1>
                    <p className="leading-7 text-muted-foreground">
                        Take an IQ-style assessment covering logical reasoning, number
                        sequences, pattern recognition and spatial ability — the same skill
                        groups placement tests measure. Answer each question against the clock
                        and receive a comprehensive scored breakdown with Blync Pro.
                    </p>
                    <p className="mt-4 leading-7 text-muted-foreground">
                        Included with your Blync Pro membership. If you are preparing for a specific
                        employer, explore our{" "}
                        <Link href="/games/cognitive" className="underline hover:text-foreground">
                            Capgemini and Cognizant cognitive challenges
                        </Link>{" "}
                        to practice exact hiring rounds.
                    </p>
                </section>

                <IQTestContainer />
            </div>
        </div>
    );
}
