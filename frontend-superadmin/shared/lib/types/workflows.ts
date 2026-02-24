/**
 * Workflow Engine domain types - Super Admin
 *
 * Platform workflows with state machine definition, execution history,
 * and analytics. Seed-data only for now.
 */

export type WorkflowStatus = "ACTIVE" | "DRAFT" | "DISABLED" | "ARCHIVED"
export type WorkflowType = "APPROVAL" | "BOOKING" | "INTAKE" | "ESCROW" | "PAGEANT" | "CASTING" | "CAMPAIGN" | "GENERIC"

export interface WorkflowState {
  id: string
  name: string
  description?: string
  /** Optional: for state machine viz */
  type?: "initial" | "intermediate" | "terminal"
}

export interface WorkflowTransition {
  from: string
  to: string
  trigger?: string
  condition?: string
}

export interface Workflow {
  id: string
  name: string
  description?: string
  type: WorkflowType
  status: WorkflowStatus
  /** Tenant ID if tenant-specific; empty for platform default */
  tenantId?: string
  blueprintId?: string
  version: string
  states: WorkflowState[]
  transitions: WorkflowTransition[]
  stats: {
    executionCount: number
    successCount: number
    failureCount: number
    avgDurationMs: number
    lastRunAt?: string
  }
}

export type ExecutionStatus = "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED"

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: ExecutionStatus
  currentState?: string
  startedAt: string
  completedAt?: string
  durationMs?: number
  tenantId?: string
  entityId?: string
  entityType?: string
  errorMessage?: string
  stepCount: number
}

export interface WorkflowExecutionStep {
  id: string
  executionId: string
  sequence: number
  fromState: string
  toState: string
  timestamp: string
  durationMs?: number
  success: boolean
  payload?: Record<string, unknown>
}

export interface WorkflowAnalytics {
  workflowId: string
  period: string
  executionCount: number
  successCount: number
  failureCount: number
  avgDurationMs: number
  p95DurationMs: number
  slaCompliancePercent?: number
}
