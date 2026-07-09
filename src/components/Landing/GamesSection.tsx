import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Container from "../common/Container";

const categories = [
  {
    slug: "cognitive",
    name: "Cognitive Games",
    href: "/games/cognitive",
    description:
      "Switch, Digit, Motion, Grid, Inductive & Deductive challenges — the exact games used in placement tests.",
    image: "/games/games.png",
  },
  {
    slug: "memory",
    name: "Memory Games",
    href: "/games/memory",
    description:
      "Memory and Recall challenges to improve working memory, recall speed, and short-term retention.",
    image: "/games/memory.png",
  },
];

export default function GamesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-white/[0.015] rounded-full blur-[100px] pointer-events-none" />

      <Container>
        {/* Section Heading */}
        <div className="mb-16 text-center max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
            Choose Your Challenge
          </h2>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 text-xl font-medium tracking-tight">
            Select a category to start practicing
          </span>
        </div>

        {/* Categories Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.href}
              className="relative flex flex-col overflow-hidden rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300 group"
            >
              {/* Cover Image */}
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Card Body */}
              <div className="p-8 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed font-light">
                    {cat.description}
                  </p>
                </div>

                {/* Explore CTA */}
                <div className="flex items-center gap-2 mt-8 text-sm font-bold text-white/50 group-hover:text-white transition-colors duration-200">
                  <span className="tracking-wide">Explore Category</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Suggest Games Banner */}
        <div className="relative mt-20 p-8 md:p-10 rounded-[2rem] bg-gradient-to-r from-white/[0.02] to-white/[0.01] border border-white/[0.05] overflow-hidden group z-10">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-left">
              <h3 className="text-lg md:text-xl font-bold mb-2 text-white">
                Suggest us more games and get 2 month free subscription
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Provide comprehensive details (rules, mechanics, flow) about other placement or cognitive games. After review and approval, we will credit your 2-month subscription.
              </p>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-black hover:bg-white/90 text-sm font-semibold transition-all shadow-lg shadow-white/5 shrink-0"
            >
              Suggest a Game
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
