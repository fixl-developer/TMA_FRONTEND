/**
 * Platform User types - Super Admin
 *
 * Cross-tenant user identity, roles, and abuse status.
 */

export type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED"

export type PlatformRole =
  | "SUPER_ADMIN"
  | "TENANT_OWNER"
  | "ADMIN"
  | "AGENT"
  | "TALENT_MANAGER"
  | "TALENT"
  | "JUDGE"
  | "BRAND"

export interface PlatformUser {
  _id: string
  email: string
  name: string
  status: UserStatus
  role: PlatformRole
  tenantIds: string[]
  lastLoginAt?: string
  createdAt?: string
  suspendedAt?: string
  suspensionReason?: string
}

export interface AbuseReport {
  _id: string
  userId: string
  reporterId: string
  tenantId: string
  reason: string
  status: "PENDING" | "REVIEWED" | "DISMISSED" | "ACTION_TAKEN"
  createdAt: string
  resolvedAt?: string
}
