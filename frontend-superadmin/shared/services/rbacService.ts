/**
 * RBAC Service - Super Admin
 *
 * Seed-backed service for roles, capabilities, policies, permission matrix, and audit.
 */

import {
  seedRoles,
  seedPolicies,
  seedPermissionMatrix,
  seedRbacAudit,
} from "@/data/seed"
import type {
  Role,
  Policy,
  PermissionMatrix,
  RbacAuditLog,
} from "@/shared/lib/types/rbac"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getRoles = async (): Promise<Role[]> => {
  await delay(180)
  return seedRoles as Role[]
}

export const getRoleById = async (id: string): Promise<Role | undefined> => {
  await delay(100)
  return (seedRoles as Role[]).find((r) => r.id === id)
}

export const getPolicies = async (): Promise<Policy[]> => {
  await delay(160)
  return seedPolicies as Policy[]
}

export const getPolicyById = async (id: string): Promise<Policy | undefined> => {
  await delay(100)
  return (seedPolicies as Policy[]).find((p) => p.id === id)
}

export const getPermissionMatrix = async (): Promise<PermissionMatrix[]> => {
  await delay(150)
  return seedPermissionMatrix as PermissionMatrix[]
}

export const getRbacAuditLogs = async (): Promise<RbacAuditLog[]> => {
  await delay(140)
  return seedRbacAudit as RbacAuditLog[]
}

export const getRbacAuditLogsByRoleId = async (roleId: string): Promise<RbacAuditLog[]> => {
  await delay(120)
  return (seedRbacAudit as RbacAuditLog[]).filter((log) => log.targetName === roleId || log.targetType === "role")
}
