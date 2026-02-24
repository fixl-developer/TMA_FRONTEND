/**
 * Automation Engine domain types - Super Admin
 *
 * Automation packs, rules (trigger/condition/action), execution logs,
 * and analytics. Seed-data only for now.
 */

export type AutomationPackStatus = "ACTIVE" | "DRAFT" | "DEPRECATED"
export type AutomationRuleStatus = "ACTIVE" | "DRAFT" | "DISABLED"
export type AutomationTriggerType = "EVENT" | "SCHEDULE" | "MANUAL" | "WEBHOOK"
export type AutomationLogStatus = "SUCCESS" | "FAILED" | "RUNNING" | "CANCELLED"

export interface AutomationPack {
  id: string
  name: string
  description?: string
  status: AutomationPackStatus
  /** Rule IDs belonging to this pack */
  ruleIds: string[]
  /** Tenant count that have adopted this pack */
  tenantAdoptionCount: number
  /** Health: ok | warning | error */
  health: "ok" | "warning" | "error"
  dependencies?: string[]
  updatedAt: string
}

export interface AutomationRule {
  id: string
  packId: string
  name: string
  description?: string
  status: AutomationRuleStatus
  trigger: {
    type: AutomationTriggerType
    event?: string
    schedule?: string
    config?: Record<string, unknown>
  }
  conditions?: { expression: string; description?: string }[]
  actions?: { type: string; config?: Record<string, unknown> }[]
  guardrails?: { type: string; config?: Record<string, unknown> }[]
  stats: {
    executionCount: number
    successCount: number
    failureCount: number
    avgDurationMs: number
    lastRunAt?: string
  }
  updatedAt: string
}

export interface AutomationLog {
  id: string
  ruleId: string
  ruleName?: string
  status: AutomationLogStatus
  startedAt: string
  completedAt?: string
  durationMs?: number
  tenantId?: string
  entityId?: string
  entityType?: string
  errorMessage?: string
  triggerPayload?: Record<string, unknown>
}

export interface AutomationAnalytics {
  period: string
  totalExecutions: number
  successCount: number
  failureCount: number
  successRatePercent: number
  avgDurationMs: number
  p95DurationMs: number
  /** Per-pack breakdown */
  byPack?: { packId: string; packName: string; executionCount: number; successRatePercent: number }[]
}
