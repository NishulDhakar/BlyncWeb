"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { gamesData } from "@/data/BlogData";
import { ArrowLeft, Clock, Brain, Gamepad2, ChevronDown } from "lucide-react";
import BackToDashboard from "@/components/common/BackToDashboard";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BlogPage() {
  const [openGame, setOpenGame] = useState<number | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <BackToDashboard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 mt-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-8 md:mb-10 px-2">
            Capgemini Game Based Aptitude
          </h1>

          <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-border/50 shadow-sm text-left">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Capgemini has introduced a <strong className="text-foreground">Game-Based Aptitude Test</strong> in its hiring process.
              Candidates play <strong className="text-foreground">4 randomly selected games</strong> out of 24 available, measuring logical thinking,
              problem-solving, multitasking, memory, and decision-making.
            </p>
            <div className="mt-4 pt-4 border-t border-border/30 flex gap-2">
              <Button asChild size="sm" variant="default" className="gap-2">
                <Link href="/games/cognitive">
                  <Gamepad2 className="w-4 h-4" /> Practice Games
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid gap-4"
        >
          {gamesData.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm hover:border-primary/20 transition-all duration-300">
                <div
                  onClick={() => setOpenGame(openGame === game.id ? null : game.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={openGame === game.id}
                  aria-controls={`game-details-${game.id}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpenGame(openGame === game.id ? null : game.id);
                    }
                  }}
                  className="p-4 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start sm:items-center gap-4 w-full">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shrink-0">
                      <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg group-hover:text-primary transition-colors truncate sm:whitespace-normal">{game.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Badge variant="secondary" className="text-[10px] h-5">{game.typeOfQuestions}</Badge>
                        <span className="flex items-center gap-1 whitespace-nowrap"><Clock className="w-3 h-3" /> {game.duration}</span>
                      </div>
                    </div>
                    <div className={`sm:hidden p-2 rounded-full border border-border/50 transition-transform duration-300 ${openGame === game.id ? 'rotate-180 bg-accent' : 'bg-background'}`}>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className={`hidden sm:block p-2 rounded-full border border-border/50 transition-transform duration-300 ${openGame === game.id ? 'rotate-180 bg-accent' : 'bg-background'}`}>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>


                <AnimatePresence>
                  {openGame === game.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div id={`game-details-${game.id}`} className="px-4 sm:px-6 pb-6 pt-0 border-t border-border/30">
                        <div className="pt-4 grid sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-sm mb-2 text-primary">About the Game</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{game.description}</p>

                            <Button asChild size="sm" className="w-full sm:w-auto gap-2">
                              <Link href={game.playLink}>
                                🎮 Play Now
                              </Link>
                            </Button>
                          </div>
                          <div className="bg-muted/30 p-4 rounded-xl">
                            <h4 className="font-semibold text-sm mb-2 text-primary">How to Play</h4>
                            <ul className="space-y-2">
                              {game.howToPlay.map((rule, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                  <span className="text-primary font-bold">•</span>
                                  {rule}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div >
          ))
          }
        </motion.div >
      </div >
    </div >
  );
}
