"use client"

import { cn } from "@/shared/lib/utils"

interface PageBannerProps {
  title: string
  subtitle?: string
  variant?: "default" | "talent" | "castings" | "bookings" | "contracts"
  className?: string
}

const variantStyles = {
  default: "from-slate-900 via-slate-800 to-slate-900 bg-gradient-to-br",
  talent: "from-amber-950/90 via-slate-900 to-rose-950/80 bg-gradient-to-br",
  castings: "from-sky-950/90 via-slate-900 to-indigo-950/80 bg-gradient-to-br",
  bookings: "from-violet-950/90 via-slate-900 to-fuchsia-950/70 bg-gradient-to-br",
  contracts: "from-emerald-950/90 via-slate-900 to-teal-950/80 bg-gradient-to-br",
}

export function PageBanner({ title, subtitle, variant = "default", className }: PageBannerProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl px-8 py-12 sm:px-10 sm:py-14", variantStyles[variant], className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent" />
      <div className="relative">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-sm text-white/70 sm:text-base">{subtitle}</p>}
      </div>
    </div>
  )
}
