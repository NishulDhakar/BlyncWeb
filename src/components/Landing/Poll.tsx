"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getPoll, submitVote } from "@/features/polls/actions";
import Container from "../common/Container";

type Option = {
    id: string;
    label: string;
    votes: number;
    isInput: boolean;
};

export default function Poll() {
    const [options, setOptions] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState<string | null>(null);
    const [suggestion, setSuggestion] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        async function loadPoll() {
            const poll = await getPoll();
            if (poll && poll.options) {
                setOptions(poll.options);
            }
            setIsLoading(false);
        }
        loadPoll();
    }, [isSubmitted]); // Reload results after submission

    const totalVotes = options.reduce((acc, curr) => acc + curr.votes, 0);

    const handleSelect = (id: string) => {
        if (isSubmitted) return;
        setSelected(id);
    };

    const handleSubmit = async () => {
        if (!selected) return;

        if (options.find(o => o.id === selected)?.isInput && !suggestion.trim()) {
            toast.error("Please enter a game suggestion");
            return;
        }

        try {
            const result = await submitVote(selected, suggestion);

            if (result.success) {
                setIsSubmitted(true);
                toast.success("Thanks for your vote!");
                // Optimistic update
                setOptions(prev => prev.map(opt =>
                    opt.id === selected
                        ? { ...opt, votes: opt.votes + 1 }
                        : opt
                ));
            } else {
                toast.error("Failed to submit vote. Please try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        }
    };

    if (isLoading) {
        return <div className="py-20 text-center animate-pulse">Loading poll...</div>;
    }

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <Container className="relative z-10">
                <div className="text-center mb-12 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-center gap-2 text-primary font-medium"
                    >
                        <Sparkles className="w-5 h-5" />
                        <span>Community Vote</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
                    >
                        Which game you want next?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-muted-foreground text-lg"
                    >
                        Help us shape the future of Cognitive Games.
                    </motion.p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Card className="p-1 bg-background/50 backdrop-blur-xl border-white/10 shadow-2xl">
                        <div className="grid gap-3 p-4 sm:p-6">
                            <AnimatePresence mode="wait">
                                {!isSubmitted ? (
                                    <motion.div
                                        key="options"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-3"
                                    >
                                        {options.map((option, index) => (
                                            <motion.div
                                                key={option.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <div
                                                    onClick={() => handleSelect(option.id)}
                                                    className={cn(
                                                        "group relative flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 border",
                                                        selected === option.id
                                                            ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]"
                                                            : "bg-card hover:bg-accent/50 border-transparent hover:border-white/10"
                                                    )}
                                                >
                                                    <div className="flex-1">
                                                        <h3 className={cn(
                                                            "font-semibold text-lg transition-colors",
                                                            selected === option.id ? "text-primary" : "text-foreground"
                                                        )}>
                                                            {option.label}
                                                        </h3>
                                                        {option.isInput && selected === option.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: "auto" }}
                                                                className="mt-3"
                                                            >
                                                                <Input
                                                                    value={suggestion}
                                                                    onChange={(e) => setSuggestion(e.target.value)}
                                                                    placeholder="Enter your game suggestion..."
                                                                    className="bg-background/50 border-primary/20 focus-visible:ring-primary"
                                                                    autoFocus
                                                                />
                                                            </motion.div>
                                                        )}
                                                    </div>

                                                    <div className={cn(
                                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                                        selected === option.id
                                                            ? "border-primary bg-primary text-primary-foreground scale-110"
                                                            : "border-muted-foreground/30 group-hover:border-original/50"
                                                    )}>
                                                        {selected === option.id && <Check className="w-3.5 h-3.5" />}
                                                    </div>

                                                    {/* Shimmer effect for selected item */}
                                                    {selected === option.id && (
                                                        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer" />
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}

                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="pt-4 flex justify-end"
                                        >
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={!selected || (options.find(o => o.id === selected)?.isInput && !suggestion.trim())}
                                                className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/20"
                                            >
                                                Vote Now
                                                <Send className="w-5 h-5 ml-2" />
                                            </Button>
                                        </motion.div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="results"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-4 py-4"
                                    >
                                        <div className="text-center mb-6">
                                            <h3 className="text-2xl font-bold mb-2">Results</h3>
                                            <p className="text-muted-foreground">Total votes: {totalVotes}</p>
                                        </div>

                                        {options.map((option, index) => {
                                            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                                            return (
                                                <motion.div
                                                    key={option.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="relative"
                                                >
                                                    <div className="flex justify-between items-end mb-1 px-1">
                                                        <span className={cn(
                                                            "font-medium",
                                                            selected === option.id ? "text-primary" : "text-foreground"
                                                        )}>
                                                            {option.label}
                                                        </span>
                                                        <span className="font-bold text-lg">{percentage}%</span>
                                                    </div>

                                                    <div className="h-4 bg-muted/30 rounded-full overflow-hidden relative">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${percentage}%` }}
                                                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                                            className={cn(
                                                                "h-full rounded-full relative",
                                                                selected === option.id ? "bg-primary" : "bg-primary/50"
                                                            )}
                                                        >
                                                            {selected === option.id && (
                                                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                                            )}
                                                        </motion.div>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground text-right mt-1">
                                                        {option.votes} votes
                                                    </div>
                                                </motion.div>
                                            );
                                        })}

                                        <div className="pt-8 text-center">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setIsSubmitted(false);
                                                    setSelected(null);
                                                    setSuggestion("");
                                                }}
                                                className="rounded-xl"
                                            >
                                                Vote Again
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Card>
                </div>
            </Container>
        </section>
    );
}
