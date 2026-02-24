/**
 * Platform Analytics & Reporting domain types - Super Admin
 */

export interface PlatformMetrics {
  activeTenants: number
  totalUsers: number
  transactionVolume: number
  revenueTotal: number
  growthTenants: number
  growthRevenue: number
}

export interface TenantAnalytics {
  tenantId: string
  name: string
  blueprint: string
  revenue: number
  healthScore: number
  churnRisk: "low" | "medium" | "high"
  usersCount: number
  transactionCount: number
  lastActivity: string
}

export interface RevenueBreakdown {
  subscription: number
  transaction: number
  commission: number
  total: number
}

export interface ReportDefinition {
  id: string
  name: string
  type: "scheduled" | "adhoc" | "template"
  schedule?: string
  lastRun?: string
  status: "active" | "paused" | "draft"
}
