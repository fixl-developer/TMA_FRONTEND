"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { seedTenants, seedUsers } from "@/data/seed"
import type { Tenant } from "@/shared/lib/types/tenants"
import { useAuth } from "./AuthContext"
import { getTenantsSync, getSessionTenantIds, onTenantsUpdated } from "@/shared/services/tenantService"

const STORAGE_KEY = "talentos_selected_tenant"

// Fallback when user not found in seedUsers (legacy role-based mapping)
const ROLE_DEFAULT_TENANT: Record<string, string> = {
  admin: "tenant_001",
  modelling: "tenant_001",
  pageant: "tenant_002",
  "talent-mgmt": "tenant_001",
  academy: "tenant_001",
  influencer: "tenant_001",
}

function getStoredTenantId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORAGE_KEY)
}

function setStoredTenantId(tenantId: string | null) {
  if (typeof window === "undefined") return
  if (tenantId) localStorage.setItem(STORAGE_KEY, tenantId)
  else localStorage.removeItem(STORAGE_KEY)
}

interface TenantContextValue {
  currentTenant: Tenant | null
  tenants: Tenant[]
  tenantId: string | null
  setTenantId: (id: string) => void
  switchTenant: (id: string) => void
}

const TenantContext = React.createContext<TenantContextValue | null>(null)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [tenantId, setTenantIdState] = React.useState<string | null>(null)
  const [mounted, setMounted] = React.useState(false)
  const [tenants, setTenants] = React.useState<Tenant[]>(() => getTenantsSync())

  React.useEffect(() => {
    const unsubscribe = onTenantsUpdated(() => setTenants(getTenantsSync()))
    return unsubscribe
  }, [])

  // Determine available tenants for current user
  const availableTenantIds = React.useMemo(() => {
    if (!user) return []
    if (user.role === "superadmin") return tenants.map((t) => t._id)
    // Look up user in seedUsers by email to get tenantIds
    const seedUser = (seedUsers as { email?: string; tenantIds?: string[] }[]).find(
      (u) => u.email?.toLowerCase() === user.email?.toLowerCase()
    )
    let ids: string[] = seedUser?.tenantIds?.length ? [...seedUser.tenantIds] : []
    if (ids.length === 0) {
      const defaultId = ROLE_DEFAULT_TENANT[user.role]
      if (defaultId) ids = [defaultId]
    }
    // Add session tenant IDs (e.g. from signup - new tenant created this session)
    const sessionIds = getSessionTenantIds()
    sessionIds.forEach((id) => {
      if (!ids.includes(id) && tenants.some((t) => t._id === id)) ids.push(id)
    })
    return ids
  }, [user, tenants])

  // Initialize tenant on mount; prefer tenantId from URL (e.g. after signup)
  React.useEffect(() => {
    const fromUrl = searchParams?.get("tenantId")
    const stored = getStoredTenantId()
    const candidate = fromUrl && availableTenantIds.includes(fromUrl)
      ? fromUrl
      : stored && availableTenantIds.includes(stored)
      ? stored
      : availableTenantIds.length > 0
      ? availableTenantIds[0]
      : null
    if (candidate) {
      setTenantIdState(candidate)
      setStoredTenantId(candidate)
    } else {
      setTenantIdState(null)
    }
    setMounted(true)
  }, [availableTenantIds.join(","), searchParams?.get("tenantId")])

  const setTenantId = React.useCallback((id: string) => {
    if (!availableTenantIds.includes(id)) return
    setTenantIdState(id)
    setStoredTenantId(id)
  }, [availableTenantIds])

  const switchTenant = React.useCallback((id: string) => {
    setTenantId(id)
  }, [setTenantId])

  const currentTenant = React.useMemo(() => {
    if (!tenantId || !mounted) return null
    return tenants.find((t) => t._id === tenantId) ?? null
  }, [tenantId, tenants, mounted])

  const value: TenantContextValue = {
    currentTenant,
    tenants: tenants.filter((t) => availableTenantIds.includes(t._id)),
    tenantId,
    setTenantId,
    switchTenant,
  }

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const ctx = React.useContext(TenantContext)
  if (!ctx) throw new Error("useTenant must be used within TenantProvider")
  return ctx
}
