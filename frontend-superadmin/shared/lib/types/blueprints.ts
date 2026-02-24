/**
 * Blueprint domain types - B1–B10
 *
 * Super Admin view of core blueprints with metadata for catalog,
 * configuration and analytics screens. Seed-data only for now.
 */

export type BlueprintId = "B1" | "B2" | "B3" | "B4" | "B5" | "B6" | "B7" | "B8" | "B9" | "B10"

export type BlueprintStatus = "ACTIVE" | "DRAFT" | "DEPRECATED"

export interface Blueprint {
  id: BlueprintId
  /** Short code, usually same as id (e.g. B1) */
  code: BlueprintId
  name: string
  category: string
  status: BlueprintStatus
  description: string
  /** High-level modules included in this blueprint */
  modules: string[]
  /** Key default workflows shipped with this blueprint */
  defaultWorkflows: string[]
  /** Example roles that primarily operate this blueprint */
  primaryRoles: string[]
  /** Quick stats derived from seed data or static for now */
  stats: {
    tenantCount: number
    activeInstances: number
    avgWesScore?: number
  }
  /** For detail/config pages – simple flags only, no runtime behavior yet */
  capabilities: string[]
}

