/**
 * Modelling Dashboard Service
 *
 * Aggregates data for modelling dashboards. Uses seed data.
 */

import {
  seedCastings,
  seedBookings,
  seedTalents,
  seedEscrows,
  seedInvoices,
  seedWallets,
} from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getJobsFunnel = async (tenantId?: string | null) => {
  await delay(100)
  const id = tenantId || "tenant_001"
  const castings = (seedCastings as { tenantId: string; status: string }[]).filter(
    (c) => c.tenantId === id
  )
  const open = castings.filter((c) => c.status === "OPEN").length
  const shortlisting = castings.filter((c) => c.status === "SHORTLISTING").length
  const closed = castings.filter((c) => !["OPEN", "SHORTLISTING"].includes(c.status)).length
  return [
    { stage: "Open", count: open },
    { stage: "Shortlisting", count: shortlisting },
    { stage: "Closed", count: closed },
  ]
}

export const getJobsStatusBreakdown = async (tenantId?: string | null) => {
  await delay(100)
  const id = tenantId || "tenant_001"
  const castings = (seedCastings as { tenantId: string; status: string }[]).filter(
    (c) => c.tenantId === id
  )
  const byStatus = castings.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1
    return acc
  }, {})
  return Object.entries(byStatus).map(([name, value]) => ({ name, value }))
}

export const getFinanceOverview = async (tenantId?: string | null) => {
  await delay(120)
  const id = tenantId || "tenant_001"
  const wallets = (seedWallets as { tenantId?: string; balanceMinor?: number }[]).filter(
    (w) => w.tenantId === id
  )
  const escrows = (seedEscrows as { tenantId?: string; amountMinor?: number; status: string }[]).filter(
    (e) => e.tenantId === id
  )
  const invoices = (seedInvoices as { tenantId?: string; amountMinor?: number; status?: string }[]).filter(
    (i) => i.tenantId === id
  )
  const totalWallet = wallets.reduce((s, w) => s + (w.balanceMinor ?? 0), 0)
  const totalEscrow = escrows
    .filter((e) => !["RELEASED", "DISPUTED"].includes(e.status))
    .reduce((s, e) => s + (e.amountMinor ?? 0), 0)
  const pendingInvoices = invoices
    .filter((i) => ["DRAFT", "SENT", "PENDING"].includes(i.status ?? ""))
    .reduce((s, i) => s + (i.amountMinor ?? 0), 0)
  return {
    walletBalance: totalWallet,
    escrowBalance: totalEscrow,
    pendingInvoices,
    escrowCount: escrows.length,
    invoiceCount: invoices.length,
  }
}

export const getRevenueByMonth = async (tenantId?: string | null) => {
  await delay(100)
  const id = tenantId || "tenant_001"
  const bookings = (seedBookings as { tenantId: string; stage: string; createdAt?: string }[]).filter(
    (b) => b.tenantId === id && b.stage === "CONFIRMED"
  )
  const byMonth = bookings.reduce<Record<string, number>>((acc, b) => {
    const m = b.createdAt ? new Date(b.createdAt).toLocaleString("en-IN", { month: "short" }) : "Jan"
    acc[m] = (acc[m] || 0) + 1
    return acc
  }, {})
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  return months.map((m) => ({ month: m, count: byMonth[m] ?? 0 }))
}
