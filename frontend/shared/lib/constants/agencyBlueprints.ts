/**
 * Agency Type → Blueprint mapping from overall.md
 * Used for tenant configuration and UI display.
 */

import type { AgencyType } from "@/shared/lib/types/tenants"

export const AGENCY_TYPE_BLUEPRINT_MAP: Record<AgencyType, string[]> = {
  MODELING_AGENCY: ["B1"],
  TALENT_AGENCY: ["B1", "B2"],
  CASTING_AGENCY: ["B2"],
  PRODUCTION_HOUSE: ["B2", "B6"],
  INFLUENCER_AGENCY: ["B4", "B8"],
  UGC_PRODUCTION: ["B6", "B4"],
  SOCIAL_MARKETING_AGENCY: ["B4", "B8"],
  PAGEANT_ORGANIZER: ["B3", "B8"],
  PAGEANT_TRAINING: ["B5", "B1"],
  ACTING_ACADEMY: ["B5", "B1"],
  SPEAKER_BUREAU: ["B1"],
  SPORTS_AGENCY: ["B1", "B4"],
  EVENT_PROMOTER: ["B1", "B6", "B4"],
  PHOTOGRAPHY_AGENCY: ["B6"],
  STYLING_AGENCY: ["B1", "B7"],
  EVENT_STAFFING_AGENCY: ["B7", "B1"],
  CREATIVE_RECRUITMENT: ["B2", "B6"],
  BRAND: ["B4"],
  MEDIA_BUYING_AGENCY: ["B4"],
  TALENT_NETWORK: ["B8", "B1"],
  MARKETPLACE_AGGREGATOR: ["B9"],
  HOLDING_COMPANY: ["B10"],
}

/** Human-readable agency type labels */
export const AGENCY_TYPE_LABELS: Record<AgencyType, string> = {
  MODELING_AGENCY: "Modeling",
  TALENT_AGENCY: "Talent",
  CASTING_AGENCY: "Casting",
  PRODUCTION_HOUSE: "Production",
  INFLUENCER_AGENCY: "Influencer",
  UGC_PRODUCTION: "UGC",
  SOCIAL_MARKETING_AGENCY: "Social Marketing",
  PAGEANT_ORGANIZER: "Pageant",
  PAGEANT_TRAINING: "Pageant Training",
  ACTING_ACADEMY: "Academy",
  SPEAKER_BUREAU: "Speaker Bureau",
  SPORTS_AGENCY: "Sports",
  EVENT_PROMOTER: "Event Promoter",
  PHOTOGRAPHY_AGENCY: "Photography",
  STYLING_AGENCY: "Styling",
  EVENT_STAFFING_AGENCY: "Event Staffing",
  CREATIVE_RECRUITMENT: "Creative Recruitment",
  BRAND: "Brand",
  MEDIA_BUYING_AGENCY: "Media Buying",
  TALENT_NETWORK: "Talent Network",
  MARKETPLACE_AGGREGATOR: "Marketplace",
  HOLDING_COMPANY: "Holding",
}
