"use client"

import * as React from "react"
import type { RoleKey, PageTheme } from "@/shared/config/roleDashboardConfig"
import { ROLE_DASHBOARD_CONFIG } from "@/shared/config/roleDashboardConfig"

export interface DashboardThemeValue {
  role: RoleKey
  page: PageTheme
  accent: string
  accentHover: string
}

const defaultTheme: DashboardThemeValue = {
  role: "modelling",
  page: ROLE_DASHBOARD_CONFIG.modelling.page,
  accent: ROLE_DASHBOARD_CONFIG.modelling.accent,
  accentHover: ROLE_DASHBOARD_CONFIG.modelling.accentHover,
}

const DashboardThemeContext = React.createContext<DashboardThemeValue | null>(null)

export function DashboardThemeProvider({
  role,
  children,
}: {
  role: RoleKey
  children: React.ReactNode
}) {
  const cfg = ROLE_DASHBOARD_CONFIG[role]
  const value: DashboardThemeValue = {
    role,
    page: cfg.page,
    accent: cfg.accent,
    accentHover: cfg.accentHover,
  }
  return (
    <DashboardThemeContext.Provider value={value}>
      {children}
    </DashboardThemeContext.Provider>
  )
}

export function useDashboardTheme(): DashboardThemeValue {
  const ctx = React.useContext(DashboardThemeContext)
  return ctx ?? defaultTheme
}
