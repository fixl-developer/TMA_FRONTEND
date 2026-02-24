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
  Users,
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
  BarChart3,
  Gauge,
  Building2,
  Lock,
  ShieldCheck,
  Clock,
  Scale,
  Globe2,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { GlobalSearchBar } from "@/shared/components/search/GlobalSearchBar"
import { cn } from "@/shared/lib/utils"

interface SuperAdminShellProps {
  children: React.ReactNode
}

interface NavItem {
  label: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: {
    label: string
    href: string
  }[]
}

interface NavSection {
  label: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "Organization",
    items: [
      { 
        label: "Tenants", 
        icon: Building2,
        children: [
          { label: "Overview", href: "/tenants" },
          { label: "Lifecycle", href: "/tenants/lifecycle" },
          { label: "Configuration", href: "/tenants/configuration" },
          { label: "Risk", href: "/tenants/risk" },
        ]
      },
      { 
        label: "Users", 
        icon: UserCircle2,
        children: [
          { label: "Overview", href: "/users" },
          { label: "Identity", href: "/users/identity" },
          { label: "Roles", href: "/users/roles" },
          { label: "Abuse", href: "/users/abuse" },
        ]
      },
      { label: "Blueprints", href: "/blueprints/catalog", icon: Layers },
      { label: "Templates", href: "/templates", icon: FileStack },
    ],
  },
  {
    label: "Platform Configuration",
    items: [
      { label: "Workflows", href: "/workflows", icon: Workflow },
      { 
        label: "Automation", 
        icon: Zap,
        children: [
          { label: "Overview", href: "/automation" },
          { label: "Workflows", href: "/automation/workflows" },
          { label: "Policies", href: "/automation/policies" },
          { label: "Controls", href: "/automation/controls" },
        ]
      },
      { label: "RBAC", href: "/rbac/roles", icon: Shield },
      { 
        label: "Features", 
        icon: Flag,
        children: [
          { label: "Overview", href: "/features" },
          { label: "Flags", href: "/features/flags" },
          { label: "Rollouts", href: "/features/rollouts" },
          { label: "Config", href: "/features/config" },
        ]
      },
      { label: "Governance", href: "/governance", icon: Lock },
    ],
  },
  {
    label: "Finance & Revenue",
    items: [
      { label: "Finance", href: "/finance", icon: Wallet2 },
      { 
        label: "Revenue", 
        icon: TrendingUp,
        children: [
          { label: "Overview", href: "/finance/revenue" },
          { label: "Billing", href: "/revenue/billing" },
          { label: "Fees", href: "/revenue/fees" },
          { label: "Reports", href: "/revenue/reports" },
        ]
      },
      { label: "Commissions", href: "/commissions", icon: DollarSign },
      { label: "Reconciliation", href: "/reconciliation", icon: FileText },
      { 
        label: "Payments", 
        icon: Wallet2,
        children: [
          { label: "Wallets", href: "/payments/wallets" },
          { label: "Escrow", href: "/payments/escrow" },
          { label: "Risk", href: "/payments/risk" },
        ]
      },
    ],
  },
  {
    label: "Trust & Safety",
    items: [
      { 
        label: "Fraud Detection", 
        icon: ShieldAlert,
        children: [
          { label: "Dashboard", href: "/fraud/dashboard" },
          { label: "Signals", href: "/fraud/signals" },
          { label: "Models", href: "/fraud/models" },
          { label: "Patterns", href: "/fraud/patterns" },
          { label: "Responses", href: "/fraud/responses" },
          { label: "Thresholds", href: "/fraud/thresholds" },
        ]
      },
      { 
        label: "Moderation", 
        icon: Shield,
        children: [
          { label: "Queue", href: "/moderation/queue" },
          { label: "Rules", href: "/moderation/rules" },
          { label: "Appeals", href: "/moderation/appeals" },
          { label: "Moderators", href: "/moderation/moderators" },
          { label: "Analytics", href: "/moderation/analytics" },
        ]
      },
    ],
  },
  {
    label: "Analytics & Monitoring",
    items: [
      { label: "System Health", href: "/health", icon: Activity },
      { 
        label: "Analytics", 
        icon: BarChart3,
        children: [
          { label: "Platform", href: "/analytics/platform" },
          { label: "Tenants", href: "/analytics/tenants" },
          { label: "Revenue", href: "/analytics/revenue" },
          { label: "Reports", href: "/analytics/reports" },
        ]
      },
      { 
        label: "WES", 
        icon: Gauge,
        children: [
          { label: "Dashboard", href: "/wes" },
          { label: "Executions", href: "/wes/executions" },
          { label: "Analytics", href: "/wes/analytics" },
          { label: "Bottlenecks", href: "/wes/bottlenecks" },
          { label: "KPIs", href: "/wes/kpis" },
        ]
      },
    ],
  },
  {
    label: "Content & Events",
    items: [
      { label: "Pageants", href: "/pageants", icon: Crown },
      { label: "Talent Showcase", href: "/talent-showcase", icon: PlaySquare },
  {
    label: "Content & Events",
    items: [
      { label: "Pageants", href: "/pageants", icon: Crown },
      { label: "Talent Showcase", href: "/talent-showcase", icon: PlaySquare },
      { label: "Announcements", href: "/announcements", icon: Megaphone },
      { label: "Notifications", href: "/notifications", icon: Bell },
    ],
  },
  {
    label: "Collaboration",
    items: [
      { label: "Requests", href: "/collaboration/requests", icon: Users },
      { label: "Rooms", href: "/collaboration/rooms", icon: Building2 },
      { label: "Contracts", href: "/collaboration/contracts", icon: FileText },
      { label: "Escrow", href: "/collaboration/escrow", icon: Shield },
      { label: "Analytics", href: "/collaboration/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Compliance & Legal",
    items: [
      { label: "DSR Requests", href: "/compliance/dsr", icon: ShieldCheck },
      { label: "Legal Holds", href: "/compliance/legal-holds", icon: Lock },
      { 
        label: "Retention", 
        icon: Clock,
        children: [
          { label: "Policies", href: "/compliance/retention/policies" },
          { label: "Schedules", href: "/compliance/retention/schedules" },
          { label: "Lifecycle", href: "/compliance/retention/lifecycle" },
        ]
      },
    ],
  },
  {
    label: "Operations & Integrations",
    items: [
      { label: "Operations", href: "/operations", icon: Workflow },
      { 
        label: "Integrations", 
        icon: Plug2,
        children: [
          { label: "Overview", href: "/integrations" },
          { label: "API Usage", href: "/integrations/api/usage" },
          { label: "API Rate Limits", href: "/integrations/api/rate-limits" },
          { label: "API Versions", href: "/integrations/api/versions" },
          { label: "API Keys", href: "/integrations/api/keys" },
          { label: "Webhooks", href: "/integrations/webhooks" },
          { label: "Payments", href: "/integrations/payments" },
        ]
      },
      { label: "CLM", href: "/clm", icon: FileText },
      { 
        label: "Configuration", 
        icon: Settings,
        children: [
          { label: "Global Settings", href: "/config/global" },
          { label: "Feature Flags", href: "/config/features" },
          { label: "Environments", href: "/config/environments" },
          { label: "Deployments", href: "/config/deployments" },
        ]
      },
      { 
        label: "Backup & Recovery", 
        icon: Shield,
        children: [
          { label: "Configuration", href: "/backup/config" },
          { label: "Schedule", href: "/backup/schedule" },
          { label: "Restore", href: "/backup/restore" },
          { label: "Verification", href: "/backup/verification" },
        ]
      },
      { 
        label: "Onboarding", 
        icon: Gauge,
        children: [
          { label: "Wizard", href: "/onboarding/wizard" },
          { label: "Progress", href: "/onboarding/progress" },
          { label: "Verification", href: "/onboarding/verification" },
        ]
      },
    ],
  },
]

export function SuperAdminShell({ children }: SuperAdminShellProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(navSections.map((s) => s.label))
  )
  const [expandedParents, setExpandedParents] = React.useState<Set<string>>(new Set())

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

  const toggleParent = (label: string) => {
    setExpandedParents((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5] text-[#323130]">
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
        <aside
          className={cn(
            "fixed left-0 top-14 z-20 flex h-[calc(100vh-3.5rem)] flex-col border-r border-[#d1d1d1] bg-[#edebe9] transition-[width] duration-200",
            collapsed ? "w-[72px]" : "w-64"
          )}
          aria-label="Main navigation"
        >
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
                        const hasChildren = item.children && item.children.length > 0
                        const isParentExpanded = expandedParents.has(item.label)
                        
                        // Check if any child is active
                        const isChildActive = hasChildren && item.children?.some(child => 
                          pathname === child.href || pathname.startsWith(child.href + "/")
                        )
                        
                        const isDirectActive = item.href && (
                          pathname === item.href ||
                          (item.href !== "/" && pathname.startsWith(item.href + "/"))
                        )

                        if (hasChildren) {
                          // Parent item with children
                          return (
                            <li key={item.label}>
                              <button
                                type="button"
                                onClick={() => toggleParent(item.label)}
                                className={cn(
                                  "group relative flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors",
                                  isChildActive
                                    ? "bg-[#e3f2fd] font-semibold text-[#0078d4]"
                                    : "text-[#605e5c] hover:bg-[#e1dfdd] hover:text-[#323130]"
                                )}
                              >
                                {isChildActive && (
                                  <span className="absolute left-0 top-0 h-full w-1 bg-[#0078d4]" />
                                )}
                                <span
                                  className={cn(
                                    "flex h-5 w-5 shrink-0 items-center justify-center",
                                    isChildActive ? "text-[#0078d4]" : "text-[#605e5c]"
                                  )}
                                >
                                  <Icon className="h-5 w-5" />
                                </span>
                                {!collapsed && (
                                  <>
                                    <span className="flex-1 truncate">{item.label}</span>
                                    <ChevronRight
                                      className={cn(
                                        "h-3.5 w-3.5 transition-transform",
                                        isParentExpanded && "rotate-90"
                                      )}
                                    />
                                  </>
                                )}
                              </button>
                              {!collapsed && isParentExpanded && (
                                <ul className="ml-8 mt-0.5 space-y-0.5 border-l-2 border-[#d1d1d1] pl-2">
                                  {item.children?.map((child) => {
                                    const isActive = pathname === child.href || 
                                      (child.href !== "/" && pathname.startsWith(child.href + "/"))
                                    
                                    return (
                                      <li key={child.href}>
                                        <Link
                                          href={child.href}
                                          className={cn(
                                            "block rounded px-3 py-1.5 text-sm transition-colors",
                                            isActive
                                              ? "bg-[#e3f2fd] font-semibold text-[#0078d4]"
                                              : "text-[#605e5c] hover:bg-[#e1dfdd] hover:text-[#323130]"
                                          )}
                                        >
                                          {child.label}
                                        </Link>
                                      </li>
                                    )
                                  })}
                                </ul>
                              )}
                            </li>
                          )
                        } else {
                          // Regular item without children
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href!}
                                title={collapsed ? item.label : undefined}
                                className={cn(
                                  "group relative flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                                  isDirectActive
                                    ? "bg-[#e3f2fd] font-semibold text-[#0078d4]"
                                    : "text-[#605e5c] hover:bg-[#e1dfdd] hover:text-[#323130]"
                                )}
                                aria-current={isDirectActive ? "page" : undefined}
                              >
                                {isDirectActive && (
                                  <span className="absolute left-0 top-0 h-full w-1 bg-[#0078d4]" />
                                )}
                                <span
                                  className={cn(
                                    "flex h-5 w-5 shrink-0 items-center justify-center",
                                    isDirectActive ? "text-[#0078d4]" : "text-[#605e5c]"
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
                        }
                      })}
                    </ul>
                  )}
                </div>
              )
            })}
          </nav>

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

        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col transition-[margin] duration-200",
            collapsed ? "ml-[72px]" : "ml-64"
          )}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
