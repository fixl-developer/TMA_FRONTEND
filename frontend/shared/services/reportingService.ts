/**
 * Reporting Service – Cross-module reports, exports
 * Phase 37. Seed data only.
 */

import {
  seedBookings,
  seedQuotes,
  seedContracts,
  seedInvoices,
  seedRegistrations,
  seedPageants,
} from "@/data/seed"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export interface ReportSummary {
  bookingsCount: number
  quotesCount: number
  contractsCount: number
  invoicesCount: number
  registrationsCount: number
  revenueMinor: number
}

export async function getReportSummary(tenantId: string): Promise<ReportSummary> {
  await delay(150)
  const bookings = (seedBookings as any[]).filter((b) => b.tenantId === tenantId)
  const quotes = (seedQuotes as any[]).filter((q) => q.tenantId === tenantId)
  const contracts = (seedContracts as any[]).filter((c) => c.tenantId === tenantId)
  const invoices = (seedInvoices as any[]).filter((i) => i.tenantId === tenantId)
  const pageantIds = (seedPageants as any[]).filter((p) => p.tenantId === tenantId).map((p) => p._id)
  const registrations = (seedRegistrations as any[]).filter((r) => pageantIds.includes(r.pageantId))

  const revenueMinor = bookings.reduce((s, b) => s + (b.amountMinor ?? 0), 0) +
    invoices.reduce((s, i) => s + (i.amountMinor ?? 0), 0)

  return {
    bookingsCount: bookings.length,
    quotesCount: quotes.length,
    contractsCount: contracts.length,
    invoicesCount: invoices.length,
    registrationsCount: registrations.length,
    revenueMinor,
  }
}
