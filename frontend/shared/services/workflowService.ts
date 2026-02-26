/**
 * Workflow Service
 * 
 * Service functions for workflow management operations.
 * Uses seed data for Phase 1 implementation.
 */

import {
  seedWorkflows,
  getWorkflowById,
  getWorkflowsByBlueprint,
  getWorkflowsByStatus,
  getWorkflowsByCategory,
  getWorkflowStats,
  type Workflow,
  type WorkflowId,
  type WorkflowStatus
} from "@/data/seed/workflows"

// Simulated delay for realistic API feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Get all workflows
 */
export async function getWorkflows(): Promise<Workflow[]> {
  await delay(300)
  return seedWorkflows
}

/**
 * Get workflow by ID
 */
export async function getWorkflow(id: WorkflowId): Promise<Workflow | null> {
  await delay(200)
  const workflow = getWorkflowById(id)
  return workflow || null
}

/**
 * Get workflows by blueprint
 */
export async function getWorkflowsByBlueprintAsync(
  blueprintId: string
): Promise<Workflow[]> {
  await delay(250)
  return getWorkflowsByBlueprint(blueprintId)
}

/**
 * Get workflows by status
 */
export async function getWorkflowsByStatusAsync(
  status: WorkflowStatus
): Promise<Workflow[]> {
  await delay(250)
  return getWorkflowsByStatus(status)
}

/**
 * Get workflows by category
 */
export async function getWorkflowsByCategoryAsync(
  category: string
): Promise<Workflow[]> {
  await delay(250)
  return getWorkflowsByCategory(category)
}

/**
 * Get workflow statistics
 */
export async function getWorkflowStatsAsync() {
  await delay(200)
  return getWorkflowStats()
}

/**
 * Search workflows by query
 */
export async function searchWorkflows(query: string): Promise<Workflow[]> {
  await delay(300)
  const lowerQuery = query.toLowerCase()
  return seedWorkflows.filter(
    w =>
      w.name.toLowerCase().includes(lowerQuery) ||
      w.description.toLowerCase().includes(lowerQuery) ||
      w.id.toLowerCase().includes(lowerQuery) ||
      w.blueprint.toLowerCase().includes(lowerQuery) ||
      w.category.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get workflow execution logs (mock data)
 */
export async function getWorkflowExecutionLogs(
  workflowId: WorkflowId,
  limit: number = 50
): Promise<any[]> {
  await delay(300)
  const workflow = getWorkflowById(workflowId)
  if (!workflow) return []

  // Mock execution logs
  const logs = []
  for (let i = 0; i < Math.min(limit, 50); i++) {
    const success = Math.random() > (100 - workflow.successRate) / 100
    logs.push({
      id: `exec_${workflowId}_${i + 1}`,
      workflowId,
      executionId: `exec_${Date.now()}_${i}`,
      status: success ? "SUCCESS" : "FAILED",
      startedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      completedAt: new Date(Date.now() - Math.random() * 43200000).toISOString(),
      duration: `${Math.floor(Math.random() * 300) + 10}s`,
      currentState: success ? workflow.states[workflow.states.length - 1].name : workflow.states[Math.floor(Math.random() * workflow.states.length)].name,
      error: success ? null : "Timeout waiting for approval",
      metadata: {
        entityId: `entity_${Math.floor(Math.random() * 1000)}`,
        entityType: "Booking",
        triggeredBy: "user_123"
      }
    })
  }
  return logs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
}

/**
 * Get workflow analytics (mock data)
 */
export async function getWorkflowAnalytics(
  workflowId: WorkflowId
): Promise<any> {
  await delay(300)
  const workflow = getWorkflowById(workflowId)
  if (!workflow) return null

  return {
    workflowId,
    executions24h: workflow.executions24h,
    executions7d: workflow.executions24h * 7,
    executions30d: workflow.executions24h * 30,
    successRate: workflow.successRate,
    avgDuration: workflow.avgDuration,
    bottlenecks: [
      { state: workflow.states[2]?.name || "Unknown", avgTime: "2.3d", count: 45 },
      { state: workflow.states[4]?.name || "Unknown", avgTime: "1.8d", count: 38 }
    ],
    stateDistribution: workflow.states.slice(0, 5).map((state, i) => ({
      state: state.name,
      count: Math.floor(Math.random() * 100) + 10,
      percentage: Math.floor(Math.random() * 30) + 5
    })),
    errorRate: 100 - workflow.successRate,
    topErrors: [
      { error: "Timeout waiting for approval", count: 12 },
      { error: "Missing required documents", count: 8 },
      { error: "Payment gateway error", count: 5 }
    ]
  }
}

/**
 * Get workflow monitoring data (mock real-time data)
 */
export async function getWorkflowMonitoring(
  workflowId: WorkflowId
): Promise<any> {
  await delay(200)
  const workflow = getWorkflowById(workflowId)
  if (!workflow) return null

  return {
    workflowId,
    activeExecutions: Math.floor(Math.random() * 50) + 10,
    queuedExecutions: Math.floor(Math.random() * 20),
    currentLoad: Math.floor(Math.random() * 100),
    healthStatus: workflow.successRate > 90 ? "HEALTHY" : workflow.successRate > 75 ? "WARNING" : "CRITICAL",
    recentExecutions: await getWorkflowExecutionLogs(workflowId, 10),
    stateBreakdown: workflow.states.map(state => ({
      state: state.name,
      activeCount: Math.floor(Math.random() * 20)
    }))
  }
}

/**
 * Create new workflow (mock)
 */
export async function createWorkflow(
  data: Partial<Workflow>
): Promise<{ success: boolean; message: string; workflowId?: string }> {
  await delay(500)
  
  return {
    success: true,
    message: `Workflow "${data.name}" created successfully`,
    workflowId: `WF_${Date.now()}`
  }
}

/**
 * Update workflow (mock)
 */
export async function updateWorkflow(
  workflowId: WorkflowId,
  data: Partial<Workflow>
): Promise<{ success: boolean; message: string }> {
  await delay(500)
  
  const workflow = getWorkflowById(workflowId)
  if (!workflow) {
    return {
      success: false,
      message: `Workflow ${workflowId} not found`
    }
  }

  return {
    success: true,
    message: `Workflow "${workflow.name}" updated successfully`
  }
}

/**
 * Delete workflow (mock)
 */
export async function deleteWorkflow(
  workflowId: WorkflowId
): Promise<{ success: boolean; message: string }> {
  await delay(400)
  
  const workflow = getWorkflowById(workflowId)
  if (!workflow) {
    return {
      success: false,
      message: `Workflow ${workflowId} not found`
    }
  }

  return {
    success: true,
    message: `Workflow "${workflow.name}" deleted successfully`
  }
}

/**
 * Activate/deactivate workflow (mock)
 */
export async function toggleWorkflowStatus(
  workflowId: WorkflowId,
  status: WorkflowStatus
): Promise<{ success: boolean; message: string }> {
  await delay(300)
  
  const workflow = getWorkflowById(workflowId)
  if (!workflow) {
    return {
      success: false,
      message: `Workflow ${workflowId} not found`
    }
  }

  return {
    success: true,
    message: `Workflow "${workflow.name}" status changed to ${status}`
  }
}

/**
 * Test workflow execution (mock)
 */
export async function testWorkflowExecution(
  workflowId: WorkflowId,
  testData: any
): Promise<{ success: boolean; message: string; executionId?: string }> {
  await delay(1000)
  
  const workflow = getWorkflowById(workflowId)
  if (!workflow) {
    return {
      success: false,
      message: `Workflow ${workflowId} not found`
    }
  }

  const success = Math.random() > 0.2 // 80% success rate for tests
  
  return {
    success,
    message: success 
      ? `Test execution completed successfully` 
      : `Test execution failed: Validation error in state ${workflow.states[2].name}`,
    executionId: success ? `test_exec_${Date.now()}` : undefined
  }
}
