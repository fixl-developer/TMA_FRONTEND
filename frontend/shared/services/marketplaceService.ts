/**
 * Marketplace Service - B9 Marketplace/Aggregator
 *
 * Vendor listings for marketplace tenants.
 */

import { seedMarketplaceListings } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const LISTING_OVERRIDES_KEY = "talentos_marketplace_listing_overrides"

function resolveTenant(tenantId?: string | null) {
  return tenantId ?? "tenant_001"
}

export interface MarketplaceListing {
  _id: string
  tenantId: string
  vendorId: string
  title: string
  category: string
  description: string
  rate: number
  currency: string
  status: string
  createdAt: string
}

export interface UpsertMarketplaceListingPayload {
  tenantId: string
  listingId?: string
  title: string
  category: string
  description: string
  rate: number
  currency: string
  status: string
}

function getListingOverridesSync(): Record<string, MarketplaceListing[]> {
  if (typeof window === "undefined") return {}
  try {
    const s = localStorage.getItem(LISTING_OVERRIDES_KEY)
    if (!s) return {}
    return JSON.parse(s) as Record<string, MarketplaceListing[]>
  } catch {
    return {}
  }
}

function saveListingOverrides(overrides: Record<string, MarketplaceListing[]>) {
  if (typeof window === "undefined") return
  localStorage.setItem(LISTING_OVERRIDES_KEY, JSON.stringify(overrides))
}

export async function getMarketplaceListings(tenantId?: string | null): Promise<MarketplaceListing[]> {
  await delay(150)
  const id = resolveTenant(tenantId)
  const overrides = getListingOverridesSync()
  if (overrides[id]) return overrides[id]
  return (seedMarketplaceListings as MarketplaceListing[]).filter((l) => l.tenantId === id)
}

export async function upsertMarketplaceListing(
  payload: UpsertMarketplaceListingPayload
): Promise<MarketplaceListing> {
  await delay(180)
  const tenantId = resolveTenant(payload.tenantId)
  const overrides = getListingOverridesSync()
  const seed = (seedMarketplaceListings as MarketplaceListing[]).filter(
    (l) => l.tenantId === tenantId
  )
  const current = overrides[tenantId] ?? seed
  const index = payload.listingId
    ? current.findIndex((l) => l._id === payload.listingId)
    : -1

  const listing: MarketplaceListing = {
    _id: payload.listingId ?? `listing_${Date.now()}`,
    tenantId,
    vendorId: index >= 0 ? current[index].vendorId : `vendor_${Date.now()}`,
    title: payload.title.trim(),
    category: payload.category.trim(),
    description: payload.description.trim(),
    rate: Number(payload.rate) || 0,
    currency: payload.currency || "INR",
    status: payload.status || "ACTIVE",
    createdAt: index >= 0 ? current[index].createdAt : new Date().toISOString(),
  }

  const next =
    index >= 0
      ? current.map((item, i) => (i === index ? listing : item))
      : [listing, ...current]
  overrides[tenantId] = next
  saveListingOverrides(overrides)
  return listing
}

export function resetMarketplaceListingOverrides(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(LISTING_OVERRIDES_KEY)
}
