/**
 * Ops Health Service - WES & Ops Health Dashboard
 *
 * Workflow Execution Score, pillars, bottlenecks, CCC, disputes, recommendations.
 * UI-only with seed data.
 */

import {
  seedTenantMetricSnapshots,
  seedSlaClocks,
  seedApprovalMetrics,
  seedWesRecommendations,
  seedWesBottlenecks,
  seedCccMetrics,
  seedDisputes,
  seedConflicts,
} from "@/data/seed"

const DEFAULT_TENANT = "tenant_001"
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function resolveTenant(tenantId?: string | null) {
  return tenantId ?? DEFAULT_TENANT
}

const PILLAR_LABELS: Record<string, string> = {
  stageFlow: "Stage Flow",
  slaCompliance: "SLA Compliance",
  approvalVelocity: "Approval Velocity",
  queueHygiene: "Queue Hygiene",
  ccc: "Cash Conversion",
  disputeRate: "Dispute Rate",
  utilization: "Utilization",
}

export async function getWesOverview(tenantId?: string | null) {
  await delay(150)
  const id = resolveTenant(tenantId)
  const snapshots = (seedTenantMetricSnapshots as any[])
    .filter((s) => s.tenantId === id)
    .sort((a, b) => (b.period ?? "").localeCompare(a.period ?? ""))
  const latest = snapshots[0]
  const previous = snapshots[1]
  const trend = latest && previous ? (latest.wesTotal - previous.wesTotal) : 0
  return { latest, previous, trend, history: snapshots.slice(0, 6) }
}

export async function getBottlenecks(tenantId?: string | null) {
  await delay(120)
  const id = resolveTenant(tenantId)
  return (seedWesBottlenecks as any[])
    .filter((b) => b.tenantId === id)
    .sort((a, b) => (b.stageTimeRatio ?? 0) - (a.stageTimeRatio ?? 0))
}

export async function getCccMetrics(tenantId?: string | null) {
  await delay(120)
  const id = resolveTenant(tenantId)
  return (seedCccMetrics as any[])
    .filter((c) => c.tenantId === id)
    .sort((a, b) => (b.period ?? "").localeCompare(a.period ?? ""))
}

export async function getDisputeMetrics(tenantId?: string | null) {
  await delay(120)
  const id = resolveTenant(tenantId)
  const disputes = (seedDisputes as any[]).filter((d) => d.tenantId === id)
  const open = disputes.filter((d) => d.status === "OPEN" || d.status === "IN_REVIEW").length
  const resolved = disputes.filter((d) => d.status === "RESOLVED").length
  const total = disputes.length
  const resolutionDays = 5 // mock median
  return { open, resolved, total, resolutionDays, disputeRate: total > 0 ? (open / total) * 100 : 0 }
}

export async function getUtilizationMetrics(tenantId?: string | null) {
  await delay(120)
  const id = resolveTenant(tenantId)
  const conflicts = (seedConflicts as any[]).filter((c) => c.tenantId === id && c.status === "OPEN")
  return {
    utilizationPct: 72,
    conflictCount: conflicts.length,
    lastMinuteGaps: 1,
  }
}

export async function getRecommendations(tenantId?: string | null) {
  await delay(120)
  const id = resolveTenant(tenantId)
  return (seedWesRecommendations as any[])
    .filter((r) => r.tenantId === id)
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
}

export async function getSlaClocks(tenantId?: string | null, filters?: { status?: string }) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedSlaClocks as any[]).filter((s) => s.tenantId === id)
  if (filters?.status) list = list.filter((s) => s.status === filters.status)
  return list.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
}

export async function getApprovalMetrics(tenantId?: string | null) {
  await delay(120)
  const id = resolveTenant(tenantId)
  return (seedApprovalMetrics as any[]).filter((a) => a.tenantId === id)
}

export function getPillarLabel(key: string) {
  return PILLAR_LABELS[key] ?? key
}

export function getWesScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600"
  if (score >= 60) return "text-amber-600"
  return "text-red-600"
}

export function getWesScoreBgColor(score: number) {
  if (score >= 80) return "bg-emerald-100"
  if (score >= 60) return "bg-amber-100"
  return "bg-red-100"
}
