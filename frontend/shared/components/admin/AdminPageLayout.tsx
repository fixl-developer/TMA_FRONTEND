/**
 * AdminPageLayout - Microsoft 365 Style
 * Reusable layout component for all admin pages
 */

import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"

interface AdminPageLayoutProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

export function AdminPageLayout({ title, subtitle, actions, children }: AdminPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-[1600px]">
        {/* Page Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  )
}

interface AdminStatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  color?: "blue" | "green" | "yellow" | "red" | "purple"
  subtitle?: string
  trend?: {
    value: string
    direction: "up" | "down"
  }
}

export function AdminStatCard({ label, value, icon: Icon, color = "blue", subtitle, trend }: AdminStatCardProps) {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
    purple: "text-purple-600",
  }

  const trendColorClasses = {
    up: "text-green-600",
    down: "text-red-600",
  }

  return (
    <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-600">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <Icon className={`h-5 w-5 ${colorClasses[color]}`} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs ${trendColorClasses[trend.direction]}`}>
          <span className="font-semibold">{trend.value}</span>
        </div>
      )}
    </div>
  )
}

interface AdminCardProps {
  title?: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function AdminCard({ title, subtitle, actions, children, className = "" }: AdminCardProps) {
  return (
    <div className={`rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      {(title || actions) && (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div>
            {title && <h2 className="text-sm font-semibold text-gray-900">{title}</h2>}
            {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

interface AdminTableProps {
  headers: string[]
  children: ReactNode
  emptyState?: ReactNode
}

export function AdminTable({ headers, children, emptyState }: AdminTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      {!children && emptyState}
    </div>
  )
}

interface AdminTableRowProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function AdminTableRow({ children, onClick, className = "" }: AdminTableRowProps) {
  return (
    <tr
      className={`border-b border-gray-200 transition-colors hover:bg-gray-50 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

interface AdminButtonProps {
  children: ReactNode
  onClick?: (e: React.MouseEvent) => void
  variant?: "primary" | "secondary" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  className?: string
}

export function AdminButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  className = "",
}: AdminButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variantClasses = {
    primary: "border border-blue-600 bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border border-blue-600 bg-white text-blue-600 hover:bg-gray-50",
    danger: "border border-red-600 bg-white text-red-600 hover:bg-red-50",
    ghost: "text-blue-600 hover:bg-gray-50",
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-xs",
    lg: "px-6 py-3 text-sm",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  )
}

interface AdminBadgeProps {
  children: ReactNode
  variant?: "default" | "success" | "warning" | "danger" | "info"
}

export function AdminBadge({ children, variant = "default" }: AdminBadgeProps) {
  const variantClasses = {
    default: "border-gray-600 bg-gray-100 text-gray-900",
    success: "border-green-600 bg-green-50 text-green-600",
    warning: "border-yellow-600 bg-yellow-50 text-yellow-700",
    danger: "border-red-600 bg-red-50 text-red-600",
    info: "border-blue-600 bg-blue-50 text-blue-600",
  }

  return (
    <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-semibold ${variantClasses[variant]}`}>
      {children}
    </span>
  )
}

interface AdminEmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function AdminEmptyState({ icon: Icon, title, description, action }: AdminEmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
      {description && <p className="text-xs text-gray-600 mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}

interface AdminSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function AdminSearchBar({ value, onChange, placeholder = "Search..." }: AdminSearchBarProps) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-64 rounded border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
      />
    </div>
  )
}

interface AdminLoadingProps {
  rows?: number
}

export function AdminLoading({ rows = 4 }: AdminLoadingProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded bg-gray-100" />
      ))}
    </div>
  )
}

interface AdminStatsGridProps {
  children: ReactNode
  columns?: 2 | 3 | 4
}

export function AdminStatsGrid({ children, columns = 4 }: AdminStatsGridProps) {
  const colClasses = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }

  return <div className={`mb-6 grid grid-cols-1 gap-4 ${colClasses[columns]}`}>{children}</div>
}
