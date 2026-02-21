"use client"

import { useColorMode } from "@/shared/context/ColorModeContext"

export function usePageantModeStyles() {
  const { mode } = useColorMode()
  const isDark = mode === "dark"

  return {
    isDark,
    cardVariant: isDark ? ("dark" as const) : ("default" as const),
    colors: isDark
      ? {
          title: "#f8fafc",
          text: "#e2e8f0",
          textMuted: "#94a3b8",
          textSoft: "#64748b",
          border: "#334155",
          surface: "#111827",
          surfaceAlt: "#0f172a",
          hover: "#1e293b",
          inputBg: "#0f172a",
        }
      : {
          title: "#0f172a",
          text: "#1e293b",
          textMuted: "#475569",
          textSoft: "#64748b",
          border: "#e2e8f0",
          surface: "#ffffff",
          surfaceAlt: "#f8fafc",
          hover: "#f8fafc",
          inputBg: "#ffffff",
        },
  }
}

