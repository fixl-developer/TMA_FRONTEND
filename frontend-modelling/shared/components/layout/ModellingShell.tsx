"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  UserCircle2,
  Megaphone,
  Calendar,
  FileSignature,
  Menu,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"

interface NavSection {
  label: string
  items: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[]
}

const navSections: NavSection[] = [
  { label: "Overview", items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }] },
  { label: "Talent CRM", items: [{ label: "Talent", href: "/talent", icon: UserCircle2 }] },
  { label: "Castings", items: [{ label: "Castings", href: "/castings", icon: Megaphone }] },
  { label: "Bookings", items: [{ label: "Bookings", href: "/bookings", icon: Calendar }] },
  { label: "Contracts", items: [{ label: "Contracts", href: "/contracts", icon: FileSignature }] },
]

export function ModellingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(navSections.map((s) => s.label))
  )

  React.useEffect(() => {
    const stored = localStorage.getItem("modellingSidebarCollapsed")
    if (stored === "true") setCollapsed(true)
  }, [])

  React.useEffect(() => {
    localStorage.setItem("modellingSidebarCollapsed", String(collapsed))
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
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-slate-800 bg-slate-900/95 backdrop-blur-sm shadow-2xl shadow-black/40 transition-[width] duration-200",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-sm font-bold text-slate-900 shadow-lg shadow-amber-500/20">
              MA
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-display truncate text-xs font-semibold tracking-wide text-white">TalentOS</p>
                <p className="truncate text-[10px] text-amber-400/90">Modelling Agency</p>
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setCollapsed((v) => !v)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {navSections.map((section) => {
            const isExpanded = collapsed || expandedSections.has(section.label)
            return (
              <div key={section.label} className="mb-1">
                {!collapsed && (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.label)}
                    className="flex w-full items-center justify-between px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300"
                  >
                    {section.label}
                    <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-90")} />
                  </button>
                )}
                {isExpanded && (
                  <ul className="space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const active = (item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href))
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={cn(
                              "group flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors",
                              active ? "bg-amber-500/15 font-medium text-amber-400" : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                active ? "bg-amber-500/30 text-amber-400" : "bg-slate-800 text-slate-500 group-hover:bg-slate-700 group-hover:text-slate-300"
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
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
      </aside>

      <div className={cn("flex min-h-screen flex-1 flex-col", collapsed ? "ml-[72px]" : "ml-64")}>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 sm:px-6">
          <div className="flex-1" />
          <div className="flex items-center gap-3 border-l border-slate-700 pl-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-white">Modelling Agency</p>
              <p className="text-xs text-amber-400/80">Elite Models Co</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/20">
              MA
            </div>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
