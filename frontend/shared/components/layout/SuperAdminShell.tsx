/**
 * Super Admin Shell Layout
 *
 * Professional admin layout inspired by Microsoft 365 admin center.
 * Left-hand navigation with expandable sections, top header bar,
 * and consistent content area. Supports side panels for detail views.
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Crown,
  Users2,
  UserCircle2,
  PlaySquare,
  Wallet2,
  ShieldAlert,
  Flag,
  Workflow,
  Plug2,
  Menu,
  ChevronRight,
  Settings,
  HelpCircle,
  LogOut,
  FileText,
  Headphones,
  BarChart3,
  Shield,
  Layers,
  Scale,
  DollarSign,
  Puzzle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import { GlobalSearchBar } from "@/shared/components/search/GlobalSearchBar"
import { useAuth } from "@/shared/context/AuthContext"
import { cn } from "@/shared/lib/utils"

interface SuperAdminShellProps {
  children: React.ReactNode
}

interface NavSection {
  label: string
  items: {
    label: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }[]
}

const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/superadmin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content & Events",
    items: [
      { label: "Pageants", href: "/superadmin/pageants", icon: Crown },
      { label: "Talent Showcase", href: "/superadmin/talent-showcase", icon: PlaySquare },
    ],
  },
  {
    label: "Organization",
    items: [
      { label: "Tenants", href: "/superadmin/tenants", icon: Users2 },
      { label: "Users", href: "/superadmin/users", icon: UserCircle2 },
      { label: "Features", href: "/superadmin/features", icon: Flag },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Revenue & Billing", href: "/superadmin/revenue", icon: DollarSign },
      { label: "Finance & Wallets", href: "/superadmin/finance?tab=revenue", icon: Wallet2 },
      { label: "Payments", href: "/superadmin/finance?tab=payments", icon: Wallet2 },
    ],
  },
  {
    label: "Blueprints",
    items: [
      { label: "Blueprint Requests", href: "/superadmin/blueprints", icon: Puzzle },
    ],
  },
  {
    label: "Trust & Safety",
    items: [
      { label: "Trust & Safety", href: "/superadmin/governance", icon: ShieldAlert },
      { label: "Moderation", href: "/superadmin/governance?tab=moderation", icon: ShieldAlert },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Automation", href: "/superadmin/automation", icon: Layers },
      { label: "Security", href: "/superadmin/security", icon: Shield },
      { label: "Analytics", href: "/superadmin/analytics", icon: BarChart3 },
      { label: "Integrations", href: "/superadmin/integrations", icon: Plug2 },
      { label: "Operations", href: "/superadmin/operations", icon: Workflow },
      { label: "Support", href: "/superadmin/support", icon: Headphones },
      { label: "Audit log", href: "/superadmin/audit", icon: FileText },
    ],
  },
  {
    label: "Data & Legal",
    items: [
      { label: "Privacy", href: "/superadmin/data-legal/privacy", icon: Scale },
      { label: "Retention", href: "/superadmin/data-legal/retention", icon: FileText },
      { label: "Legal Hold", href: "/superadmin/data-legal/legal-hold", icon: Scale },
    ],
  },
]

export function SuperAdminShell({ children }: SuperAdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(navSections.map((s) => s.label))
  )
  const isNarrow = collapsed && !hovered
  const showFullNav = !collapsed || hovered

  React.useEffect(() => {
    const stored = localStorage.getItem("sidebarCollapsed")
    if (stored === "true") setCollapsed(true)
  }, [])

  React.useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(collapsed))
  }, [collapsed])

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar - professional left nav */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-slate-200 bg-white shadow-sm transition-[width] duration-200",
          isNarrow ? "w-[72px]" : "w-64"
        )}
        aria-label="Main navigation"
        onMouseEnter={() => collapsed && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Logo + collapse */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
              TO
            </div>
            {showFullNav && (
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold tracking-wide text-slate-800">
                  TalentOS
                </p>
                <p className="truncate text-[10px] text-slate-500">
                  Super Admin
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3" aria-label="Navigation menu">
          {navSections.map((section) => {
            const isExpanded = isNarrow || expandedSections.has(section.label)

            return (
              <div key={section.label} className="mb-1">
                {showFullNav && (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.label)}
                    className="flex w-full items-center justify-between px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  >
                    {section.label}
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        isExpanded && "rotate-90"
                      )}
                    />
                  </button>
                )}
                {isExpanded && (
                  <ul className="space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const active =
                        (item.href === "/superadmin" && pathname === "/superadmin") ||
                        (item.href !== "/superadmin" && pathname.startsWith(item.href))

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            title={isNarrow ? item.label : undefined}
                            className={cn(
                              "group flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors",
                              active
                                ? "bg-blue-50 font-medium text-blue-700"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            )}
                            aria-current={active ? "page" : undefined}
                          >
                            <span
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                active
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-700"
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            {showFullNav && (
                              <span className="truncate">{item.label}</span>
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-200 px-4 py-3">
          {showFullNav && (
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Settings className="h-3.5 w-3.5" />
              <span>Settings</span>
            </div>
          )}
          {isNarrow && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "flex min-h-screen flex-1 flex-col transition-[margin] duration-200",
          isNarrow ? "ml-[72px]" : "ml-64"
        )}
      >
        {/* Top header */}
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex flex-1 items-center gap-4">
            <GlobalSearchBar
              placeholder="Search pageants, tenants, talents..."
              className="max-w-md"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-slate-600 hover:bg-slate-100 sm:flex"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </Button>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-800">{user?.name ?? "Super Admin"}</p>
              <p className="text-xs text-slate-500">Platform owner</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:bg-slate-100"
              onClick={() => {
                logout()
                router.push("/login")
              }}
              title="Logout"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Logout
            </Button>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
              aria-label="User avatar"
            >
              SA
            </div>
          </div>
          </div>
        </header>

        {/* Page content */}
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
