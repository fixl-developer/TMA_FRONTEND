/**
 * Fraud Detection domain types - Super Admin
 */

export type FraudSignalSeverity = "low" | "medium" | "high" | "critical"
export type FraudSignalStatus = "active" | "investigating" | "resolved" | "flagged" | "blocked" | "monitoring"
export type SignalType =
  | "velocity_check"
  | "payment_anomaly"
  | "behavior_anomaly"
  | "device_fingerprint"
  | "geo_anomaly"
  | "payment_pattern"
  | "content_fraud"

export interface FraudSignal {
  id: string
  type: SignalType
  severity: FraudSignalSeverity
  status: FraudSignalStatus
  entityType: string
  entityId: string
  entityName: string
  description: string
  detectedAt: string
  riskScore: number
  actionTaken?: string
  assignedTo?: string
  resolvedAt?: string
  resolution?: string
  indicators?: string[]
  metadata?: Record<string, unknown>
}

export interface FraudInvestigation {
  id: string
  title: string
  status: "active" | "resolved"
  priority: "low" | "medium" | "high" | "critical"
  openedDate: string
  closedDate?: string
  assignedTo: string
  description: string
  affectedEntities?: { users?: number; transactions?: number; pageants?: number; bookings?: number }
  estimatedLoss?: number
  evidence?: string[]
  actions?: { date: string; action: string; by: string }[]
  resolution?: string
  nextSteps?: string[]
}

export interface FraudPattern {
  id: string
  name: string
  type: string
  confidence: number
  occurrences: number
  firstDetected: string
  lastDetected: string
  description: string
  indicators?: string[]
  affectedEntities?: number
  preventedLoss?: number
  status: string
}

export interface FraudModel {
  id: string
  name: string
  version: string
  status: "active" | "training" | "deprecated"
  entityType: string
  lastTrained?: string
  accuracy?: number
  precision?: number
  recall?: number
  f1Score?: number
  configuration?: Record<string, unknown>
}

export interface FraudResponseRule {
  id: string
  name: string
  triggerType: string
  severityThreshold: number
  action: string
  status: "active" | "disabled"
  executionCount?: number
  lastTriggered?: string
}

export interface FraudThreshold {
  id: string
  name: string
  metric: string
  value: number
  action: string
  status: "active" | "disabled"
}

export interface FraudDashboardData {
  overview: {
    totalSignals: number
    activeInvestigations: number
    blockedEntities: number
    riskScore: number
    falsePositiveRate: number
    avgResponseTime: number
    preventedLoss: number
    flaggedTransactions: number
  }
  fraudSignals: FraudSignal[]
  riskScores?: Array<{
    entityId: string
    entityType: string
    entityName: string
    overallScore: number
    category: string
    factors: Record<string, number>
    lastUpdated: string
    trend: string
    recommendations: string[]
  }>
  investigations?: FraudInvestigation[]
  blockedEntities?: unknown[]
  patterns?: FraudPattern[]
  analytics?: {
    byType?: Array<{ type: string; count: number; percentage: number; avgSeverity: string }>
    monthlyTrend?: Array<{ month: string; signals: number; blocked: number }>
  }
}
