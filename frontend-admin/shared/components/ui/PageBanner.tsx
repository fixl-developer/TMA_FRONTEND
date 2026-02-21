"use client"

import { cn } from "@/shared/lib/utils"

interface PageBannerProps {
  title: string
  subtitle?: string
  variant?: "default" | "talent" | "events" | "casting" | "influencers" | "academy"
  className?: string
}

const variantStyles = {
  default:
    "from-slate-900 via-slate-800 to-slate-900 bg-gradient-to-br",
  talent:
    "from-amber-950/90 via-slate-900 to-rose-950/80 bg-gradient-to-br",
  events:
    "from-violet-950/90 via-slate-900 to-fuchsia-950/70 bg-gradient-to-br",
  casting:
    "from-sky-950/90 via-slate-900 to-indigo-950/80 bg-gradient-to-br",
  influencers:
    "from-pink-950/90 via-slate-900 to-amber-950/70 bg-gradient-to-br",
  academy:
    "from-emerald-950/90 via-slate-900 to-teal-950/80 bg-gradient-to-br",
}

export function PageBanner({ title, subtitle, variant = "default", className }: PageBannerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl px-8 py-12 sm:px-10 sm:py-14",
        variantStyles[variant],
        className
      )}
    >
      {/* Subtle film grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Gradient shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent" />
      <div className="relative">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-xl text-sm text-white/70 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
