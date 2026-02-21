/**
 * Vendor Service - Vendor & Procurement
 *
 * Vendors, RFQs, purchase orders, goods receipts, scorecards.
 * UI-only with seed data.
 */

import {
  seedVendors,
  seedRfqs,
  seedPurchaseOrders,
  seedVendorScorecards,
  seedGoodsReceipts,
  seedProjects,
} from "@/data/seed"

const DEFAULT_TENANT = "tenant_001"
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function resolveTenant(tenantId?: string | null) {
  return tenantId ?? DEFAULT_TENANT
}

export async function getVendors(
  tenantId?: string | null,
  filters?: { status?: string; type?: string }
) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedVendors as any[]).filter((v) => v.tenantId === id)
  if (filters?.status) list = list.filter((v) => v.status === filters.status)
  if (filters?.type) list = list.filter((v) => v.type === filters.type)
  return list.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
}

export async function getVendorById(vendorId: string) {
  await delay(60)
  return (seedVendors as any[]).find((v) => v._id === vendorId) ?? null
}

export async function getRfqs(
  tenantId?: string | null,
  filters?: { status?: string; projectId?: string }
) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedRfqs as any[]).filter((r) => r.tenantId === id)
  if (filters?.status) list = list.filter((r) => r.status === filters.status)
  if (filters?.projectId) list = list.filter((r) => r.projectId === filters.projectId)
  return list.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
}

export async function getRfqById(rfqId: string) {
  await delay(60)
  return (seedRfqs as any[]).find((r) => r._id === rfqId) ?? null
}

export async function getPurchaseOrders(
  tenantId?: string | null,
  filters?: { status?: string; vendorId?: string }
) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedPurchaseOrders as any[]).filter((p) => p.tenantId === id)
  if (filters?.status) list = list.filter((p) => p.status === filters.status)
  if (filters?.vendorId) list = list.filter((p) => p.vendorId === filters.vendorId)
  return list.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
}

export async function getPurchaseOrderById(poId: string) {
  await delay(60)
  return (seedPurchaseOrders as any[]).find((p) => p._id === poId) ?? null
}

export async function getGoodsReceipts(
  tenantId?: string | null,
  filters?: { status?: string }
) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedGoodsReceipts as any[]).filter((g) => g.tenantId === id)
  if (filters?.status) list = list.filter((g) => g.status === filters.status)
  return list.sort((a, b) => (b.receivedAt ?? "").localeCompare(a.receivedAt ?? ""))
}

export async function getGoodsReceiptByPo(poId: string) {
  await delay(60)
  return (seedGoodsReceipts as any[]).find((g) => g.poId === poId) ?? null
}

export async function getVendorScorecard(vendorId: string) {
  await delay(80)
  return (seedVendorScorecards as any[])
    .filter((s) => s.vendorId === vendorId)
    .sort((a, b) => (b.period ?? "").localeCompare(a.period ?? ""))[0] ?? null
}

export async function getProjectById(projectId: string) {
  await delay(60)
  return (seedProjects as any[]).find((p) => p._id === projectId) ?? null
}

export function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

export function getVendorStatusColor(status: string) {
  const colors: Record<string, string> = {
    VERIFIED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  }
  return colors[status] ?? "bg-slate-100 text-slate-600"
}

export function getRfqStatusColor(status: string) {
  const colors: Record<string, string> = {
    OPEN: "bg-blue-100 text-blue-700 border-blue-200",
    BIDS_RECEIVED: "bg-amber-100 text-amber-700 border-amber-200",
    EVALUATING: "bg-amber-100 text-amber-700 border-amber-200",
    AWARDED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  }
  return colors[status] ?? "bg-slate-100 text-slate-600"
}

export function getPoStatusColor(status: string) {
  const colors: Record<string, string> = {
    PENDING_APPROVAL: "bg-amber-100 text-amber-700 border-amber-200",
    APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    RECEIVED: "bg-blue-100 text-blue-700 border-blue-200",
  }
  return colors[status] ?? "bg-slate-100 text-slate-600"
}

export function getVendorTypeLabel(type: string) {
  const labels: Record<string, string> = {
    PHOTOGRAPHY: "Photography",
    BEAUTY: "Beauty / MUA",
    EVENT_EQUIPMENT: "Event Equipment",
    CATERING: "Catering",
    WARDROBE: "Wardrobe",
  }
  return labels[type] ?? type
}
