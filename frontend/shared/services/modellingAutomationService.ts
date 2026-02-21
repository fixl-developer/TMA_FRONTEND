/**
 * Modelling Automation Service
 *
 * Mock service for automations. Tenant-scoped.
 */

import { seedAutomationWorkflows, seedAutomationRuns } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// In-memory: created automations (resets on refresh)
const createdAutomations: Automation[] = []
// Overrides for seed automations (status toggle)
const automationOverrides: Record<string, Partial<Automation>> = {}

export interface Automation {
  _id: string
  tenantId?: string
  name: string
  trigger: string
  status: string
  runsLast24h?: number
  lastRunAt?: string
  createdAt?: string
}

export interface AutomationRun {
  _id: string
  automationId: string
  status: string
  triggeredBy?: string
  runAt: string
  durationMs?: number
  error?: string
}

function applyAutomationOverrides(automations: Automation[]): Automation[] {
  return automations.map((a) => {
    const override = automationOverrides[a._id]
    return override ? { ...a, ...override } : a
  })
}

export const getAutomations = async (
  tenantId?: string | null
): Promise<Automation[]> => {
  await delay(120)
  const id = tenantId || "tenant_001"
  const fromSeed = (seedAutomationWorkflows as Automation[]).filter(
    (a) => a.tenantId === id
  )
  const fromCreated = createdAutomations.filter((a) => a.tenantId === id)
  return [...fromCreated, ...applyAutomationOverrides(fromSeed)]
}

export const getAutomationById = async (
  automationId: string,
  tenantId?: string | null
): Promise<Automation | null> => {
  await delay(80)
  const tid = tenantId || "tenant_001"
  const fromCreated = createdAutomations.find(
    (x) => x._id === automationId && x.tenantId === tid
  )
  if (fromCreated) return fromCreated
  const a = (seedAutomationWorkflows as Automation[]).find(
    (x) => x._id === automationId && x.tenantId === tid
  )
  if (!a) return null
  const override = automationOverrides[automationId]
  return override ? { ...a, ...override } : a
}

export const getAutomationRuns = async (
  automationId: string,
  tenantId?: string | null,
  limit = 20
): Promise<AutomationRun[]> => {
  await delay(100)
  const runs = (seedAutomationRuns as AutomationRun[]).filter(
    (r) => r.automationId === automationId
  )
  return runs
    .sort((a, b) => new Date(b.runAt).getTime() - new Date(a.runAt).getTime())
    .slice(0, limit)
}

/** Mock: create/update automation */
export const saveAutomation = async (
  data: { name: string; trigger: string; conditions?: string; actions?: string },
  automationId?: string,
  tenantId?: string | null
): Promise<Automation> => {
  await delay(200)
  const tid = tenantId || "tenant_001"
  if (automationId) {
    const fromCreated = createdAutomations.find(
      (a) => a._id === automationId && a.tenantId === tid
    )
    if (fromCreated) {
      Object.assign(fromCreated, data)
      return fromCreated
    }
    const override = automationOverrides[automationId]
    automationOverrides[automationId] = { ...override, name: data.name, trigger: data.trigger }
    const existing = (seedAutomationWorkflows as Automation[]).find(
      (a) => a._id === automationId
    )
    const merged = existing ? { ...existing, ...automationOverrides[automationId] } : { _id: automationId, tenantId: tid, name: data.name, trigger: data.trigger, status: "ACTIVE" }
    return merged as Automation
  }
  const newAuto: Automation = {
    _id: `auto_${Date.now()}`,
    tenantId: tid,
    name: data.name,
    trigger: data.trigger,
    status: "ACTIVE",
    runsLast24h: 0,
    createdAt: new Date().toISOString(),
  }
  createdAutomations.push(newAuto)
  return newAuto
}

/** Mock: toggle automation enabled/disabled */
export const toggleAutomation = async (
  automationId: string,
  tenantId?: string | null
): Promise<void> => {
  await delay(150)
  const tid = tenantId || "tenant_001"
  const fromCreated = createdAutomations.find(
    (a) => a._id === automationId && a.tenantId === tid
  )
  if (fromCreated) {
    fromCreated.status = fromCreated.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
  } else {
    const key = automationId
    const current = automationOverrides[key]?.status
    const seed = (seedAutomationWorkflows as Automation[]).find((a) => a._id === automationId)
    const baseStatus = seed?.status ?? "ACTIVE"
    const next = (current ?? baseStatus) === "ACTIVE" ? "INACTIVE" : "ACTIVE"
    automationOverrides[key] = { ...automationOverrides[key], status: next }
  }
}
