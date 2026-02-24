"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getUtilizationStats, getResourceTypeLabel } from "@/shared/services/resourceService"
import { useTenant } from "@/shared/context/TenantContext"
import { BarChart3, Users, TrendingUp, ArrowLeft, AlertTriangle } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminEmptyState,
  AdminTableSkeleton,
} from "@/shared/components/layout/AdminPageWrapper"

export default function UtilizationPage() {
  const { tenantId } = useTenant()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUtilizationStats(tenantId).then((s) => {
      setStats(s)
      setLoading(false)
    })
  }, [tenantId])

  const byType = stats?.byType ?? {}

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Utilization"
        subtitle="Resource utilization and capacity"
        action={
          <Link href="/admin/resources">
            <AdminButton variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Resources
            </AdminButton>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <AdminStatCard
          title="Total resources"
          value={loading ? "—" : stats?.totalResources ?? 0}
          icon={Users}
          color="blue"
        />
        <AdminStatCard
          title="Assignments"
          value={loading ? "—" : stats?.totalAssignments ?? 0}
          icon={TrendingUp}
          color="green"
        />
        <AdminStatCard
          title="Open conflicts"
          value={loading ? "—" : stats?.openConflicts ?? 0}
          icon={AlertTriangle}
          color="yellow"
        />
      </div>

      <AdminCard>
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-white/60" />
          <h2 className="text-lg font-semibold text-white">Utilization by type</h2>
        </div>
        {loading ? (
          <AdminTableSkeleton rows={4} cols={2} />
        ) : Object.keys(byType).length === 0 ? (
          <AdminEmptyState
            icon={BarChart3}
            title="No utilization data"
            description="No resource utilization data available."
          />
        ) : (
          <div className="space-y-4">
            {Object.entries(byType).map(([type, data]: [string, any]) => {
              const pct =
                data.total > 0
                  ? Math.round((data.assigned / data.total) * 100)
                  : 0
              return (
                <div key={type}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-white">
                      {getResourceTypeLabel(type)}
                    </span>
                    <span className="text-white/60">
                      {data.assigned}/{data.total} assigned · {data.hours}h
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#d4ff00] transition-all"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
