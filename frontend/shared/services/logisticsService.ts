/**
 * Logistics Service - Shipments, Kits, Returns
 *
 * Track shipments, product seeding (influencer), kits, returns.
 * UI-only with seed data.
 */

import {
  seedShipments,
  seedPackages,
  seedTrackingEvents,
  seedReturnAuthorizations,
  seedCampaigns,
  seedTalents,
} from "@/data/seed"

const DEFAULT_TENANT = "tenant_001"
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function resolveTenant(tenantId?: string | null) {
  return tenantId ?? DEFAULT_TENANT
}

export async function getShipments(
  tenantId?: string | null,
  filters?: { status?: string; type?: string }
) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedShipments as any[]).filter((s) => s.tenantId === id)
  if (filters?.status) list = list.filter((s) => s.status === filters.status)
  if (filters?.type) list = list.filter((s) => s.type === filters.type)
  return list.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
}

export async function getShipmentById(shipmentId: string) {
  await delay(60)
  return (seedShipments as any[]).find((s) => s._id === shipmentId) ?? null
}

export async function getPackagesByShipment(shipmentId: string) {
  await delay(60)
  return (seedPackages as any[]).filter((p) => p.shipmentId === shipmentId)
}

export async function getTrackingEventsByShipment(shipmentId: string) {
  await delay(80)
  return (seedTrackingEvents as any[])
    .filter((t) => t.shipmentId === shipmentId)
    .sort((a, b) => (a.timestamp ?? "").localeCompare(b.timestamp ?? ""))
}

export async function getReturnAuthorizations(
  tenantId?: string | null,
  filters?: { status?: string }
) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedReturnAuthorizations as any[]).filter((r) => r.tenantId === id)
  if (filters?.status) list = list.filter((r) => r.status === filters.status)
  return list.sort((a, b) => (b.requestedAt ?? "").localeCompare(a.requestedAt ?? ""))
}

export async function getCampaignById(campaignId: string) {
  await delay(60)
  return (seedCampaigns as any[]).find((c) => c._id === campaignId) ?? null
}

export async function getTalentById(talentId: string) {
  await delay(60)
  return (seedTalents as any[]).find((t) => t._id === talentId) ?? null
}

export function getShipmentStatusColor(status: string) {
  const colors: Record<string, string> = {
    LABEL_CREATED: "bg-slate-100 text-slate-700 border-slate-200",
    PICKED_UP: "bg-blue-100 text-blue-700 border-blue-200",
    IN_TRANSIT: "bg-amber-100 text-amber-700 border-amber-200",
    OUT_FOR_DELIVERY: "bg-amber-100 text-amber-700 border-amber-200",
    DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  }
  return colors[status] ?? "bg-slate-100 text-slate-600"
}

export function getShipmentTypeLabel(type: string) {
  const labels: Record<string, string> = {
    PRODUCT_SEEDING: "Product Seeding",
    WARDROBE: "Wardrobe",
    KIT: "Kit",
  }
  return labels[type] ?? type
}

export function getReturnStatusColor(status: string) {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  }
  return colors[status] ?? "bg-slate-100 text-slate-600"
}
