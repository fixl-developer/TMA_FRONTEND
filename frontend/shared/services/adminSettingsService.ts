/**
 * Admin Settings Service
 *
 * Tenant admin settings. Uses seed data + localStorage overrides.
 */

import { seedAdminSettings, seedTenants } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const STORAGE_KEY = "talentos_admin_settings_overrides"

export interface AdminSettings {
  tenantId: string
  organization: { name: string; slug: string; subdomain: string }
  branding: { primaryColor: string; logo?: string }
  features?: Record<string, boolean>
  updatedAt?: string
}

function getOverrides(): Record<string, Partial<AdminSettings>> {
  if (typeof window === "undefined") return {}
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? JSON.parse(s) : {}
  } catch {
    return {}
  }
}

function saveOverrides(overrides: Record<string, Partial<AdminSettings>>) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

export const getAdminSettings = async (
  tenantId?: string | null
): Promise<AdminSettings | null> => {
  await delay(100)
  const id = tenantId || "tenant_001"
  const list = Array.isArray(seedAdminSettings) ? seedAdminSettings : [seedAdminSettings]
  let s = (list as AdminSettings[]).find((x) => x.tenantId === id) ?? null
  if (!s) {
    const tenant = (seedTenants as { _id: string; name: string; slug: string }[]).find((t) => t._id === id)
    if (tenant) {
      s = {
        tenantId: id,
        organization: { name: tenant.name, slug: tenant.slug, subdomain: `${tenant.slug}.talentos.io` },
        branding: { primaryColor: "#7C3AED" },
      }
    }
  }
  const overrides = getOverrides()[id]
  return s ? { ...s, ...overrides } : null
}

export const updateAdminSettings = async (
  tenantId: string,
  patch: Partial<Pick<AdminSettings, "organization" | "branding">>
): Promise<boolean> => {
  await delay(100)
  const overrides = getOverrides()
  const current = overrides[tenantId] || {}
  const orgPatch = patch.organization
    ? {
        ...patch.organization,
        slug: patch.organization.subdomain?.split(".")[0] || (current.organization as any)?.slug,
      }
    : undefined
  overrides[tenantId] = {
    ...current,
    organization: orgPatch ? { ...(current.organization as any), ...orgPatch } : current.organization,
    branding: patch.branding ? { ...(current.branding as any), ...patch.branding } : current.branding,
    updatedAt: new Date().toISOString(),
  }
  saveOverrides(overrides)
  return true
}
