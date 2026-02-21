/**
 * Modelling Dispute Service
 *
 * Mock service for disputes. Tenant-scoped.
 */

import { seedDisputes, seedDisputeEvidence } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface Dispute {
  _id: string
  tenantId: string
  referenceType: string
  referenceId: string
  raisedBy: string
  reason: string
  status: string
  amountMinor: number
  currency: string
  createdAt: string
  assignedTo?: string | null
  resolvedAt?: string
  resolution?: string
}

export interface DisputeEvidence {
  _id: string
  disputeId: string
  type: string
  description: string
  url?: string
  uploadedBy: string
  createdAt: string
}

export const getDisputes = async (
  tenantId?: string | null
): Promise<Dispute[]> => {
  await delay(120)
  const id = tenantId || "tenant_001"
  return (seedDisputes as Dispute[]).filter((d) => d.tenantId === id)
}

export const getDisputeById = async (
  disputeId: string,
  tenantId?: string | null
): Promise<Dispute | null> => {
  await delay(80)
  const tid = tenantId || "tenant_001"
  const d = (seedDisputes as Dispute[]).find(
    (x) => x._id === disputeId && x.tenantId === tid
  )
  return d ?? null
}

export const getDisputeEvidence = async (
  disputeId: string,
  tenantId?: string | null
): Promise<DisputeEvidence[]> => {
  await delay(80)
  return (seedDisputeEvidence as DisputeEvidence[]).filter(
    (e) => e.disputeId === disputeId
  )
}

/** Mock: add evidence */
export const addDisputeEvidence = async (
  disputeId: string,
  description: string,
  type: string,
  tenantId?: string | null
): Promise<DisputeEvidence> => {
  await delay(200)
  return {
    _id: `ev_${Date.now()}`,
    disputeId,
    type,
    description,
    url: "/placeholder/upload.pdf",
    uploadedBy: "current_user",
    createdAt: new Date().toISOString(),
  }
}

/** Mock: assign dispute */
export const assignDispute = async (
  disputeId: string,
  assigneeId: string,
  tenantId?: string | null
): Promise<void> => {
  await delay(200)
}

/** Mock: resolve dispute (decision) */
export const resolveDispute = async (
  disputeId: string,
  resolution: string,
  tenantId?: string | null
): Promise<void> => {
  await delay(200)
}

/** Mock: close dispute */
export const closeDispute = async (
  disputeId: string,
  tenantId?: string | null
): Promise<void> => {
  await delay(200)
}
