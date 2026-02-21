"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getUtilizationMetrics } from "@/shared/services/opsHealthService"
import { useTenant } from "@/shared/context/TenantContext"
import { Users, AlertTriangle } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

export default function UtilizationHealthPage() {
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUtilizationMetrics(tenantId).then((m) => {
      setMetrics(m)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AgenciesPage>
      <PageBanner
        title="Utilization"
        subtitle="Resource utilization & conflict alerts"
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/ops-health">
          <Button variant="ghost" size="sm">
            ← Ops Health
          </Button>
        </Link>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/resources">Resources</Link>
        </Button>
      </div>

      <div className="mb-6 mt-6 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card style={{ borderColor: page.border }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Utilization</CardTitle>
            <Users className="h-5 w-5" style={{ color: page.accent }} />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" style={{ color: page.text }}>
              {loading ? "—" : metrics?.utilizationPct ?? 0}%
            </p>
            <p className="text-sm text-slate-500">Healthy band: 60–85%</p>
          </CardContent>
        </Card>
        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="text-sm">Open conflicts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">
              {loading ? "—" : metrics?.conflictCount ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="text-sm">Last-minute gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" style={{ color: page.text }}>
              {loading ? "—" : metrics?.lastMinuteGaps ?? 0}
            </p>
            <p className="text-sm text-slate-500">Unfilled within 24h</p>
          </CardContent>
        </Card>
      </div>

      <Card style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Utilization & conflict rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            WES rewards utilization in a healthy band (60–85%). Penalizes conflicts and last-minute gaps.
          </p>
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
