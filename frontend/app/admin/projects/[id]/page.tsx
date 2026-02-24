"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  getProjectById,
  getTasksByProject,
  getChecklistsByProject,
} from "@/shared/services/projectService"
import { FolderKanban, ListTodo, CheckSquare, ArrowLeft } from "lucide-react"
import { getCreatorName, getOwnerName } from "@/shared/lib/creator"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"

const typeLabels: Record<string, string> = {
  PAGEANT: "Pageant",
  PRODUCTION: "Production",
  INFLUENCER: "Influencer",
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function ProjectDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [project, setProject] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [checklists, setChecklists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      getProjectById(id),
      getTasksByProject(id),
      getChecklistsByProject(id),
    ]).then(([p, t, c]) => {
      setProject(p)
      setTasks(t)
      setChecklists(c)
      setLoading(false)
    })
  }, [id])

  if (loading || !project) {
    return (
      <AdminPageWrapper>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-white/60">Loading project…</p>
        </div>
      </AdminPageWrapper>
    )
  }

  const doneTasks = tasks.filter((t) => t.status === "DONE").length
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={project.name}
        subtitle={`${typeLabels[project.type] ?? project.type} · ${project.startDate} – ${project.endDate}`}
        action={
          <div className="flex gap-2">
            <Link href="/admin/projects">
              <AdminButton variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Projects
              </AdminButton>
            </Link>
            {project.eventId && (
              <Link href={`/admin/events/${project.eventId}/run-of-show`}>
                <AdminButton variant="secondary" size="sm">Run-of-show</AdminButton>
              </Link>
            )}
          </div>
        }
      />

      {project.description && (
        <p className="mb-6 text-sm text-white/70">{project.description}</p>
      )}

      <AdminCard className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-white">Ownership & attribution</h3>
        <div className="space-y-1 text-sm text-white/70">
          <p>
            Owner:{" "}
            {getOwnerName(project.ownerId) ?? project.ownerId ?? "—"}
          </p>
          <p>
            Created by:{" "}
            {getCreatorName(project.createdByUserId ?? project.createdBy) ??
              project.createdByUserId ??
              project.createdBy ??
              "System"}
          </p>
          <p>
            Created: {formatDateTime(project.createdAt)} · Updated: {formatDateTime(project.updatedAt)}
          </p>
        </div>
      </AdminCard>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-white/60" />
              <h2 className="text-lg font-semibold text-white">Tasks ({tasks.length})</h2>
            </div>
            <CapabilityGate capability="jobs.read">
              <Link href={`/admin/projects/${id}/tasks`}>
                <AdminButton size="sm" variant="secondary">View all</AdminButton>
              </Link>
            </CapabilityGate>
          </div>
          {tasks.length === 0 ? (
            <p className="py-4 text-center text-white/60">No tasks yet.</p>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 4).map((t) => (
                <div
                  key={t._id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                >
                  <p className="text-sm font-medium text-white">
                    {t.title}
                  </p>
                  <AdminBadge variant={
                    t.status === "DONE" ? "success" :
                    t.status === "IN_PROGRESS" ? "info" : "default"
                  }>
                    {t.status.replace("_", " ")}
                  </AdminBadge>
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-white/50">
            {doneTasks} done · {inProgressTasks} in progress
          </p>
        </AdminCard>

        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-white/60" />
              <h2 className="text-lg font-semibold text-white">Checklists ({checklists.length})</h2>
            </div>
            <CapabilityGate capability="jobs.read">
              <Link href={`/admin/projects/${id}/checklists`}>
                <AdminButton size="sm" variant="secondary">View all</AdminButton>
              </Link>
            </CapabilityGate>
          </div>
          {checklists.length === 0 ? (
            <p className="py-4 text-center text-white/60">No checklists yet.</p>
          ) : (
            <div className="space-y-2">
              {checklists.map((c) => {
                const items = c.items ?? []
                const done = items.filter((i: any) => i.done).length
                const total = items.length
                return (
                  <Link key={c._id} href={`/admin/projects/${id}/checklists`}>
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10">
                      <p className="text-sm font-medium text-white">
                        {c.name}
                      </p>
                      <span className="text-xs text-white/60">
                        {done}/{total}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </AdminCard>
      </div>

      <div className="flex flex-wrap gap-3">
        <CapabilityGate capability="jobs.read">
          <Link href={`/admin/projects/${id}/tasks`}>
            <AdminButton variant="secondary">Tasks</AdminButton>
          </Link>
        </CapabilityGate>
        <CapabilityGate capability="jobs.read">
          <Link href={`/admin/projects/${id}/checklists`}>
            <AdminButton variant="secondary">Checklists</AdminButton>
          </Link>
        </CapabilityGate>
      </div>
    </AdminPageWrapper>
  )
}
