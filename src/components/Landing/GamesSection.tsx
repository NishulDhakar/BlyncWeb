import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Container from "../common/Container";
import { ShimmerButton } from "../ui/shimmer-button";
import { CoolMode } from "../ui/cool-mode";
import { SectionHeading } from "./_ui";

const categories = [
  {
    slug: "cognitive",
    name: "Cognitive Games",
    href: "/games/cognitive",
    description:
      "Switch, Digit, Motion, Grid, Inductive and Deductive challenges — the exact games used in Capgemini and Cognizant placement tests.",
    image: "/games/games.png",
  },
  {
    slug: "memory",
    name: "Memory Games",
    href: "/games/memory",
    description:
      "Recall and working-memory challenges that build retention speed and short-term span under time pressure.",
    image: "/games/memory.png",
  },
];

export default function GamesSection() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          kicker="The catalogue"
          title="Pick a track and"
          accent="start where it matters."
          description="Two focused categories, every game type inside. Free to play, unlimited attempts."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-heading text-xl font-bold text-foreground">{cat.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {cat.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-foreground">
                  Explore category
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-secondary/50 p-7 sm:p-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h3 className="font-heading text-lg font-bold text-foreground">
              Suggest a game, get 2 months of Pro free
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Send us the rules, mechanics and flow of another placement or cognitive game.
              Once it is reviewed and approved, the credit is yours.
            </p>
          </div>
          <CoolMode>
            <ShimmerButton
              href="/contact"
              className="h-11 px-6 text-sm font-semibold shadow-md"
            >
              Suggest a game
              <ArrowUpRight className="size-4" />
            </ShimmerButton>
          </CoolMode>
        </div>
      </Container>
    </section>
  );
}
