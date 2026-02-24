/**
 * Collaboration Service - Super Admin
 *
 * Seed-backed service for cross-tenant collaboration: requests, rooms, contracts, escrow, analytics.
 */

import {
  seedCollaborationRequests,
  seedCollaborationRooms,
  seedCollaborationContracts,
  seedCollaborationEscrow,
  seedCollaborationAnalytics,
} from "@/data/seed"
import type {
  CollaborationRequest,
  CollaborationRoom,
  CollaborationContract,
  CollaborationEscrow,
  CollaborationAnalytics,
  CollaborationRequestStatus,
  CollaborationRequestType,
} from "@/shared/lib/types/collaboration"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getCollaborationRequests = async (): Promise<CollaborationRequest[]> => {
  await delay(180)
  return seedCollaborationRequests as CollaborationRequest[]
}

export const getCollaborationRequestById = async (id: string): Promise<CollaborationRequest | undefined> => {
  await delay(100)
  return (seedCollaborationRequests as CollaborationRequest[]).find((r) => r.id === id)
}

export const getCollaborationRooms = async (): Promise<CollaborationRoom[]> => {
  await delay(160)
  return seedCollaborationRooms as CollaborationRoom[]
}

export const getCollaborationRoomById = async (id: string): Promise<CollaborationRoom | undefined> => {
  await delay(100)
  return (seedCollaborationRooms as CollaborationRoom[]).find((r) => r.id === id)
}

export const getCollaborationContracts = async (): Promise<CollaborationContract[]> => {
  await delay(150)
  return seedCollaborationContracts as CollaborationContract[]
}

export const getCollaborationContractsByRoomId = async (roomId: string): Promise<CollaborationContract[]> => {
  await delay(120)
  return (seedCollaborationContracts as CollaborationContract[]).filter((c) => c.roomId === roomId)
}

export const getCollaborationEscrow = async (): Promise<CollaborationEscrow[]> => {
  await delay(140)
  return seedCollaborationEscrow as CollaborationEscrow[]
}

export const getCollaborationEscrowByRoomId = async (roomId: string): Promise<CollaborationEscrow[]> => {
  await delay(120)
  return (seedCollaborationEscrow as CollaborationEscrow[]).filter((e) => e.roomId === roomId)
}

export const getCollaborationAnalytics = async (): Promise<CollaborationAnalytics> => {
  await delay(130)
  return seedCollaborationAnalytics as CollaborationAnalytics
}

export type CollaborationRequestsFilters = {
  status?: CollaborationRequestStatus
  type?: CollaborationRequestType
  tenantId?: string
}

export const getCollaborationRequestsFiltered = async (
  filters: CollaborationRequestsFilters
): Promise<CollaborationRequest[]> => {
  await delay(150)
  let requests = seedCollaborationRequests as CollaborationRequest[]
  if (filters.status) requests = requests.filter((r) => r.status === filters.status)
  if (filters.type) requests = requests.filter((r) => r.type === filters.type)
  if (filters.tenantId) {
    requests = requests.filter(
      (r) => r.requesterTenantId === filters.tenantId || r.targetTenantId === filters.tenantId
    )
  }
  return requests
}
