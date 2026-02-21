/**
 * Tenant types - Super Admin
 *
 * Minimal Tenant type used for dashboard views.
 * Mirrors the core Tenant type from the tenant frontend.
 */

/** 22 agency types from overall.md */
export const AGENCY_TYPE = {
  MODELING_AGENCY: "MODELING_AGENCY",
  TALENT_AGENCY: "TALENT_AGENCY",
  CASTING_AGENCY: "CASTING_AGENCY",
  PRODUCTION_HOUSE: "PRODUCTION_HOUSE",
  INFLUENCER_AGENCY: "INFLUENCER_AGENCY",
  UGC_PRODUCTION: "UGC_PRODUCTION",
  SOCIAL_MARKETING_AGENCY: "SOCIAL_MARKETING_AGENCY",
  PAGEANT_ORGANIZER: "PAGEANT_ORGANIZER",
  PAGEANT_TRAINING: "PAGEANT_TRAINING",
  ACTING_ACADEMY: "ACTING_ACADEMY",
  SPEAKER_BUREAU: "SPEAKER_BUREAU",
  SPORTS_AGENCY: "SPORTS_AGENCY",
  EVENT_PROMOTER: "EVENT_PROMOTER",
  PHOTOGRAPHY_AGENCY: "PHOTOGRAPHY_AGENCY",
  STYLING_AGENCY: "STYLING_AGENCY",
  EVENT_STAFFING_AGENCY: "EVENT_STAFFING_AGENCY",
  CREATIVE_RECRUITMENT: "CREATIVE_RECRUITMENT",
  BRAND: "BRAND",
  MEDIA_BUYING_AGENCY: "MEDIA_BUYING_AGENCY",
  TALENT_NETWORK: "TALENT_NETWORK",
  MARKETPLACE_AGGREGATOR: "MARKETPLACE_AGGREGATOR",
  HOLDING_COMPANY: "HOLDING_COMPANY",
} as const

export type AgencyType = (typeof AGENCY_TYPE)[keyof typeof AGENCY_TYPE]

/** B1–B10 blueprints from overall.md */
export const BLUEPRINT = {
  B1: "B1", // Roster + Booking
  B2: "B2", // Casting Pipeline
  B3: "B3", // Season/Competition
  B4: "B4", // Brand Deals + Deliverables
  B5: "B5", // Course/Cohort
  B6: "B6", // Project + Assets
  B7: "B7", // Shift/Staffing
  B8: "B8", // Community + Monetization
  B9: "B9", // Marketplace
  B10: "B10", // Holding/Group
} as const

export type Blueprint = (typeof BLUEPRINT)[keyof typeof BLUEPRINT]

export interface Tenant {
  _id: string
  type: "AGENCY" | "PAGEANT_ORG" | "EVENT_ORG" | "BRAND" | "PLATFORM_INTERNAL" | "HOLDING" | "ACADEMY" | "MARKETPLACE"
  agencyType?: AgencyType | string
  /** Active and enforced blueprints (approved by platform) */
  blueprints?: Blueprint[] | string[]
  /** Founder-selected capabilities (before/after approval) */
  enabledBlueprints?: Blueprint[] | string[]
  /** Platform-approved capabilities */
  approvedBlueprints?: Blueprint[] | string[]
  /** Pending platform approval */
  requestedBlueprints?: Blueprint[] | string[]
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

