// Server Component — no client JS shipped

import Container from "../common/Container";
import { landingHeadingClass, landingSubtitleClass } from "./_ui";

const stats = [
  {
    value: "750+",
    label: "Register User",
    video: "/videos/video1.webm",
  },
  {
    value: "6",
    label: "focus tools included",
    video: "/videos/video2.webm",
  },
  {
    value: "365",
    label: "days of activity heatmap",
    video: "/videos/video3.webm",
  },
];

export default function NumbersSpeak() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-6xl text-center">
          <h2 className={landingHeadingClass}>
            Our Numbers Speak
            <br />
            for Themselves
          </h2>
          <p className={landingSubtitleClass}>
            Powered by our growing community.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="aspect-[16/11] overflow-hidden rounded-xl border border-border/70 bg-secondary">
                <video
                  aria-hidden="true"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  src={stat.video}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="px-4 pb-5 pt-4 sm:px-5">
                <p className="font-heading text-2xl font-extrabold leading-none text-foreground">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-bold leading-snug text-muted-foreground sm:text-base">
                  {stat.label}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
