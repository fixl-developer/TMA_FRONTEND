"use client"

export type SidebarRailStyle = "minimal" | "pill" | "boxed"

const SIDEBAR_RAIL_STYLE_KEY = "talentos_sidebar_rail_style"

export function getSidebarRailStyle(): SidebarRailStyle {
  if (typeof window === "undefined") return "minimal"
  const stored = localStorage.getItem(SIDEBAR_RAIL_STYLE_KEY)
  if (stored === "pill" || stored === "boxed" || stored === "minimal") return stored
  return "minimal"
}

export function saveSidebarRailStyle(style: SidebarRailStyle): void {
  if (typeof window === "undefined") return
  localStorage.setItem(SIDEBAR_RAIL_STYLE_KEY, style)
}

export function cycleSidebarRailStyle(style: SidebarRailStyle): SidebarRailStyle {
  if (style === "minimal") return "pill"
  if (style === "pill") return "boxed"
  return "minimal"
}

export function getSidebarRailStyleLabel(style: SidebarRailStyle): string {
  if (style === "minimal") return "Minimal"
  if (style === "pill") return "Pill"
  return "Boxed"
}

export function getRailItemClass(style: SidebarRailStyle, active: boolean): string {
  if (style === "pill") {
    return active ? "rounded-full border border-current/40" : "rounded-full border border-transparent"
  }
  if (style === "boxed") {
    return active ? "rounded-md border border-current/40 shadow-sm" : "rounded-md border border-transparent"
  }
  return "rounded-lg"
}
