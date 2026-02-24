"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getUtilizationMetrics } from "@/shared/services/opsHealthService"
import { useTenant } from "@/shared/context/TenantContext"
import { Users, AlertTriangle, ArrowLeft, TrendingUp } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
} from "@/shared/components/layout/AdminPageWrapper"

export default function UtilizationHealthPage() {
  const { tenantId } = useTenant()
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUtilizationMetrics(tenantId).then((m) => {
      setMetrics(m)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Utilization"
        subtitle="Resource utilization & conflict alerts"
        action={
          <div className="flex gap-2">
            <Link href="/admin/ops-health">
              <AdminButton variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Ops Health
              </AdminButton>
            </Link>
            <Link href="/admin/resources">
              <AdminButton variant="secondary" size="sm">
                Resources
              </AdminButton>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <AdminStatCard
          title="Utilization"
          value={loading ? "—" : `${metrics?.utilizationPct ?? 0}%`}
          subtitle="Healthy band: 60–85%"
          icon={Users}
          color="blue"
        />
        <AdminStatCard
          title="Open conflicts"
          value={loading ? "—" : metrics?.conflictCount ?? 0}
          icon={AlertTriangle}
          color="yellow"
        />
        <AdminStatCard
          title="Last-minute gaps"
          value={loading ? "—" : metrics?.lastMinuteGaps ?? 0}
          subtitle="Unfilled within 24h"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      <AdminCard>
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-white/60" />
          <h2 className="text-lg font-semibold text-white">Utilization & conflict rate</h2>
        </div>
        <p className="text-sm text-white/70">
          WES rewards utilization in a healthy band (60–85%). Penalizes conflicts and last-minute gaps.
        </p>
      </AdminCard>
    </AdminPageWrapper>
  )
}
