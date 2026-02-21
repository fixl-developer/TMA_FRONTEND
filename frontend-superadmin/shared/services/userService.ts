/**
 * User Service - Super Admin
 *
 * Returns seed data for platform users (Identity, Roles, Abuse).
 * Replace with API calls when backend is ready.
 */

import { seedUsers, seedAbuseReports, seedTenants } from "@/data/seed"
import type { PlatformUser } from "@/shared/lib/types/users"

export async function getUsers(): Promise<PlatformUser[]> {
  await new Promise((r) => setTimeout(r, 300))
  return seedUsers as PlatformUser[]
}

export async function getAbuseReports() {
  await new Promise((r) => setTimeout(r, 200))
  return seedAbuseReports
}

export function getTenantName(tenantId: string): string {
  const tenant = (seedTenants as any[]).find((t) => t._id === tenantId)
  return tenant?.name ?? tenantId
}
