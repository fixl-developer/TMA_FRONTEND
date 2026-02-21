"use client"

import { cn } from "@/shared/lib/utils"

interface PageBannerProps {
  title: string
  subtitle?: string
  variant?: "default" | "process" | "registration" | "judges" | "sponsors" | "results"
  className?: string
}

const variantStyles = {
  default: "from-slate-900 via-slate-800 to-slate-900 bg-gradient-to-br",
  process: "from-violet-950/90 via-slate-900 to-fuchsia-950/80 bg-gradient-to-br",
  registration: "from-sky-950/90 via-slate-900 to-indigo-950/80 bg-gradient-to-br",
  judges: "from-amber-950/90 via-slate-900 to-rose-950/80 bg-gradient-to-br",
  sponsors: "from-emerald-950/90 via-slate-900 to-teal-950/80 bg-gradient-to-br",
  results: "from-pink-950/90 via-slate-900 to-violet-950/80 bg-gradient-to-br",
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
