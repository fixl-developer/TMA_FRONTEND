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
  { label: "Overview", items: [
    { label: "Dashboard", href: BASE, icon: LayoutDashboard },
    { label: "Analytics", href: `${BASE}/dashboards/analytics`, icon: BarChart3 },
    { label: "Reports", href: `${BASE}/reports`, icon: BarChart3 },
    { label: "Integrations", href: `${BASE}/integrations`, icon: BarChart3 },
    { label: "Audit log", href: `${BASE}/audit-log`, icon: BarChart3 },
  ] },
  { label: "Tenant Management", roles: ["admin"], items: [
    { label: "Organization", href: `${BASE}/organization`, icon: Building2 },
    { label: "Franchise", href: `${BASE}/franchise`, icon: Building2 },
    { label: "Users & Roles", href: `${BASE}/users`, icon: Users2 },
    { label: "Teams", href: `${BASE}/teams`, icon: Users2 },
    { label: "Roles & Policies", href: `${BASE}/roles`, icon: KeyRound },
    { label: "Blueprints", href: `${BASE}/blueprints`, icon: Layers },
    { label: "Compliance", href: `${BASE}/compliance`, icon: ShieldCheck },
  ]},
  { label: "CRM", roles: ["admin"], items: [
    { label: "CRM", href: `${BASE}/crm`, icon: Building2 },
    { label: "Leads", href: `${BASE}/crm/leads`, icon: Users2 },
    { label: "Accounts", href: `${BASE}/crm/accounts`, icon: Building2 },
    { label: "Contacts", href: `${BASE}/crm/contacts`, icon: Users2 },
    { label: "Activities", href: `${BASE}/crm/activities`, icon: Building2 },
    { label: "Segments", href: `${BASE}/crm/segments`, icon: Building2 },
  ] },
  { label: "Talent", items: [{ label: "Talent", href: `${BASE}/talent`, icon: UserCircle2 }] },
  { label: "Casting & Auditions", blueprintId: "B2", items: [
    { label: "Castings", href: `${BASE}/casting`, icon: Megaphone },
    { label: "Client viewer", href: `${BASE}/casting/viewer`, icon: Users2 },
  ] },
  { label: "Pageants & Events", blueprintId: "B3", items: [
    { label: "Events", href: `${BASE}/events`, icon: Crown },
    { label: "Shift rosters", href: `${BASE}/shifts`, icon: Users },
  ] },
  { label: "Work Management", roles: ["admin"], items: [
    { label: "Projects", href: `${BASE}/projects`, icon: FolderKanban },
  ] },
  { label: "Resources", roles: ["admin"], items: [
    { label: "Resources", href: `${BASE}/resources`, icon: Users },
    { label: "Availability", href: `${BASE}/resources/availability`, icon: Users },
    { label: "Assignments", href: `${BASE}/resources/assignments`, icon: Users },
    { label: "Utilization", href: `${BASE}/resources/utilization`, icon: Users },
    { label: "Conflicts", href: `${BASE}/resources/conflicts`, icon: Users },
  ] },
  { label: "Marketplace", roles: ["admin"], blueprintId: "B9", items: [
    { label: "Listings", href: `${BASE}/marketplace`, icon: Store },
    { label: "Bookings", href: `${BASE}/marketplace/bookings`, icon: FileText },
    { label: "Reviews", href: `${BASE}/marketplace/reviews`, icon: MessageSquare },
  ] },
  { label: "Vendors & Procurement", roles: ["admin"], items: [
    { label: "Vendors", href: `${BASE}/vendors`, icon: Truck },
    { label: "RFQs", href: `${BASE}/procurement/rfqs`, icon: FileSearch },
    { label: "Purchase Orders", href: `${BASE}/procurement/pos`, icon: FileSearch },
    { label: "Goods Receipts", href: `${BASE}/procurement/receipts`, icon: Truck },
  ] },
  { label: "Logistics", roles: ["admin"], items: [
    { label: "Shipments", href: `${BASE}/logistics/shipments`, icon: Package },
    { label: "Returns", href: `${BASE}/logistics/returns`, icon: Package },
  ] },
  { label: "Communications", roles: ["admin"], items: [
    { label: "Threads", href: `${BASE}/comms`, icon: MessageSquare },
    { label: "Portal", href: "/portal", icon: MessageSquare },
    { label: "Mobile", href: "/mobile", icon: MessageSquare },
    { label: "Notifications", href: `${BASE}/settings/notifications`, icon: Bell },
  ] },
  { label: "Ops Health", roles: ["admin"], items: [
    { label: "WES Dashboard", href: `${BASE}/ops-health`, icon: Activity },
    { label: "Bottlenecks", href: `${BASE}/ops-health/bottlenecks`, icon: Activity },
    { label: "Cashflow", href: `${BASE}/ops-health/cashflow`, icon: Activity },
    { label: "Disputes", href: `${BASE}/ops-health/disputes`, icon: Activity },
    { label: "Utilization", href: `${BASE}/ops-health/utilization`, icon: Activity },
    { label: "Recommendations", href: `${BASE}/ops-health/recommendations`, icon: Activity },
  ] },
  { label: "Brand Deals", blueprintId: "B4", items: [
    { label: "Deal Rooms", href: `${BASE}/deals`, icon: Sparkles },
    { label: "Deliverables", href: `${BASE}/deals/deliverables`, icon: FileText },
  ] },
  { label: "Influencers", items: [
    { label: "Campaigns", href: `${BASE}/influencers`, icon: Sparkles },
    { label: "Creators", href: `${BASE}/influencers/creators`, icon: UserCircle2 },
  ] },
  { label: "Academy", blueprintId: "B5", items: [{ label: "Academy", href: `${BASE}/academy`, icon: GraduationCap }] },
  { label: "Content", roles: ["admin"], items: [
    { label: "Upload", href: `${BASE}/content/upload`, icon: ImageIcon },
    { label: "Pending", href: `${BASE}/content/pending`, icon: ImageIcon },
    { label: "Analytics", href: `${BASE}/content/analytics`, icon: ImageIcon },
  ] },
  { label: "Automation", roles: ["admin"], items: [
    { label: "Campaigns", href: `${BASE}/automation/campaigns`, icon: Layers },
    { label: "Create", href: `${BASE}/automation/campaigns/create`, icon: Layers },
    { label: "Rules", href: `${BASE}/automation/rules`, icon: Layers },
    { label: "Policy packs", href: `${BASE}/automation/policy-packs`, icon: Shield },
    { label: "SLA", href: `${BASE}/automation/sla`, icon: Layers },
    { label: "Logs", href: `${BASE}/automation/logs`, icon: Activity },
  ] },
  { label: "Ads", roles: ["admin"], items: [
    { label: "Campaigns", href: `${BASE}/ads`, icon: Megaphone },
    { label: "Create", href: `${BASE}/ads/create`, icon: Megaphone },
    { label: "Approvals", href: `${BASE}/ads/approvals`, icon: Megaphone },
    { label: "Attribution", href: `${BASE}/ads/attribution`, icon: Megaphone },
  ] },
  { label: "Community", roles: ["admin"], blueprintId: "B8", items: [
    { label: "Feed", href: `${BASE}/community`, icon: MessageCircle },
    { label: "Groups", href: `${BASE}/community/groups`, icon: Users2 },
    { label: "Moderation", href: `${BASE}/community/moderation`, icon: ShieldCheck },
  ] },
  { label: "Collaboration", roles: ["admin"], items: [
    { label: "Collaborations", href: `${BASE}/collaboration`, icon: Link2 },
    { label: "Initiate", href: `${BASE}/collaboration/initiate`, icon: Link2 },
  ] },
  { label: "Contracts", roles: ["admin"], items: [
    { label: "Contracts", href: `${BASE}/contracts`, icon: FileText },
    { label: "Create", href: `${BASE}/contracts/create`, icon: FileText },
    { label: "Templates", href: `${BASE}/contracts/templates`, icon: FileText },
    { label: "Obligations", href: `${BASE}/contracts/obligations`, icon: FileText },
  ] },
  { label: "Sales", roles: ["admin"], items: [
    { label: "Sales", href: `${BASE}/sales`, icon: FileText },
    { label: "Quotes", href: `${BASE}/sales/quotes`, icon: FileText },
    { label: "Rate cards", href: `${BASE}/sales/rate-cards`, icon: FileText },
    { label: "Templates", href: `${BASE}/sales/templates`, icon: FileText },
  ] },
  { label: "Finance", items: [
    { label: "Wallet", href: `${BASE}/wallet`, icon: Wallet },
    { label: "Invoices", href: `${BASE}/finance/invoices`, icon: Wallet },
    { label: "Escrows", href: `${BASE}/finance/escrows`, icon: Wallet },
    { label: "Payments", href: `${BASE}/finance/payments`, icon: Wallet },
    { label: "Reconciliation", href: `${BASE}/finance/reconciliation`, icon: Wallet },
    { label: "Payouts", href: `${BASE}/finance/payouts`, icon: Wallet },
    { label: "Discounts", href: `${BASE}/finance/discounts`, icon: Gift },
  ] },
  { label: "Rewards", roles: ["admin"], items: [
    { label: "Dashboard", href: `${BASE}/rewards`, icon: Gift },
    { label: "Earn", href: `${BASE}/rewards/earn`, icon: Gift },
    { label: "Redeem", href: `${BASE}/rewards/redeem`, icon: Gift },
    { label: "Tiers", href: `${BASE}/rewards/tiers`, icon: Gift },
    { label: "Activity", href: `${BASE}/rewards/activity`, icon: Gift },
  ] },
  { label: "Support", items: [
    { label: "Support cases", href: `${BASE}/support`, icon: HelpCircle },
    { label: "Help center", href: `${BASE}/help`, icon: HelpCircle },
  ] },
  { label: "Settings", items: [
    { label: "Tenant Settings", href: `${BASE}/settings`, icon: Settings },
    { label: "Security", href: `${BASE}/security`, icon: Shield },
    { label: "Limits", href: `${BASE}/limits`, icon: AlertTriangle },
    { label: "Risk View", href: `${BASE}/risk`, icon: AlertTriangle },
    { label: "Credits", href: `${BASE}/credits`, icon: Gift },
  ]},
]

function TenantAdminShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { theme, toggleTheme, setTheme } = useAdminTheme()
  const [collapsed, setCollapsed] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const [railStyle, setRailStyle] = React.useState<SidebarRailStyle>("minimal")
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(navSections.map((s) => s.label))
  )
  const isNarrow = collapsed && !hovered
  const showFullNav = !collapsed || hovered

  React.useEffect(() => {
    const stored = localStorage.getItem("adminSidebarCollapsed")
    if (stored === "true") setCollapsed(true)
    setRailStyle(getSidebarRailStyle())
  }, [])

  React.useEffect(() => {
    localStorage.setItem("adminSidebarCollapsed", String(collapsed))
  }, [collapsed])

  const handleCycleRailStyle = () => {
    const next = cycleSidebarRailStyle(railStyle)
    setRailStyle(next)
    saveSidebarRailStyle(next)
  }

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
    }).catch(() => {})
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
  
  const isDark = theme === "dark"
  
  return (
    <ColorModeProvider mode={theme as ColorMode} setMode={(mode) => setTheme(mode)}>
      <div className={cn(
        "flex min-h-screen transition-colors duration-300",
        isDark 
          ? "bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c]" 
          : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
      )} data-theme="admin">
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 flex h-screen flex-col border-r backdrop-blur-xl shadow-2xl transition-[width] duration-200",
          isDark ? "border-white/10" : "border-slate-200",
          isNarrow ? "w-[72px]" : "w-64"
        )}
        style={{ backgroundColor: isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.8)" }}
        onMouseEnter={() => collapsed && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={cn(
          "flex h-16 shrink-0 items-center justify-between border-b px-4",
          isDark ? "border-white/10" : "border-slate-200"
        )}>
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4ff00] to-[#b8e600] text-sm font-bold text-black shadow-lg shadow-[#d4ff00]/30">
              TT
            </div>
            {showFullNav && (
              <div className="min-w-0">
                <p className={cn("font-display truncate text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>TalentOS</p>
                <p className="truncate text-xs text-[#d4ff00]">{roleLabel}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {showFullNav && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 text-[10px] font-semibold uppercase transition-colors",
                  isDark 
                    ? "text-white/50 hover:bg-white/10 hover:text-white" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                )}
                onClick={handleCycleRailStyle}
                aria-label="Cycle rail style"
                title={`Rail style: ${railStyle}`}
              >
                {getSidebarRailStyleLabel(railStyle)}
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-8 w-8 min-h-[44px] min-w-[44px] shrink-0 transition-colors",
                isDark 
                  ? "text-white/50 hover:bg-white/10 hover:text-white" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
              onClick={() => setCollapsed((v) => !v)} 
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {isNarrow ? (
            <div className="flex flex-col items-center gap-1 px-2">
              {visibleNavItems.map((item) => {
                const Icon = item.icon
                const active =
                  (item.href === BASE && pathname === BASE) ||
                  (item.href !== BASE && pathname?.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    className={cn(
                      "group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all",
                      getRailItemClass(railStyle, active),
                      active 
                        ? "bg-[#d4ff00] text-black shadow-lg shadow-[#d4ff00]/30" 
                        : isDark 
                          ? "text-white/50 hover:bg-white/10 hover:text-white"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    {active && (
                      <span className="absolute -right-1 h-5 w-1 rounded-full bg-[#d4ff00]" />
                    )}
                    <Icon className="h-5 w-5" />
                    <span className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/20 bg-black/80 px-3 py-1.5 text-xs text-white opacity-0 shadow-xl backdrop-blur-sm transition-opacity group-hover:opacity-100">
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          ) : (
            visibleSections.map((section) => {
              const isExpanded = expandedSections.has(section.label)
              return (
                <div key={section.label} className="mb-2 px-2">
                  {showFullNav && (
                    <button 
                      type="button" 
                      onClick={() => toggleSection(section.label)} 
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider transition-all",
                        isDark 
                          ? "text-white/40 hover:bg-white/5 hover:text-white/60"
                          : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      )}
                    >
                      {section.label}
                      <ChevronRight className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-90")} />
                    </button>
                  )}
                  {isExpanded && (
                    <ul className="mt-1 space-y-0.5">
                      {section.items.map((item) => {
                        const Icon = item.icon
                        const active = (item.href === BASE && pathname === BASE) || (item.href !== BASE && pathname?.startsWith(item.href))
                        return (
                          <li key={item.href}>
                            <Link 
                              href={item.href} 
                              title={item.label}
                              className={cn(
                                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                                active 
                                  ? "bg-[#d4ff00]/10 font-semibold text-[#d4ff00] shadow-sm" 
                                  : isDark
                                    ? "text-white/60 hover:bg-white/5 hover:text-white"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                              )}
                            >
                              <span className={cn(
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all",
                                active 
                                  ? "bg-[#d4ff00] text-black shadow-lg shadow-[#d4ff00]/30" 
                                  : isDark
                                    ? "bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white"
                                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-900"
                              )}>
                                <Icon className="h-4 w-4" />
                              </span>
                              {showFullNav && <span className="truncate">{item.label}</span>}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })
          )}
        </nav>
        <div className={cn("border-t px-2 py-3", isDark ? "border-white/10" : "border-slate-200")}>
          {showFullNav && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-full justify-start text-[10px] font-medium uppercase tracking-wide transition-colors",
                isDark 
                  ? "text-white/40 hover:bg-white/5 hover:text-white/60"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              )}
              onClick={handleCycleRailStyle}
              title={`Sidebar style: ${getSidebarRailStyleLabel(railStyle)}`}
            >
              Style: {getSidebarRailStyleLabel(railStyle)}
            </Button>
          )}
        </div>
      </aside>
      <div className={cn("flex min-h-screen flex-1 flex-col transition-[margin] duration-200", isNarrow ? "ml-[72px]" : "ml-64")}>
        <header className={cn(
          "sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b px-4 backdrop-blur-xl sm:px-6 transition-colors duration-300",
          isDark 
            ? "border-white/10 bg-black/20" 
            : "border-slate-200 bg-white/80"
        )}>
          <div className="flex flex-1 items-center gap-4 min-w-0">
            <TenantSwitcher />
            <Breadcrumbs fromPath className="hidden sm:flex" />
          </div>
          <div className="flex items-center gap-3">
            <button 
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg backdrop-blur-sm transition-all",
                isDark 
                  ? "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              )}
              onClick={toggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg backdrop-blur-sm transition-all",
              isDark 
                ? "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            )}>
              <Bell className="h-4 w-4" />
            </button>
            <button className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg backdrop-blur-sm transition-all",
              isDark 
                ? "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            )}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <div className="hidden items-center gap-3 border-l pl-3 sm:flex" style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}>
              <div className="text-right">
                <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>{user?.name ?? "John Smith"}</p>
                <p className={cn("text-xs", isDark ? "text-white/50" : "text-slate-500")}>{roleLabel}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-sm font-bold text-white shadow-lg">
                {user?.name?.charAt(0) ?? "J"}
              </div>
            </div>
            <button 
              className={cn(
                "hidden rounded-lg px-3 py-2 text-sm font-medium backdrop-blur-sm transition-all sm:flex",
                isDark 
                  ? "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              )}
              onClick={() => { logout(); router.push("/login") }} 
              title="Logout"
            >
              <LogOut className="mr-1.5 h-4 w-4" />
              Logout
            </button>
          </div>
        </header>
        <div className="admin-content min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">{children}</div>
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
