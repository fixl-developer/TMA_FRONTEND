"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  getProjectById,
  getTasksByProject,
} from "@/shared/services/projectService"
import { ListTodo, Calendar, ArrowLeft } from "lucide-react"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"

export default function ProjectTasksPage() {
  const params = useParams()
  const id = params?.id as string
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
      <AdminPageWrapper>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-white/60">Loading…</p>
        </div>
      </AdminPageWrapper>
    )
  }

  const byStatus = {
    TODO: tasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    DONE: tasks.filter((t) => t.status === "DONE"),
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={`Tasks: ${project.name}`}
        subtitle="Task list and assignments"
        action={
          <div className="flex gap-2">
            <Link href={`/admin/projects/${id}`}>
              <AdminButton variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Project
              </AdminButton>
            </Link>
            <Link href="/admin/projects">
              <AdminButton variant="ghost" size="sm">All projects</AdminButton>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <CapabilityGate
          capability="jobs.read"
          fallback={
            <AdminCard className="lg:col-span-3">
              <p className="py-8 text-center text-sm text-white/60">
                You do not have permission to view project tasks.
              </p>
            </AdminCard>
          }
        >
          {(["TODO", "IN_PROGRESS", "DONE"] as const).map((status) => (
            <AdminCard key={status}>
              <div className="mb-4 flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-white/60" />
                <h2 className="text-sm font-semibold text-white">
                  {status.replace("_", " ")} ({byStatus[status].length})
                </h2>
              </div>
              {byStatus[status].length === 0 ? (
                <p className="py-4 text-center text-sm text-white/60">
                  No tasks
                </p>
              ) : (
                <div className="space-y-3">
                  {byStatus[status].map((t) => (
                    <div
                      key={t._id}
                      className="rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <p className="font-medium text-sm text-white">
                        {t.title}
                      </p>
                      {t.description && (
                        <p className="mt-1 text-xs text-white/60 line-clamp-2">
                          {t.description}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/50">
                        {t.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {t.dueDate}
                          </span>
                        )}
                        {t.priority && (
                          <AdminBadge variant={t.priority === "HIGH" ? "warning" : "default"}>
                            {t.priority}
                          </AdminBadge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AdminCard>
          ))}
        </CapabilityGate>
      </div>
    </AdminPageWrapper>
  )
}
