/**
 * Operations Service - Super Admin
 *
 * Automation, Security, Analytics. Phase 4. Seed data only.
 */

import {
  seedAutomationWorkflows,
  seedSecurityIncidents,
  seedSecurityThreats,
  seedAnalyticsAlerts,
  seedComplianceMapping,
} from "@/data/seed"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getAutomationWorkflows() {
  await delay(200)
  return seedAutomationWorkflows
}

export async function getSecurityIncidents() {
  await delay(200)
  return seedSecurityIncidents
}

export async function getSecurityThreats() {
  await delay(200)
  return seedSecurityThreats
}

export async function getAnalyticsAlerts() {
  await delay(200)
  return seedAnalyticsAlerts
}

export async function getComplianceMapping() {
  await delay(150)
  return seedComplianceMapping
}
