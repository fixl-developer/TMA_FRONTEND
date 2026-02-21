"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { cn } from "@/shared/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  /** If true, auto-generate from pathname. Overrides items. */
  fromPath?: boolean
  /** Custom path segment labels, e.g. { "admin": "Dashboard", "users": "Users & Roles" } */
  pathLabels?: Record<string, string>
  className?: string
}

const DEFAULT_LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  users: "Users & Roles",
  teams: "Teams",
  roles: "Roles & Policies",
  talent: "Talent",
  casting: "Castings",
  events: "Events",
  settings: "Settings",
  organization: "Organization",
  wallet: "Wallet",
  finance: "Finance",
  invoices: "Invoices",
  compliance: "Compliance",
  modelling: "Modelling",
  pageant: "Pageant",
  superadmin: "Super Admin",
  tenants: "Tenants",
}

export function Breadcrumbs({
  items,
  fromPath = false,
  pathLabels = {},
  className,
}: BreadcrumbsProps) {
  const pathname = usePathname()
  const labels = { ...DEFAULT_LABELS, ...pathLabels }

  const pathItems = React.useMemo(() => {
    if (!fromPath || !pathname) return []
    const segments = pathname.split("/").filter(Boolean)
    return segments.map((seg, i) => {
      const href = "/" + segments.slice(0, i + 1).join("/")
      const label = labels[seg] ?? seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      return { label, href }
    })
  }, [pathname, fromPath, labels])

  const displayItems = items ?? pathItems
  if (displayItems.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm", className)}>
      {displayItems.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          )}
          {item.href && i < displayItems.length - 1 ? (
            <Link
              href={item.href}
              className="text-slate-500 hover:text-slate-700 transition-colors truncate max-w-[140px]"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-slate-800 truncate max-w-[140px]" aria-current="page">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
