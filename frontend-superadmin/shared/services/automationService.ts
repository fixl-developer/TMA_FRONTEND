/**
 * Automation Service - Super Admin
 *
 * Seed-backed service for automation packs, rules, execution logs, and analytics.
 */

import {
  seedAutomationPacks,
  seedAutomationRules,
  seedAutomationLogs,
  seedAutomationAnalytics,
} from "@/data/seed"
import type {
  AutomationPack,
  AutomationRule,
  AutomationLog,
  AutomationAnalytics,
  AutomationRuleStatus,
  AutomationTriggerType,
} from "@/shared/lib/types/automation"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getAutomationPacks = async (): Promise<AutomationPack[]> => {
  await delay(150)
  return seedAutomationPacks as AutomationPack[]
}

export const getAutomationPackById = async (id: string): Promise<AutomationPack | undefined> => {
  await delay(100)
  return (seedAutomationPacks as AutomationPack[]).find((p) => p.id === id)
}

export const getAutomationRules = async (): Promise<AutomationRule[]> => {
  await delay(160)
  return seedAutomationRules as AutomationRule[]
}

export const getAutomationRuleById = async (id: string): Promise<AutomationRule | undefined> => {
  await delay(100)
  return (seedAutomationRules as AutomationRule[]).find((r) => r.id === id)
}

export const getAutomationRulesByPackId = async (packId: string): Promise<AutomationRule[]> => {
  await delay(120)
  return (seedAutomationRules as AutomationRule[]).filter((r) => r.packId === packId)
}

export const getAutomationLogs = async (): Promise<AutomationLog[]> => {
  await delay(140)
  return seedAutomationLogs as AutomationLog[]
}

export const getAutomationLogsByRuleId = async (ruleId: string): Promise<AutomationLog[]> => {
  await delay(120)
  return (seedAutomationLogs as AutomationLog[]).filter((l) => l.ruleId === ruleId)
}

export const getAutomationAnalytics = async (): Promise<AutomationAnalytics> => {
  await delay(130)
  return seedAutomationAnalytics as AutomationAnalytics
}

export type AutomationRulesFilters = {
  packId?: string
  status?: AutomationRuleStatus
  triggerType?: AutomationTriggerType
}

export const getAutomationRulesFiltered = async (
  filters: AutomationRulesFilters
): Promise<AutomationRule[]> => {
  await delay(150)
  let rules = seedAutomationRules as AutomationRule[]
  if (filters.packId) rules = rules.filter((r) => r.packId === filters.packId)
  if (filters.status) rules = rules.filter((r) => r.status === filters.status)
  if (filters.triggerType) rules = rules.filter((r) => r.trigger.type === filters.triggerType)
  return rules
}
