/**
 * WES (Workflow Execution System) domain types - Super Admin
 */

export interface WesScore {
  id: string
  tenantId: string
  tenantName: string
  blueprint: string
  currentScore: number
  previousScore: number
  trend: "up" | "down" | "stable"
  lastCalculated: string
  metrics: Record<string, number>
  rank?: number
  totalTenants?: number
}

export interface WesTenantScore {
  tenantId: string
  name: string
  blueprint: string
  wesScore: number
  trend: "up" | "down" | "stable"
  trendValue?: number
  metrics: Record<string, number>
  lastUpdated: string
}

export interface WesExecution {
  id: string
  tenantId: string
  workflowId: string
  workflowName: string
  status: "running" | "completed" | "failed" | "queued"
  startedAt: string
  completedAt?: string
  duration?: number
  stage?: string
  error?: string
}

export interface WesBottleneck {
  id: string
  tenantId?: string
  stage: string
  description: string
  impact: "high" | "medium" | "low"
  avgDelayHours: number
  affectedExecutions: number
  status: "identified" | "resolving" | "resolved"
  recommendation?: string
}

export interface WesKpi {
  id: string
  name: string
  metric: string
  targetValue: number
  unit: string
  blueprint?: string
  thresholdWarning?: number
  thresholdCritical?: number
  status: "active" | "disabled"
}

export interface WesRecommendation {
  id: string
  tenantId?: string
  tenantName?: string
  priority: "high" | "medium" | "low"
  category: string
  title: string
  description: string
  potentialImpact?: string
  estimatedTimeSaving?: string
  status: "pending" | "in_progress" | "implemented" | "planned"
  createdAt?: string
  implementedAt?: string
  affectedTenants?: number
  estimatedImprovement?: number
}

export interface WesDashboardData {
  overview: {
    platformWES: number
    totalTenants: number
    highPerformers: number
    needsImprovement: number
    automationRules?: number
    activeRules?: number
    avgResponseTime?: number
    avgResolutionRate?: number
  }
  tenantScores: WesTenantScore[]
  blueprintBenchmarks?: Array<{
    blueprint: string
    avgWES: number
    tenantCount: number
    topPerformer: number
    needsImprovement: number
    keyMetrics: Record<string, number>
  }>
  historicalTrend?: Array<{ month: string; score: number }>
  recommendations?: WesRecommendation[]
}
