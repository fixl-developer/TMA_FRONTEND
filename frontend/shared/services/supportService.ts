/**
 * Support Service – Tenant support cases
 * Phase 38. Seed data only.
 */

import { seedSupportCases } from "@/data/seed"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export interface SupportCase {
  _id: string
  tenantId: string
  subject: string
  category: string
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED"
  priority: "LOW" | "MEDIUM" | "HIGH"
  createdBy?: string
  createdAt?: string
  resolvedAt?: string
}

export async function getSupportCasesByTenant(tenantId: string): Promise<SupportCase[]> {
  await delay(100)
  return (seedSupportCases as SupportCase[]).filter((c) => c.tenantId === tenantId)
}
