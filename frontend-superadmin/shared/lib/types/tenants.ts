/**
 * Tenant types - Super Admin
 *
 * Minimal Tenant type used for dashboard views.
 * Mirrors the core Tenant type from the tenant frontend.
 */

export interface Tenant {
  _id: string
  type: "AGENCY" | "PAGEANT_ORG" | "EVENT_ORG" | "BRAND" | "PLATFORM_INTERNAL" | "HOLDING" | "ACADEMY" | "MARKETPLACE"
  agencyType?: string
  /** Active and enforced blueprints (approved by platform) */
  blueprints?: string[]
  /** Founder-selected capabilities (before/after approval) */
  enabledBlueprints?: string[]
  /** Platform-approved capabilities */
  approvedBlueprints?: string[]
  /** Pending platform approval */
  requestedBlueprints?: string[]
  name: string
  slug: string
  email?: string
  description?: string
  status: "ACTIVE" | "SUSPENDED" | "DELETED" | "PENDING"
  timezone?: string
  countryCode?: string
  /** B10: parent holding company tenant ID */
  parentTenantId?: string
  settings?: Record<string, any>
  createdAt?: Date
  updatedAt?: Date
}

