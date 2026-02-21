/**
 * Talent Showcasing Types - Super Admin
 *
 * Minimal types for ContentPost and related analytics
 * used on the Super Admin showcase dashboard.
 */

export type ContentOwnerType = "TALENT" | "EVENT" | "BRAND"

export type ContentType = "VIDEO" | "IMAGE"

export type ContentStatus = "PENDING" | "LIVE" | "EXPIRED" | "REJECTED"

export interface ContentAnalytics {
  views: number
  clicks: number
  applications: number
}

export interface ContentPost {
  _id: string
  tenantId: string
  ownerType: ContentOwnerType
  ownerId: string
  type: ContentType
  status: ContentStatus
  title: string
  description?: string
  tags?: string[]
  linkedPageantId?: string
  createdAt?: string
  analytics?: ContentAnalytics
}

