"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/shared/lib/utils"
import { ChevronRight } from "lucide-react"

const AGENCIES = {
  bg: "bg-[#FAFAF9]",
  surface: "bg-white",
  border: "border-[#E7E5E4]",
  borderHover: "hover:border-[#B8860B]/40",
  accent: "text-[#B8860B]",
  accentBg: "bg-[#FEF3C7]",
  accentBgSoft: "bg-[#B8860B]/10",
  text: "text-[#1C1917]",
  textMuted: "text-[#57534E]",
}

interface AgencyCardBaseProps {
  className?: string
  children: React.ReactNode
  as?: "div" | "article" | "a"
  href?: string
}

function AgencyCardBase({ className, children, as: Comp = "div", href, ...props }: AgencyCardBaseProps & React.HTMLAttributes<HTMLElement>) {
  const base = "rounded-xl border transition-all duration-200 overflow-hidden"
  const interactive = href ? "cursor-pointer hover:shadow-lg hover:-translate-y-0.5 hover:border-[#B8860B]/40" : ""

  if (Comp === "a" && href) {
    return (
      <Link href={href} className={cn(base, AGENCIES.border, AGENCIES.surface, interactive, className)} {...(props as any)}>
        {children}
      </Link>
    )
  }

  return (
    <Comp className={cn(base, AGENCIES.border, AGENCIES.surface, interactive, className)} {...props}>
      {children}
    </Comp>
  )
}

/** Metric card – KPI with icon, number, label */
export function AgencyMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ElementType
  trend?: "up" | "down" | "neutral"
  className?: string
}) {
  return (
    <AgencyCardBase className={cn("p-5", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className={cn("text-sm font-medium", AGENCIES.textMuted)}>{title}</p>
          <p className={cn("mt-1 text-2xl font-bold", AGENCIES.accent)}>{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-[#78716C]">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", AGENCIES.accentBg)}>
            <Icon className={cn("h-5 w-5", AGENCIES.accent)} />
          </div>
        )}
      </div>
      {trend && (
        <div className={cn("mt-3 text-xs font-medium", trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : AGENCIES.textMuted)}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"} vs last period
        </div>
      )}
    </AgencyCardBase>
  )
}

/** List card – row with icon, title, meta, action */
export function AgencyListCard({
  title,
  subtitle,
  meta,
  icon: Icon,
  href,
  badge,
  className,
}: {
  title: string
  subtitle?: string
  meta?: React.ReactNode
  icon?: React.ElementType
  href?: string
  badge?: string
  className?: string
}) {
  return (
    <AgencyCardBase href={href} className={cn("p-4", className)}>
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", AGENCIES.accentBg)}>
            <Icon className={cn("h-5 w-5", AGENCIES.accent)} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className={cn("font-semibold", AGENCIES.text)}>{title}</p>
            {badge && (
              <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium", AGENCIES.accentBg, AGENCIES.accent)}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className={cn("mt-0.5 text-sm", AGENCIES.textMuted)}>{subtitle}</p>}
          {meta && <div className="mt-2">{meta}</div>}
        </div>
        {href && <ChevronRight className={cn("h-5 w-5 shrink-0", AGENCIES.textMuted)} />}
      </div>
    </AgencyCardBase>
  )
}

/** Featured card – large with gradient accent strip */
export function AgencyFeaturedCard({
  title,
  subtitle,
  ctaLabel,
  href,
  gradient = "gold",
  icon: Icon,
  className,
}: {
  title: string
  subtitle?: string
  ctaLabel?: string
  href?: string
  gradient?: "gold" | "coral" | "teal"
  icon?: React.ElementType
  className?: string
}) {
  const gradients = {
    gold: "from-[#E4A853] to-[#B8860B]",
    coral: "from-[#E07C5C] to-[#B8860B]",
    teal: "from-[#0D9488] to-[#B8860B]",
  }
  const g = gradients[gradient]

  return (
    <AgencyCardBase href={href} className={cn("relative", className)}>
      <div className={cn("absolute left-0 top-0 h-full w-1 bg-gradient-to-b", g)} />
      <div className="p-5 pl-6">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", AGENCIES.accentBg)}>
              <Icon className={cn("h-6 w-6", AGENCIES.accent)} />
            </div>
          )}
          <div>
            <h3 className={cn("text-lg font-semibold", AGENCIES.text)}>{title}</h3>
            {subtitle && <p className={cn("mt-1 text-sm", AGENCIES.textMuted)}>{subtitle}</p>}
            {ctaLabel && href && (
              <Link href={href} className={cn("mt-3 inline-flex items-center text-sm font-medium", AGENCIES.accent, "hover:underline")}>
                {ctaLabel}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </AgencyCardBase>
  )
}

/** Bento grid – mixed size cards */
export function AgencyBentoGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {children}
    </div>
  )
}

/** Bento item – span 2 for featured */
export function AgencyBentoItem({ span = 1, className, children }: { span?: 1 | 2; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn(span === 2 ? "sm:col-span-2" : "", className)}>
      {children}
    </div>
  )
}
