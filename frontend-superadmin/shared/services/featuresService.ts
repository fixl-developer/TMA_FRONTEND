/**
 * Features Service - Super Admin
 *
 * Feature flags, rollouts, and platform config.
 * Seed data only. Replace with API when backend is ready.
 */

import { seedFeatureFlags, seedRollouts, seedPlatformConfig } from "@/data/seed"

export async function getFeatureFlags() {
  await new Promise((r) => setTimeout(r, 200))
  return seedFeatureFlags
}

export async function getRollouts() {
  await new Promise((r) => setTimeout(r, 200))
  return seedRollouts
}

export async function getPlatformConfig() {
  await new Promise((r) => setTimeout(r, 150))
  return seedPlatformConfig
}
