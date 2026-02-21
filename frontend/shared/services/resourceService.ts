/**
 * Resource Service - Resource & Capacity Planning
 *
 * Resources (Talent, Crew, Trainer, Staff), availability, assignments, conflicts.
 * UI-only with seed data.
 */

import {
  seedResources,
  seedAvailabilityBlocks,
  seedAssignments,
  seedConflicts,
} from "@/data/seed"

const DEFAULT_TENANT = "tenant_001"
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function resolveTenant(tenantId?: string | null) {
  return tenantId ?? DEFAULT_TENANT
}

export async function getResources(
  tenantId?: string | null,
  filters?: { type?: string }
) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedResources as any[]).filter((r) => r.tenantId === id)
  if (filters?.type) list = list.filter((r) => r.type === filters.type)
  return list.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
}

export async function getResourceById(resourceId: string) {
  await delay(60)
  return (seedResources as any[]).find((r) => r._id === resourceId) ?? null
}

export async function getAvailabilityByResource(resourceId: string) {
  await delay(80)
  return (seedAvailabilityBlocks as any[])
    .filter((a) => a.resourceId === resourceId)
    .sort((a, b) => (a.from ?? "").localeCompare(b.from ?? ""))
}

export async function getAvailabilityBlocks(tenantId?: string | null) {
  await delay(120)
  const id = resolveTenant(tenantId)
  return (seedAvailabilityBlocks as any[])
    .filter((a) => a.tenantId === id)
    .sort((a, b) => (a.from ?? "").localeCompare(b.from ?? ""))
}

export async function getAssignments(
  tenantId?: string | null,
  filters?: { resourceId?: string; demandType?: string; status?: string }
) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedAssignments as any[]).filter((a) => a.tenantId === id)
  if (filters?.resourceId) list = list.filter((a) => a.resourceId === filters.resourceId)
  if (filters?.demandType) list = list.filter((a) => a.demandType === filters.demandType)
  if (filters?.status) list = list.filter((a) => a.status === filters.status)
  return list.sort((a, b) => (a.from ?? "").localeCompare(b.from ?? ""))
}

export async function getAssignmentsByResource(resourceId: string) {
  await delay(80)
  return (seedAssignments as any[])
    .filter((a) => a.resourceId === resourceId)
    .sort((a, b) => (a.from ?? "").localeCompare(b.from ?? ""))
}

export async function getConflicts(
  tenantId?: string | null,
  filters?: { status?: string; resourceId?: string }
) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedConflicts as any[]).filter((c) => c.tenantId === id)
  if (filters?.status) list = list.filter((c) => c.status === filters.status)
  if (filters?.resourceId) list = list.filter((c) => c.resourceId === filters.resourceId)
  return list.sort((a, b) => (b.detectedAt ?? b.resolvedAt ?? "").localeCompare(a.detectedAt ?? a.resolvedAt ?? ""))
}

export async function getUtilizationStats(tenantId?: string | null) {
  await delay(150)
  const id = resolveTenant(tenantId)
  const resources = (seedResources as any[]).filter((r) => r.tenantId === id)
  const assignments = (seedAssignments as any[]).filter((a) => a.tenantId === id)
  const conflicts = (seedConflicts as any[]).filter((c) => c.tenantId === id && c.status === "OPEN")

  const byType: Record<string, { total: number; assigned: number; hours: number }> = {}
  for (const r of resources) {
    const t = r.type ?? "OTHER"
    if (!byType[t]) byType[t] = { total: 0, assigned: 0, hours: 0 }
    byType[t].total++
  }
  for (const a of assignments) {
    if (a.status === "CONFIRMED" || a.status === "HOLD") {
      const r = resources.find((x) => x._id === a.resourceId)
      const t = r?.type ?? "OTHER"
      if (byType[t]) {
        byType[t].assigned++
        byType[t].hours += a.hours ?? 0
      }
    }
  }

  return {
    totalResources: resources.length,
    totalAssignments: assignments.length,
    openConflicts: conflicts.length,
    byType,
  }
}

export function getResourceTypeLabel(type: string) {
  const labels: Record<string, string> = {
    TALENT: "Talent",
    CREW: "Crew",
    TRAINER: "Trainer",
    STAFF: "Staff",
  }
  return labels[type] ?? type
}

export function getAssignmentStatusColor(status: string) {
  const colors: Record<string, string> = {
    CONFIRMED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    HOLD: "bg-amber-100 text-amber-700 border-amber-200",
    INQUIRY: "bg-slate-100 text-slate-700 border-slate-200",
  }
  return colors[status] ?? "bg-slate-100 text-slate-600"
}

export function getConflictStatusColor(status: string) {
  const colors: Record<string, string> = {
    OPEN: "bg-amber-100 text-amber-700 border-amber-200",
    RESOLVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  }
  return colors[status] ?? "bg-slate-100 text-slate-600"
}
