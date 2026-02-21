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
  await delay(150)

  if (tenantId) {
    return seedPageants.filter((p) => p.tenantId === tenantId) as Pageant[]
  }

  return seedPageants as Pageant[]
}

export const getPageantById = async (id: string): Promise<Pageant | null> => {
  await delay(100)
  return (seedPageants.find((p) => p._id === id) as Pageant) ?? null
}