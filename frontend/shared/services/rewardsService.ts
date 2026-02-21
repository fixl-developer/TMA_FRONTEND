import {
  seedRewards,
  seedLoyaltyTiers,
  seedDiscountCodes,
  seedActivityLogs,
  seedRedeemableItems,
} from "@/data/seed"
import type {
  Reward,
  LoyaltyTier,
  DiscountCode,
  ActivityLog,
  RedeemableItem,
} from "@/shared/lib/types/rewards"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const DEMO_USER = "user_001"
const DEMO_TENANT = "tenant_001"

export async function getRewardByUser(tenantId: string, userId: string): Promise<Reward | null> {
  await delay(80)
  return (seedRewards as Reward[]).find((r) => r.tenantId === tenantId && r.userId === userId) ?? null
}

export async function getLoyaltyTiers(): Promise<LoyaltyTier[]> {
  await delay(60)
  return seedLoyaltyTiers as LoyaltyTier[]
}

export async function getDiscountCodes(tenantId?: string): Promise<DiscountCode[]> {
  await delay(100)
  const codes = seedDiscountCodes as DiscountCode[]
  if (tenantId) return codes.filter((c) => c.tenantId === tenantId)
  return codes
}

export async function getActivityLogs(tenantId: string, userId?: string): Promise<ActivityLog[]> {
  await delay(100)
  let logs = (seedActivityLogs as ActivityLog[]).filter((a) => a.tenantId === tenantId)
  if (userId) logs = logs.filter((a) => a.userId === userId)
  return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getRedeemableItems(tenantId?: string): Promise<RedeemableItem[]> {
  await delay(80)
  const items = seedRedeemableItems as RedeemableItem[]
  if (tenantId) return items.filter((i) => i.tenantId === tenantId)
  return items
}

export async function getEarnActivities(tenantId: string): Promise<{ id: string; label: string; credits: number; done: boolean }[]> {
  await delay(80)
  const reward = (seedRewards as Reward[]).find((r) => r.tenantId === tenantId && r.userId === DEMO_USER)
  const credits = reward?.credits ?? 0
  return [
    { id: "reg", label: "Complete a pageant registration", credits: 100, done: credits >= 100 },
    { id: "refer", label: "Refer a new talent", credits: 250, done: credits >= 350 },
    { id: "course", label: "Complete an Academy course", credits: 500, done: credits >= 850 },
    { id: "profile", label: "Complete your profile 100%", credits: 50, done: credits >= 900 },
    { id: "review", label: "Leave a review", credits: 25, done: credits >= 925 },
  ]
}
