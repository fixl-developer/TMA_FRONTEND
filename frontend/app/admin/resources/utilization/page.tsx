"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getUtilizationStats, getResourceTypeLabel } from "@/shared/services/resourceService"
import { useTenant } from "@/shared/context/TenantContext"
import { BarChart3, Users, TrendingUp } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

export default function UtilizationPage() {
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
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
    <AgenciesPage>
      <PageBanner
        title="Utilization"
        subtitle="Resource utilization and capacity"
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/resources">
          <Button variant="ghost" size="sm">
            ← Resources
          </Button>
        </Link>
      </div>

      <div className="mb-6 mt-6 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card style={{ borderColor: page.border }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total resources</CardTitle>
            <Users className="h-5 w-5" style={{ color: page.accent }} />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" style={{ color: page.text }}>
              {loading ? "—" : stats?.totalResources ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card style={{ borderColor: page.border }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Assignments</CardTitle>
            <TrendingUp className="h-5 w-5" style={{ color: page.accent }} />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" style={{ color: page.text }}>
              {loading ? "—" : stats?.totalAssignments ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card style={{ borderColor: page.border }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Open conflicts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">
              {loading ? "—" : stats?.openConflicts ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Utilization by type
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Loading…</p>
          ) : Object.keys(byType).length === 0 ? (
            <p className="py-8 text-center text-slate-500">No utilization data.</p>
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
                      <span style={{ color: page.text }}>
                        {getResourceTypeLabel(type)}
                      </span>
                      <span className="text-slate-500">
                        {data.assigned}/{data.total} assigned · {data.hours}h
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
