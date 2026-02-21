/**
 * CRM Service
 *
 * Leads, Accounts, Contacts, Activities, Segments.
 * UI-only with seed data.
 */

import {
  seedLeads,
  seedAccounts,
  seedContacts,
  seedActivities,
  seedSegments,
} from "@/data/seed"

const DEFAULT_TENANT = "tenant_001"
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function resolveTenant(tenantId?: string | null) {
  return tenantId ?? DEFAULT_TENANT
}

export async function getLeads(tenantId?: string | null, filters?: { status?: string; source?: string }) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedLeads as any[]).filter((l) => l.tenantId === id)
  if (filters?.status) list = list.filter((l) => l.status === filters.status)
  if (filters?.source) list = list.filter((l) => l.source === filters.source)
  return list
}

export async function getLeadById(leadId: string) {
  await delay(80)
  return (seedLeads as any[]).find((l) => l._id === leadId) ?? null
}

export async function getAccounts(tenantId?: string | null, filters?: { type?: string; status?: string }) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedAccounts as any[]).filter((a) => a.tenantId === id)
  if (filters?.type) list = list.filter((a) => a.type === filters.type)
  if (filters?.status) list = list.filter((a) => a.status === filters.status)
  return list
}

export async function getAccountById(accountId: string) {
  await delay(80)
  return (seedAccounts as any[]).find((a) => a._id === accountId) ?? null
}

export async function getContactsByAccount(accountId: string) {
  await delay(80)
  return (seedContacts as any[]).filter((c) => c.accountId === accountId)
}

export async function getContacts(tenantId?: string | null) {
  await delay(120)
  const id = resolveTenant(tenantId)
  return (seedContacts as any[]).filter((c) => c.tenantId === id)
}

export async function getActivitiesByObject(objectType: string, objectId: string) {
  await delay(80)
  return (seedActivities as any[])
    .filter((a) => a.objectType === objectType && a.objectId === objectId)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
}

export async function getActivities(tenantId?: string | null, limit = 20) {
  await delay(120)
  const id = resolveTenant(tenantId)
  return (seedActivities as any[])
    .filter((a) => a.tenantId === id)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, limit)
}

export async function getSegments(tenantId?: string | null) {
  await delay(100)
  const id = resolveTenant(tenantId)
  return (seedSegments as any[]).filter((s) => s.tenantId === id)
}

export function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}
