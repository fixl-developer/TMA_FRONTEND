/**
 * RBAC/ABAC domain types - Super Admin
 *
 * Roles, capabilities, policies (ABAC), permission matrix, and audit.
 */

export interface Role {
  id: string
  name: string
  displayName: string
  blueprint: string
  description?: string
  permissionCount: number
  userCount: number
  isSystem: boolean
  createdAt?: string
  updatedAt?: string
  permissions?: string[]
  inheritsFrom?: string[]
}

export interface Capability {
  id: string
  name: string
  category: string
  description?: string
  riskLevel: "low" | "medium" | "high" | "critical"
  action: string
  resource: string
  conditions?: { field: string; operator: string; value: unknown }[]
}

export interface Policy {
  id: string
  name: string
  description?: string
  type: "allow" | "deny" | "conditional"
  blueprint: string
  status: "active" | "draft" | "disabled"
  priority: number
  conditions: { field: string; operator: string; value: unknown }[]
  actions: string[]
  resources: string[]
  appliedToRoles: string[]
  createdAt?: string
  updatedAt?: string
}

export interface PermissionMatrix {
  blueprint: string
  roles: string[]
  resources: {
    name: string
    permissions: {
      action: string
      roleAccess: Record<string, boolean>
    }[]
  }[]
}

export interface RbacAuditLog {
  id: string
  timestamp: string
  action: string
  actionType: string
  actor: string
  actorRole: string
  targetType: string
  targetName: string
  blueprint?: string
  changes?: { field: string; oldValue: unknown; newValue: unknown }[]
  ipAddress?: string
  userAgent?: string
}
