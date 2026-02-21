/**
 * Pageant Service - Super Admin
 *
 * Mock service for pageant-related operations in the Super Admin app.
 * Uses local seed data and simulates API latency.
 */

import { seedPageants } from "@/data/seed"
import type { Pageant } from "@/shared/lib/types/pageants"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Get all pageants (optionally filtered by tenant)
 */
export const getPageants = async (tenantId?: string): Promise<Pageant[]> => {
  await delay(250)

  if (tenantId) {
    return seedPageants.filter((p) => p.tenantId === tenantId) as Pageant[]
  }

  return seedPageants as Pageant[]
}

