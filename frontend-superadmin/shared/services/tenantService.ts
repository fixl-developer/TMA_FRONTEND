/**
 * Tenant Service - Super Admin
 *
 * Mock service for tenant-related operations in the Super Admin app.
 * Uses local seed data and simulates API latency.
 * Runtime tenants (from signup or Super Admin create) persist in localStorage.
 */

import { seedTenants } from "@/data/seed"
import type { Tenant } from "@/shared/lib/types/tenants"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const STORAGE_KEY = "talentos_runtime_tenants"
const TENANTS_UPDATED_EVENT = "talentos_tenants_updated"

// In-memory overrides for tenant status (suspend/activate - persists until refresh)
const tenantStatusOverrides: Record<string, Tenant["status"]> = {}

function getRuntimeTenantsSync(): Tenant[] {
  if (typeof window === "undefined") return []
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (!s) return []
    return JSON.parse(s) as Tenant[]
  } catch {
    return []
  }
}

function saveRuntimeTenants(tenants: Tenant[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tenants))
  window.dispatchEvent(new CustomEvent(TENANTS_UPDATED_EVENT))
}

export const getTenants = async (): Promise<Tenant[]> => {
  await delay(200)
  const seed = seedTenants as Tenant[]
  const runtime = getRuntimeTenantsSync()
  const all = [...seed, ...runtime]
  return all.map((t) => {
    const override = tenantStatusOverrides[t._id]
    return override ? { ...t, status: override } : t
  })
}

export interface CreateTenantPayload {
  name: string
  type: Tenant["type"]
  agencyType?: string
  blueprints?: string[]
  slug?: string
  ownerName?: string
  ownerEmail?: string
  subdomain?: string
  countryCode?: string
  timezone?: string
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/** Mock: create tenant (Super Admin or self-serve signup) */
export async function createTenant(payload: CreateTenantPayload): Promise<Tenant> {
  await delay(300)
  const runtime = getRuntimeTenantsSync()
  const slug = payload.slug?.trim() || slugify(payload.name) || "org"
  const baseId = `tenant_${String(24 + runtime.length).padStart(3, "0")}`
  let tenantId = baseId
  let suffix = 0
  while (runtime.some((t) => t._id === tenantId) || (seedTenants as Tenant[]).some((t: Tenant) => t._id === tenantId)) {
    suffix++
    tenantId = `${baseId}_${suffix}`
  }

  const tenant: Tenant = {
    _id: tenantId,
    name: payload.name,
    type: payload.type,
    slug: slug || tenantId,
    status: "PENDING",
    agencyType: payload.agencyType as Tenant["agencyType"],
    blueprints: payload.blueprints,
    email: payload.ownerEmail,
    countryCode: payload.countryCode || "IN",
    timezone: payload.timezone || "Asia/Kolkata",
    settings: payload.subdomain ? { subdomain: payload.subdomain } : {},
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  runtime.push(tenant)
  saveRuntimeTenants(runtime)
  return tenant
}

/** Mock: reject/remove pending tenant */
export async function rejectTenant(tenantId: string): Promise<void> {
  await delay(200)
  const runtime = getRuntimeTenantsSync().filter((t) => t._id !== tenantId)
  saveRuntimeTenants(runtime)
}

/** Mock: suspend tenant */
export const suspendTenant = async (tenantId: string): Promise<void> => {
  await delay(200)
  tenantStatusOverrides[tenantId] = "SUSPENDED"
}

/** Mock: activate tenant */
export const activateTenant = async (tenantId: string): Promise<void> => {
  await delay(200)
  tenantStatusOverrides[tenantId] = "ACTIVE"
}

/** Subscribe to tenant list updates */
export function onTenantsUpdated(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  const handler = () => callback()
  window.addEventListener(TENANTS_UPDATED_EVENT, handler)
  return () => window.removeEventListener(TENANTS_UPDATED_EVENT, handler)
}
