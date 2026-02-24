/**
 * Cross-Tenant Collaboration domain types - Super Admin
 *
 * Collaboration requests, rooms, contracts, escrow, and analytics.
 */

export type CollaborationRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED"
export type CollaborationRequestType = "JOINT_CAMPAIGN" | "SHARED_TALENT" | "COLLABORATIVE_EVENT" | "RESOURCE_SHARING"
export type CollaborationRoomStatus = "ACTIVE" | "ARCHIVED" | "CLOSED"
export type CollaborationContractStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "TERMINATED"

export interface CollaborationRequest {
  id: string
  requesterTenantId: string
  requesterTenantName?: string
  targetTenantId: string
  targetTenantName?: string
  type: CollaborationRequestType
  status: CollaborationRequestStatus
  title: string
  description?: string
  requestedAt: string
  respondedAt?: string
  expiresAt?: string
  approvedBy?: string
  rejectionReason?: string
}

export interface CollaborationRoom {
  id: string
  name: string
  description?: string
  status: CollaborationRoomStatus
  tenantIds: string[]
  tenantNames?: string[]
  createdBy: string
  createdAt: string
  archivedAt?: string
  participantCount: number
  sharedResourceCount?: number
  contractCount?: number
  escrowAccountIds?: string[]
}

export interface CollaborationContract {
  id: string
  roomId: string
  roomName?: string
  tenantIds: string[]
  tenantNames?: string[]
  status: CollaborationContractStatus
  title: string
  description?: string
  terms?: Record<string, unknown>
  signedAt?: string
  completedAt?: string
  terminatedAt?: string
  createdAt: string
}

export interface CollaborationEscrow {
  id: string
  roomId: string
  contractId?: string
  tenantIds: string[]
  amountMinor: number
  currency: string
  status: string
  fundedAt?: string
  releasedAt?: string
  createdAt: string
}

export interface CollaborationAnalytics {
  period: string
  totalRooms: number
  activeRooms: number
  totalRequests: number
  approvedRequests: number
  rejectionRatePercent: number
  totalRevenueMinor: number
  tenantParticipationCount: number
  avgRoomDurationDays: number
}
