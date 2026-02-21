import { seedWallets, seedTransactions, seedInvoices, seedPayouts } from "@/data/seed"

const DEFAULT_TENANT = "tenant_001"
const STORAGE_KEY = "talentos_payout_status_overrides"
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function resolveTenantId(tenantId?: string | null) {
  return tenantId || DEFAULT_TENANT
}

interface PayoutOverride {
  status: string
  reviewedAt?: string
  reviewedBy?: string
  reviewReason?: string
  approvedAt?: string
  approvedBy?: string
  approveReason?: string
  rejectedAt?: string
  rejectedBy?: string
}

function getPayoutOverrides(): Record<string, PayoutOverride> {
  if (typeof window === "undefined") return {}
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? JSON.parse(s) : {}
  } catch {
    return {}
  }
}

function setPayoutOverride(payoutId: string, patch: Partial<PayoutOverride>) {
  if (typeof window === "undefined") return
  const overrides = getPayoutOverrides()
  const existing = overrides[payoutId] ?? { status: "PENDING" }
  overrides[payoutId] = { ...existing, ...patch }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

export const getTenantWallet = async (tenantId?: string | null) => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  const w = (seedWallets as any[]).find((x) => x.scope === "TENANT" && x.tenantId === id)
  return w ?? { balanceMinor: 0, currency: "INR" }
}

export const getTenantTransactions = async (tenantId?: string | null) => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  return (seedTransactions as any[]).filter((t) => t.tenantId === id)
}

export const getTenantInvoices = async (tenantId?: string | null) => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  return (seedInvoices as any[]).filter((i) => i.tenantId === id)
}

export const getTenantPayouts = async (tenantId?: string | null) => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  const overrides = getPayoutOverrides()
  return (seedPayouts as any[])
    .filter((p) => p.tenantId === id)
    .map((p) => (overrides[p._id] ? { ...p, ...overrides[p._id] } : p))
}

/** Maker-checker: reviewer marks payout ready for approval */
export const markPayoutReviewed = async (
  payoutId: string,
  reason: string,
  actor = "finance.reviewer@talentos.io"
) => {
  await delay(180)
  setPayoutOverride(payoutId, {
    status: "PENDING_APPROVAL",
    reviewedAt: new Date().toISOString(),
    reviewedBy: actor,
    reviewReason: reason.trim(),
  })
}

/** Maker-checker: approve payout (second approver) */
export const approvePayout = async (
  payoutId: string,
  reason: string,
  actor = "finance.approver@talentos.io"
) => {
  await delay(200)
  setPayoutOverride(payoutId, {
    status: "SETTLED",
    approvedAt: new Date().toISOString(),
    approvedBy: actor,
    approveReason: reason.trim(),
  })
}

/** Maker-checker: reject payout */
export const rejectPayout = async (
  payoutId: string,
  reason: string,
  actor = "finance.approver@talentos.io"
) => {
  await delay(200)
  setPayoutOverride(payoutId, {
    status: "REJECTED",
    rejectedAt: new Date().toISOString(),
    rejectedBy: actor,
    approveReason: reason.trim(),
  })
}
