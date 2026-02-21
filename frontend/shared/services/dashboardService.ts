/**
 * Dashboard Service
 *
 * Platform and tenant dashboard stats, charts.
 * UI-only with seed data.
 */

import {
  seedTenants,
  seedRevenueReports,
  seedModerationLogs,
  seedDisputes,
  seedTalents,
  seedCastings,
  seedBookings,
  seedTransactions,
  seedWallets,
  seedEscrows,
  seedPayouts,
  seedLedgerEntries,
} from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getPlatformDashboardStats() {
  await delay(180)
  const tenants = seedTenants as any[]
  const reports = seedRevenueReports as any[]
  const logs = seedModerationLogs as any[]
  const disputes = seedDisputes as any[]

  const activeTenants = tenants.filter((t) => t.status === "ACTIVE").length
  const latestReport = reports[0]
  const totalRevenue = latestReport
    ? (latestReport.subscriptionRevenue || 0) +
      (latestReport.usageRevenue || 0) +
      (latestReport.platformFeeRevenue || 0)
    : 0
  const openIncidents = logs.filter((l) => l.status !== "RESOLVED").length
  const openDisputes = disputes.filter((d) => d.status !== "RESOLVED").length

  // Format period for display (e.g., "2025-02" -> "Feb 2025")
  function formatPeriod(period: string): string {
    const [year, month] = period.split("-")
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthIndex = parseInt(month) - 1
    return `${monthNames[monthIndex]} ${year}`
  }

  return {
    tenantCount: activeTenants,
    totalRevenue,
    revenueCurrency: latestReport?.currency ?? "INR",
    openIncidents,
    openDisputes,
    revenueOverTime: reports.slice(0, 12).reverse().map((r) => ({
      period: formatPeriod(r.period),
      revenue: (r.subscriptionRevenue || 0) + (r.usageRevenue || 0) + (r.platformFeeRevenue || 0),
    })),
  }
}

export async function getJobsFunnelStats(tenantId?: string | null) {
  await delay(150)
  const tid = tenantId ?? "tenant_001"
  const castings = (seedCastings as any[]).filter((c) => c.tenantId === tid)
  const bookings = (seedBookings as any[]).filter((b: any) => b.tenantId === tid)

  return {
    funnel: [
      { stage: "Open", count: castings.filter((c) => c.status === "OPEN").length },
      { stage: "Shortlisting", count: castings.filter((c) => c.status === "SHORTLISTING").length },
      { stage: "Closed", count: castings.filter((c) => !["OPEN", "SHORTLISTING"].includes(c.status)).length },
    ],
    bookingsByStage: [
      { stage: "Inquiry", count: bookings.filter((b: any) => b.stage === "INQUIRY").length },
      { stage: "Confirmed", count: bookings.filter((b: any) => b.stage === "CONFIRMED").length },
      { stage: "Completed", count: bookings.filter((b: any) => b.stage === "COMPLETED").length },
    ],
  }
}

export async function getTalentGrowthStats(tenantId?: string | null) {
  await delay(150)
  const tid = tenantId ?? "tenant_001"
  const talents = (seedTalents as any[]).filter((t) => t.tenantId === tid)
  const byMonth = [
    { month: "Jan", count: Math.max(0, talents.length - 5) },
    { month: "Feb", count: Math.max(0, talents.length - 3) },
    { month: "Mar", count: Math.max(0, talents.length - 2) },
    { month: "Apr", count: Math.max(0, talents.length - 1) },
    { month: "May", count: talents.length },
    { month: "Jun", count: talents.length },
  ]
  return { byMonth, total: talents.length }
}

export async function getDisputeRateStats(tenantId?: string | null) {
  await delay(150)
  const disputes = seedDisputes as any[]
  const tid = tenantId ?? undefined
  const filtered = tid ? disputes.filter((d) => d.tenantId === tid) : disputes
  const open = filtered.filter((d) => d.status !== "RESOLVED").length
  const resolved = filtered.filter((d) => d.status === "RESOLVED").length
  const total = filtered.length
  const rate = total > 0 ? Math.round((open / total) * 100) : 0
  return {
    open,
    resolved,
    total,
    ratePercent: rate,
    byStatus: [
      { name: "Open", value: open },
      { name: "Resolved", value: resolved },
    ],
  }
}

/** Tenant income over time from ledger (contract payments, deposits). Docs: dashboards/finance. */
export async function getTenantIncomeOverTimeStats(tenantId?: string | null) {
  await delay(150)
  const tid = tenantId ?? "tenant_001"
  const ledger = (seedLedgerEntries as any[]).filter(
    (e) => e.tenantId === tid && e.direction === "INBOUND"
  )
  const byMonth = new Map<string, { contract: number; deposit: number }>()
  for (const e of ledger) {
    const d = new Date(e.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const cur = byMonth.get(key) ?? { contract: 0, deposit: 0 }
    if (e.type === "CONTRACT_PAYMENT") cur.contract += e.amountMinor ?? 0
    else if (e.type === "DEPOSIT") cur.deposit += e.amountMinor ?? 0
    byMonth.set(key, cur)
  }
  const sorted = [...byMonth.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-6)
  return sorted.map(([period, v]) => ({
    period: period.replace("-", " "),
    contract: v.contract,
    deposit: v.deposit,
    total: v.contract + v.deposit,
  }))
}

/**
 * Revenue/income over time.
 * Tenant: from ledger (contract payments, deposits). Platform: from revenue reports.
 */
export async function getRevenueOverTimeStats(tenantId?: string | null) {
  await delay(150)
  const tenantIncome = await getTenantIncomeOverTimeStats(tenantId)
  if (tenantIncome.length > 0) {
    return {
      data: tenantIncome,
      source: "tenant" as const,
    }
  }
  const reports = seedRevenueReports as any[]
  return {
    data: reports.slice(0, 6).reverse().map((r) => ({
      period: r.period.replace("-", " "),
      subscription: r.subscriptionRevenue ?? 0,
      usage: r.usageRevenue ?? 0,
      platformFee: r.platformFeeRevenue ?? 0,
      total: (r.subscriptionRevenue ?? 0) + (r.usageRevenue ?? 0) + (r.platformFeeRevenue ?? 0),
    })),
    source: "platform" as const,
  }
}

/**
 * Finance overview: Wallet, Escrow, Payouts.
 * From overall2.md §4.11: dashboards/finance – Wallet, escrow, payouts.
 */
export async function getFinanceOverviewStats(tenantId?: string | null) {
  await delay(150)
  const tid = tenantId ?? "tenant_001"
  const wallet = (seedWallets as any[]).find(
    (w) => w.scope === "TENANT" && w.tenantId === tid
  )
  const escrows = (seedEscrows as any[]).filter((e) => e.tenantId === tid)
  const payouts = (seedPayouts as any[]).filter((p) => p.tenantId === tid)

  const escrowByStatus = {
    created: escrows.filter((e) => e.status === "CREATED").length,
    funded: escrows.filter((e) => e.status === "FUNDED").length,
    locked: escrows.filter((e) => e.status === "LOCKED").length,
    released: escrows.filter((e) => e.status === "RELEASED").length,
    disputed: escrows.filter((e) => e.status === "DISPUTED").length,
  }
  const escrowAmounts = {
    created: escrows.filter((e) => e.status === "CREATED").reduce((s, e) => s + (e.amountMinor ?? 0), 0),
    funded: escrows.filter((e) => e.status === "FUNDED").reduce((s, e) => s + (e.amountMinor ?? 0), 0),
    locked: escrows.filter((e) => e.status === "LOCKED").reduce((s, e) => s + (e.amountMinor ?? 0), 0),
  }
  const payoutPending = payouts.filter((p) => p.status === "PENDING").reduce((s, p) => s + (p.amountMinor ?? 0), 0)
  const payoutSettled = payouts.filter((p) => p.status === "SETTLED").reduce((s, p) => s + (p.amountMinor ?? 0), 0)

  return {
    walletBalance: wallet?.balanceMinor ?? 0,
    walletCurrency: wallet?.currency ?? "INR",
    escrowByStatus,
    escrowAmounts,
    payoutPending,
    payoutSettled,
    payoutCount: payouts.length,
  }
}

export function formatCurrency(amountMinor: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}
