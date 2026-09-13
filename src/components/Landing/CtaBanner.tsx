// Server Component — no client JS shipped

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "../common/Container";
import { ShimmerButton } from "../ui/shimmer-button";
import { CoolMode } from "../ui/cool-mode";
import { Kicker, landingHeadingClass, landingSubtitleClass } from "./_ui";

export default function CtaBanner() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-secondary/60 p-8 sm:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-foreground/[0.05] blur-3xl"
          />
          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <Kicker>Get started</Kicker>
              <h2 className={`mt-5 max-w-5xl ${landingHeadingClass}`}>
                Make your next practice round{" "}
                <span>the one that counts.</span>
              </h2>
              <p className={`${landingSubtitleClass} mx-0`}>
                Complete cognitive preparation suite. Drill real assessment rounds and build the speed and
                accuracy the placement rounds are looking for.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <CoolMode>
                <ShimmerButton
                  href="/pricing"
                  className="h-12 px-8 text-sm font-semibold shadow-xl"
                >
                  Get started now
                  <ArrowUpRight className="size-4" />
                </ShimmerButton>
              </CoolMode>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
