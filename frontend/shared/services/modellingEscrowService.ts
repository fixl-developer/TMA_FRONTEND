/**
 * Modelling Escrow Service
 *
 * Mock service for escrows. Tenant-scoped.
 * Status flow: CREATED → FUNDED → LOCKED → RELEASED (or DISPUTED)
 */

import { seedEscrows, seedEscrowEvents } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface Escrow {
  _id: string
  tenantId: string
  referenceType: string
  referenceId: string
  amountMinor: number
  currency: string
  status: string
  createdAt: string
  fundedAt?: string
  lockedAt?: string
  releasedAt?: string
  disputedAt?: string
}

export interface EscrowEvent {
  _id: string
  escrowId: string
  event: string
  createdAt: string
}

export const STATUS_ORDER = ["CREATED", "FUNDED", "LOCKED", "RELEASED"]

export const getEscrows = async (
  tenantId?: string | null
): Promise<Escrow[]> => {
  await delay(120)
  const id = tenantId || "tenant_001"
  return (seedEscrows as Escrow[]).filter((e) => e.tenantId === id)
}

export const getEscrowById = async (
  escrowId: string,
  tenantId?: string | null
): Promise<Escrow | null> => {
  await delay(80)
  const tid = tenantId || "tenant_001"
  const e = (seedEscrows as Escrow[]).find(
    (x) => x._id === escrowId && x.tenantId === tid
  )
  return e ?? null
}

export const getEscrowEvents = async (
  escrowId: string,
  tenantId?: string | null
): Promise<EscrowEvent[]> => {
  await delay(80)
  const events = (seedEscrowEvents as EscrowEvent[]).filter(
    (e) => e.escrowId === escrowId
  )
  return events.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
}

/** Mock: fund escrow */
export const fundEscrow = async (
  escrowId: string,
  tenantId?: string | null
): Promise<void> => {
  await delay(200)
}

/** Mock: lock escrow */
export const lockEscrow = async (
  escrowId: string,
  tenantId?: string | null
): Promise<void> => {
  await delay(200)
}

/** Mock: release escrow */
export const releaseEscrow = async (
  escrowId: string,
  tenantId?: string | null
): Promise<void> => {
  await delay(200)
}

/** Mock: dispute escrow */
export const disputeEscrow = async (
  escrowId: string,
  tenantId?: string | null
): Promise<void> => {
  await delay(200)
}
