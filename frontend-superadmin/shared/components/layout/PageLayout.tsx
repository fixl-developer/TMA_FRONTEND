/**
 * PageLayout - Consistent page structure for Super Admin
 *
 * Professional layout wrapper inspired by Microsoft 365 admin center.
 * Provides consistent header, content area, and spacing across all pages.
 */

import * as React from "react"
import { cn } from "@/shared/lib/utils"

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <main
      className={cn(
        "min-h-full bg-slate-50",
        className
      )}
    >
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  )
}

interface PageHeaderProps {
  title: string
  description?: string
  badge?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        {badge && (
          <div className="mb-2">{badge}</div>
        )}
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  )
}

interface PageSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function PageSection({
  title,
  description,
  children,
  className,
}: PageSectionProps) {
  return (
    <section className={cn("mb-8", className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-sm font-semibold text-slate-800 sm:text-base">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

interface MetricsGridProps {
  children: React.ReactNode
  className?: string
}

export function MetricsGrid({ children, className }: MetricsGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  )
}
