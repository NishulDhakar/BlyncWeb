// Shared building blocks for the landing page. Server-safe (no client JS).

import React from "react";
import { cn } from "@/lib/utils";

export const landingHeadingClass =
  "[font-family:Inter,ui-sans-serif,system-ui,sans-serif] text-3xl font-medium leading-[1.05] text-foreground sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl";

export const landingSubtitleClass =
  "mx-auto mt-8 max-w-5xl [font-family:Inter,ui-sans-serif,system-ui,sans-serif] text-xl font-medium leading-[1.4] text-muted-foreground sm:text-xl lg:text-[1rem]";

/** Small uppercase pill label that sits above every section heading. */
export function Kicker({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border border-border bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Section heading in the Timmo style: heavy sans on line one, a serif italic
 * accent on line two. Pass the accent as its own prop so callers stay tidy.
 */
export function SectionHeading({
  kicker,
  title,
  accent,
  description,
  align = "center",
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  accent?: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-6xl text-center" : "max-w-6xl text-left",
        className,
      )}
    >
      {kicker ? <Kicker>{kicker}</Kicker> : null}
      <h2
        className={cn(
          landingHeadingClass,
          kicker && "mt-5",
        )}
      >
        {title}
        {accent ? (
          <>
            {" "}
            <span className="text-foreground">{accent}</span>
          </>
        ) : null}
      </h2>
      {description ? (
        <p
          className={cn(
            landingSubtitleClass,
            align === "left" && "mx-0",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

/** Card surface used across the feature / step / testimonial grids. */
export function PanelCard({
  children,
  className,
  interactive = true,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300",
        interactive && "hover:-translate-y-1 hover:shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
