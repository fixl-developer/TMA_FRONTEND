/**
 * Tenant Template domain types - T1–T8
 *
 * Super Admin view of tenant templates (preset blueprint + module combos).
 * Used for catalog, details, compare, and apply wizard. Seed-data only for now.
 */

export type TemplateId = "T1" | "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "T8"

export interface TenantTemplate {
  id: TemplateId
  code: TemplateId
  name: string
  description: string
  /** Primary use case label */
  useCase: string
  /** Blueprint IDs included in this template (e.g. B1, B2) */
  includedBlueprints: string[]
  /** Default modules enabled */
  defaultModules: string[]
  /** Default workflow names */
  defaultWorkflows: string[]
  /** Default dashboard names */
  defaultDashboards: string[]
  /** Pricing tier suggestion for this template */
  pricingTierRecommendation: string
  /** Tenant count using this template (from seed or computed) */
  tenantCount: number
}
