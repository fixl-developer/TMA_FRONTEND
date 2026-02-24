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
  PlugZap,
  Menu,
  ChevronRight,
  Settings,
  HelpCircle,
  Zap,
  DollarSign,
  FileText,
  Shield,
  Activity,
  Megaphone,
  Bell,
  BarChart3,
  Gauge,
  GitBranch,
  KeyRound,
  TrendingUp,
  Layers,
  FileStack,
  Globe2,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { GlobalSearchBar } from "@/shared/components/search/GlobalSearchBar"
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
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content & Events",
    items: [
      { label: "Pageants", href: "/pageants", icon: Crown },
      { label: "Talent Showcase", href: "/talent-showcase", icon: PlaySquare },
    ],
  },
  {
    label: "Organization",
    items: [
      { label: "Tenants", href: "/tenants", icon: Users2 },
      { label: "Blueprints", href: "/blueprints/catalog", icon: Layers },
      { label: "Templates", href: "/templates", icon: FileStack },
      { label: "Users", href: "/users", icon: UserCircle2 },
      { label: "Onboarding wizard", href: "/onboarding/wizard", icon: Gauge },
      { label: "Onboarding progress", href: "/onboarding/progress", icon: Activity },
      { label: "Onboarding verification", href: "/onboarding/verification", icon: Shield },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Workflows", href: "/workflows", icon: Workflow },
      { label: "Automation", href: "/automation", icon: Zap },
      { label: "Finance", href: "/finance", icon: Wallet2 },
      { label: "Revenue", href: "/finance/revenue", icon: TrendingUp },
      { label: "Commissions", href: "/commissions", icon: DollarSign },
      { label: "Reconciliation", href: "/reconciliation", icon: FileText },
      { label: "Fraud & Risk", href: "/fraud", icon: ShieldAlert },
      { label: "CLM", href: "/clm", icon: FileText },
      { label: "RBAC", href: "/rbac/roles", icon: Shield },
      { label: "System Health", href: "/health", icon: Activity },
      { label: "Backup & Recovery", href: "/backup/config", icon: Shield },
      { label: "Global config", href: "/config/global", icon: Settings },
      { label: "Feature flags", href: "/config/features", icon: Flag },
      { label: "Environments", href: "/config/environments", icon: Globe2 },
      { label: "Deployments", href: "/config/deployments", icon: GitBranch },
      { label: "Governance", href: "/governance", icon: ShieldAlert },
      { label: "Operations", href: "/operations", icon: Workflow },
      { label: "WES Dashboard", href: "/wes", icon: Zap },
      { label: "Announcements", href: "/announcements", icon: Megaphone },
      { label: "Notifications", href: "/notifications", icon: Bell },
      { label: "Integrations", href: "/integrations", icon: Plug2 },
      { label: "API usage", href: "/integrations/api/usage", icon: BarChart3 },
      { label: "API rate limits", href: "/integrations/api/rate-limits", icon: Gauge },
      { label: "API versions", href: "/integrations/api/versions", icon: GitBranch },
      { label: "API keys", href: "/integrations/api/keys", icon: KeyRound },
      { label: "Webhooks", href: "/integrations/webhooks", icon: PlugZap },
    ],
  },
]

export function SuperAdminShell({ children }: SuperAdminShellProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(navSections.map((s) => s.label))
  )

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
    <div className="flex min-h-screen flex-col bg-[#f5f5f5] text-[#323130]">
      {/* Top header - Full width Microsoft blue style */}
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 bg-[#0078d4] px-4 sm:px-6">
        <div className="flex flex-1 items-center gap-4 min-w-0">
          <h1 className="text-sm font-semibold text-white whitespace-nowrap">TalentOS Super Admin</h1>
          <div className="flex-1 max-w-2xl">
            <GlobalSearchBar
              placeholder="Search pageants, tenants, talents..."
              className="w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-[#106ebe]"
            title="Notifications"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-[#106ebe]"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-[#106ebe]"
            title="Help"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
          <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#0078d4]">
            SA
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar - Microsoft style with light gray background */}
        <aside
          className={cn(
            "fixed left-0 top-14 z-20 flex h-[calc(100vh-3.5rem)] flex-col border-r border-[#d1d1d1] bg-[#edebe9] transition-[width] duration-200",
            collapsed ? "w-[72px]" : "w-64"
          )}
          aria-label="Main navigation"
        >
          {/* Collapse button at top of sidebar */}
          <div className="flex h-12 shrink-0 items-center border-b border-[#d1d1d1] px-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-[#605e5c] hover:bg-[#e1dfdd] hover:text-[#323130]"
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-hide" aria-label="Navigation menu">
          {navSections.map((section) => {
            const isExpanded = collapsed || expandedSections.has(section.label)

            return (
              <div key={section.label} className="mb-1">
                {!collapsed && (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.label)}
                    className="flex w-full items-center justify-between px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-[#605e5c] hover:bg-[#e1dfdd]"
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
                      // More precise active matching - exact match or child route
                      const active =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href + "/"))

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={cn(
                              "group relative flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                              active
                                ? "bg-[#e3f2fd] font-semibold text-[#0078d4]"
                                : "text-[#605e5c] hover:bg-[#e1dfdd] hover:text-[#323130]"
                            )}
                            aria-current={active ? "page" : undefined}
                          >
                            {/* Blue left border for active item */}
                            {active && (
                              <span className="absolute left-0 top-0 h-full w-1 bg-[#0078d4]" />
                            )}
                            <span
                              className={cn(
                                "flex h-5 w-5 shrink-0 items-center justify-center",
                                active ? "text-[#0078d4]" : "text-[#605e5c]"
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </span>
                            {!collapsed && (
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
        <div className="shrink-0 border-t border-[#d1d1d1] px-4 py-3">
          {!collapsed && (
            <div className="flex items-center gap-2 text-[11px] text-[#605e5c] hover:text-[#323130] cursor-pointer">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </div>
          )}
          {collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#605e5c] hover:bg-[#e1dfdd]"
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
          "flex min-h-0 flex-1 flex-col transition-[margin] duration-200",
          collapsed ? "ml-[72px]" : "ml-64"
        )}
      >
        {/* Page content */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
    </div>
  )
}
