/**
 * Blueprint Service - B1–B10 configs, role packs, module toggles
 *
 * Uses seed data. Tenant-scoped for blueprint assignment.
 */

import { seedBlueprintConfigs, seedRolePacks, seedTenants } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface BlueprintConfig {
  _id: string
  name: string
  description: string
  modules: string[]
  rolePacks: string[]
}

export interface RolePack {
  _id: string
  code: string
  name: string
  capabilities: string[]
}

export const getBlueprintConfigs = async (): Promise<BlueprintConfig[]> => {
  await delay(120)
  return seedBlueprintConfigs as BlueprintConfig[]
}

export const getRolePacks = async (): Promise<RolePack[]> => {
  await delay(120)
  return seedRolePacks as RolePack[]
}

export const getTenantBlueprints = async (
  tenantId?: string | null
): Promise<string[]> => {
  await delay(80)
  const id = tenantId || "tenant_001"
  const tenant = (seedTenants as any[]).find((t) => t._id === id)
  return (tenant?.blueprints as string[]) ?? []
}

export const getTenantBlueprintConfigs = async (
  tenantId?: string | null
): Promise<BlueprintConfig[]> => {
  await delay(150)
  const blueprints = await getTenantBlueprints(tenantId)
  const configs = (seedBlueprintConfigs as BlueprintConfig[]).filter((b) =>
    blueprints.includes(b._id)
  )
  return configs
}
