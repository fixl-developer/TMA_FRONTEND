/**
 * Automation Service – Campaign Builder, Rules, Policy Packs, SLA
 * Phase 35. Seed data only.
 */

import {
  seedAutomationCampaigns,
  seedAutomationRules,
  seedPolicyPacks,
  seedSlaConfigs,
  seedAutomationRuns,
} from "@/data/seed"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export interface AutomationCampaign {
  _id: string
  tenantId: string
  name: string
  status: "ACTIVE" | "INACTIVE"
  stages: { order: number; name: string; trigger: string; actions: string[] }[]
  targeting: Record<string, unknown>
  runsCount?: number
  lastRunAt?: string
  createdAt?: string
}

export interface AutomationRule {
  _id: string
  tenantId: string
  name: string
  trigger: string
  conditions: { field: string; op: string; value: unknown }[]
  actions: string[]
  status: "ACTIVE" | "INACTIVE"
  runsLast24h?: number
  lastRunAt?: string
  createdAt?: string
}

export interface PolicyPack {
  code: string
  name: string
  description: string
  enabled: boolean
  policies: string[]
}

export interface SlaConfig {
  _id: string
  tenantId: string
  name: string
  objectType: string
  clockStart: string
  targetHours: number
  escalationSteps: { atHours: number; action: string }[]
  status: "ACTIVE" | "INACTIVE"
  breachesLast30d?: number
  createdAt?: string
}

export interface AutomationRun {
  _id: string
  automationId: string
  status: string
  triggeredBy?: string
  runAt?: string
  durationMs?: number
  error?: string
}

export async function getAutomationCampaigns(tenantId: string): Promise<AutomationCampaign[]> {
  await delay(100)
  return (seedAutomationCampaigns as AutomationCampaign[]).filter((c) => c.tenantId === tenantId)
}

export async function getAutomationCampaignById(
  id: string,
  tenantId: string
): Promise<AutomationCampaign | null> {
  await delay(80)
  const c = (seedAutomationCampaigns as AutomationCampaign[]).find(
    (x) => x._id === id && x.tenantId === tenantId
  )
  return c ?? null
}

export async function getAutomationRules(tenantId: string): Promise<AutomationRule[]> {
  await delay(100)
  return (seedAutomationRules as AutomationRule[]).filter((r) => r.tenantId === tenantId)
}

export async function getPolicyPacks(): Promise<PolicyPack[]> {
  await delay(80)
  return seedPolicyPacks as PolicyPack[]
}

export async function getSlaConfigs(tenantId: string): Promise<SlaConfig[]> {
  await delay(100)
  return (seedSlaConfigs as SlaConfig[]).filter((s) => s.tenantId === tenantId)
}

export async function getAutomationLogs(
  tenantId: string,
  limit = 50
): Promise<AutomationRun[]> {
  await delay(100)
  const runs = seedAutomationRuns as AutomationRun[]
  return runs.slice(0, limit)
}
