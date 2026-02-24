"use client"

import * as React from "react"
import Link from "next/link"
import { ROLE_DASHBOARD_CONFIG } from "@/shared/config/roleDashboardConfig"
import { DashboardThemeProvider } from "@/shared/context/DashboardThemeContext"
import { AdminThemeProvider, useAdminTheme } from "@/shared/context/AdminThemeContext"
import { ColorModeProvider, type ColorMode } from "@/shared/context/ColorModeContext"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  Users2,
  ShieldCheck,
  FolderKanban,
  Users,
  Truck,
  FileSearch,
  Package,
  MessageSquare,
  Bell,
  Activity,
  Shield,
  KeyRound,
  Layers,
  Settings,
  AlertTriangle,
  Menu,
  ChevronRight,
  UserCircle2,
  Megaphone,
  Crown,
  Sparkles,
  GraduationCap,
  Wallet,
  LogOut,
  ImageIcon,
  Gift,
  MessageCircle,
  Link2,
  FileText,
  HelpCircle,
  Store,
  Sun,
  Moon,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useAuth } from "@/shared/context/AuthContext"
import { seedUsers } from "@/data/seed"
import { TenantSwitcher } from "@/shared/components/layout/TenantSwitcher"
import { NotificationsDropdown } from "@/shared/components/layout/NotificationsDropdown"
import { Breadcrumbs } from "@/shared/components/ui/breadcrumbs"
import { cn } from "@/shared/lib/utils"
import { getRoleLabel } from "@/shared/lib/roles"
import { LocaleSwitcher } from "@/shared/components/ui/LocaleSwitcher"
import {
  cycleSidebarRailStyle,
  getRailItemClass,
  getSidebarRailStyleLabel,
  getSidebarRailStyle,
  saveSidebarRailStyle,
  type SidebarRailStyle,
} from "@/shared/lib/sidebarRailStyle"

const BASE = "/admin"
const s = ROLE_DASHBOARD_CONFIG.admin.sidebar

/** Roles that can see each section. Empty = all roles. blueprintId = only visible when blueprint is active. */
type NavSection = { label: string; roles?: string[]; blueprintId?: string; items: { label: string; href: string; icon: any }[] }
const navSections: NavSection[] = [
  {
    label: "Overview", items: [
      { label: "Dashboard", href: BASE, icon: LayoutDashboard },
      { label: "Analytics", href: `${BASE}/dashboards/analytics`, icon: BarChart3 },
      { label: "Reports", href: `${BASE}/reports`, icon: BarChart3 },
      { label: "Integrations", href: `${BASE}/integrations`, icon: BarChart3 },
      { label: "Audit log", href: `${BASE}/audit-log`, icon: BarChart3 },
    ]
  },
  {
    label: "Tenant Management", roles: ["admin"], items: [
      { label: "Organization", href: `${BASE}/organization`, icon: Building2 },
      { label: "Franchise", href: `${BASE}/franchise`, icon: Building2 },
      { label: "Users & Roles", href: `${BASE}/users`, icon: Users2 },
      { label: "Teams", href: `${BASE}/teams`, icon: Users2 },
      { label: "Roles & Policies", href: `${BASE}/roles`, icon: KeyRound },
      { label: "Blueprints", href: `${BASE}/blueprints`, icon: Layers },
      { label: "Compliance", href: `${BASE}/compliance`, icon: ShieldCheck },
    ]
  },
  {
    label: "CRM", roles: ["admin"], items: [
      { label: "CRM", href: `${BASE}/crm`, icon: Building2 },
      { label: "Leads", href: `${BASE}/crm/leads`, icon: Users2 },
      { label: "Accounts", href: `${BASE}/crm/accounts`, icon: Building2 },
      { label: "Contacts", href: `${BASE}/crm/contacts`, icon: Users2 },
      { label: "Activities", href: `${BASE}/crm/activities`, icon: Building2 },
      { label: "Segments", href: `${BASE}/crm/segments`, icon: Building2 },
    ]
  },
  { label: "Talent", items: [{ label: "Talent", href: `${BASE}/talent`, icon: UserCircle2 }] },
  {
    label: "Casting & Auditions", blueprintId: "B2", items: [
      { label: "Castings", href: `${BASE}/casting`, icon: Megaphone },
      { label: "Client viewer", href: `${BASE}/casting/viewer`, icon: Users2 },
    ]
  },
  {
    label: "Pageants & Events", blueprintId: "B3", items: [
      { label: "Events", href: `${BASE}/events`, icon: Crown },
      { label: "Shift rosters", href: `${BASE}/shifts`, icon: Users },
    ]
  },
  {
    label: "Work Management", roles: ["admin"], items: [
      { label: "Projects", href: `${BASE}/projects`, icon: FolderKanban },
    ]
  },
  {
    label: "Resources", roles: ["admin"], items: [
      { label: "Resources", href: `${BASE}/resources`, icon: Users },
      { label: "Availability", href: `${BASE}/resources/availability`, icon: Users },
      { label: "Assignments", href: `${BASE}/resources/assignments`, icon: Users },
      { label: "Utilization", href: `${BASE}/resources/utilization`, icon: Users },
      { label: "Conflicts", href: `${BASE}/resources/conflicts`, icon: Users },
    ]
  },
  {
    label: "Marketplace", roles: ["admin"], blueprintId: "B9", items: [
      { label: "Listings", href: `${BASE}/marketplace`, icon: Store },
      { label: "Bookings", href: `${BASE}/marketplace/bookings`, icon: FileText },
      { label: "Reviews", href: `${BASE}/marketplace/reviews`, icon: MessageSquare },
    ]
  },
  {
    label: "Vendors & Procurement", roles: ["admin"], items: [
      { label: "Vendors", href: `${BASE}/vendors`, icon: Truck },
      { label: "RFQs", href: `${BASE}/procurement/rfqs`, icon: FileSearch },
      { label: "Purchase Orders", href: `${BASE}/procurement/pos`, icon: FileSearch },
      { label: "Goods Receipts", href: `${BASE}/procurement/receipts`, icon: Truck },
    ]
  },
  {
    label: "Logistics", roles: ["admin"], items: [
      { label: "Shipments", href: `${BASE}/logistics/shipments`, icon: Package },
      { label: "Returns", href: `${BASE}/logistics/returns`, icon: Package },
    ]
  },
  {
    label: "Communications", roles: ["admin"], items: [
      { label: "Threads", href: `${BASE}/comms`, icon: MessageSquare },
      { label: "Portal", href: "/portal", icon: MessageSquare },
      { label: "Mobile", href: "/mobile", icon: MessageSquare },
      { label: "Notifications", href: `${BASE}/settings/notifications`, icon: Bell },
    ]
  },
  {
    label: "Ops Health", roles: ["admin"], items: [
      { label: "WES Dashboard", href: `${BASE}/ops-health`, icon: Activity },
      { label: "Bottlenecks", href: `${BASE}/ops-health/bottlenecks`, icon: Activity },
      { label: "Cashflow", href: `${BASE}/ops-health/cashflow`, icon: Activity },
      { label: "Disputes", href: `${BASE}/ops-health/disputes`, icon: Activity },
      { label: "Utilization", href: `${BASE}/ops-health/utilization`, icon: Activity },
      { label: "Recommendations", href: `${BASE}/ops-health/recommendations`, icon: Activity },
    ]
  },
  {
    label: "Brand Deals", blueprintId: "B4", items: [
      { label: "Deal Rooms", href: `${BASE}/deals`, icon: Sparkles },
      { label: "Deliverables", href: `${BASE}/deals/deliverables`, icon: FileText },
    ]
  },
  {
    label: "Influencers", items: [
      { label: "Campaigns", href: `${BASE}/influencers`, icon: Sparkles },
      { label: "Creators", href: `${BASE}/influencers/creators`, icon: UserCircle2 },
    ]
  },
  { label: "Academy", blueprintId: "B5", items: [{ label: "Academy", href: `${BASE}/academy`, icon: GraduationCap }] },
  {
    label: "Content", roles: ["admin"], items: [
      { label: "Upload", href: `${BASE}/content/upload`, icon: ImageIcon },
      { label: "Pending", href: `${BASE}/content/pending`, icon: ImageIcon },
      { label: "Analytics", href: `${BASE}/content/analytics`, icon: ImageIcon },
    ]
  },
  {
    label: "Automation", roles: ["admin"], items: [
      { label: "Campaigns", href: `${BASE}/automation/campaigns`, icon: Layers },
      { label: "Create", href: `${BASE}/automation/campaigns/create`, icon: Layers },
      { label: "Rules", href: `${BASE}/automation/rules`, icon: Layers },
      { label: "Policy packs", href: `${BASE}/automation/policy-packs`, icon: Shield },
      { label: "SLA", href: `${BASE}/automation/sla`, icon: Layers },
      { label: "Logs", href: `${BASE}/automation/logs`, icon: Activity },
    ]
  },
  {
    label: "Ads", roles: ["admin"], items: [
      { label: "Campaigns", href: `${BASE}/ads`, icon: Megaphone },
      { label: "Create", href: `${BASE}/ads/create`, icon: Megaphone },
      { label: "Approvals", href: `${BASE}/ads/approvals`, icon: Megaphone },
      { label: "Attribution", href: `${BASE}/ads/attribution`, icon: Megaphone },
    ]
  },
  {
    label: "Community", roles: ["admin"], blueprintId: "B8", items: [
      { label: "Feed", href: `${BASE}/community`, icon: MessageCircle },
      { label: "Groups", href: `${BASE}/community/groups`, icon: Users2 },
      { label: "Moderation", href: `${BASE}/community/moderation`, icon: ShieldCheck },
    ]
  },
  {
    label: "Collaboration", roles: ["admin"], items: [
      { label: "Collaborations", href: `${BASE}/collaboration`, icon: Link2 },
      { label: "Initiate", href: `${BASE}/collaboration/initiate`, icon: Link2 },
    ]
  },
  {
    label: "Contracts", roles: ["admin"], items: [
      { label: "Contracts", href: `${BASE}/contracts`, icon: FileText },
      { label: "Create", href: `${BASE}/contracts/create`, icon: FileText },
      { label: "Templates", href: `${BASE}/contracts/templates`, icon: FileText },
      { label: "Obligations", href: `${BASE}/contracts/obligations`, icon: FileText },
    ]
  },
  {
    label: "Sales", roles: ["admin"], items: [
      { label: "Sales", href: `${BASE}/sales`, icon: FileText },
      { label: "Quotes", href: `${BASE}/sales/quotes`, icon: FileText },
      { label: "Rate cards", href: `${BASE}/sales/rate-cards`, icon: FileText },
      { label: "Templates", href: `${BASE}/sales/templates`, icon: FileText },
    ]
  },
  {
    label: "Finance", items: [
      { label: "Wallet", href: `${BASE}/wallet`, icon: Wallet },
      { label: "Invoices", href: `${BASE}/finance/invoices`, icon: Wallet },
      { label: "Escrows", href: `${BASE}/finance/escrows`, icon: Wallet },
      { label: "Payments", href: `${BASE}/finance/payments`, icon: Wallet },
      { label: "Reconciliation", href: `${BASE}/finance/reconciliation`, icon: Wallet },
      { label: "Payouts", href: `${BASE}/finance/payouts`, icon: Wallet },
      { label: "Discounts", href: `${BASE}/finance/discounts`, icon: Gift },
    ]
  },
  {
    label: "Rewards", roles: ["admin"], items: [
      { label: "Dashboard", href: `${BASE}/rewards`, icon: Gift },
      { label: "Earn", href: `${BASE}/rewards/earn`, icon: Gift },
      { label: "Redeem", href: `${BASE}/rewards/redeem`, icon: Gift },
      { label: "Tiers", href: `${BASE}/rewards/tiers`, icon: Gift },
      { label: "Activity", href: `${BASE}/rewards/activity`, icon: Gift },
    ]
  },
  {
    label: "Support", items: [
      { label: "Support cases", href: `${BASE}/support`, icon: HelpCircle },
      { label: "Help center", href: `${BASE}/help`, icon: HelpCircle },
    ]
  },
  {
    label: "Settings", items: [
      { label: "Tenant Settings", href: `${BASE}/settings`, icon: Settings },
      { label: "Security", href: `${BASE}/security`, icon: Shield },
      { label: "Limits", href: `${BASE}/limits`, icon: AlertTriangle },
      { label: "Risk View", href: `${BASE}/risk`, icon: AlertTriangle },
      { label: "Credits", href: `${BASE}/credits`, icon: Gift },
    ]
  },
]

function TenantAdminShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = React.useState(false)
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(navSections.map((s) => s.label))
  )
  const sidebarWidth = collapsed ? 48 : 240

  React.useEffect(() => {
    const stored = localStorage.getItem("adminSidebarCollapsed")
    if (stored === "true") setCollapsed(true)
  }, [])

  React.useEffect(() => {
    localStorage.setItem("adminSidebarCollapsed", String(collapsed))
  }, [collapsed])

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  /** Active blueprint IDs from localStorage */
  const [activeBlueprints, setActiveBlueprints] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    // Read active blueprints from seed + localStorage state
    const { getTenantBlueprintConfigs } = require("@/shared/services/blueprintService")
    getTenantBlueprintConfigs().then((configs: any[]) => {
      setActiveBlueprints(new Set(configs.map((c: any) => c._id)))
    }).catch(() => { })
  }, [])

  /** Filter nav sections by role and active blueprints. Empty roles = visible to all. */
  const visibleSections = React.useMemo(() => {
    const role = user?.role ?? "admin"
    return navSections.filter((section) => {
      const allowed = section.roles
      if (allowed && allowed.length > 0 && !allowed.includes(role)) return false
      // If section requires a blueprint, only show if active
      if (section.blueprintId && !activeBlueprints.has(section.blueprintId)) return false
      return true
    })
  }, [user?.role, activeBlueprints])
  const visibleNavItems = React.useMemo(
    () => visibleSections.flatMap((section) => section.items),
    [visibleSections]
  )

  const page = ROLE_DASHBOARD_CONFIG.admin.page
  const platformRole = React.useMemo(() => {
    const email = user?.email?.toLowerCase()
    if (!email) return null
    const match = (seedUsers as any[]).find((u) => u.email?.toLowerCase() === email)
    return match?.role ?? null
  }, [user?.email])
  const roleLabel = platformRole ? getRoleLabel(platformRole) : "Admin"

  return (
    <ColorModeProvider mode="light" setMode={() => { }}>
      <div className="flex min-h-screen bg-gray-50" data-theme="admin">
        {/* Full-width header - Microsoft 365 style */}
        <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between bg-white px-4 shadow-sm border-b border-[#edebe9]">
          <div className="flex flex-1 items-center gap-4 min-w-0">
            <h1 className="text-base font-semibold text-[#323130]">Tenant Admin</h1>
            <div className="hidden md:flex flex-1 max-w-md">
              <input
                type="search"
                placeholder="Search..."
                className="h-8 w-full rounded border border-[#edebe9] bg-white px-3 text-sm text-[#323130] placeholder:text-[#a19f9d] focus:border-[#0078d4] focus:outline-none focus:ring-1 focus:ring-[#0078d4]/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded text-[#605e5c] transition-colors hover:bg-[#f3f2f1] hover:text-[#323130]">
              <Bell className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded text-[#605e5c] transition-colors hover:bg-[#f3f2f1] hover:text-[#323130]">
              <Settings className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded text-[#605e5c] transition-colors hover:bg-[#f3f2f1] hover:text-[#323130]">
              <HelpCircle className="h-4 w-4" />
            </button>
            <div className="ml-2 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#0078d4] text-xs font-semibold text-white">
              {user?.name?.charAt(0) ?? "A"}
            </div>
          </div>
        </header>

        {/* Sidebar - Microsoft 365 style */}
        <aside
          className={cn(
            "fixed left-0 top-14 z-20 flex flex-col border-r border-[#edebe9] bg-[#f3f2f1] transition-all duration-200",
            collapsed ? "w-12" : "w-60"
          )}
          style={{ height: "calc(100vh - 3.5rem)" }}
        >
          {/* Hamburger button at top */}
          <div className="flex h-12 items-center border-b border-[#edebe9] px-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#605e5c] hover:bg-[#e1dfdd] hover:text-[#323130]"
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#c8c6c4 transparent" }}>
            {visibleSections.map((section) => {
              const isExpanded = expandedSections.has(section.label)
              return (
                <div key={section.label} className="mb-1 px-2">
                  {!collapsed && (
                    <button
                      type="button"
                      onClick={() => toggleSection(section.label)}
                      className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#605e5c] transition-colors hover:bg-[#e1dfdd] hover:text-[#323130]"
                    >
                      {section.label}
                      <ChevronRight className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-90")} />
                    </button>
                  )}
                  {isExpanded && (
                    <ul className="mt-0.5 space-y-0.5">
                      {section.items.map((item) => {
                        const Icon = item.icon
                        const active = pathname === item.href || (item.href !== BASE && pathname?.startsWith(item.href + "/"))
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              title={item.label}
                              className={cn(
                                "group flex items-center gap-2.5 rounded px-2 py-1.5 text-xs font-medium transition-colors",
                                active
                                  ? "bg-[#edebe9] text-[#0078d4] font-semibold"
                                  : "text-[#323130] hover:bg-[#e1dfdd]"
                              )}
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                              {!collapsed && <span className="truncate">{item.label}</span>}
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

          {/* Footer - Settings */}
          {!collapsed && (
            <div className="border-t border-[#edebe9] p-2">
              <Link
                href={`${BASE}/settings`}
                className="flex items-center gap-2.5 rounded px-2 py-1.5 text-xs font-medium text-[#323130] transition-colors hover:bg-[#e1dfdd]"
              >
                <Settings className="h-4 w-4 shrink-0" />
                <span>Settings</span>
              </Link>
            </div>
          )}
        </aside>

        {/* Main content */}
        <div
          className="flex min-h-screen flex-1 flex-col bg-gray-50 transition-all duration-200 admin-light-theme:bg-gray-50 admin-dark-theme:bg-transparent"
          style={{ marginLeft: collapsed ? "3rem" : "15rem", marginTop: "3.5rem" }}
        >
          <div className="admin-content min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </ColorModeProvider>
  )
}

export function TenantAdminShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardThemeProvider role="admin">
      <AdminThemeProvider>
        <TenantAdminShellContent>{children}</TenantAdminShellContent>
      </AdminThemeProvider>
    </DashboardThemeProvider>
  )
}
