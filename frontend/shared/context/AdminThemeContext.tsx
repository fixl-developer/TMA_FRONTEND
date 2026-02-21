"use client"

import * as React from "react"

type Theme = "dark" | "light"

interface AdminThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const AdminThemeContext = React.createContext<AdminThemeContextValue | undefined>(undefined)

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("dark")

  React.useEffect(() => {
    // Load theme from localStorage
    const stored = localStorage.getItem("adminTheme") as Theme | null
    if (stored === "light" || stored === "dark") {
      setThemeState(stored)
    }
  }, [])

  React.useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem("adminTheme", theme)
    
    // Apply theme to document
    if (theme === "light") {
      document.documentElement.classList.add("admin-light-theme")
      document.documentElement.classList.remove("admin-dark-theme")
    } else {
      document.documentElement.classList.add("admin-dark-theme")
      document.documentElement.classList.remove("admin-light-theme")
    }
  }, [theme])

  const toggleTheme = React.useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"))
  }, [])

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </AdminThemeContext.Provider>
  )
}

export function useAdminTheme() {
  const context = React.useContext(AdminThemeContext)
  if (!context) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider")
  }
  return context
}
