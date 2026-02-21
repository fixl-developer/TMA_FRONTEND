/**
 * Governance & Moderation Types - Super Admin
 *
 * Minimal types to power the governance dashboard.
 */

export type ModerationSource = "SHOWCASE" | "COMMUNITY" | "PAGEANT"

export type ModerationCategory =
  | "SPAM_PROMOTION"
  | "OFF_PLATFORM_DEAL"
  | "ABUSIVE_CONTENT"
  | "MINOR_PROTECTION"

export type ModerationSeverity = "LOW" | "MEDIUM" | "HIGH"

export type ModerationStatus = "OPEN" | "RESOLVED" | "ESCALATED"

export interface ModerationLog {
  _id: string
  tenantId: string
  source: ModerationSource
  contentId: string
  category: ModerationCategory
  severity: ModerationSeverity
  status: ModerationStatus
  reportedBy?: string
  rule?: string
  summary?: string
  actionTaken?: string
  createdAt?: string
  resolvedAt?: string
}

