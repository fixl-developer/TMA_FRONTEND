"use client"

import * as React from "react"
import Link from "next/link"
import { ROLE_DASHBOARD_CONFIG } from "@/shared/config/roleDashboardConfig"
import { DashboardThemeProvider } from "@/shared/context/DashboardThemeContext"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, GraduationCap, Users, Award, TrendingUp, Menu, ChevronRight, LogOut, BookOpen, Video, UserCog } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useAuth } from "@/shared/context/AuthContext"
import { cn } from "@/shared/lib/utils"
import {
  cycleSidebarRailStyle,
  getRailItemClass,
  getSidebarRailStyleLabel,
  getSidebarRailStyle,
  saveSidebarRailStyle,
  type SidebarRailStyle,
} from "@/shared/lib/sidebarRailStyle"

const BASE = "/academy"
const s = ROLE_DASHBOARD_CONFIG.academy.sidebar

const navSections = [
  { label: "Overview", items: [{ label: "Dashboard", href: BASE, icon: LayoutDashboard }] },
  { label: "Learning", items: [
    { label: "Courses", href: `${BASE}/courses`, icon: GraduationCap },
    { label: "My Learning", href: `${BASE}/my-learning`, icon: BookOpen },
    { label: "Cohorts", href: `${BASE}/cohorts`, icon: Users },
    { label: "Sessions", href: `${BASE}/sessions`, icon: Video },
  ] },
  { label: "Mentors", items: [{ label: "Mentors", href: `${BASE}/mentors`, icon: Users }] },
  { label: "Achievements", items: [
    { label: "Certificates", href: `${BASE}/certificates`, icon: Award },
    { label: "Certifications", href: `${BASE}/certifications`, icon: Award },
  ] },
  { label: "Progress", items: [{ label: "Progress", href: `${BASE}/progress`, icon: TrendingUp }] },
  { label: "Trainer", items: [{ label: "Trainer", href: `${BASE}/trainer`, icon: UserCog }] },
]
const allNavItems = navSections.flatMap((section) => section.items)

export function AcademyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const [railStyle, setRailStyle] = React.useState<SidebarRailStyle>("minimal")
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(navSections.map((s) => s.label)))
  const isNarrow = collapsed && !hovered
  const showFullNav = !collapsed || hovered

  React.useEffect(() => {
    const stored = localStorage.getItem("academySidebarCollapsed")
    if (stored === "true") setCollapsed(true)
    setRailStyle(getSidebarRailStyle())
  }, [])

  React.useEffect(() => {
    localStorage.setItem("academySidebarCollapsed", String(collapsed))
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

  const page = ROLE_DASHBOARD_CONFIG.academy.page
  return (
    <DashboardThemeProvider role="academy">
    <div className="flex min-h-screen transition-colors" style={{ backgroundColor: page.bg, color: page.text }} data-theme="academy">
      <aside
        className={cn("fixed left-0 top-0 z-30 flex h-screen flex-col border-r shadow-sm transition-[width] duration-200", isNarrow ? "w-[72px]" : "w-64")}
        style={{ backgroundColor: s.bg, borderColor: s.border }}
        onMouseEnter={() => collapsed && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b px-4" style={{ borderColor: s.border }}>
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm" style={{ backgroundColor: s.accent }}>AC</div>
            {showFullNav && <div className="min-w-0"><p className="font-display truncate text-xs font-semibold" style={{ color: s.text }}>TalentOS</p><p className="truncate text-[10px]" style={{ color: s.accent }}>Academy</p></div>}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size={showFullNav ? "sm" : "icon"}
              className={cn(
                "h-8 min-h-[44px] shrink-0 hover:opacity-80 text-[10px] font-semibold uppercase",
                showFullNav ? "px-2" : "w-8 min-w-[44px]"
              )}
              style={{ color: s.textMuted }}
              onClick={handleCycleRailStyle}
              aria-label="Cycle rail style"
              title={`Rail style: ${railStyle}`}
            >
              {showFullNav ? getSidebarRailStyleLabel(railStyle) : railStyle.slice(0, 1)}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 min-h-[44px] min-w-[44px] shrink-0 hover:opacity-80" style={{ color: s.textMuted }} onClick={() => setCollapsed((v) => !v)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}><Menu className="h-4 w-4" /></Button>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {isNarrow ? (
            <div className="flex flex-col items-center gap-1 px-2">
              {allNavItems.map((item) => {
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
                      "group relative flex h-10 w-10 shrink-0 items-center justify-center transition-colors",
                      getRailItemClass(railStyle, active),
                      active ? "text-white" : "hover:opacity-90"
                    )}
                    style={{
                      color: active ? "#fff" : s.textMuted,
                      backgroundColor: active ? s.accent : "transparent",
                    }}
                  >
                    {active && (
                      <span
                        className="absolute -right-1 h-5 w-0.5 rounded-full"
                        style={{ backgroundColor: s.accent }}
                      />
                    )}
                    <Icon className="h-5 w-5" />
                    <span className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          ) : (
            navSections.map((section) => {
              const isExpanded = expandedSections.has(section.label)
              return (
                <div key={section.label} className="mb-1">
                  {showFullNav && (
                    <button type="button" onClick={() => toggleSection(section.label)} className="flex w-full items-center justify-between px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider transition-colors rounded-lg" style={{ color: s.textMuted }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = s.hover; e.currentTarget.style.color = s.text }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = s.textMuted }}>
                      {section.label}
                      <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-90")} />
                    </button>
                  )}
                  {isExpanded && (
                    <ul className="space-y-0.5">
                      {section.items.map((item) => {
                        const Icon = item.icon
                        const active = (item.href === BASE && pathname === BASE) || (item.href !== BASE && pathname?.startsWith(item.href))
                        return (
                          <li key={item.href}>
                            <Link href={item.href} title={item.label}
                              className={cn("group flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors", active ? "font-semibold" : "")}
                              style={active ? { backgroundColor: s.accentLight, color: s.accent } : { color: s.textMuted }}
                              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.backgroundColor = s.hover; e.currentTarget.style.color = s.text } }}
                              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = s.textMuted } }}>
                              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", active ? "text-white" : "group-hover:opacity-80")} style={{ backgroundColor: active ? s.accent : 'rgba(0,0,0,0.08)' }}>
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
        <div className="border-t px-2 py-2" style={{ borderColor: s.border }}>
          <Button
            variant="ghost"
            size={showFullNav ? "sm" : "icon"}
            className={cn(
              "h-8 w-full justify-start text-[10px] font-medium uppercase tracking-wide",
              !showFullNav && "w-8"
            )}
            style={{ color: s.textMuted }}
            onClick={handleCycleRailStyle}
            title={`Sidebar style: ${getSidebarRailStyleLabel(railStyle)}`}
          >
            {showFullNav ? `Sidebar style: ${getSidebarRailStyleLabel(railStyle)}` : railStyle.slice(0, 1)}
          </Button>
        </div>
      </aside>
      <div className={cn("flex min-h-screen flex-1 flex-col transition-[margin] duration-200", isNarrow ? "ml-[72px]" : "ml-64")}>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b px-4 sm:px-6" style={{ backgroundColor: page.contentBg, borderColor: page.border }}>
          <div className="flex-1" />
          <div className="flex items-center gap-3 border-l pl-3" style={{ borderColor: page.border }}>
            <div className="hidden text-right sm:block"><p className="text-sm font-medium" style={{ color: page.text }}>{user?.name ?? "Academy"}</p><p className="text-xs" style={{ color: s.accent }}>TalentOS Academy</p></div>
            <Button variant="ghost" size="sm" style={{ color: page.textMuted }} className="hover:opacity-90" onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = page.hover; e.currentTarget.style.color = page.text }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = page.textMuted }} onClick={() => { logout(); router.push("/login") }} title="Logout">
              <LogOut className="h-4 w-4 mr-1.5" />
              Logout
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm" style={{ backgroundColor: s.accent }}>AC</div>
          </div>
        </header>
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">{children}</div>
      </div>
    </div>
    </DashboardThemeProvider>
  )
}
