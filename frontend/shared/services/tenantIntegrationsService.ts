/**
 * Tenant Integrations Service – Webhooks, API keys (tenant-scoped)
 * Phase 37. Seed data only.
 */

import { seedWebhooks, seedApiKeys, seedPlatformAuditLogs } from "@/data/seed"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export interface Webhook {
  _id: string
  tenantId: string
  url: string
  events: string[]
  status: "ACTIVE" | "DISABLED"
  lastDeliveryAt?: string
  successRate?: number
  createdAt?: string
}

export interface ApiKey {
  _id: string
  tenantId: string
  name: string
  keyPrefix: string
  scopes: string[]
  lastUsedAt?: string
  requestsLast30d?: number
  status: "ACTIVE" | "REVOKED"
  createdAt?: string
}

export interface AuditLogEntry {
  _id: string
  tenantId: string | null
  actorId: string
  actorType: string
  action: string
  entityType: string
  entityId: string
  details?: Record<string, unknown>
  ip?: string
  createdAt: string
}

export async function getWebhooksByTenant(tenantId: string): Promise<Webhook[]> {
  await delay(100)
  return (seedWebhooks as Webhook[]).filter((w) => w.tenantId === tenantId)
}

export async function getApiKeysByTenant(tenantId: string): Promise<ApiKey[]> {
  await delay(100)
  return (seedApiKeys as ApiKey[]).filter((k) => k.tenantId === tenantId)
}

export async function getAuditLogsByTenant(
  tenantId: string,
  limit = 50
): Promise<AuditLogEntry[]> {
  await delay(120)
  const logs = (seedPlatformAuditLogs as AuditLogEntry[]).filter(
    (l) => l.tenantId === tenantId
  )
  return logs.slice(0, limit)
}
