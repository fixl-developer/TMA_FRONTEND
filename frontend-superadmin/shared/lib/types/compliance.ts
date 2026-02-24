/**
 * Compliance & Legal domain types - Super Admin
 *
 * DSR (Data Subject Rights), Legal Holds, Retention Policies.
 */

export type DsrRequestType = "ACCESS" | "ERASURE" | "PORTABILITY" | "RECTIFICATION"
export type DsrRequestStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED" | "EXPIRED"
export type LegalHoldStatus = "ACTIVE" | "RELEASED" | "EXPIRED"
export type RetentionPolicyStatus = "ACTIVE" | "DRAFT" | "DISABLED"

export interface DsrRequest {
  _id: string
  userId: string
  tenantId: string
  type: DsrRequestType
  status: DsrRequestStatus
  requestedAt: string
  completedAt?: string
  dueDate?: string
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  dataSubjectName?: string
  dataSubjectEmail?: string
  description?: string
  slaDays?: number
  slaStatus?: "ON_TIME" | "AT_RISK" | "BREACHED"
}

export interface LegalHold {
  _id: string
  tenantId: string
  reason: string
  entityTypes: string[]
  status: LegalHoldStatus
  createdAt: string
  expiresAt?: string
  releasedAt?: string
  affectedDataCount?: number
  createdBy?: string
  releasedBy?: string
  releaseReason?: string
}

export interface RetentionPolicy {
  _id: string
  entityType: string
  retentionMonths: number
  description?: string
  status: RetentionPolicyStatus
  tenantId?: string
  deletionRule?: "SOFT_DELETE" | "HARD_DELETE" | "ARCHIVE"
  exceptions?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface RetentionSchedule {
  id: string
  policyId: string
  entityType: string
  scheduledDate: string
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED"
  affectedCount?: number
  executedAt?: string
  errorMessage?: string
}
