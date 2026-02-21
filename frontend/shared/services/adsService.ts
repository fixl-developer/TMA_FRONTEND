import {
  seedAdCampaigns,
  seedAdCreatives,
  seedAdTargeting,
  seedAdPerformance,
  seedAdAttribution,
} from "@/data/seed"
import type {
  AdCampaign,
  AdCreative,
  AdTargeting,
  AdPerformance,
  AdTrackingLink,
  AttributionOutcome,
} from "@/shared/lib/types/ads"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getAdCampaigns(tenantId?: string): Promise<AdCampaign[]> {
  await delay(120)
  const campaigns = seedAdCampaigns as AdCampaign[]
  if (tenantId) return campaigns.filter((c) => c.tenantId === tenantId)
  return campaigns
}

export async function getAdCampaignById(id: string): Promise<AdCampaign | null> {
  await delay(80)
  return (seedAdCampaigns as AdCampaign[]).find((c) => c._id === id) ?? null
}

export async function getCreativesByCampaign(campaignId: string): Promise<AdCreative[]> {
  await delay(100)
  return (seedAdCreatives as AdCreative[]).filter((c) => c.campaignId === campaignId)
}

export async function getTargetingByCampaign(campaignId: string): Promise<AdTargeting | null> {
  await delay(80)
  return (seedAdTargeting as AdTargeting[]).find((t) => t.campaignId === campaignId) ?? null
}

export async function getPerformanceByCampaign(campaignId: string): Promise<AdPerformance | null> {
  await delay(80)
  const perf = seedAdPerformance as Record<string, AdPerformance>
  return perf[campaignId] ?? null
}

export async function getPendingCreatives(tenantId: string): Promise<AdCreative[]> {
  await delay(100)
  return (seedAdCreatives as AdCreative[]).filter(
    (c) => c.tenantId === tenantId && c.status === "PENDING"
  )
}

export async function getTrackingLinks(tenantId?: string, campaignId?: string): Promise<AdTrackingLink[]> {
  await delay(100)
  let links = seedAdAttribution as AdTrackingLink[]
  if (tenantId) links = links.filter((l) => l.tenantId === tenantId)
  if (campaignId) links = links.filter((l) => l.campaignId === campaignId)
  return links
}

export async function getAttributionReport(tenantId: string): Promise<AttributionOutcome[]> {
  await delay(120)
  const campaigns = (seedAdCampaigns as AdCampaign[]).filter((c) => c.tenantId === tenantId)
  const links = (seedAdAttribution as AdTrackingLink[]).filter((l) => l.tenantId === tenantId)
  const byCampaign = new Map<string, { spend: number; conversions: number; revenue: number }>()
  for (const c of campaigns) {
    byCampaign.set(c._id, { spend: c.spentMinor, conversions: 0, revenue: 0 })
  }
  for (const l of links) {
    const cur = byCampaign.get(l.campaignId)
    if (cur) {
      cur.conversions += l.conversions
      cur.revenue += l.revenueMinor ?? 0
    }
  }
  return campaigns.map((c) => {
    const data = byCampaign.get(c._id) ?? { spend: c.spentMinor, conversions: 0, revenue: 0 }
    const roi = data.spend > 0 ? Math.round(((data.revenue - data.spend) / data.spend) * 100) : 0
    return {
      campaignId: c._id,
      campaignName: c.name,
      spendMinor: data.spend,
      conversions: data.conversions,
      revenueMinor: data.revenue,
      roiPercent: roi,
    }
  })
}
