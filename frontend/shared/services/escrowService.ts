/**
 * Escrow Service – Tenant escrow accounts
 * Phase 39. Seed data only.
 */

import { seedEscrows } from "@/data/seed"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export interface Escrow {
  _id: string
  tenantId: string
  referenceType: string
  referenceId: string
  amountMinor: number
  currency: string
  status: "CREATED" | "FUNDED" | "LOCKED" | "RELEASED" | "DISPUTED"
  createdAt?: string
  fundedAt?: string
  lockedAt?: string
  releasedAt?: string
  disputedAt?: string
}

export async function getEscrowsByTenant(tenantId: string): Promise<Escrow[]> {
  await delay(100)
  return (seedEscrows as Escrow[]).filter((e) => e.tenantId === tenantId)
}

export async function getEscrowById(id: string, tenantId: string): Promise<Escrow | null> {
  await delay(80)
  const e = (seedEscrows as Escrow[]).find((x) => x._id === id && x.tenantId === tenantId)
  return e ?? null
}
