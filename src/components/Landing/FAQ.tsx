// Server Component — no client JS shipped

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Container from "../common/Container";
import { SectionHeading } from "./_ui";

export const faqData = [
  {
    question: "What are Capgemini Cognitive Ability Games?",
    answer:
      "Game-based assessments Capgemini uses during placements to test logical reasoning, problem-solving, memory and pattern recognition.",
  },
  {
    question: "Can I practice the exact same games here?",
    answer:
      "Blync provides practice challenges built to mirror the real games. They are not identical, but the logic, difficulty and format track the actual rounds closely.",
  },
  {
    question: "Do I need an account to practice?",
    answer:
      "No. Basic games are open to everyone. A free account only adds progress tracking and practice history.",
  },
  {
    question: "How should I prepare for the actual assessment?",
    answer:
      "Practice regularly, focus on speed and accuracy, and rotate through every challenge type — Switch, Grid, Inductive and Deductive especially.",
  },
  {
    question: "Is the platform free?",
    answer:
      "Yes. All core Capgemini and Cognizant practice games are free to access.",
  },
  {
    question: "Will practicing here improve my chances?",
    answer:
      "Consistent practice builds confidence, improves reaction time and strengthens logical problem-solving — the skills these rounds score directly.",
  },
];

export default function FAQ() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading
          kicker="FAQ"
          title="Questions before you"
          accent="get started."
        />

        <div className="mt-12 rounded-2xl border border-border bg-card p-2 shadow-sm sm:p-4">
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border px-4 last:border-0"
              >
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-foreground hover:no-underline">
                  <h3 className="m-0 text-base font-semibold">{faq.question}</h3>
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
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
