"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getProjects } from "@/shared/services/projectService"
import { useTenant } from "@/shared/context/TenantContext"
import { FolderKanban, ListTodo, CheckSquare, Calendar, Plus, ExternalLink } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminTable,
  AdminTableRow,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
  AdminSearchBar,
} from "@/shared/components/admin/AdminPageLayout"
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
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    getProjects(tenantId).then((data) => {
      setProjects(data)
      setLoading(false)
    })
  }, [tenantId])

  const activeCount = projects.filter((p) => p.status === "ACTIVE").length
  const planningCount = projects.filter((p) => p.status === "PLANNING").length
  const completedCount = projects.filter((p) => p.status === "COMPLETED").length

  const filteredProjects = projects.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Projects"
        subtitle="Manage work, tasks, checklists, and run-of-show"
        actions={
        <div className="flex gap-2">
          <CapabilityGate capability="jobs.read">
            <Link href="/admin/events">
              <AdminButton variant="secondary">
                Events
              </AdminButton>
            </Link>
          </CapabilityGate>
          <AdminButton disabled>
            <Plus className="h-4 w-4" />
            New Project
          </AdminButton>
        </div>
      }
    >
      {/* Stats */}
      <AdminStatsGrid columns={4}>
        <AdminStatCard label="Total Projects" value={projects.length} icon={FolderKanban} color="purple" />
        <AdminStatCard label="Active" value={activeCount} icon={CheckSquare} color="green" subtitle="In progress" />
        <AdminStatCard label="Planning" value={planningCount} icon={ListTodo} color="yellow" subtitle="Not started" />
        <AdminStatCard label="Completed" value={completedCount} icon={Calendar} color="blue" subtitle="Finished" />
      </AdminStatsGrid>

      {/* Projects Table */}
      <AdminCard
        title="All Projects"
        actions={<AdminSearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search projects..." />}
      >
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-[#f3f2f1]" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <AdminEmptyState
            icon={FolderKanban}
            title={searchQuery ? "No projects found" : "No projects yet"}
            description={searchQuery ? "Try adjusting your search" : "Create your first project to get started"}
          />
        ) : (
          <AdminTable headers={["Project", "Type", "Owner", "Status", "Dates", "Actions"]}>
            {filteredProjects.map((project) => (
              <AdminTableRow key={project._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#8764b8] text-xs font-semibold text-white">
                      {project.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#323130]">{project.name}</p>
                      <p className="text-xs text-[#605e5c] truncate max-w-xs">{project.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-[#605e5c]">
                  {typeLabels[project.type] || project.type}
                </td>
                <td className="px-6 py-4 text-xs text-[#605e5c]">
                  {getOwnerName(project.ownerId)}
                </td>
                <td className="px-6 py-4">
                  <AdminBadge
                    variant={
                      project.status === "ACTIVE"
                        ? "success"
                        : project.status === "PLANNING"
                        ? "warning"
                        : project.status === "COMPLETED"
                        ? "info"
                        : "default"
                    }
                  >
                    {project.status}
                  </AdminBadge>
                </td>
                <td className="px-6 py-4 text-xs text-[#605e5c]">
                  {project.startDate ? new Date(project.startDate).toLocaleDateString("en-IN") : "—"}
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/projects/${project._id}`}>
                    <AdminButton size="sm" variant="ghost">
                      View
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </AdminButton>
                  </Link>
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
