/**
 * Comms Service - Client Portal & Communications
 *
 * Threads, messages, approvals, notification preferences.
 * UI-only with seed data.
 */

import {
  seedThreads,
  seedMessages,
  seedApprovals,
  seedNotifications,
  seedUserNotificationPreferences,
  seedUsers,
} from "@/data/seed"

const DEFAULT_TENANT = "tenant_001"
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function resolveTenant(tenantId?: string | null) {
  return tenantId ?? DEFAULT_TENANT
}

export async function getThreads(
  tenantId?: string | null,
  filters?: { objectType?: string }
) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedThreads as any[]).filter((t) => t.tenantId === id)
  if (filters?.objectType) list = list.filter((t) => t.objectType === filters.objectType)
  return list.sort((a, b) => (b.lastMessageAt ?? "").localeCompare(a.lastMessageAt ?? ""))
}

export async function getThreadById(threadId: string) {
  await delay(60)
  return (seedThreads as any[]).find((t) => t._id === threadId) ?? null
}

export async function getThreadByObject(objectType: string, objectId: string) {
  await delay(80)
  return (seedThreads as any[]).find(
    (t) => t.objectType === objectType && t.objectId === objectId
  ) ?? null
}

export async function getMessagesByThread(threadId: string) {
  await delay(80)
  return (seedMessages as any[])
    .filter((m) => m.threadId === threadId)
    .sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""))
}

export async function getApprovals(
  tenantId?: string | null,
  filters?: { status?: string }
) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedApprovals as any[]).filter((a) => a.tenantId === id)
  if (filters?.status) list = list.filter((a) => a.status === filters.status)
  return list.sort((a, b) => (b.requestedAt ?? "").localeCompare(a.requestedAt ?? ""))
}

export async function getPendingApprovals(tenantId?: string | null) {
  return getApprovals(tenantId, { status: "PENDING" })
}

export async function getNotifications(tenantId?: string | null, filters?: { read?: boolean }) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedNotifications as any[]).filter((n) => n.tenantId === id)
  if (filters?.read !== undefined) list = list.filter((n) => n.read === filters.read)
  return list.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
}

export async function getNotificationPreferences(userId: string, tenantId?: string | null) {
  await delay(80)
  const id = resolveTenant(tenantId)
  return (seedUserNotificationPreferences as any[]).find(
    (p) => p.userId === userId && p.tenantId === id
  ) ?? null
}

export async function getUserById(userId: string) {
  await delay(60)
  return (seedUsers as any[]).find((u) => u._id === userId) ?? null
}

export function getObjectTypeLabel(type: string) {
  const labels: Record<string, string> = {
    BOOKING: "Booking",
    CASTING: "Casting",
    DEAL: "Deal",
    PROJECT: "Project",
    EVENT: "Event",
    CONTENT: "Content",
    QUOTE: "Quote",
    CONTRACT: "Contract",
    DELIVERABLE: "Deliverable",
    INVOICE: "Invoice",
  }
  return labels[type] ?? type
}

export function getApprovalStatusColor(status: string) {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    REJECTED: "bg-red-100 text-red-700 border-red-200",
  }
  return colors[status] ?? "bg-slate-100 text-slate-600"
}
