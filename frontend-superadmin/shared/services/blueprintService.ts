/**
 * Blueprint Service - Super Admin
 *
 * Seed-backed service for B1–B10 blueprint catalog, details and
 * basic analytics. Mirrors the patterns used in other mock services.
 */

import { seedBlueprints } from "@/data/seed"
import type { Blueprint, BlueprintId } from "@/shared/lib/types/blueprints"
import type { Tenant } from "@/shared/lib/types/tenants"
import { getTenants } from "@/shared/services/tenantService"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const BLUEPRINT_OVERRIDES_KEY = "talentos_blueprint_overrides_v1"

function getOverridesSync(): Partial<Record<BlueprintId, Partial<Blueprint>>> {
  if (typeof window === "undefined") return {}
  try {
    const s = localStorage.getItem(BLUEPRINT_OVERRIDES_KEY)
    if (!s) return {}
    return JSON.parse(s) as Partial<Record<BlueprintId, Partial<Blueprint>>>
  } catch {
    return {}
  }
}

function saveOverrides(overrides: Partial<Record<BlueprintId, Partial<Blueprint>>>) {
  if (typeof window === "undefined") return
  localStorage.setItem(BLUEPRINT_OVERRIDES_KEY, JSON.stringify(overrides))
}

export const getBlueprints = async (): Promise<Blueprint[]> => {
  await delay(150)
  const seed = seedBlueprints as Blueprint[]
  const overrides = getOverridesSync()
  return seed.map((b) => ({ ...b, ...(overrides[b.id] ?? {}) }))
}

export const getBlueprintById = async (id: BlueprintId): Promise<Blueprint | undefined> => {
  await delay(120)
  const seed = (seedBlueprints as Blueprint[]).find((b) => b.id === id)
  if (!seed) return undefined
  const overrides = getOverridesSync()
  return { ...seed, ...(overrides[id] ?? {}) }
}

export interface BlueprintTenantSummary {
  blueprintId: BlueprintId
  tenants: Tenant[]
}

export const getBlueprintTenants = async (id: BlueprintId): Promise<BlueprintTenantSummary> => {
  await delay(160)
  const tenants = (await getTenants()).filter((t) =>
    (t.blueprints as string[] | undefined)?.includes(id)
  )
  return {
    blueprintId: id,
    tenants,
  }
}

export type UpdateBlueprintConfigPayload = Pick<
  Blueprint,
  "modules" | "defaultWorkflows" | "primaryRoles" | "capabilities" | "status" | "category" | "description" | "name"
>

export const updateBlueprintConfig = async (
  id: BlueprintId,
  patch: Partial<UpdateBlueprintConfigPayload>
): Promise<Blueprint> => {
  await delay(220)
  const current = await getBlueprintById(id)
  if (!current) {
    throw new Error("Blueprint not found")
  }
  const overrides = getOverridesSync()
  const nextOverride = { ...(overrides[id] ?? {}), ...patch }
  const next = { ...current, ...patch }
  saveOverrides({ ...overrides, [id]: nextOverride })
  return next
}

