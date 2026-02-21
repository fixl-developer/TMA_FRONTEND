export type AdCampaignStatus = "DRAFT" | "PENDING" | "ACTIVE" | "PAUSED" | "ENDED"
export type AdObjective = "AWARENESS" | "LEADS" | "CONVERSIONS"
export type CreativeFormat = "IMAGE" | "VIDEO"
export type CreativeStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED"

export interface AdCampaign {
  _id: string
  tenantId: string
  name: string
  status: AdCampaignStatus
  objective: AdObjective
  budgetMinor: number
  spentMinor: number
  startDate: string
  endDate: string
  createdAt?: string
}

export interface AdCreative {
  _id: string
  campaignId: string
  tenantId: string
  name: string
  format: CreativeFormat
  status: CreativeStatus
  previewUrl?: string
  headline?: string
  body?: string
  cta?: string
  createdAt?: string
}

export interface AdTargeting {
  _id: string
  campaignId: string
  tenantId: string
  locations: string[]
  ageMin: number
  ageMax: number
  genders: string[]
  interests: string[]
  createdAt?: string
}

export interface AdPerformance {
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  spendMinor: number
}

export interface AdTrackingLink {
  _id: string
  campaignId: string
  tenantId: string
  name: string
  baseUrl: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmContent?: string
  utmTerm?: string
  fullUrl: string
  clicks: number
  conversions: number
  revenueMinor?: number
  createdAt?: string
}

export interface AttributionOutcome {
  campaignId: string
  campaignName: string
  spendMinor: number
  conversions: number
  revenueMinor: number
  roiPercent: number
}
