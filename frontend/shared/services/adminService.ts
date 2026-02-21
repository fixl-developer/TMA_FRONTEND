/**
 * Admin Service - Tenant Admin
 *
 * Tenant-scoped data for admin dashboard.
 * Pass tenantId from useTenant() when calling these functions.
 */

import { seedUsers, seedTalents, seedCastings, seedPageants, seedRetentionPolicies, seedCampaigns, seedCourses, seedTeams, seedBookings, seedDsrRequests, seedUserConsents } from "@/data/seed"
import { getTenantRoles } from "@/shared/services/roleService"
import complianceMapping from "@/data/seed/complianceMapping.json"
import { ROLE_NAME_TO_PLATFORM, ROLE_PLATFORM_TO_NAME } from "@/shared/lib/roles"

const DEFAULT_TENANT = "tenant_001"
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const STORAGE_KEY = "talentos_user_role_overrides"
const STATUS_STORAGE_KEY = "talentos_user_status_overrides"

function resolveTenantId(tenantId?: string | null) {
  return tenantId || DEFAULT_TENANT
}

function getRoleOverrides(): Record<string, string> {
  if (typeof window === "undefined") return {}
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? JSON.parse(s) : {}
  } catch {
    return {}
  }
}

function saveRoleOverrides(overrides: Record<string, string>) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

function getStatusOverrides(): Record<string, string> {
  if (typeof window === "undefined") return {}
  try {
    const s = localStorage.getItem(STATUS_STORAGE_KEY)
    return s ? JSON.parse(s) : {}
  } catch {
    return {}
  }
}

function saveStatusOverrides(overrides: Record<string, string>) {
  if (typeof window === "undefined") return
  localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(overrides))
}

export const getTenantUsers = async (tenantId?: string | null) => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  const base = (seedUsers as any[]).filter((u) => u.tenantIds?.includes(id))
  const overrides = getRoleOverrides()
  const roles = getTenantRoles(id)

  const statusOverrides = getStatusOverrides()

  return base.map((u) => {
    const key = `${id}_${u._id}`
    let out = { ...u }
    const roleId = overrides[key]
    if (roleId) {
      const role = roles.find((r) => r._id === roleId && r.tenantId === id)
      if (role) {
        const platformRole = ROLE_NAME_TO_PLATFORM[role.name]
        out = { ...out, role: platformRole ?? role.name }
      }
    }
    const statusOverride = statusOverrides[key]
    if (statusOverride) {
      out = { ...out, status: statusOverride }
    }
    return out
  })
}

export const assignRoleToUser = async (
  tenantId: string,
  userId: string,
  roleId: string
): Promise<boolean> => {
  await delay(100)
  const id = resolveTenantId(tenantId)
  const overrides = getRoleOverrides()
  overrides[`${id}_${userId}`] = roleId
  saveRoleOverrides(overrides)
  return true
}

export const suspendUser = async (
  tenantId: string,
  userId: string,
  reason?: string
): Promise<boolean> => {
  await delay(100)
  const id = resolveTenantId(tenantId)
  const overrides = getStatusOverrides()
  overrides[`${id}_${userId}`] = "SUSPENDED"
  saveStatusOverrides(overrides)
  return true
}

export const activateUser = async (tenantId: string, userId: string): Promise<boolean> => {
  await delay(100)
  const id = resolveTenantId(tenantId)
  const overrides = getStatusOverrides()
  overrides[`${id}_${userId}`] = "ACTIVE"
  saveStatusOverrides(overrides)
  return true
}

/** Get roleId for a user in a tenant (for pre-selecting in UserDetailModal) */
export function getRoleIdForUser(
  tenantId: string,
  userId: string,
  userRole?: string
): string | undefined {
  const id = resolveTenantId(tenantId)
  const overrides = getRoleOverrides()
  const override = overrides[`${id}_${userId}`]
  if (override) return override
  const roleName = userRole ? ROLE_PLATFORM_TO_NAME[userRole] : undefined
  if (!roleName) return undefined
  const roles = getTenantRoles(id)
  const role = roles.find((r) => r.tenantId === id && r.name === roleName)
  return role?._id
}

export const getTenantTeams = async (tenantId?: string | null) => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  return (seedTeams as any[]).filter((t: any) => t.tenantId === id)
}

export const getTenantTalents = async (tenantId?: string | null) => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  return (seedTalents as any[]).filter((t) => t.tenantId === id)
}

export const getTenantCastings = async (tenantId?: string | null) => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  return (seedCastings as any[]).filter((c) => c.tenantId === id)
}

export const getTenantEvents = async (tenantId?: string | null) => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  return (seedPageants as any[]).filter((p) => p.tenantId === id)
}

export const getComplianceStatus = async () => {
  await delay(150)
  return {
    status: "OK" as const,
    frameworks: Object.entries(complianceMapping as Record<string, any[]>).map(([name, controls]) => ({
      name,
      controls: controls.length,
      implemented: controls.filter((c: any) => c.status === "IMPLEMENTED").length,
    })),
    retentionPolicies: seedRetentionPolicies as any[],
  }
}

export const getDsrRequests = async (tenantId?: string | null) => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  return (seedDsrRequests as any[]).filter((r) => r.tenantId === id)
}

export const getConsents = async (tenantId?: string | null) => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  return (seedUserConsents as any[]).filter((c) => c.tenantId === id)
}

export const getTenantLimits = async (tenantId?: string | null) => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  const users = (seedUsers as any[]).filter((u) => u.tenantIds?.includes(id))
  const talents = (seedTalents as any[]).filter((t) => t.tenantId === id)
  const castings = (seedCastings as any[]).filter((c) => c.tenantId === id)
  return {
    users: { used: users.length, limit: 50 },
    talents: { used: talents.length, limit: 200 },
    castings: { used: castings.length, limit: 100 },
    storage: { used: 2.4, limit: 50, unit: "GB" },
  }
}

export const getTenantRisk = async (tenantId?: string | null) => {
  await delay(150)
  resolveTenantId(tenantId) // ensure tenant context used
  return {
    level: "LOW" as const,
    score: 12,
    factors: [
      { name: "Payment history", status: "OK" },
      { name: "Dispute rate", status: "OK" },
      { name: "Compliance", status: "OK" },
    ],
  }
}

export const getTenantCampaigns = async (tenantId?: string | null) => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  return (seedCampaigns as any[]).filter((c) => c.tenantId === id)
}

export const getTenantCourses = async (tenantId?: string | null) => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  return (seedCourses as any[]).filter((c) => c.tenantId === id)
}

export const getTenantDashboardStats = async (tenantId?: string | null) => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  const users = (seedUsers as any[]).filter((u) => u.tenantIds?.includes(id))
  const talents = (seedTalents as any[]).filter((t) => t.tenantId === id)
  const castings = (seedCastings as any[]).filter((c) => c.tenantId === id)
  const bookings = (seedBookings as any[]).filter((b: any) => b.tenantId === id)
  const roles = getTenantRoles(id)
  const activeTalents = talents.filter((t: any) => t.status !== "INACTIVE").length
  const openJobs = castings.filter((c: any) => ["OPEN", "SHORTLISTING"].includes(c.status)).length
  const pendingBookings = bookings.filter((b: any) => ["INQUIRY", "OPTION_HOLD"].includes(b.stage)).length
  // 7-day mock sparkline data (last 7 days)
  const base = activeTalents || 1
  const sparklineTalents = [base - 1, base, base, base - 1, base, base + 1, base].map((v) => Math.max(0, v))
  const sparklineJobs = [openJobs - 1, openJobs, openJobs + 1, openJobs, openJobs - 1, openJobs, openJobs].map((v) => Math.max(0, v))
  const sparklineBookings = [pendingBookings, pendingBookings + 1, pendingBookings, pendingBookings - 1, pendingBookings, pendingBookings - 1, pendingBookings].map((v) => Math.max(0, v))
  const sparklineRevenue = [2, 2.2, 2.1, 2.3, 2.2, 2.4, 2.4] // mock 7-day trend

  return {
    users: users.filter((u) => u.status === "ACTIVE").length,
    roles: roles.length,
    talents: talents.length,
    castings: castings.length,
    activeTalents,
    openJobs,
    pendingBookings,
    revenue: "₹2.4L",
    compliance: "OK" as const,
    walletBalance: "₹2.4L",
    sparklineTalents,
    sparklineJobs,
    sparklineBookings,
    sparklineRevenue,
    // Chart data (last 6 months mock)
    bookingsByMonth: [
      { month: "Jan", count: 2 },
      { month: "Feb", count: 4 },
      { month: "Mar", count: 3 },
      { month: "Apr", count: 5 },
      { month: "May", count: 6 },
      { month: "Jun", count: pendingBookings + 3 },
    ],
    jobStatusBreakdown: [
      { name: "Open", value: castings.filter((c: any) => c.status === "OPEN").length },
      { name: "Shortlisting", value: castings.filter((c: any) => c.status === "SHORTLISTING").length },
      { name: "Closed", value: castings.filter((c: any) => !["OPEN", "SHORTLISTING"].includes(c.status)).length },
    ],
  }
}
