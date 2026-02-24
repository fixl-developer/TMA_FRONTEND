"use client"

import * as React from "react"
import { cn } from "@/shared/lib/utils"

interface AdminPageWrapperProps {
  children: React.ReactNode
  className?: string
  /** Remove default padding */
  noPadding?: boolean
}

/**
 * Wrapper component for all admin pages with theme support
 * Provides consistent background and spacing
 * Dark theme: purple gradient
 * Light theme: professional gray
 */
export function AdminPageWrapper({ children, className, noPadding = false }: AdminPageWrapperProps) {
  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        // Dark theme (default)
        "bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c]",
        // Light theme - professional gray
        "admin-light-theme:bg-gray-50",
        !noPadding && "p-4 sm:p-6 lg:p-8",
        className
      )}
    >
      <div className="mx-auto max-w-[1600px]">
        {children}
      </div>
    </div>
  )
}

interface AdminCardProps {
  children: React.ReactNode
  className?: string
  /** Hover effect */
  hoverable?: boolean
  /** Click handler */
  onClick?: () => void
}

/**
 * Card component for admin pages with Microsoft 365 style
 */
export function AdminCard({ children, className, hoverable = false, onClick }: AdminCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-6 transition-colors duration-300",
        // Dark theme
        "border-white/10 bg-white/5",
        // Light theme - Microsoft 365 style
        "admin-light-theme:border-gray-200 admin-light-theme:bg-white admin-light-theme:shadow-sm",
        hoverable && "transition-all cursor-pointer",
        hoverable && "hover:border-white/20 hover:bg-white/10",
        hoverable && "admin-light-theme:hover:border-gray-300 admin-light-theme:hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface AdminSectionHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

/**
 * Section header for admin pages with Microsoft 365 style
 */
export function AdminSectionHeader({ title, subtitle, action, className }: AdminSectionHeaderProps) {
  return (
    <div className={cn("mb-6 flex items-start justify-between gap-4", className)}>
      <div>
        <h2 className="text-2xl font-bold text-white admin-light-theme:text-gray-900 transition-colors duration-300">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-white/60 admin-light-theme:text-gray-600 transition-colors duration-300">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

interface AdminStatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ElementType
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  color?: "purple" | "blue" | "pink" | "yellow" | "green"
  className?: string
}

/**
 * Stat card for admin pages with theme support
 */
export function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = "purple",
  className,
}: AdminStatCardProps) {
  const colorMap = {
    purple: {
      bg: "from-purple-400/20 to-pink-400/20",
      icon: "bg-purple-500/10 text-purple-400",
      iconLight: "admin-light-theme:bg-purple-100 admin-light-theme:text-purple-600"
    },
    blue: {
      bg: "from-blue-400/20 to-cyan-400/20",
      icon: "bg-blue-500/10 text-blue-400",
      iconLight: "admin-light-theme:bg-blue-100 admin-light-theme:text-blue-600"
    },
    pink: {
      bg: "from-pink-400/20 to-rose-400/20",
      icon: "bg-pink-500/10 text-pink-400",
      iconLight: "admin-light-theme:bg-pink-100 admin-light-theme:text-pink-600"
    },
    yellow: {
      bg: "from-yellow-400/20 to-amber-400/20",
      icon: "bg-yellow-500/10 text-yellow-400",
      iconLight: "admin-light-theme:bg-yellow-100 admin-light-theme:text-yellow-600"
    },
    green: {
      bg: "from-emerald-400/20 to-teal-400/20",
      icon: "bg-emerald-500/10 text-emerald-400",
      iconLight: "admin-light-theme:bg-emerald-100 admin-light-theme:text-emerald-600"
    },
  }

  const colors = colorMap[color]

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-6 backdrop-blur-md transition-all",
        // Dark theme
        "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
        // Light theme
        "admin-light-theme:border-slate-200 admin-light-theme:bg-white admin-light-theme:shadow-sm admin-light-theme:hover:border-slate-300 admin-light-theme:hover:shadow-md",
        className
      )}
    >
      <div className={cn("absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br blur-2xl", colors.bg)} />
      <div className="relative">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/50 admin-light-theme:text-slate-500 transition-colors">{title}</p>
            {subtitle && <p className="mt-1 text-sm text-white/60 admin-light-theme:text-slate-600 transition-colors">{subtitle}</p>}
          </div>
          {Icon && (
            <div className={cn("rounded-lg p-2 transition-colors", colors.icon, colors.iconLight)}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-3">
          <p className="text-4xl font-bold text-white admin-light-theme:text-slate-900 transition-colors">{value}</p>
          {trend && trendValue && (
            <span
              className={cn(
                "flex items-center gap-1 text-sm font-semibold transition-colors",
                trend === "up"
                  ? "text-emerald-400 admin-light-theme:text-emerald-600"
                  : trend === "down"
                    ? "text-rose-400 admin-light-theme:text-rose-600"
                    : "text-white/50 admin-light-theme:text-slate-500"
              )}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"}
              {trendValue}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

interface AdminTableProps {
  headers: string[]
  children: React.ReactNode
  className?: string
}

/**
 * Table component for admin pages with theme support
 */
export function AdminTable({ headers, children, className }: AdminTableProps) {
  return (
    <div className={cn(
      "overflow-hidden rounded-2xl border transition-colors",
      "border-white/10",
      "admin-light-theme:border-slate-200",
      className
    )}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={cn(
              "border-b transition-colors",
              "border-white/10 bg-white/5",
              "admin-light-theme:border-slate-200 admin-light-theme:bg-slate-50"
            )}>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-white/50 admin-light-theme:text-slate-600 transition-colors"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  )
}

interface AdminTableRowProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

/**
 * Table row component with theme support
 */
export function AdminTableRow({ children, onClick, className }: AdminTableRowProps) {
  return (
    <tr
      className={cn(
        "border-b transition-colors",
        "border-white/5 hover:bg-white/5",
        "admin-light-theme:border-slate-100 admin-light-theme:hover:bg-slate-50",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

/**
 * Button component for admin pages with theme support
 */
export function AdminButton({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: AdminButtonProps) {
  const variants = {
    primary: cn(
      "bg-[#d4ff00] text-black hover:bg-[#b8e600] shadow-lg shadow-[#d4ff00]/30",
      "admin-light-theme:bg-[#d4ff00] admin-light-theme:text-black admin-light-theme:hover:bg-[#b8e600]"
    ),
    secondary: cn(
      "bg-white/10 text-white hover:bg-white/20 border border-white/20",
      "admin-light-theme:bg-slate-100 admin-light-theme:text-slate-700 admin-light-theme:hover:bg-slate-200 admin-light-theme:border-slate-300"
    ),
    ghost: cn(
      "bg-transparent text-white/70 hover:bg-white/10 hover:text-white",
      "admin-light-theme:text-slate-600 admin-light-theme:hover:bg-slate-100 admin-light-theme:hover:text-slate-900"
    ),
    danger: cn(
      "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30",
      "admin-light-theme:bg-rose-100 admin-light-theme:text-rose-700 admin-light-theme:hover:bg-rose-200 admin-light-theme:border-rose-300"
    ),
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }

  return (
    <button
      className={cn(
        "rounded-lg font-semibold transition-all",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface AdminBadgeProps {
  children: React.ReactNode
  variant?: "success" | "warning" | "danger" | "info" | "default"
  className?: string
}

/**
 * Badge component for status indicators with theme support
 */
export function AdminBadge({ children, variant = "default", className }: AdminBadgeProps) {
  const variants = {
    success: cn(
      "bg-emerald-500/20 text-emerald-400",
      "admin-light-theme:bg-emerald-100 admin-light-theme:text-emerald-700"
    ),
    warning: cn(
      "bg-yellow-500/20 text-yellow-400",
      "admin-light-theme:bg-yellow-100 admin-light-theme:text-yellow-700"
    ),
    danger: cn(
      "bg-rose-500/20 text-rose-400",
      "admin-light-theme:bg-rose-100 admin-light-theme:text-rose-700"
    ),
    info: cn(
      "bg-blue-500/20 text-blue-400",
      "admin-light-theme:bg-blue-100 admin-light-theme:text-blue-700"
    ),
    default: cn(
      "bg-white/10 text-white/70",
      "admin-light-theme:bg-slate-100 admin-light-theme:text-slate-700"
    ),
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

interface AdminEmptyStateProps {
  icon?: React.ElementType
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

/**
 * Table skeleton for loading states (replaces "Loading…" text)
 */
export function AdminTableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className={cn(
                "h-4 animate-pulse rounded-md",
                j === 0 ? "w-1/4" : j === cols - 1 ? "w-16" : "flex-1"
              )}
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Empty state component with theme support
 */
export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: AdminEmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {Icon && (
        <div className={cn(
          "mb-4 rounded-full p-6 transition-colors",
          "bg-white/5",
          "admin-light-theme:bg-slate-100"
        )}>
          <Icon className={cn(
            "h-12 w-12 transition-colors",
            "text-white/30",
            "admin-light-theme:text-slate-400"
          )} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-white admin-light-theme:text-slate-900 transition-colors">{title}</h3>
      {description && <p className="mt-2 text-sm text-white/60 admin-light-theme:text-slate-600 transition-colors">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

interface AdminPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

/**
 * Pagination component for admin tables
 */
export function AdminPagination({ page, totalPages, onPageChange, className }: AdminPaginationProps) {
  if (totalPages <= 1) return null
  return (
    <div className={cn("flex items-center justify-between text-sm", className)}>
      <span className="text-white/40 admin-light-theme:text-slate-500">
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/60 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 admin-light-theme:border-slate-200 admin-light-theme:text-slate-600"
        >
          ← Prev
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "min-w-[2rem] rounded-lg border px-3 py-1.5 text-sm transition",
                p === page
                  ? "border-blue-500 bg-blue-500/20 text-blue-300"
                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 admin-light-theme:border-slate-200 admin-light-theme:text-slate-600"
              )}
            >
              {p}
            </button>
          )
        })}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/60 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 admin-light-theme:border-slate-200 admin-light-theme:text-slate-600"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

interface AdminSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

/**
 * Search bar with consistent styling
 */
export function AdminSearchBar({ value, onChange, placeholder = "Search...", className }: AdminSearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 admin-light-theme:text-slate-400"
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border py-2 pl-10 pr-4 text-sm outline-none transition",
          "border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:ring-1 focus:ring-blue-500",
          "admin-light-theme:border-slate-200 admin-light-theme:bg-white admin-light-theme:text-slate-900 admin-light-theme:placeholder:text-slate-400"
        )}
      />
    </div>
  )
}
