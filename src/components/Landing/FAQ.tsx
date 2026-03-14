"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Container from "../common/Container";

const faqData = [
  {
    question: "What are Capgemini Cognitive Ability Games?",
    answer:
      "These are game-based assessments used by Capgemini during placements to test logical reasoning, problem-solving, memory, and pattern recognition skills.",
  },
  {
    question: "Can I practice the exact same games here?",
    answer:
      "We provide practice challenges inspired by the real Capgemini Cognitive Ability Games. While not identical, they are designed to mimic the logic, difficulty, and format closely.",
  },
  {
    question: "Do I need to create an account to practice?",
    answer:
      "No account is required to try out basic games. However, creating a free account allows you to track your progress and revisit your practice history.",
  },
  {
    question: "How should I prepare for the actual Capgemini assessment?",
    answer:
      "Regularly practice puzzles, focus on improving speed and accuracy, and review different challenge types such as Switch, Grid, Inductive, and Deductive Challenges.",
  },
  {
    question: "Is this platform free to use?",
    answer:
      "Yes! All core Capgemini practice games are free to access. We aim to help students prepare effectively without barriers.",
  },
  {
    question: "Will practicing here really improve my chances?",
    answer:
      "Yes. Consistent practice builds confidence, improves reaction time, and strengthens your logical problem-solving skills — all of which are essential for clearing Capgemini’s games.",
  },
];

export default function FAQ() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-background/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-purple-500/5 to-transparent rounded-full blur-[120px] -z-10 pointer-events-none" />

      <Container className="max-w-4xl">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-primary/30 bg-primary/5">
              ❓ FAQ
            </Badge>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Common questions about preparing for Capgemini &amp; Cognizant game-based aptitude tests.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-sm bg-card/30 rounded-2xl p-6 md:p-8 border border-border/50 shadow-xl"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border/30 last:border-0"
              >
                <AccordionTrigger className="text-left text-base md:text-lg font-semibold py-5 hover:text-primary transition-colors group">
                  <h3 className="flex items-start gap-3 text-base md:text-lg font-semibold m-0 text-left">
                    <span className="text-primary/60 group-hover:text-primary transition-colors">Q{index + 1}.</span>
                    <span>{faq.question}</span>
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-5 pl-9">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </Container>
    </section>
  );
}
