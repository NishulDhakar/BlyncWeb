"use client";

import React from "react";
import { Star } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Container from "../common/Container";

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
}

function TestimonialCard({ name, role, content, rating }: TestimonialCardProps) {
  return (
    <div className="h-full">
      <Card className="h-full flex flex-col border-border/50 bg-card/50 hover:bg-card/70 transition-colors duration-200">
        <CardContent className="pt-6 flex-1">
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${
                  index < rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-muted-foreground leading-relaxed italic text-sm md:text-base">
            &ldquo;{content}&rdquo;
          </p>
        </CardContent>
        <CardHeader className="flex flex-row items-center gap-4 pt-0 pb-6">
          <Avatar className="border border-border/40">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
            <AvatarFallback className="bg-muted text-foreground font-semibold">{name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-sm">{name}</h4>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

const testimonials = [
  {
    name: "Akshay",
    role: "B. Tech AIML (TIT Bhopal)",
    content:
      "The dedicated practice modules for cognitive games gave me a real edge. I felt much more prepared for the actual assessment logic.",
    rating: 5,
  },
  {
    name: "Shubham Kumar",
    role: "Engineering Student",
    content:
      "Excellent resource for pattern recognition puzzles. The difficulty progression is spot on for placement tests.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "B. Tech IT (LNCT Bhopal)",
    content:
      "A professional platform that cuts through the noise. Direct, relevant practice without unnecessary distractions.",
    rating: 5,
  },
  {
    name: "Lovlesh",
    role: "B. Tech CSE",
    content:
      "Structured and effective. It turns a usually stressful preparation process into a systematic training routine.",
    rating: 5,
  },
  {
    name: "Vishal",
    role: "B. Tech CSE",
    content:
      "The interface is clean and the games accurately reflect standard cognitive ability tests used by major recruiters.",
    rating: 5,
  },
  {
    name: "Siya",
    role: "B. Tech IT",
    content:
      "Highly recommended for anyone looking to seriously improve their problem-solving speed and accuracy.",
    rating: 5,
  },
];

export default function Testimonial() {
  return (
    <section className="py-20 relative overflow-hidden">
      <Container>
        <div className="mb-16 text-center max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Success Stories
          </h2>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50 text-xl md:text-xl font-bold tracking-tight mb-4">Student Success Stories</span>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto mt-10">
            Hear from students who have used our platform to sharpen their skills and secure their dream placements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              content={testimonial.content}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
