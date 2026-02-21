export interface Reward {
  _id: string
  tenantId: string
  userId: string
  credits: number
  tier: string
  milestonesReached: number
  lastActivityAt: string
}

export interface LoyaltyTier {
  _id: string
  name: string
  minCredits: number
  maxCredits: number
  benefits: string[]
  color: string
}

export interface DiscountCode {
  _id: string
  tenantId: string
  code: string
  type: "PERCENTAGE" | "FIXED"
  value?: number
  valueMinor?: number
  minOrderMinor: number
  maxUses: number
  usedCount: number
  validFrom: string
  validTo: string
  status: "ACTIVE" | "EXPIRED" | "DISABLED"
}

export interface ActivityLog {
  _id: string
  tenantId: string
  userId: string
  type: string
  creditsEarned?: number
  creditsSpent?: number
  description: string
  createdAt: string
}

export interface RedeemableItem {
  _id: string
  tenantId: string
  name: string
  creditsCost: number
  type: string
  description: string
}
