/**
 * Superadmin Audit Log Service
 *
 * Platform-level audit logs. Uses seed data.
 */

import { seedPlatformAuditLogs } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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
  signature?: string
  immutable?: boolean
}

export const getPlatformAuditLogs = async (
  options?: { tenantId?: string | null; limit?: number }
): Promise<AuditLogEntry[]> => {
  await delay(150)
  let logs = [...(seedPlatformAuditLogs as AuditLogEntry[])]
  if (options?.tenantId) {
    logs = logs.filter(
      (l) => l.tenantId === options.tenantId || l.tenantId === null
    )
  }
  logs.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return logs.slice(0, options?.limit ?? 50)
}
