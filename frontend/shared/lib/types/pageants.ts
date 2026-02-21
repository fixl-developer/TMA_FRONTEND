/**
 * Pageants Domain Types - Super Admin
 *
 * Minimal Pageant types used by the Super Admin UI.
 * Mirrors the frontend tenant types for consistency.
 */

export interface Pageant {
  _id: string
  tenantId: string
  name: string
  description?: string
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "ARCHIVED"
  rules?: Record<string, any>
  createdByUserId: string
  createdAt?: Date
  updatedAt?: Date
}

