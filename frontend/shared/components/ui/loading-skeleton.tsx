/**
 * Loading Skeleton - Phase 1 Design System
 *
 * Placeholder for loading states.
 */

import * as React from "react"
import { cn } from "@/shared/lib/utils"

export function LoadingSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
      {...props}
    />
  )
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-4">
          <LoadingSkeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <LoadingSkeleton className="mb-4 h-6 w-1/3" />
      <LoadingSkeleton className="mb-2 h-4 w-full" />
      <LoadingSkeleton className="mb-2 h-4 w-4/5" />
      <LoadingSkeleton className="h-4 w-2/3" />
    </div>
  )
}

/** Skeleton matching InteractiveMetricCard layout for dashboard metrics */
export function MetricCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-amber-50 p-6 shadow-lg shadow-slate-200/60">
      <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-slate-200/40" />
      <div className="relative flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="mt-3 h-8 w-16" />
          <LoadingSkeleton className="mt-1 h-3 w-20" />
        </div>
        <LoadingSkeleton className="h-14 w-14 shrink-0 rounded-2xl" />
      </div>
    </div>
  )
}

/** Skeleton for list rows (e.g. projects, castings) */
export function ListRowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-200 p-4">
          <LoadingSkeleton className="h-10 w-10 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <LoadingSkeleton className="h-4 w-2/3" />
            <LoadingSkeleton className="h-3 w-1/2" />
          </div>
          <LoadingSkeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}
