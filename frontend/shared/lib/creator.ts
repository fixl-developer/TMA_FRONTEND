/**
 * Creator / ownership helpers
 * Maps createdByUserId to user name from seed.
 */

import { seedUsers } from "@/data/seed"

export function getCreatorName(createdBy?: string | null): string | null {
  if (!createdBy) return null
  const user = (seedUsers as { _id?: string; name?: string }[]).find(
    (u) => u._id === createdBy
  )
  return user?.name ?? null
}

/** Alias for ownerId (projects use ownerId) */
export function getOwnerName(ownerId?: string | null): string | null {
  return getCreatorName(ownerId)
}
