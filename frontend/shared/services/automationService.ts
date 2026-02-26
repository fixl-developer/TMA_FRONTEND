/**
 * Automation Service
 * 
 * Service functions for automation pack and rule management.
 * Uses seed data for Phase 1 implementation.
 */

import {
  seedAutomationPacks,
  getAutomationPackById,
  getAutomationPacksByStatus,
  getAutomationPacksByCategory,
  getAutomationPacksByBlueprint,
  getAutomationPackStats,
  getPackCategories,
  type AutomationPack,
  type AutomationPackId,
  type PackStatus
} from "@/data/seed/automationPacks"

import {
  seedAutomationRules,
  getAutomationRuleById,
  getAutomationRulesByPack,
  getAutomationRulesByCategory,
  getAutomationRulesByPriority,
  getEnabledAutomationRules,
  getAutomationRuleStats,
  getRuleCategories,
  type AutomationRule,
  type AutomationRuleId
} from "@/data/seed/automationRules"

// Simulated delay for realistic API feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// ============================================================================
// AUTOMATION PACKS
// ============================================================================

/**
 * Get all automation packs
 */
export async function getAutomationPacks(): Promise<AutomationPack[]> {
  await delay(300)
  return seedAutomationPacks
}

/**
 * Get automation pack by ID
 */
export async function getAutomationPack(id: AutomationPackId): Promise<AutomationPack | null> {
  await delay(200)
  const pack = getAutomationPackById(id)
  return pack || null
}

/**
 * Get automation packs by status
 */
export async function getAutomationPacksByStatusAsync(
  status: PackStatus
): Promise<AutomationPack[]> {
  await delay(250)
  return getAutomationPacksByStatus(status)
}

/**
 * Get automation packs by category
 */
export async function getAutomationPacksByCategoryAsync(
  category: string
): Promise<AutomationPack[]> {
  await delay(250)
  return getAutomationPacksByCategory(category)
}

/**
 * Get automation packs by blueprint
 */
export async function getAutomationPacksByBlueprintAsync(
  blueprintId: string
): Promise<AutomationPack[]> {
  await delay(250)
  return getAutomationPacksByBlueprint(blueprintId)
}

/**
 * Get automation pack statistics
 */
export async function getAutomationPackStatsAsync() {
  await delay(200)
  return getAutomationPackStats()
}

/**
 * Get pack categories
 */
export async function getPackCategoriesAsync(): Promise<string[]> {
  await delay(150)
  return getPackCategories()
}

/**
 * Search automation packs
 */
export async function searchAutomationPacks(query: string): Promise<AutomationPack[]> {
  await delay(300)
  const lowerQuery = query.toLowerCase()
  return seedAutomationPacks.filter(
    p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.id.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Install automation pack (mock)
 */
export async function installAutomationPack(
  packId: AutomationPackId,
  tenantId: string
): Promise<{ success: boolean; message: string }> {
  await delay(500)
  
  const pack = getAutomationPackById(packId)
  if (!pack) {
    return {
      success: false,
      message: `Pack ${packId} not found`
    }
  }

  return {
    success: true,
    message: `Pack "${pack.name}" installed successfully for tenant ${tenantId}`
  }
}

// ============================================================================
// AUTOMATION RULES
// ============================================================================

/**
 * Get all automation rules
 */
export async function getAutomationRules(): Promise<AutomationRule[]> {
  await delay(300)
  return seedAutomationRules
}

/**
 * Get automation rule by ID
 */
export async function getAutomationRule(id: AutomationRuleId): Promise<AutomationRule | null> {
  await delay(200)
  const rule = getAutomationRuleById(id)
  return rule || null
}

/**
 * Get automation rules by pack
 */
export async function getAutomationRulesByPackAsync(
  packId: string
): Promise<AutomationRule[]> {
  await delay(250)
  return getAutomationRulesByPack(packId)
}

/**
 * Get automation rules by category
 */
export async function getAutomationRulesByCategoryAsync(
  category: string
): Promise<AutomationRule[]> {
  await delay(250)
  return getAutomationRulesByCategory(category)
}

/**
 * Get automation rules by priority
 */
export async function getAutomationRulesByPriorityAsync(
  priority: string
): Promise<AutomationRule[]> {
  await delay(250)
  return getAutomationRulesByPriority(priority)
}

/**
 * Get enabled automation rules
 */
export async function getEnabledAutomationRulesAsync(): Promise<AutomationRule[]> {
  await delay(250)
  return getEnabledAutomationRules()
}

/**
 * Get automation rule statistics
 */
export async function getAutomationRuleStatsAsync() {
  await delay(200)
  return getAutomationRuleStats()
}

/**
 * Get rule categories
 */
export async function getRuleCategoriesAsync(): Promise<string[]> {
  await delay(150)
  return getRuleCategories()
}

/**
 * Search automation rules
 */
export async function searchAutomationRules(query: string): Promise<AutomationRule[]> {
  await delay(300)
  const lowerQuery = query.toLowerCase()
  return seedAutomationRules.filter(
    r =>
      r.name.toLowerCase().includes(lowerQuery) ||
      r.description.toLowerCase().includes(lowerQuery) ||
      r.id.toLowerCase().includes(lowerQuery) ||
      r.category.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Toggle rule enabled status (mock)
 */
export async function toggleRuleEnabled(
  ruleId: AutomationRuleId,
  enabled: boolean
): Promise<{ success: boolean; message: string }> {
  await delay(300)
  
  const rule = getAutomationRuleById(ruleId)
  if (!rule) {
    return {
      success: false,
      message: `Rule ${ruleId} not found`
    }
  }

  return {
    success: true,
    message: `Rule "${rule.name}" ${enabled ? "enabled" : "disabled"} successfully`
  }
}

/**
 * Test rule execution (mock)
 */
export async function testRuleExecution(
  ruleId: AutomationRuleId,
  testData: any
): Promise<{ success: boolean; message: string; executionId?: string }> {
  await delay(1000)
  
  const rule = getAutomationRuleById(ruleId)
  if (!rule) {
    return {
      success: false,
      message: `Rule ${ruleId} not found`
    }
  }

  const success = Math.random() > 0.2 // 80% success rate for tests
  
  return {
    success,
    message: success 
      ? `Test execution completed successfully` 
      : `Test execution failed: Condition not met`,
    executionId: success ? `test_exec_${Date.now()}` : undefined
  }
}

/**
 * Get rule execution logs (mock)
 */
export async function getRuleExecutionLogs(
  ruleId: AutomationRuleId,
  limit: number = 50
): Promise<any[]> {
  await delay(300)
  const rule = getAutomationRuleById(ruleId)
  if (!rule) return []

  // Mock execution logs
  const logs = []
  for (let i = 0; i < Math.min(limit, 50); i++) {
    const success = Math.random() > (100 - rule.successRate) / 100
    logs.push({
      id: `exec_${ruleId}_${i + 1}`,
      ruleId,
      executionId: `exec_${Date.now()}_${i}`,
      status: success ? "SUCCESS" : "FAILED",
      startedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      completedAt: new Date(Date.now() - Math.random() * 43200000).toISOString(),
      duration: `${Math.floor(Math.random() * 5000) + 100}ms`,
      error: success ? null : "Condition evaluation failed",
      metadata: {
        entityId: `entity_${Math.floor(Math.random() * 1000)}`,
        entityType: rule.trigger.entity,
        triggeredBy: rule.trigger.type
      }
    })
  }
  return logs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
}

/**
 * Get rule analytics (mock)
 */
export async function getRuleAnalytics(
  ruleId: AutomationRuleId
): Promise<any> {
  await delay(300)
  const rule = getAutomationRuleById(ruleId)
  if (!rule) return null

  return {
    ruleId,
    executions24h: rule.executions24h,
    executions7d: rule.executions24h * 7,
    executions30d: rule.executions24h * 30,
    successRate: rule.successRate,
    avgDuration: `${Math.floor(Math.random() * 3000) + 500}ms`,
    errorRate: 100 - rule.successRate,
    topErrors: [
      { error: "Condition not met", count: Math.floor(Math.random() * 10) + 1 },
      { error: "Timeout", count: Math.floor(Math.random() * 5) + 1 }
    ]
  }
}

/**
 * Create automation rule (mock)
 */
export async function createAutomationRule(
  data: Partial<AutomationRule>
): Promise<{ success: boolean; message: string; ruleId?: string }> {
  await delay(500)
  
  return {
    success: true,
    message: `Rule "${data.name}" created successfully`,
    ruleId: `RULE_${Date.now()}`
  }
}

/**
 * Update automation rule (mock)
 */
export async function updateAutomationRule(
  ruleId: AutomationRuleId,
  data: Partial<AutomationRule>
): Promise<{ success: boolean; message: string }> {
  await delay(500)
  
  const rule = getAutomationRuleById(ruleId)
  if (!rule) {
    return {
      success: false,
      message: `Rule ${ruleId} not found`
    }
  }

  return {
    success: true,
    message: `Rule "${rule.name}" updated successfully`
  }
}

/**
 * Delete automation rule (mock)
 */
export async function deleteAutomationRule(
  ruleId: AutomationRuleId
): Promise<{ success: boolean; message: string }> {
  await delay(400)
  
  const rule = getAutomationRuleById(ruleId)
  if (!rule) {
    return {
      success: false,
      message: `Rule ${ruleId} not found`
    }
  }

  return {
    success: true,
    message: `Rule "${rule.name}" deleted successfully`
  }
}
