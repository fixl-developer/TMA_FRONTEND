/**
 * Capability Service - RBAC
 *
 * Maps user + tenant to capabilities from seed roles.
 * Superadmin gets all capabilities.
 */

import { seedRoles, seedUsers } from "@/data/seed"

// Seed role name by user role
const ROLE_NAME_MAP: Record<string, string> = {
  TENANT_OWNER: "Tenant Owner",
  ADMIN: "Admin",
  AGENT: "Agent",
  FINANCE: "Finance",
  PAGEANT_DIRECTOR: "Pageant Director",
  JUDGE: "Judge",
}

// Default capabilities for tenants without roles in seed (fallback)
const DEFAULT_OWNER_CAPS = [
  "tenant.manage_settings",
  "users.invite",
  "users.assign_roles",
  "talents.read",
  "talents.write",
  "jobs.read",
  "jobs.write",
  "contracts.create",
  "wallet.read",
  "escrow.release",
  "audit.read",
]

// All capabilities (superadmin)
const ALL_CAPABILITIES = [
  "tenant.manage_settings",
  "users.invite",
  "users.assign_roles",
  "talents.read",
  "talents.write",
  "talents.delete",
  "jobs.read",
  "jobs.write",
  "bookings.manage",
  "contracts.create",
  "contracts.send",
  "contracts.void",
  "wallet.read",
  "ledger.transfer",
  "credits.issue",
  "escrow.create",
  "escrow.release",
  "escrow.lock",
  "disputes.raise",
  "disputes.decide",
  "automations.manage",
  "automations.run.retry",
  "audit.read",
  "exports.generate",
  "pageant.manage",
  "judges.manage",
  "registrations.read",
  "scoring.publish",
  "scoring.submit",
  "participants.read",
]

export function getCapabilitiesForUser(
  userEmail: string,
  tenantId: string | null
): string[] {
  if (!userEmail) return []

  // Superadmin gets all
  const email = userEmail.toLowerCase()
  if (email === "admin@talentos.com" || email === "superadmin@talentos.io") {
    return ALL_CAPABILITIES
  }

  const seedUser = (seedUsers as { email?: string; role?: string; tenantIds?: string[] }[]).find(
    (u) => u.email?.toLowerCase() === email
  )

  if (!seedUser) {
    // Demo users (admin@talentos.io etc.) - use default owner caps
    return DEFAULT_OWNER_CAPS
  }

  const userRole = seedUser.role
  const userTenantIds = seedUser.tenantIds || []
  if (tenantId && !userTenantIds.includes(tenantId)) {
    return []
  }

  const roleName = ROLE_NAME_MAP[userRole || ""]
  const roles = seedRoles as { tenantId: string; name: string; capabilities?: string[] }[]
  const role = roles.find(
    (r) => r.tenantId === (tenantId || userTenantIds[0]) && r.name === roleName
  )

  if (role?.capabilities?.length) return role.capabilities

  // Fallback for tenants without roles in seed
  if (userRole === "TENANT_OWNER" || userRole === "ADMIN") {
    return DEFAULT_OWNER_CAPS
  }

  return []
}

export function hasCapability(
  userEmail: string,
  tenantId: string | null,
  capability: string
): boolean {
  const caps = getCapabilitiesForUser(userEmail, tenantId)
  return caps.includes(capability)
}
