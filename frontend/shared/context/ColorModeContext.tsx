"use client"

import * as React from "react"

export type ColorMode = "light" | "dark"

interface ColorModeValue {
  mode: ColorMode
  setMode: (mode: ColorMode) => void
  toggleMode: () => void
}

const ColorModeContext = React.createContext<ColorModeValue | null>(null)

export function ColorModeProvider({
  mode,
  setMode,
  children,
}: {
  mode: ColorMode
  setMode: (mode: ColorMode) => void
  children: React.ReactNode
}) {
  const value = React.useMemo<ColorModeValue>(
    () => ({
      mode,
      setMode,
      toggleMode: () => setMode(mode === "dark" ? "light" : "dark"),
    }),
    [mode, setMode]
  )

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>
}

export function useColorMode(): ColorModeValue {
  const ctx = React.useContext(ColorModeContext)
  if (ctx) return ctx
  return {
    mode: "light",
    setMode: () => undefined,
    toggleMode: () => undefined,
  }
}

