/**
 * Workflow Service - Super Admin
 *
 * Seed-backed service for platform workflows, executions, and analytics.
 */

import {
  seedWorkflows,
  seedWorkflowExecutions,
  seedWorkflowAnalytics,
} from "@/data/seed"
import type {
  Workflow,
  WorkflowExecution,
  WorkflowAnalytics,
  WorkflowStatus,
  WorkflowType,
} from "@/shared/lib/types/workflows"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getWorkflows = async (): Promise<Workflow[]> => {
  await delay(180)
  return seedWorkflows as Workflow[]
}

export const getWorkflowById = async (id: string): Promise<Workflow | undefined> => {
  await delay(120)
  return (seedWorkflows as Workflow[]).find((w) => w.id === id)
}

export const getWorkflowExecutions = async (
  workflowId: string
): Promise<WorkflowExecution[]> => {
  await delay(160)
  return (seedWorkflowExecutions as WorkflowExecution[]).filter(
    (e) => e.workflowId === workflowId
  )
}

export const getWorkflowAnalytics = async (
  workflowId: string
): Promise<WorkflowAnalytics | undefined> => {
  await delay(140)
  return (seedWorkflowAnalytics as WorkflowAnalytics[]).find(
    (a) => a.workflowId === workflowId
  )
}

export const getAllExecutions = async (): Promise<WorkflowExecution[]> => {
  await delay(150)
  return seedWorkflowExecutions as WorkflowExecution[]
}

export type WorkflowListFilters = {
  type?: WorkflowType
  status?: WorkflowStatus
  tenantId?: string
}

export const getWorkflowsFiltered = async (
  filters: WorkflowListFilters
): Promise<Workflow[]> => {
  await delay(180)
  let list = seedWorkflows as Workflow[]
  if (filters.type) list = list.filter((w) => w.type === filters.type)
  if (filters.status) list = list.filter((w) => w.status === filters.status)
  if (filters.tenantId !== undefined)
    list = list.filter((w) => (w.tenantId ?? "") === filters.tenantId)
  return list
}
