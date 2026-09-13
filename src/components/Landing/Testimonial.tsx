// Server Component — no client JS shipped

import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Container from "../common/Container";
import { SectionHeading } from "./_ui";

const testimonials = [
  {
    name: "Akshay",
    role: "B.Tech AIML, TIT Bhopal",
    content:
      "The dedicated practice for cognitive games gave me a real edge. I walked into the actual assessment already knowing the logic.",
  },
  {
    name: "Shubham Kumar",
    role: "Engineering student",
    content:
      "Excellent for pattern recognition puzzles. The difficulty progression is spot on for placement tests.",
  },
  {
    name: "Priya Sharma",
    role: "B.Tech IT, LNCT Bhopal",
    content:
      "A platform that cuts through the noise. Direct, relevant practice with no distractions.",
  },
  {
    name: "Lovlesh",
    role: "B.Tech CSE",
    content:
      "Structured and effective. It turned a stressful prep process into a systematic routine.",
  },
  {
    name: "Vishal",
    role: "B.Tech CSE",
    content:
      "Clean interface, and the games accurately reflect the cognitive tests major recruiters use.",
  },
  {
    name: "Siya",
    role: "B.Tech IT",
    content:
      "Highly recommended for anyone serious about improving problem-solving speed and accuracy.",
  },
];

export default function Testimonial() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          kicker="Proof"
          title="Students who walked in"
          accent="prepared, not surprised."
          description="Real notes from candidates who used Blync before their placement rounds."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-foreground text-foreground" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 font-serif text-lg italic leading-relaxed text-foreground">
                &ldquo;{t.content}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <Avatar className="size-9 border border-border">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.name)}`}
                  />
                  <AvatarFallback className="bg-secondary text-xs font-semibold text-foreground">
                    {t.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
