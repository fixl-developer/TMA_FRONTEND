"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, UserCircle2, Megaphone, Calendar, FileSignature, Wallet, CreditCard, FileText, Receipt, Shield, Menu, ChevronRight, LogOut, AlertCircle, Bell, Zap, ClipboardList, Moon, Sun, Search } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useAuth } from "@/shared/context/AuthContext"
import { TenantSwitcher } from "@/shared/components/layout/TenantSwitcher"
import { NotificationsDropdown } from "@/shared/components/layout/NotificationsDropdown"
import { ROLE_DASHBOARD_CONFIG } from "@/shared/config/roleDashboardConfig"
import { DashboardThemeProvider } from "@/shared/context/DashboardThemeContext"
import { ColorModeProvider, type ColorMode } from "@/shared/context/ColorModeContext"
import { cn } from "@/shared/lib/utils"

const BASE = "/modelling"
const s = ROLE_DASHBOARD_CONFIG.modelling.sidebar

const navSections = [
  { label: "Overview", items: [
    { label: "Dashboard", href: BASE, icon: LayoutDashboard },
    { label: "Jobs", href: `${BASE}/dashboard/jobs`, icon: Megaphone },
    { label: "Finance", href: `${BASE}/dashboard/finance`, icon: Wallet },
  ] },
  { label: "Talent CRM", items: [{ label: "Talent", href: `${BASE}/talent`, icon: UserCircle2 }] },
  { label: "Castings", items: [{ label: "Castings", href: `${BASE}/castings`, icon: Megaphone }] },
  { label: "Bookings", items: [{ label: "Bookings", href: `${BASE}/bookings`, icon: Calendar }] },
  { label: "Contracts", items: [
    { label: "Contracts", href: `${BASE}/contracts`, icon: FileSignature },
    { label: "Templates", href: `${BASE}/contracts/templates`, icon: FileSignature },
    { label: "Clauses", href: `${BASE}/contracts/clauses`, icon: FileSignature },
  ] },
  { label: "Finance", items: [
    { label: "Wallets", href: `${BASE}/finance/wallets`, icon: Wallet },
    { label: "Invoices", href: `${BASE}/finance/invoices`, icon: Receipt },
    { label: "Escrows", href: `${BASE}/finance/escrows`, icon: Shield },
    { label: "Credits", href: `${BASE}/finance/credits`, icon: CreditCard },
    { label: "Statements", href: `${BASE}/finance/statements`, icon: FileText },
  ] },
  { label: "Operations", items: [
    { label: "Disputes", href: `${BASE}/disputes`, icon: AlertCircle },
    { label: "Notifications", href: `${BASE}/notifications`, icon: Bell },
    { label: "Automations", href: `${BASE}/automations`, icon: Zap },
    { label: "Audit log", href: `${BASE}/audit`, icon: ClipboardList },
  ] },
]

const allNavItems = navSections.flatMap((sec) => sec.items)

export function ModellingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const [colorMode, setColorMode] = React.useState<ColorMode>("dark")
  const [navQuery, setNavQuery] = React.useState("")
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(navSections.map((sec) => sec.label)))

  React.useEffect(() => {
    const stored = localStorage.getItem("modellingSidebarCollapsed")
    const storedMode = localStorage.getItem("modellingColorMode")
    if (stored === "true") setCollapsed(true)
    if (storedMode === "dark" || storedMode === "light") setColorMode(storedMode)
  }, [])

  React.useEffect(() => {
    localStorage.setItem("modellingSidebarCollapsed", String(collapsed))
  }, [collapsed])

  React.useEffect(() => {
    localStorage.setItem("modellingColorMode", colorMode)
  }, [colorMode])

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  const isNarrow = collapsed && !hovered
  const showFullNav = !collapsed || hovered

  const isDark = colorMode === "dark"
  const sidebarTheme = isDark
    ? {
        bg: "#0b0f14",
        border: "#1f2937",
        text: "#e5e7eb",
        textMuted: "#94a3b8",
        sectionText: "#64748b",
        hoverBg: "#151b23",
        iconBg: "#111827",
        activeBg: s.accent,
        activeText: "#111827",
        tooltipBg: "#111827",
        tooltipBorder: "#1f2937",
      }
    : {
        bg: "#ffffff",
        border: "#e5e7eb",
        text: "#0f172a",
        textMuted: "#64748b",
        sectionText: "#94a3b8",
        hoverBg: "#f3f4f6",
        iconBg: "#eef2ff",
        activeBg: s.accent,
        activeText: "#111827",
        tooltipBg: "#ffffff",
        tooltipBorder: "#e5e7eb",
      }
  const shellTheme = isDark
    ? {
        canvasBg: "#0a0a0a",
        headerBg: "#111111",
        headerBorder: "#262626",
        headerText: "#fafafa",
        headerMuted: "#a3a3a3",
        iconBg: "#171717",
        iconBorder: "#303030",
      }
    : {
        canvasBg: "#f8fafc",
        headerBg: "#ffffff",
        headerBorder: "#e5e7eb",
        headerText: "#111827",
        headerMuted: "#6b7280",
        iconBg: "#f3f4f6",
        iconBorder: "#d1d5db",
      }
  const treeLine = isDark ? "rgba(148,163,184,0.28)" : "rgba(100,116,139,0.24)"
  const treeLineActive = "#facc15"
  const treeLineMask = sidebarTheme.bg
  const filteredSections = React.useMemo(() => {
    const q = navQuery.trim().toLowerCase()
    if (!q) return navSections
    return navSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.label.toLowerCase().includes(q)),
      }))
      .filter((section) => section.items.length > 0)
  }, [navQuery])
  const visibleNavItems = filteredSections.flatMap((sec) => sec.items)

  return (
    <DashboardThemeProvider role="modelling">
      <ColorModeProvider mode={colorMode} setMode={setColorMode}>
    <div className="flex min-h-screen transition-colors" style={{ backgroundColor: shellTheme.canvasBg, color: shellTheme.headerText }} data-theme="modelling" data-mode={colorMode}>
      <aside
        className={cn("fixed left-0 top-0 z-30 flex h-screen flex-col border-r shadow-sm transition-[width] duration-200", isNarrow ? "w-[72px]" : "w-64")}
        style={{ backgroundColor: sidebarTheme.bg, borderColor: sidebarTheme.border }}
        onMouseEnter={() => collapsed && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b px-3.5" style={{ borderColor: sidebarTheme.border }}>
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-black shadow-sm" style={{ backgroundColor: s.accent }}>MA</div>
            {showFullNav && <div className="min-w-0"><p className="font-display truncate text-xs font-semibold" style={{ color: sidebarTheme.text }}>TalentOS</p><p className="truncate text-[10px]" style={{ color: s.accent }}>Modelling Agency</p></div>}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 min-h-[44px] min-w-[44px] shrink-0 hover:opacity-80" style={{ color: sidebarTheme.textMuted }} onClick={() => setCollapsed((v) => !v)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}><Menu className="h-4 w-4" /></Button>
          </div>
        </div>
        {showFullNav && (
          <div className="border-b p-3" style={{ borderColor: sidebarTheme.border }}>
            <label className="relative block">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4" style={{ color: sidebarTheme.textMuted }} />
              <input
                type="text"
                value={navQuery}
                onChange={(e) => setNavQuery(e.target.value)}
                placeholder="Search..."
                className="h-9 w-full rounded-lg border pl-9 pr-3 text-sm outline-none transition-colors"
                style={{
                  backgroundColor: isDark ? "#0f1622" : "#f8fafc",
                  borderColor: sidebarTheme.border,
                  color: sidebarTheme.text,
                }}
              />
            </label>
          </div>
        )}
        <nav className="flex-1 overflow-y-auto py-2.5 scrollbar-thin">
          {isNarrow ? (
            <div className="flex flex-col items-center gap-1 px-2">
              {visibleNavItems.map((item) => {
                const Icon = item.icon
                const active = (item.href === BASE && pathname === BASE) || (item.href !== BASE && pathname?.startsWith(item.href))
                return (
                  <Link key={item.href} href={item.href} title={item.label}
                    className={cn("group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors", active ? "text-white" : "hover:opacity-90")}
                    style={{ color: active ? sidebarTheme.activeText : sidebarTheme.textMuted, backgroundColor: active ? sidebarTheme.activeBg : 'transparent' }}
                  >
                    {active && (
                      <span
                        className="absolute -right-1 h-5 w-0.5 rounded-full"
                        style={{ backgroundColor: sidebarTheme.activeBg, boxShadow: "0 0 10px rgba(250,204,21,0.6)" }}
                      />
                    )}
                    <Icon className="h-5 w-5" />
                    <span
                      className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md border px-2 py-1 text-xs opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                      style={{ backgroundColor: sidebarTheme.tooltipBg, borderColor: sidebarTheme.tooltipBorder, color: sidebarTheme.text }}
                    >
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          ) : (
            filteredSections.map((section) => {
              const isExpanded = expandedSections.has(section.label)
              const hasActive = section.items.some(
                (item) => (item.href === BASE && pathname === BASE) || (item.href !== BASE && pathname?.startsWith(item.href))
              )
              return (
                <div key={section.label} className="mb-2">
                  <button type="button" onClick={() => toggleSection(section.label)} className="flex w-full items-center justify-between px-3.5 py-1.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors rounded-lg" style={{ color: sidebarTheme.sectionText }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sidebarTheme.hoverBg; e.currentTarget.style.color = sidebarTheme.textMuted }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = sidebarTheme.sectionText }}>
                    {section.label}
                    <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-90")} />
                  </button>
                  {isExpanded && (
                    <div className="relative ml-2 pl-4">
                      <span
                        aria-hidden="true"
                        className="absolute bottom-1 left-1 top-1 w-px"
                        style={{ backgroundColor: hasActive ? treeLineActive : treeLine, opacity: hasActive ? 0.65 : 1 }}
                      />
                      <ul className="space-y-1">
                        {section.items.map((item, index) => {
                          const Icon = item.icon
                          const active = (item.href === BASE && pathname === BASE) || (item.href !== BASE && pathname?.startsWith(item.href))
                          return (
                            <li key={item.href} className="relative">
                              <span
                                aria-hidden="true"
                                className="absolute left-[-12px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-bl-md border-b border-l"
                                style={{
                                  borderColor: active ? treeLineActive : treeLine,
                                  opacity: active ? 0.95 : 1,
                                }}
                              />
                              {index === section.items.length - 1 && (
                                <span
                                  aria-hidden="true"
                                  className="absolute bottom-0 left-[-15px] top-1/2 w-1"
                                  style={{ backgroundColor: treeLineMask }}
                                />
                              )}
                              <Link href={item.href} title={item.label}
                                className={cn("group flex items-center gap-3 rounded-lg px-3.5 py-2 text-sm transition-colors", active ? "font-semibold" : "")}
                                style={active ? { backgroundColor: sidebarTheme.activeBg, color: sidebarTheme.activeText } : { color: sidebarTheme.textMuted }}
                                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.backgroundColor = sidebarTheme.hoverBg; e.currentTarget.style.color = sidebarTheme.text } }}
                                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = sidebarTheme.textMuted } }}>
                                <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md", active ? "text-black" : "group-hover:opacity-80")} style={{ backgroundColor: active ? "rgba(17,24,39,0.12)" : sidebarTheme.iconBg, color: active ? "#111827" : sidebarTheme.textMuted }}>
                                  <Icon className="h-4 w-4" />
                                </span>
                                <span className="truncate">{item.label}</span>
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </nav>
      </aside>
      <div className={cn("flex min-h-screen flex-1 flex-col transition-[margin] duration-200", isNarrow ? "ml-[72px]" : "ml-64")}>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b px-4 sm:px-6" style={{ backgroundColor: shellTheme.headerBg, borderColor: shellTheme.headerBorder }}>
          <div className="flex flex-1 items-center gap-4">
            <TenantSwitcher />
          </div>
          <div className="flex items-center gap-3 border-l pl-3" style={{ borderColor: shellTheme.headerBorder }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg border transition-colors"
              style={{
                color: shellTheme.headerMuted,
                backgroundColor: shellTheme.iconBg,
                borderColor: shellTheme.iconBorder,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = shellTheme.headerText
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = shellTheme.headerMuted
              }}
              onClick={() => setColorMode((prev) => (prev === "dark" ? "light" : "dark"))}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <NotificationsDropdown />
            <div className="hidden text-right sm:block"><p className="text-sm font-medium" style={{ color: shellTheme.headerText }}>{user?.name ?? "Modelling Agency"}</p><p className="text-xs" style={{ color: s.accent }}>Elite Models Co</p></div>
            <Button variant="ghost" size="sm" style={{ color: shellTheme.headerMuted }} className="hover:opacity-90" onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? "#1f1f1f" : "#f3f4f6"; e.currentTarget.style.color = shellTheme.headerText }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = shellTheme.headerMuted }} onClick={() => { logout(); router.push("/login") }} title="Logout">
              <LogOut className="h-4 w-4 mr-1.5" />
              Logout
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-black shadow-sm" style={{ backgroundColor: s.accent }}>MA</div>
          </div>
        </header>
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">{children}</div>
      </div>
    </div>
      </ColorModeProvider>
    </DashboardThemeProvider>
  )
}
