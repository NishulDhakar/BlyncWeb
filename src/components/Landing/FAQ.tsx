// Server Component — no client JS shipped

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
      "Yes. Consistent practice builds confidence, improves reaction time, and strengthens your logical problem-solving skills — all of which are essential for clearing Capgemini's games.",
  },
];

export default function FAQ() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <Container className="max-w-4xl">
        <div className="mb-16 text-center max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            FAQ
          </h2>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50 text-xl md:text-xl font-bold tracking-tight mb-4">Frequently Asked Questions</span>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto mt-10">
            Common questions about preparing for Capgemini &amp; Cognizant game-based aptitude tests.
          </p>
        </div>

        <div className="bg-card/30 rounded-2xl p-6 md:p-8 border border-border/50">
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border/30 last:border-0"
              >
                <AccordionTrigger className="text-left text-base md:text-lg font-semibold py-5 hover:text-foreground/80 transition-colors">
                  <h3 className="flex items-start gap-3 text-base md:text-lg font-semibold m-0 text-left">
                    <span className="text-muted-foreground">Q{index + 1}.</span>
                    <span>{faq.question}</span>
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-5 pl-9">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  );
}
