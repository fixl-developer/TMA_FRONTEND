/**
 * Payment Service - PSP events, reconciliation, webhook log
 *
 * Tenant-scoped. Uses seed data.
 */

import { seedPaymentEvents, seedWebhookEvents } from "@/data/seed"

const DEFAULT_TENANT = "tenant_001"
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function resolveTenantId(tenantId?: string | null) {
  return tenantId || DEFAULT_TENANT
}

export interface PaymentEvent {
  _id: string
  tenantId: string
  psp: string
  eventType: string
  paymentId: string
  amountMinor: number
  currency: string
  invoiceId?: string | null
  status: string
  idempotencyKey?: string
  refundId?: string
  errorCode?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface WebhookEvent {
  _id: string
  webhookId: string
  tenantId: string
  event: string
  payloadId: string
  status: string
  attempt: number
  responseCode?: number
  errorMessage?: string
  createdAt: string
}

export const getPaymentEvents = async (
  tenantId?: string | null,
  options?: { limit?: number }
): Promise<PaymentEvent[]> => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  let events = (seedPaymentEvents as PaymentEvent[]).filter((e) => e.tenantId === id)
  events = events.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return events.slice(0, options?.limit ?? 50)
}

export const getWebhookEvents = async (
  tenantId?: string | null,
  options?: { limit?: number }
): Promise<WebhookEvent[]> => {
  await delay(150)
  const id = resolveTenantId(tenantId)
  let events = (seedWebhookEvents as WebhookEvent[]).filter((e) => e.tenantId === id)
  events = events.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return events.slice(0, options?.limit ?? 50)
}

/** Reconciliation: payment events vs invoices (mock) */
export const getReconciliationSummary = async (
  tenantId?: string | null
): Promise<{
  totalCaptured: number
  totalFailed: number
  totalRefunded: number
  unmatchedCount: number
  lastSyncedAt: string
}> => {
  await delay(180)
  const id = resolveTenantId(tenantId)
  const events = (seedPaymentEvents as PaymentEvent[]).filter((e) => e.tenantId === id)
  const captured = events.filter(
    (e) => e.eventType === "payment.captured" && e.status === "SUCCESS"
  )
  const failed = events.filter((e) => e.eventType === "payment.failed")
  const refunded = events.filter((e) => e.eventType === "refund.processed")
  return {
    totalCaptured: captured.reduce((s, e) => s + e.amountMinor, 0),
    totalFailed: failed.reduce((s, e) => s + e.amountMinor, 0),
    totalRefunded: refunded.reduce((s, e) => s + e.amountMinor, 0),
    unmatchedCount: 0,
    lastSyncedAt: new Date().toISOString(),
  }
}
