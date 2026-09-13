"use client";


import { useState } from "react";
import StartScreen from "./StartScreen";
import QuizScreen from "./QuizScreen";
import ResultScreen from "./ResultScreen";
import { AnimatePresence, motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { Loader2, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import GamePaywall from "../games/GamePaywall";

type ViewState = 'start' | 'playing' | 'result';

export default function IQTestContainer() {
    const [viewState, setViewState] = useState<ViewState>('start');
    const [results, setResults] = useState<any>(null);

    const { data: session, isPending } = authClient.useSession();

    const handleStart = () => {
        setViewState('playing');
    };

    const handleFinish = (resultsData: any) => {
        setResults(resultsData);
        setViewState('result');
    };

    const handleRetry = () => {
        setResults(null);
        setViewState('start');
    };

    if (isPending) {
        return (
            <div className="w-full h-96 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="w-full max-w-2xl mx-auto py-12 px-4">
                <div className="bg-card w-full rounded-xl border shadow-sm p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                        <LockKeyhole className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Login Required</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Please sign in to take the IQ assessment and save your results to the leaderboard.
                        </p>
                    </div>

                    <div className="pt-4 flex justify-center gap-4">
                        <Link href="/login">
                            <Button size="lg" className="w-full sm:w-auto px-8">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                                Create Account
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isPro = (session.user as any)?.isPro === true;
    if (!isPro) {
        return <GamePaywall gameName="IQ Assessment & Cognitive Breakdown" />;
    }

    return (
        <div className="w-full min-h-full">
            <AnimatePresence mode="wait">
                {viewState === 'start' && (
                    <motion.div
                        key="start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        <StartScreen onStart={handleStart} />
                    </motion.div>
                )}
                {viewState === 'playing' && (
                    <motion.div
                        key="playing"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        <QuizScreen onFinish={handleFinish} />
                    </motion.div>
                )}
                {viewState === 'result' && results && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ResultScreen results={results} onRetry={handleRetry} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
