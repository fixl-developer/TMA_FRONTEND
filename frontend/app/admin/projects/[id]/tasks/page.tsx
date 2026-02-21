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
  getTaskStatusColor,
} from "@/shared/services/projectService"
import { ListTodo, Calendar, User } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"

export default function ProjectTasksPage() {
  const params = useParams()
  const id = params?.id as string
  const { page } = useDashboardTheme()
  const [project, setProject] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([getProjectById(id), getTasksByProject(id)]).then(([p, t]) => {
      setProject(p)
      setTasks(t)
      setLoading(false)
    })
  }, [id])

  if (loading || !project) {
    return (
      <AgenciesPage>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-slate-500">Loading…</p>
        </div>
      </AgenciesPage>
    )
  }

  const byStatus = {
    TODO: tasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    DONE: tasks.filter((t) => t.status === "DONE"),
  }

  return (
    <AgenciesPage>
      <PageBanner
        title={`Tasks: ${project.name}`}
        subtitle="Task list and assignments"
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/admin/projects/${id}`}>
          <Button variant="ghost" size="sm">
            ← Project
          </Button>
        </Link>
        <Link href="/admin/projects">
          <Button variant="ghost" size="sm">
            All projects
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-3">
        <CapabilityGate
          capability="jobs.read"
          fallback={
            <Card style={{ borderColor: page.border }} className="lg:col-span-3">
              <CardContent className="py-8 text-center text-sm text-slate-500">
                You do not have permission to view project tasks.
              </CardContent>
            </Card>
          }
        >
          {(["TODO", "IN_PROGRESS", "DONE"] as const).map((status) => (
            <Card key={status} style={{ borderColor: page.border }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <ListTodo className="h-4 w-4" />
                  {status.replace("_", " ")} ({byStatus[status].length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {byStatus[status].length === 0 ? (
                  <p className="py-4 text-center text-sm text-slate-500">
                    No tasks
                  </p>
                ) : (
                  <div className="space-y-3">
                    {byStatus[status].map((t) => (
                      <div
                        key={t._id}
                        className="rounded-lg border p-3"
                        style={{ borderColor: page.border }}
                      >
                        <p className="font-medium text-sm" style={{ color: page.text }}>
                          {t.title}
                        </p>
                        {t.description && (
                          <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                            {t.description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                          {t.dueDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {t.dueDate}
                            </span>
                          )}
                          {t.priority && (
                            <span
                              className={`rounded px-1.5 py-0.5 ${
                                t.priority === "HIGH"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {t.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </CapabilityGate>
      </div>
    </AgenciesPage>
  )
}
