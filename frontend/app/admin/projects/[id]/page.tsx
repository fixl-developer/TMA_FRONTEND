"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getProjectById,
  getTasksByProject,
  getChecklistsByProject,
  getProjectStatusColor,
  getTaskStatusColor,
} from "@/shared/services/projectService"
import { FolderKanban, ListTodo, CheckSquare, ChevronRight } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"
import { getCreatorName, getOwnerName } from "@/shared/lib/creator"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"

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
  const { page } = useDashboardTheme()
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
      <AgenciesPage>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-slate-500">Loading project…</p>
        </div>
      </AgenciesPage>
    )
  }

  const doneTasks = tasks.filter((t) => t.status === "DONE").length
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length

  return (
    <AgenciesPage>
      <PageBanner
        title={project.name}
        subtitle={`${typeLabels[project.type] ?? project.type} · ${project.startDate} – ${project.endDate}`}
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/projects">
          <Button variant="ghost" size="sm">
            ← Projects
          </Button>
        </Link>
        {project.eventId && (
          <Link href={`/admin/events/${project.eventId}/run-of-show`}>
            <Button variant="outline" size="sm">
              Run-of-show
            </Button>
          </Link>
        )}
      </div>

      {project.description && (
        <p className="mt-6 text-sm text-slate-600">{project.description}</p>
      )}

      <Card className="mt-6" style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="text-sm">Ownership & attribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-slate-600">
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
        </CardContent>
      </Card>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">
        <Card style={{ borderColor: page.border }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Tasks ({tasks.length})
            </CardTitle>
            <CapabilityGate capability="jobs.read">
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/projects/${id}/tasks`}>View all</Link>
              </Button>
            </CapabilityGate>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <p className="py-4 text-center text-slate-500">No tasks yet.</p>
            ) : (
              <div className="space-y-2">
                {tasks.slice(0, 4).map((t) => (
                  <div
                    key={t._id}
                    className="flex items-center justify-between rounded border px-3 py-2"
                    style={{ borderColor: page.border }}
                  >
                    <p className="text-sm font-medium" style={{ color: page.text }}>
                      {t.title}
                    </p>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs ${getTaskStatusColor(t.status)}`}
                    >
                      {t.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs text-slate-500">
              {doneTasks} done · {inProgressTasks} in progress
            </p>
          </CardContent>
        </Card>

        <Card style={{ borderColor: page.border }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Checklists ({checklists.length})
            </CardTitle>
            <CapabilityGate capability="jobs.read">
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/projects/${id}/checklists`}>View all</Link>
              </Button>
            </CapabilityGate>
          </CardHeader>
          <CardContent>
            {checklists.length === 0 ? (
              <p className="py-4 text-center text-slate-500">No checklists yet.</p>
            ) : (
              <div className="space-y-2">
                {checklists.map((c) => {
                  const items = c.items ?? []
                  const done = items.filter((i: any) => i.done).length
                  const total = items.length
                  return (
                    <Link key={c._id} href={`/admin/projects/${id}/checklists`}>
                      <div
                        className="flex items-center justify-between rounded border px-3 py-2 transition-colors hover:bg-slate-50"
                        style={{ borderColor: page.border }}
                      >
                        <p className="text-sm font-medium" style={{ color: page.text }}>
                          {c.name}
                        </p>
                        <span className="text-xs text-slate-500">
                          {done}/{total}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <CapabilityGate capability="jobs.read">
          <Button asChild variant="outline">
            <Link href={`/admin/projects/${id}/tasks`}>Tasks</Link>
          </Button>
        </CapabilityGate>
        <CapabilityGate capability="jobs.read">
          <Button asChild variant="outline">
            <Link href={`/admin/projects/${id}/checklists`}>Checklists</Link>
          </Button>
        </CapabilityGate>
      </div>
    </AgenciesPage>
  )
}
