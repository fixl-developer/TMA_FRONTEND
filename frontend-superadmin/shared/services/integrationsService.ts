/**
 * Integrations Service - Super Admin
 *
 * APIs, Webhooks, Partners, Deployments, Data & Legal. Phase 5. Seed data only.
 */

import {
  seedApiKeys,
  seedApiUsage,
  seedApiRateLimits,
  seedApiVersions,
  seedPaymentGateways,
  seedPaymentAnalytics,
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

export async function getApiUsage() {
  await delay(200)
  return seedApiUsage
}

export async function getApiRateLimits() {
  await delay(200)
  return seedApiRateLimits
}

export async function getApiVersions() {
  await delay(200)
  return seedApiVersions
}

export async function getPaymentGateways() {
  await delay(200)
  return seedPaymentGateways
}

export async function getPaymentAnalytics() {
  await delay(200)
  return seedPaymentAnalytics
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
