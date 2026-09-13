// Server Component — no client JS shipped

import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { COMPANY_LOGOS } from "@/lib/constants";
import Container from "../common/Container";
import { Kicker } from "./_ui";

export default function LogoMarquee() {
  const half = Math.ceil(COMPANY_LOGOS.length / 2);
  const rowOne = COMPANY_LOGOS.slice(0, half);
  const rowTwo = COMPANY_LOGOS.slice(half);

  return (
    <section
      className="bg-secondary/30 py-10 sm:py-14"
      aria-labelledby="logos-heading"
    >
      <Container>
        <p id="logos-heading" className="text-center">
          <Kicker>Practice for placements at</Kicker>
        </p>

        <div className="relative mt-8 sm:mt-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-28" />

          <Marquee pauseOnHover className="[--duration:34s]">
            {rowOne.map((logo) => (
              <LogoItem key={logo.name} {...logo} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="mt-2 [--duration:38s]">
            {rowTwo.map((logo) => (
              <LogoItem key={logo.name} {...logo} />
            ))}
          </Marquee>
        </div>
      </Container>
    </section>
  );
}

function LogoItem({ src, name }: { src: string; name: string }) {
  return (
    <div className="mx-3 flex h-16 w-36 shrink-0 items-center justify-center rounded-xl  bg-white px-5 grayscale opacity-70 transition hover:grayscale-0 hover:opacity-100 sm:mx-6 sm:h-20 sm:w-44">
      <Image
        src={src}
        alt={`${name} logo`}
        width={176}
        height={60}
        className="h-auto w-full object-contain"
      />
    </div>
  );
}
