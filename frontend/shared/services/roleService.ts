/**
 * Role Service - Create custom roles from templates
 *
 * Persists custom roles to localStorage. Merges with seed roles.
 */

import { seedRoles } from "@/data/seed"

const STORAGE_KEY = "talentos_custom_roles"

function getCustomRoles(): any[] {
  if (typeof window === "undefined") return []
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? JSON.parse(s) : []
  } catch {
    return []
  }
}

function saveCustomRoles(roles: any[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(roles))
}

export function getTenantRoles(tenantId: string): any[] {
  const id = tenantId || "tenant_001"
  const seed = (seedRoles as any[]).filter((r) => r.tenantId === id)
  const custom = getCustomRoles().filter((r) => r.tenantId === id)
  return [...seed, ...custom]
}

export async function createRole(
  tenantId: string,
  name: string,
  capabilities: string[],
  isSystem = false
): Promise<any> {
  const id = tenantId || "tenant_001"
  const custom = getCustomRoles()
  const roleId = `role_custom_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  const role = {
    _id: roleId,
    tenantId: id,
    name: name.trim(),
    isSystem,
    capabilities: capabilities.filter(Boolean),
  }
  custom.push(role)
  saveCustomRoles(custom)
  return role
}
