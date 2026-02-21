"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/shared/lib/utils"
import { ChevronRight } from "lucide-react"
import { Sparkline } from "./Sparkline"

type ColorVariant = "gold" | "coral" | "teal" | "violet" | "indigo" | "emerald"

const variantStyles: Record<ColorVariant, { gradient: string; bg: string; text: string; iconBg: string }> = {
  gold: {
    gradient: "from-amber-400 via-yellow-500 to-amber-600",
    bg: "bg-amber-50",
    text: "text-amber-700",
    iconBg: "bg-amber-100",
  },
  coral: {
    gradient: "from-rose-400 via-orange-400 to-amber-500",
    bg: "bg-rose-50",
    text: "text-rose-700",
    iconBg: "bg-rose-100",
  },
  teal: {
    gradient: "from-teal-400 via-cyan-500 to-teal-600",
    bg: "bg-teal-50",
    text: "text-teal-700",
    iconBg: "bg-teal-100",
  },
  violet: {
    gradient: "from-violet-400 via-purple-500 to-indigo-600",
    bg: "bg-violet-50",
    text: "text-violet-700",
    iconBg: "bg-violet-100",
  },
  indigo: {
    gradient: "from-indigo-400 via-blue-500 to-indigo-600",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    iconBg: "bg-indigo-100",
  },
  emerald: {
    gradient: "from-emerald-400 via-green-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    iconBg: "bg-emerald-100",
  },
}

/** Interactive metric card with gradient accent, hover image reveal */
export function InteractiveMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "gold",
  trend,
  sparklineData,
  imageUrl,
  className,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ElementType
  variant?: ColorVariant
  trend?: "up" | "down" | "neutral"
  /** 7-day trend values for sparkline (e.g. [2,3,4,3,5,6,7]) */
  sparklineData?: number[]
  imageUrl?: string
  className?: string
}) {
  const s = variantStyles[variant]
  const circleMap: Record<ColorVariant, string> = {
    gold: "from-amber-400 via-yellow-500 to-amber-600",
    coral: "from-rose-400 via-orange-400 to-amber-500",
    teal: "from-teal-400 via-cyan-500 to-teal-600",
    violet: "from-violet-400 via-purple-500 to-indigo-600",
    indigo: "from-indigo-400 via-blue-500 to-indigo-600",
    emerald: "from-emerald-400 via-green-500 to-teal-600",
  }
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/80 p-6 shadow-lg shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:shadow-amber-200/30",
        s.bg,
        className
      )}
    >
      {imageUrl && (
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-white/75" />
        </div>
      )}
      <div className={cn("absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br opacity-20", circleMap[variant])} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className={cn("text-3xl font-bold", s.text)}>{value}</p>
            {sparklineData && sparklineData.length > 0 && (
              <Sparkline data={sparklineData} className="h-6 w-12 text-amber-600/70" stroke="#B8860B" />
            )}
          </div>
          {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
          {trend && (
            <span
              className={cn(
                "mt-2 inline-flex text-xs font-medium",
                trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-slate-500"
              )}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"} vs last period
            </span>
          )}
        </div>
        {Icon && (
          <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110", s.iconBg, s.text)}>
            <Icon className="h-7 w-7" />
          </div>
        )}
      </div>
    </div>
  )
}

/** Interactive featured card with image or video background */
export function InteractiveFeaturedCard({
  title,
  subtitle,
  ctaLabel,
  href,
  imageUrl,
  videoUrl,
  variant = "gold",
  icon: Icon,
  className,
}: {
  title: string
  subtitle?: string
  ctaLabel?: string
  href?: string
  imageUrl?: string
  videoUrl?: string
  variant?: ColorVariant
  icon?: React.ElementType
  className?: string
}) {
  const s = variantStyles[variant]
  const hasMedia = videoUrl || imageUrl
  const content = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/80 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
        "min-h-[140px]",
        className
      )}
    >
      {href && <Link href={href} className="absolute inset-0 z-10" aria-label={title} />}
      {videoUrl ? (
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={imageUrl}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
      ) : imageUrl ? (
        <div className="absolute inset-0">
          <Image src={imageUrl} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
      ) : (
        <div className={cn("absolute inset-0 bg-gradient-to-br", s.gradient, "opacity-90")} />
      )}
      <div className="relative flex h-full flex-col justify-end p-6">
        <div className="flex items-start gap-4">
          {Icon && !hasMedia && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Icon className="h-6 w-6 text-white" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-white drop-shadow-sm">{title}</h3>
            {subtitle && <p className="mt-0.5 text-sm text-white/90">{subtitle}</p>}
            {ctaLabel && (
              <span className="mt-3 inline-flex items-center text-sm font-medium text-white hover:underline pointer-events-none">
                {ctaLabel}
                <ChevronRight className="ml-1 h-4 w-4" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
  return content
}

/** Talent card with avatar image */
export function InteractiveTalentCard({
  name,
  subtitle,
  imageUrl,
  tags,
  href,
  className,
  theme = "light",
}: {
  name: string
  subtitle?: string
  imageUrl?: string
  tags?: string[]
  href?: string
  className?: string
  theme?: "light" | "dark"
}) {
  const isDark = theme === "dark"
  const content = (
    <div
      className={cn(
        "group relative flex items-center gap-4 rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-card-hover p-4",
        className
      )}
      style={{
        backgroundColor: isDark ? "#171717" : "#ffffff",
        borderColor: isDark ? "#262626" : "rgb(226 232 240 / 0.8)",
      }}
    >
      {href && <Link href={href} className="absolute inset-0 z-10" aria-label={name} />}
      <div className="relative z-20 h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-2 ring-amber-100 transition-all duration-300 group-hover:ring-amber-300">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" sizes="64px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200">
            <span className="text-2xl font-bold text-amber-600">{name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="relative z-20 min-w-0 flex-1">
        <p className="font-semibold" style={{ color: isDark ? "#fafafa" : "#1e293b" }}>{name}</p>
        {subtitle && <p className="text-sm" style={{ color: isDark ? "#a3a3a3" : "#64748b" }}>{subtitle}</p>}
        {tags && tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      {href && (
        <ChevronRight className="relative z-20 h-5 w-5 shrink-0 text-slate-400 transition-colors group-hover:text-amber-600" />
      )}
    </div>
  )
  return content
}

/** Casting/Job card with image or video background */
export function InteractiveCastingCard({
  title,
  client,
  type,
  status,
  deadline,
  submissionsCount,
  shortlistedCount,
  imageUrl,
  videoUrl,
  href,
  className,
  theme = "light",
}: {
  title: string
  client?: string
  type?: string
  status?: string
  deadline?: string
  submissionsCount?: number
  shortlistedCount?: number
  imageUrl?: string
  videoUrl?: string
  href?: string
  className?: string
  theme?: "light" | "dark"
}) {
  const isDark = theme === "dark"
  const statusColors: Record<string, string> = {
    OPEN: "bg-emerald-100 text-emerald-700",
    SHORTLISTING: "bg-amber-100 text-amber-700",
    CLOSED: "bg-slate-100 text-slate-600",
  }
  const content = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-card-hover",
        className
      )}
      style={{
        backgroundColor: isDark ? "#171717" : "#ffffff",
        borderColor: isDark ? "#262626" : "rgb(226 232 240 / 0.8)",
      }}
    >
      {href && <Link href={href} className="absolute inset-0 z-10" aria-label={title} />}
      <div className="relative h-28 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {videoUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={imageUrl}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : imageUrl ? (
          <Image src={imageUrl} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="400px" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", statusColors[status ?? ""] ?? "bg-slate-200 text-slate-600")}>
            {status ?? "—"}
          </span>
          {type && (
            <span className="ml-2 rounded-lg bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-600 backdrop-blur-sm">
              {type}
            </span>
          )}
        </div>
      </div>
      <div className="relative z-20 p-4">
        <h3 className="font-semibold line-clamp-2" style={{ color: isDark ? "#fafafa" : "#1e293b" }}>{title}</h3>
        {client && <p className="mt-1 text-sm" style={{ color: isDark ? "#a3a3a3" : "#64748b" }}>{client}</p>}
        <div className="mt-3 flex flex-wrap gap-3 text-xs" style={{ color: isDark ? "#a3a3a3" : "#64748b" }}>
          {deadline && <span suppressHydrationWarning>Deadline: {new Date(deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>}
          {submissionsCount != null && <span className="font-medium text-amber-600">{submissionsCount} submissions</span>}
          {shortlistedCount != null && <span className="font-medium text-emerald-600">{shortlistedCount} shortlisted</span>}
        </div>
      </div>
      {href && (
        <div className="relative z-20 border-t px-4 py-2" style={{ borderColor: isDark ? "#262626" : "#f1f5f9" }}>
          <span className="inline-flex items-center text-sm font-medium text-amber-600 group-hover:text-amber-700">
            View details
            <ChevronRight className="ml-1 h-4 w-4" />
          </span>
        </div>
      )}
    </div>
  )
  return content
}

/** Booking card with gradient accent */
export function InteractiveBookingCard({
  projectName,
  clientName,
  talentName,
  dates,
  stage,
  imageUrl,
  href,
  className,
  theme = "light",
}: {
  projectName: string
  clientName?: string
  talentName?: string
  dates?: { start: string; end: string }
  stage?: string
  imageUrl?: string
  href?: string
  className?: string
  theme?: "light" | "dark"
}) {
  const isDark = theme === "dark"
  const stageColors: Record<string, string> = {
    INQUIRY: "bg-slate-100 text-slate-600",
    OPTION_HOLD: "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-rose-100 text-rose-600",
  }
  const content = (
    <div
      className={cn(
        "group relative flex h-[130px] min-h-[130px] overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-card-hover",
        className
      )}
      style={{
        backgroundColor: isDark ? "#171717" : "#ffffff",
        borderColor: isDark ? "#262626" : "rgb(226 232 240 / 0.8)",
      }}
    >
      {href && <Link href={href} className="absolute inset-0 z-10" aria-label={projectName} />}
      <div className="relative z-20 flex h-full min-w-[100px] shrink-0 flex-col justify-center bg-gradient-to-b from-teal-100 to-cyan-100 p-4">
        {imageUrl ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-xl">
            <Image src={imageUrl} alt="" fill className="object-cover" sizes="80px" />
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/60 text-xl font-bold text-teal-600">
            {projectName.charAt(0)}
          </div>
        )}
      </div>
      <div className="relative z-20 flex min-w-0 flex-1 flex-col justify-between overflow-hidden p-4">
        <div className="min-w-0">
          <h3 className="truncate font-semibold" style={{ color: isDark ? "#fafafa" : "#1e293b" }}>{projectName}</h3>
          {clientName && <p className="truncate text-sm" style={{ color: isDark ? "#a3a3a3" : "#64748b" }}>{clientName}</p>}
          {talentName && <p className="mt-0.5 truncate text-xs" style={{ color: isDark ? "#a3a3a3" : "#64748b" }}>Talent: {talentName}</p>}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          {dates && (
            <span className="truncate text-xs" style={{ color: isDark ? "#a3a3a3" : "#64748b" }} suppressHydrationWarning>
              {new Date(dates.start).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – {new Date(dates.end).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          )}
          {stage && (
            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-medium", stageColors[stage] ?? "bg-slate-100 text-slate-600")}>
              {stage.replace(/_/g, " ")}
            </span>
          )}
        </div>
      </div>
      {href && <ChevronRight className="relative z-20 m-4 h-5 w-5 shrink-0 text-slate-400 group-hover:text-teal-600" />}
    </div>
  )
  return content
}
