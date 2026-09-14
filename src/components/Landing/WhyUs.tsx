import React from "react";
import { Star, Plus, Circle, Sparkle, Square } from "lucide-react";
import Container from "../common/Container";
import { db } from "@/lib/db";
import { users, gameScores } from "@/lib/schema";
import { sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const getWhyUsStats = unstable_cache(
  async () => {
    try {
      const [userCountResult, scoreCountResult] = await Promise.all([
        db.select({ count: sql<number>`count(*)::int` }).from(users),
        db.select({ count: sql<number>`count(*)::int` }).from(gameScores),
      ]);
      const totalUsers = userCountResult[0]?.count ?? 6443;
      const totalScores = scoreCountResult[0]?.count ?? 11965;

      const formattedUsers =
        totalUsers >= 1000
          ? `${(totalUsers / 1000).toFixed(1).replace(/\.0$/, "")}k+`
          : `${totalUsers}+`;

      const formattedScores =
        totalScores >= 1000
          ? `${(totalScores / 1000).toFixed(1).replace(/\.0$/, "")}k+`
          : `${totalScores}+`;

      return {
        users: formattedUsers,
        rounds: formattedScores,
      };
    } catch {
      return {
        users: "6.4k+",
        rounds: "12k+",
      };
    }
  },
  ["why-us-landing-stats"],
  { revalidate: 3600 }
);

export default async function WhyUs() {
  const statsData = await getWhyUsStats();

  const pillars = [
    { label: "Exam-Accurate Logic", icon: Plus },
    { label: "Streak & Habit Consistency", icon: Circle },
    { label: "Timed Reflex Training", icon: Sparkle },
    { label: "Verified Placement Results", icon: Square },
  ];

  const cards = [
    {
      value: statsData.users,
      label: "Registered candidates preparing for 2026 placement drives",
    },
    {
      value: "94%",
      label: "Placement assessment clearance rate reported by active users",
    },
    {
      value: statsData.rounds,
      label: "Cognitive challenge rounds & timed mock drills completed",
    },
  ];

  return (
    <section className="py-16 sm:py-24 lg:py-28 border-b border-border/40 bg-background overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-10 sm:space-y-12 lg:min-h-[520px]">
            {/* Top Heading */}
            <div>
              <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[0.95]">
                Why
                <br />
                us
              </h2>
            </div>

            {/* Middle Feature List with Geometric Icons */}
            <ul className="space-y-3.5 sm:space-y-4">
              {pillars.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 text-sm sm:text-base font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  <span className="flex size-4 items-center justify-center text-foreground/70 shrink-0">
                    <Icon className="size-3.5" strokeWidth={2.5} />
                  </span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            {/* Bottom Testimonial / Social Proof Snippet */}
            <div className="space-y-2.5 max-w-sm pt-2">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-3.5 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-bold text-foreground/90 ml-1">
                  5.0 / 5
                </span>
              </div>

              <blockquote className="text-xs sm:text-sm leading-relaxed text-muted-foreground italic">
                &ldquo;The dedicated practice for cognitive games gave me a real edge. I walked into the actual assessment already knowing every pattern.&rdquo;
              </blockquote>

              <div className="pt-1">
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  Shivansh tiwari
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  Placed Candidate · TIT Bhopal
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-10 lg:space-y-14 lg:min-h-[520px]">
            {/* Top Statement / Value Proposition */}
            <div className="lg:pt-2">
              <p className="font-heading text-2xl sm:text-3xl lg:text-[2.15rem] font-medium leading-[1.3] text-foreground tracking-tight max-w-3xl">
                We engineer realistic cognitive game drills that not only sharpen
                your pattern recognition under timed pressure but also deliver
                measurable speed and accuracy for guaranteed placement success.
              </p>
            </div>

            {/* Bottom 3 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-secondary/30 dark:bg-card/70 p-6 sm:p-7 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] lg:min-h-[320px] transition-all duration-300"
                >
                  {/* Giant Watermark Ghost Number */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none select-none absolute right-1 -top-2 sm:right-2 sm:-top-3 font-heading text-6xl sm:text-7xl lg:text-8xl font-black text-foreground/[0.04] dark:text-foreground/[0.06] tracking-tighter transition-transform duration-500 group-hover:scale-105"
                  >
                    {card.value}
                  </span>

                  {/* Foreground Number */}
                  <div className="relative z-10">
                    <span className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                      {card.value}
                    </span>
                  </div>

                  {/* Bottom Label */}
                  <p className="relative z-10 text-xs sm:text-sm font-normal sm:font-medium leading-relaxed text-muted-foreground mt-8 sm:mt-10">
                    {card.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
