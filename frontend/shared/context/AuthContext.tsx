"use client"

import * as React from "react"

export type UserRole = "admin" | "modelling" | "pageant" | "talent-mgmt" | "academy" | "influencer"

export interface AuthUser {
  email: string
  role: UserRole
  name: string
}

// Seed user role mapping
const SEED_ROLE_MAP: Record<string, UserRole> = {
  SUPER_ADMIN: "admin",
  TENANT_OWNER: "admin",
  ADMIN: "admin",
  AGENT: "modelling",
  TALENT: "modelling",
}

const DEMO_USERS: Record<string, { password: string; role: UserRole; name: string }> = {
  "admin@talentos.io": { password: "demo123", role: "admin", name: "Tenant Admin" },
  "modelling@talentos.io": { password: "demo123", role: "modelling", name: "Modelling Agency" },
  "pageant@talentos.io": { password: "demo123", role: "pageant", name: "Pageant Organizer" },
  "talent-mgmt@talentos.io": { password: "demo123", role: "talent-mgmt", name: "Talent Management" },
  "academy@talentos.io": { password: "demo123", role: "academy", name: "Academy" },
  "influencer@talentos.io": { password: "demo123", role: "influencer", name: "Influencer Agency" },
  // Seed users (from users.json) - password: demo123
  "rajesh@elite-models.com": { password: "demo123", role: "admin", name: "Rajesh Kumar" },
  "meera@miss-india.com": { password: "demo123", role: "pageant", name: "Meera Singh" },
  "arjun@talent-hub.com": { password: "demo123", role: "admin", name: "Arjun Nair" },
  "admin@talentos.com": { password: "demo123", role: "admin", name: "Platform Admin" },
  "priya@elite-models.com": { password: "demo123", role: "modelling", name: "Priya Mehta" },
  "anil@elite-models.com": { password: "demo123", role: "admin", name: "Anil Sharma" },
  "vikram@miss-india.com": { password: "demo123", role: "pageant", name: "Vikram Reddy" },
  // New tenant owners (Phase 3) - password: demo123
  "owner@fashion-forward.com": { password: "demo123", role: "admin", name: "Neha Verma" },
  "owner@showcase-events.com": { password: "demo123", role: "admin", name: "Ravi Mehta" },
  "owner@spotlight-talent.com": { password: "demo123", role: "admin", name: "Kavita Desai" },
  "owner@metro-casting.com": { password: "demo123", role: "admin", name: "Sanjay Pillai" },
  "owner@studio-nine.com": { password: "demo123", role: "admin", name: "Divya Nair" },
  "owner@creatorverse.com": { password: "demo123", role: "admin", name: "Ananya Krishnan" },
  "owner@pixel-perfect-ugc.com": { password: "demo123", role: "admin", name: "Rohit Sharma" },
  "owner@social-buzz.com": { password: "demo123", role: "admin", name: "Pooja Reddy" },
  "owner@crown-grooming.com": { password: "demo123", role: "admin", name: "Lakshmi Iyer" },
  "owner@national-acting.com": { password: "demo123", role: "admin", name: "Vikram Joshi" },
  "owner@keynote-speakers.com": { password: "demo123", role: "admin", name: "Meera Kapoor" },
  "owner@pro-sports-talent.com": { password: "demo123", role: "admin", name: "Arjun Malhotra" },
  "owner@lens-frame.com": { password: "demo123", role: "admin", name: "Sneha Patel" },
  "owner@glam-squad.com": { password: "demo123", role: "admin", name: "Priya Menon" },
  "owner@eventforce.com": { password: "demo123", role: "admin", name: "Rahul Gupta" },
  "owner@creative-recruit.com": { password: "demo123", role: "admin", name: "Anita Rao" },
  "owner@advantage-media.com": { password: "demo123", role: "admin", name: "Karan Singh" },
  "owner@talent-connect.com": { password: "demo123", role: "admin", name: "Deepa Nambiar" },
  "owner@gighub.com": { password: "demo123", role: "admin", name: "Suresh Kumar" },
  "owner@talentos-holdings.com": { password: "demo123", role: "admin", name: "Group Admin" },
}

const DASHBOARD_PATH: Record<UserRole, string> = {
  admin: "/admin",
  modelling: "/modelling",
  pageant: "/pageant",
  "talent-mgmt": "/talent-mgmt",
  academy: "/academy",
  influencer: "/influencer",
}

const STORAGE_KEY = "talentos_demo_user"

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (!s) return null
    return JSON.parse(s) as AuthUser
  } catch {
    return null
  }
}

function setStoredUser(user: AuthUser | null) {
  if (typeof window === "undefined") return
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  else localStorage.removeItem(STORAGE_KEY)
}

interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
  dashboardPath: string | null
  /** True after auth state has been read from storage (avoids redirecting before we know if user is logged in) */
  isReady: boolean
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setUser(getStoredUser())
    setMounted(true)
  }, [])

  const login = React.useCallback((email: string, password: string) => {
    const key = email.trim().toLowerCase()
    const demo = DEMO_USERS[key]
    if (!demo || demo.password !== password) {
      return { ok: false, error: "Invalid email or password" }
    }
    const authUser: AuthUser = { email: key, role: demo.role, name: demo.name }
    setUser(authUser)
    setStoredUser(authUser)
    return { ok: true }
  }, [])

  const logout = React.useCallback(() => {
    setUser(null)
    setStoredUser(null)
  }, [])

  const dashboardPath = user ? DASHBOARD_PATH[user.role] : null

  const value: AuthContextValue = { user, login, logout, dashboardPath, isReady: mounted }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export { DEMO_USERS, DASHBOARD_PATH }
