"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const STORAGE_KEY = "talentos-recently-visited"
const MAX_ITEMS = 5
const SKIP_PREFIXES = ["/login", "/signup", "/forgot-password", "/reset-password", "/onboarding"]

function getLabelFromPath(path: string): string {
  const parts = path.split("/").filter(Boolean)
  if (parts.length === 0) return "Home"
  const last = parts[parts.length - 1]
  if (last === "admin" || last === "modelling" || last === "pageant" || last === "academy" || last === "influencer" || last === "talent-mgmt") return "Dashboard"
  return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export function useRecentlyVisited() {
  const pathname = usePathname()
  const [items, setItems] = useState<{ path: string; label: string }[]>([])

  useEffect(() => {
    if (typeof window === "undefined" || !pathname) return
    if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) return
    if (pathname === "/") return

    const stored = localStorage.getItem(STORAGE_KEY)
    let list: { path: string; label: string }[] = []
    try {
      if (stored) list = JSON.parse(stored)
    } catch {
      list = []
    }

    const existing = list.findIndex((x) => x.path === pathname)
    if (existing >= 0) list.splice(existing, 1)
    list.unshift({ path: pathname, label: getLabelFromPath(pathname) })
    list = list.slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    setItems(list)
  }, [pathname])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch {
        setItems([])
      }
    }
  }, [])

  return items
}
