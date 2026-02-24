/**
 * Content Moderation domain types - Super Admin
 *
 * Moderation queue, rules, appeals, moderators, analytics.
 */

export type ModerationStatus = "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "QUARANTINED" | "APPEALED"
export type ContentType = "SHOWCASE" | "COMMUNITY" | "PROFILE" | "COMMENT" | "MESSAGE" | "EVENT"
export type ModerationAction = "APPROVE" | "REJECT" | "QUARANTINE" | "DELETE" | "WARN" | "STRIKE"
export type AppealStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED"
export type RuleStatus = "ACTIVE" | "DRAFT" | "DISABLED"
export type RuleTriggerType = "KEYWORD" | "PATTERN" | "ML_MODEL" | "IMAGE_ANALYSIS" | "BEHAVIORAL"

export interface ModerationItem {
  _id: string
  tenantId: string
  contentId: string
  contentType: ContentType
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  status: ModerationStatus
  reportedBy?: string
  reportedAt?: string
  assignedTo?: string
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
  action?: ModerationAction
  reason?: string
  context?: Record<string, any>
  strikeCount?: number
}

export interface ModerationRule {
  _id: string
  name: string
  description?: string
  triggerType: RuleTriggerType
  triggerConditions: Record<string, any>
  actions: ModerationAction[]
  status: RuleStatus
  priority?: number
  tenantId?: string
  createdAt?: string
  updatedAt?: string
  executionCount?: number
  successRate?: number
}

export interface Appeal {
  _id: string
  moderationId: string
  tenantId: string
  contentId: string
  contentType: ContentType
  status: AppealStatus
  reason: string
  submittedBy: string
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  decision?: "APPROVED" | "REJECTED"
  decisionNotes?: string
}

export interface Moderator {
  _id: string
  userId: string
  name: string
  email?: string
  status: "ACTIVE" | "INACTIVE" | "TRAINING"
  assignedTenants?: string[]
  performanceMetrics?: {
    itemsReviewed: number
    averageResponseTime: number
    accuracyRate: number
  }
  trainingStatus?: {
    completed: boolean
    lastTraining?: string
    certifications?: string[]
  }
}

export interface ModerationAnalytics {
  queueHealth: {
    totalPending: number
    averageWaitTime: number
    oldestPendingAge: number
  }
  responseTimes: {
    average: number
    p50: number
    p95: number
    p99: number
  }
  actionDistribution: Record<ModerationAction, number>
  moderatorPerformance: {
    moderatorId: string
    itemsReviewed: number
    averageResponseTime: number
    accuracyRate: number
  }[]
  trends: {
    date: string
    itemsQueued: number
    itemsResolved: number
    averageResponseTime: number
  }[]
}
