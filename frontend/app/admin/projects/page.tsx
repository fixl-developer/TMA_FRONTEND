"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getProjects, getProjectStatusColor } from "@/shared/services/projectService"
import { useTenant } from "@/shared/context/TenantContext"
import { FolderKanban, ListTodo, CheckSquare, Calendar, Plus } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import { getOwnerName } from "@/shared/lib/creator"

const typeLabels: Record<string, string> = {
  PAGEANT: "Pageant",
  PRODUCTION: "Production",
  INFLUENCER: "Influencer",
}

export default function ProjectsPage() {
  const { tenantId } = useTenant()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProjects(tenantId).then((data) => {
      setProjects(data)
      setLoading(false)
    })
  }, [tenantId])

  const activeCount = projects.filter((p) => p.status === "ACTIVE").length
  const planningCount = projects.filter((p) => p.status === "PLANNING").length
  const completedCount = projects.filter((p) => p.status === "COMPLETED").length

  const getProjectBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success"
      case "PLANNING":
        return "warning"
      case "COMPLETED":
        return "info"
      case "ON_HOLD":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Projects"
        subtitle="Work management, tasks, checklists, run-of-show"
        action={
          <div className="flex gap-2">
            <CapabilityGate capability="jobs.read">
              <Link href="/admin/events">
                <AdminButton variant="secondary" size="sm">
                  Events
                </AdminButton>
              </Link>
            </CapabilityGate>
            <AdminButton disabled>
              <Plus className="mr-2 h-4 w-4" />
              New Project (Soon)
            </AdminButton>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total Projects"
          value={projects.length}
          subtitle="All projects"
          icon={FolderKanban}
          color="purple"
        />
        <AdminStatCard
          title="Active"
          value={activeCount}
          subtitle="In progress"
          icon={CheckSquare}
          color="green"
        />
        <AdminStatCard
          title="Planning"
          value={planningCount}
          subtitle="Not yet started"
          icon={ListTodo}
          color="yellow"
        />
        <AdminStatCard
          title="Completed"
          value={completedCount}
          subtitle="Finished"
          icon={CheckSquare}
          color="blue"
        />
      </div>

      {/* Projects List */}
      <AdminCard>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">All Projects</h3>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <AdminEmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Projects help you manage work, tasks, and run-of-show"
            action={
              <AdminButton disabled>
                <Plus className="mr-2 h-4 w-4" />
                Create Project (Coming Soon)
              </AdminButton>
            }
          />
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <Link key={p._id} href={`/admin/projects/${p._id}`}>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                        <FolderKanban className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-white">{p.name}</p>
                          <AdminBadge variant={getProjectBadgeVariant(p.status) as any}>
                            {p.status}
                          </AdminBadge>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/60">
                          <span>{typeLabels[p.type] ?? p.type}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {p.startDate} – {p.endDate}
                          </span>
                          {p.ownerId && (
                            <span>Owner: {getOwnerName(p.ownerId) ?? "—"}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
