/**
 * Influencer Service
 *
 * Creator discovery, campaigns, deals, deliverables.
 * UI-only with seed data.
 */

import {
  seedCampaigns,
  seedCampaignDeals,
  seedCampaignDeliverables,
  seedCreators,
  seedTalents,
} from "@/data/seed"

const DEFAULT_TENANT = "tenant_001"
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const deliverableOverrides: Record<string, { status: string }> = {}

function resolveTenant(tenantId?: string | null) {
  return tenantId ?? DEFAULT_TENANT
}

export async function getCampaigns(tenantId?: string | null) {
  await delay(120)
  const id = resolveTenant(tenantId)
  return (seedCampaigns as any[]).filter((c) => c.tenantId === id)
}

export async function getCampaignById(campaignId: string) {
  await delay(80)
  return (seedCampaigns as any[]).find((c) => c._id === campaignId) ?? null
}

export async function getDealsByCampaign(campaignId: string) {
  await delay(80)
  return (seedCampaignDeals as any[]).filter((d) => d.campaignId === campaignId)
}

export async function getDeliverablesByCampaign(campaignId: string) {
  await delay(80)
  const list = (seedCampaignDeliverables as any[]).filter((d) => d.campaignId === campaignId)
  return list.map((d) => {
    const ov = deliverableOverrides[d._id]
    return ov ? { ...d, status: ov.status } : d
  })
}

export async function getDeliverablesByDeal(dealId: string) {
  await delay(80)
  return (seedCampaignDeliverables as any[]).filter((d) => d.dealId === dealId)
}

export async function getCreators(tenantId?: string | null, filters?: { niche?: string; minReach?: number; maxRate?: number }) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedCreators as any[]).filter((c) => c.tenantId === id)
  if (filters?.niche) {
    list = list.filter((c) => c.niche?.toLowerCase().includes(filters.niche!.toLowerCase()))
  }
  if (filters?.minReach != null) {
    list = list.filter((c) => (c.reachMinor ?? 0) >= filters!.minReach!)
  }
  if (filters?.maxRate != null) {
    list = list.filter((c) => (c.rateMinor ?? Infinity) <= filters!.maxRate!)
  }
  return list
}

export async function getCreatorById(creatorId: string) {
  await delay(80)
  return (seedCreators as any[]).find((c) => c._id === creatorId) ?? null
}

export async function getTalentById(talentId: string) {
  await delay(60)
  return (seedTalents as any[]).find((t) => t._id === talentId) ?? null
}

export async function approveDeliverable(deliverableId: string) {
  await delay(150)
  deliverableOverrides[deliverableId] = { status: "APPROVED" }
  return { ok: true }
}

export async function rejectDeliverable(deliverableId: string, _reason?: string) {
  await delay(150)
  deliverableOverrides[deliverableId] = { status: "REJECTED" }
  return { ok: true }
}

export function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}
