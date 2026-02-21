"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CalendarCheck, ImageIcon, Wallet, Menu } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { LocaleSwitcher } from "@/shared/components/ui/LocaleSwitcher"

const BASE = "/mobile"

const navItems = [
  { label: "Dashboard", href: BASE, icon: LayoutDashboard },
  { label: "Bookings", href: `${BASE}/bookings`, icon: CalendarCheck },
  { label: "Content", href: `${BASE}/content`, icon: ImageIcon },
  { label: "Wallet", href: `${BASE}/wallet`, icon: Wallet },
]

export function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 md:max-w-md md:mx-auto md:shadow-lg">
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-slate-900">
            TA
          </div>
          <span className="font-semibold text-slate-800">TalentOS</span>
        </div>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <button type="button" className="rounded-lg p-2 hover:bg-slate-100" aria-label="Menu">
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20 pt-4">
        <div className="px-4">{children}</div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white md:left-auto md:right-auto md:max-w-md md:mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== BASE && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-[56px] min-w-[64px] flex-col items-center justify-center gap-0.5 px-2 py-2 text-xs transition-colors",
                  isActive ? "text-amber-600" : "text-slate-500"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
