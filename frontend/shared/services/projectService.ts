/**
 * Project Service - Work Management & Run-of-Show
 *
 * Projects, tasks, checklists, run-of-show for production/pageant/staffing.
 * UI-only with seed data.
 */

import {
  seedProjects,
  seedTasks,
  seedChecklists,
  seedRunOfShow,
  seedPageants,
} from "@/data/seed"

const DEFAULT_TENANT = "tenant_001"
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function resolveTenant(tenantId?: string | null) {
  return tenantId ?? DEFAULT_TENANT
}

export async function getProjects(
  tenantId?: string | null,
  filters?: { status?: string; type?: string }
) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedProjects as any[]).filter((p) => p.tenantId === id)
  if (filters?.status) list = list.filter((p) => p.status === filters.status)
  if (filters?.type) list = list.filter((p) => p.type === filters.type)
  return list.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
}

export async function getProjectById(projectId: string) {
  await delay(80)
  return (seedProjects as any[]).find((p) => p._id === projectId) ?? null
}

export async function getTasksByProject(
  projectId: string,
  filters?: { status?: string }
) {
  await delay(100)
  let list = (seedTasks as any[]).filter((t) => t.projectId === projectId)
  if (filters?.status) list = list.filter((t) => t.status === filters.status)
  return list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
}

export async function getTaskById(taskId: string) {
  await delay(60)
  return (seedTasks as any[]).find((t) => t._id === taskId) ?? null
}

export async function getChecklistsByProject(projectId: string) {
  await delay(100)
  return (seedChecklists as any[]).filter((c) => c.projectId === projectId)
}

export async function getChecklistById(checklistId: string) {
  await delay(60)
  return (seedChecklists as any[]).find((c) => c._id === checklistId) ?? null
}

export async function getRunOfShowByEvent(eventId: string) {
  await delay(80)
  return (seedRunOfShow as any[]).find((r) => r.eventId === eventId) ?? null
}

export async function getEventById(eventId: string) {
  await delay(60)
  return (seedPageants as any[]).find((e) => e._id === eventId) ?? null
}

export function getTaskStatusColor(status: string) {
  const colors: Record<string, string> = {
    TODO: "bg-slate-100 text-slate-700 border-slate-200",
    IN_PROGRESS: "bg-amber-100 text-amber-700 border-amber-200",
    DONE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  }
  return colors[status] ?? "bg-slate-100 text-slate-600"
}

export function getProjectStatusColor(status: string) {
  const colors: Record<string, string> = {
    PLANNING: "bg-slate-100 text-slate-700 border-slate-200",
    ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
    COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
  }
  return colors[status] ?? "bg-slate-100 text-slate-600"
}
