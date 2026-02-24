/**
 * Compliance Service - Super Admin
 *
 * Seed-backed service for DSR requests, legal holds, and retention policies.
 */

import {
  seedDsrRequests,
  seedLegalHolds,
  seedRetentionPolicies,
} from "@/data/seed"
import type {
  DsrRequest,
  LegalHold,
  RetentionPolicy,
  DsrRequestStatus,
  DsrRequestType,
  LegalHoldStatus,
} from "@/shared/lib/types/compliance"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getDsrRequests = async (): Promise<DsrRequest[]> => {
  await delay(180)
  return seedDsrRequests as DsrRequest[]
}

export const getDsrRequestById = async (id: string): Promise<DsrRequest | undefined> => {
  await delay(100)
  return (seedDsrRequests as DsrRequest[]).find((r) => r._id === id)
}

export const getLegalHolds = async (): Promise<LegalHold[]> => {
  await delay(160)
  return seedLegalHolds as LegalHold[]
}

export const getLegalHoldById = async (id: string): Promise<LegalHold | undefined> => {
  await delay(100)
  return (seedLegalHolds as LegalHold[]).find((h) => h._id === id)
}

export const getRetentionPolicies = async (): Promise<RetentionPolicy[]> => {
  await delay(150)
  return seedRetentionPolicies as RetentionPolicy[]
}

export const getRetentionPolicyById = async (id: string): Promise<RetentionPolicy | undefined> => {
  await delay(100)
  return (seedRetentionPolicies as RetentionPolicy[]).find((p) => p._id === id)
}

export type DsrRequestsFilters = {
  status?: DsrRequestStatus
  type?: DsrRequestType
  tenantId?: string
}

export const getDsrRequestsFiltered = async (
  filters: DsrRequestsFilters
): Promise<DsrRequest[]> => {
  await delay(150)
  let requests = seedDsrRequests as DsrRequest[]
  if (filters.status) requests = requests.filter((r) => r.status === filters.status)
  if (filters.type) requests = requests.filter((r) => r.type === filters.type)
  if (filters.tenantId) requests = requests.filter((r) => r.tenantId === filters.tenantId)
  return requests
}

export type LegalHoldsFilters = {
  status?: LegalHoldStatus
  tenantId?: string
}

export const getLegalHoldsFiltered = async (
  filters: LegalHoldsFilters
): Promise<LegalHold[]> => {
  await delay(140)
  let holds = seedLegalHolds as LegalHold[]
  if (filters.status) holds = holds.filter((h) => h.status === filters.status)
  if (filters.tenantId) holds = holds.filter((h) => h.tenantId === filters.tenantId)
  return holds
}
