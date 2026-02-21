/**
 * Integrations Service - Super Admin
 *
 * APIs, Webhooks, Partners, Deployments, Data & Legal. Phase 5. Seed data only.
 */

import {
  seedApiKeys,
  seedWebhooks,
  seedDeployments,
  seedMaintenanceWindows,
  seedRetentionPolicies,
  seedLegalHolds,
  seedDsrRequests,
  seedPartners,
} from "@/data/seed"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getApiKeys() {
  await delay(200)
  return seedApiKeys
}

export async function getWebhooks() {
  await delay(200)
  return seedWebhooks
}

export async function getPartners() {
  await delay(200)
  return seedPartners
}

export async function getDeployments() {
  await delay(200)
  return seedDeployments
}

export async function getMaintenanceWindows() {
  await delay(200)
  return seedMaintenanceWindows
}

export async function getRetentionPolicies() {
  await delay(200)
  return seedRetentionPolicies
}

export async function getLegalHolds() {
  await delay(200)
  return seedLegalHolds
}

export async function getDsrRequests() {
  await delay(200)
  return seedDsrRequests
}
