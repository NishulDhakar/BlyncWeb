"use client"

import React, { type ComponentPropsWithoutRef, type CSSProperties } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { CoolMode, type CoolParticleOptions } from "./cool-mode"

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
  href?: string
  target?: string
  rel?: string
  coolMode?: boolean
  coolModeOptions?: CoolParticleOptions
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "var(--primary-foreground, #ffffff)",
      shimmerSize = "1.5px",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "var(--primary)",
      className,
      children,
      href,
      target,
      rel,
      coolMode = false,
      coolModeOptions,
      type = "button",
      ...props
    },
    ref
  ) => {
    const style: CSSProperties = {
      "--spread": "90deg",
      "--shimmer-color": shimmerColor,
      "--radius": borderRadius,
      "--speed": shimmerDuration,
      "--cut": shimmerSize,
      "--bg": background,
    } as CSSProperties

    const sharedClasses = cn(
      "group relative z-0 inline-flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-border/40 px-6 py-3 whitespace-nowrap text-primary-foreground [background:var(--bg)]",
      "transform-gpu transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-[0.98] active:translate-y-px",
      className
    )

    const innerContent = (
      <>
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]"
          )}
        >
          {/* spark */}
          <div className="animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
            {/* spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>

        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {children}
        </span>

        {/* Highlight */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 size-full",
            "[border-radius:var(--radius)] px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
            "transform-gpu transition-all duration-300 ease-in-out",
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute inset-[var(--cut)] -z-20 [border-radius:var(--radius)] [background:var(--bg)]"
          )}
        />
      </>
    )

    const buttonElement = href ? (
      <Link
        href={href}
        target={target}
        rel={rel}
        style={style}
        className={sharedClasses}
        onClick={props.onClick as any}
      >
        {innerContent}
      </Link>
    ) : (
      <button
        ref={ref}
        type={type}
        style={style}
        className={sharedClasses}
        {...props}
      >
        {innerContent}
      </button>
    )

    if (coolMode) {
      return <CoolMode options={coolModeOptions}>{buttonElement}</CoolMode>
    }

    return buttonElement
  }
)

ShimmerButton.displayName = "ShimmerButton"

