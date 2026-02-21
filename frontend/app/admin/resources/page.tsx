"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getResources, getUtilizationStats, getResourceTypeLabel } from "@/shared/services/resourceService"
import { useTenant } from "@/shared/context/TenantContext"
import { Users, ChevronRight, UserCircle2, Briefcase, GraduationCap, AlertTriangle } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"

const typeIcons: Record<string, any> = {
  TALENT: UserCircle2,
  CREW: Briefcase,
  TRAINER: GraduationCap,
  STAFF: Users,
}

export default function ResourcesPage() {
  const { tenantId } = useTenant()
  const [resources, setResources] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getResources(tenantId), getUtilizationStats(tenantId)]).then(
      ([r, s]) => {
        setResources(r)
        setStats(s)
        setLoading(false)
      }
    )
  }, [tenantId])

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Resources"
        subtitle="Talent, crew, trainers, staff – capacity planning"
        action={
          <div className="flex gap-2">
            <Link href="/admin/resources/availability">
              <AdminButton variant="secondary" size="sm">Availability</AdminButton>
            </Link>
            <Link href="/admin/resources/conflicts">
              <AdminButton variant="secondary" size="sm">Conflicts</AdminButton>
            </Link>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5 admin-light-theme:bg-slate-100 transition-colors" />
            ))}
          </>
        ) : (
          <>
            <AdminStatCard
              title="Total Resources"
              value={stats?.totalResources ?? 0}
              subtitle="Talent, crew, trainers"
              icon={Users}
              color="purple"
            />
            <AdminStatCard
              title="Assignments"
              value={stats?.totalAssignments ?? 0}
              subtitle="Active bookings, projects"
              icon={Briefcase}
              color="blue"
            />
            <AdminStatCard
              title="Open Conflicts"
              value={stats?.openConflicts ?? 0}
              subtitle="Require resolution"
              icon={AlertTriangle}
              color="yellow"
            />
            <AdminStatCard
              title="Utilization"
              value={stats?.utilization ? `${stats.utilization}%` : "—"}
              subtitle="Resource capacity"
              icon={Users}
              color="green"
            />
          </>
        )}
      </div>

      {/* Resource List */}
      <AdminCard>
        <h3 className="mb-6 text-lg font-bold text-white admin-light-theme:text-slate-900 transition-colors">
          Resource List
        </h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5 admin-light-theme:bg-slate-100 transition-colors" />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <AdminEmptyState
            icon={Users}
            title="No resources yet"
            description="Add talent, crew, trainers, or staff to manage capacity"
          />
        ) : (
          <div className="space-y-3">
            {resources.map((r) => {
              const Icon = typeIcons[r.type] ?? Users
              return (
                <div
                  key={r._id}
                  className="flex items-center justify-between rounded-xl border p-4 backdrop-blur-sm transition-all hover:border-white/20 admin-light-theme:border-slate-200 admin-light-theme:bg-white admin-light-theme:hover:border-slate-300 admin-light-theme:hover:shadow-md border-white/10 bg-white/5 hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 admin-light-theme:bg-purple-100 admin-light-theme:text-purple-600 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white admin-light-theme:text-slate-900 transition-colors">
                        {r.name}
                      </p>
                      <p className="text-sm text-white/60 admin-light-theme:text-slate-600 transition-colors">
                        {getResourceTypeLabel(r.type)} · {r.capacity ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.skills?.length > 0 && (
                      <span className="text-xs text-white/50 admin-light-theme:text-slate-500 transition-colors">
                        {r.skills.slice(0, 2).join(", ")}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-white/40 admin-light-theme:text-slate-400 transition-colors" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </AdminCard>

      {/* Quick Links */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/resources/availability">
          <AdminButton variant="secondary">Availability</AdminButton>
        </Link>
        <Link href="/admin/resources/assignments">
          <AdminButton variant="secondary">Assignments</AdminButton>
        </Link>
        <Link href="/admin/resources/utilization">
          <AdminButton variant="secondary">Utilization</AdminButton>
        </Link>
        <Link href="/admin/resources/conflicts">
          <AdminButton variant="secondary">Conflicts</AdminButton>
        </Link>
      </div>
    </AdminPageWrapper>
  )
}
