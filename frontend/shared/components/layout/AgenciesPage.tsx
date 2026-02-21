"use client"

import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { cn } from "@/shared/lib/utils"

/** Wrapper for all agency/talent dashboard pages – uses role-based page theme from sidebar palette */
export function AgenciesPage({ children, className }: { children: React.ReactNode; className?: string }) {
  const { role, page } = useDashboardTheme()
  const { mode } = useColorMode()
  const isDark = mode === "dark"
  const lightCanvas = role === "modelling" ? "#f8fafc" : page.bg
  const lightText = role === "modelling" ? "#111827" : page.text
  const cardBg = isDark ? "rgba(255, 255, 255, 0.05)" : "#ffffff"
  const cardBorder = isDark ? "rgba(255, 255, 255, 0.1)" : "#e5e7eb"
  const mutedText = isDark ? "rgba(255, 255, 255, 0.6)" : "#6b7280"
  const hoverBg = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(17,24,39,0.04)"
  return (
    <main
      id="main-content"
      role="main"
      className={cn("min-h-full min-w-0 transition-colors", className)}
      style={{
        background: isDark
          ? "linear-gradient(to bottom right, #1a0b2e, #3d1f47, #6b2d5c)"
          : undefined,
        backgroundColor: isDark ? undefined : lightCanvas,
        color: isDark ? "#ffffff" : lightText,
        ["--agency-card-bg" as string]: cardBg,
        ["--agency-card-border" as string]: cardBorder,
        ["--agency-text" as string]: isDark ? "#ffffff" : lightText,
        ["--agency-muted" as string]: mutedText,
        ["--agency-hover" as string]: hoverBg,
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] min-w-0 overflow-x-hidden px-4 py-8 sm:px-6 lg:px-10">{children}</div>
    </main>
  )
}
