/**
 * Sales Service - Proposals, Quotes, Rate Cards
 *
 * Deal packaging with deliverables, usage rights, pricing.
 * UI-only with seed data.
 */

import {
  seedRateCards,
  seedQuoteTemplates,
  seedQuotes,
  seedAccounts,
} from "@/data/seed"

const DEFAULT_TENANT = "tenant_001"
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function resolveTenant(tenantId?: string | null) {
  return tenantId ?? DEFAULT_TENANT
}

export async function getRateCards(tenantId?: string | null, category?: string) {
  await delay(100)
  const id = resolveTenant(tenantId)
  let list = (seedRateCards as any[]).filter((r) => r.tenantId === id)
  if (category) list = list.filter((r) => r.category === category)
  return list
}

export async function getRateCardById(rateCardId: string) {
  await delay(60)
  return (seedRateCards as any[]).find((r) => r._id === rateCardId) ?? null
}

export async function getQuoteTemplates(tenantId?: string | null) {
  await delay(100)
  const id = resolveTenant(tenantId)
  return (seedQuoteTemplates as any[]).filter((t) => t.tenantId === id)
}

export async function getQuoteTemplateById(templateId: string) {
  await delay(60)
  return (seedQuoteTemplates as any[]).find((t) => t._id === templateId) ?? null
}

export async function getQuotes(tenantId?: string | null, filters?: { status?: string; accountId?: string }) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedQuotes as any[]).filter((q) => q.tenantId === id)
  if (filters?.status) list = list.filter((q) => q.status === filters.status)
  if (filters?.accountId) list = list.filter((q) => q.accountId === filters.accountId)
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getQuoteById(quoteId: string) {
  await delay(80)
  return (seedQuotes as any[]).find((q) => q._id === quoteId) ?? null
}

export async function getAccounts(tenantId?: string | null) {
  await delay(100)
  const id = resolveTenant(tenantId)
  return (seedAccounts as any[]).filter((a) => a.tenantId === id)
}

export async function getAccountById(accountId: string) {
  await delay(60)
  return (seedAccounts as any[]).find((a) => a._id === accountId) ?? null
}

export function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}
