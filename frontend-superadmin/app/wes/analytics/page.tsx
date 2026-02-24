"use client"

import { useEffect } from "react"
import Link from "next/link"
import { BarChart3, ArrowLeft } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchWesDashboard } from "@/shared/state/wesSlice"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function WesAnalyticsPage() {
  const dispatch = useAppDispatch()
  const { dashboard, loadingDashboard } = useAppSelector((s) => s.wes)

  useEffect(() => {
    if (!dashboard) dispatch(fetchWesDashboard())
  }, [dispatch, dashboard])

  const overview = dashboard?.overview
  const blueprintBenchmarks = dashboard?.blueprintBenchmarks ?? []

  return (
    <PageLayout>
      <PageHeader
        title="Performance analytics"
        description="Stage flow efficiency, SLA compliance, approval velocity, queue hygiene, cash conversion, dispute rate. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><BarChart3 className="h-3.5 w-3.5 text-[#0078d4]" />Analytics</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/wes"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Dashboard</Link></Button>}
      />
      <PageSection title="Key metrics">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Platform WES</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingDashboard ? "—" : overview?.platformWES ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Avg response time</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{loadingDashboard ? "—" : overview?.avgResponseTime != null ? `${overview.avgResponseTime}h` : "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Avg resolution rate</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{loadingDashboard ? "—" : overview?.avgResolutionRate != null ? `${overview.avgResolutionRate}%` : "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Active rules</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{loadingDashboard ? "—" : overview?.activeRules ?? "—"}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Blueprint benchmarks">
        <Card><CardContent className="p-0">
          {blueprintBenchmarks.length === 0 ? <div className="py-12 text-center text-sm text-[#605e5c]">No benchmark data</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-[#edebe9] bg-[#faf9f8]">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Blueprint</th>
                    <th className="px-4 py-2 text-right font-medium">Avg WES</th>
                    <th className="px-4 py-2 text-right font-medium">Tenants</th>
                    <th className="px-4 py-2 text-right font-medium">Top performer</th>
                    <th className="px-4 py-2 text-right font-medium">Needs improvement</th>
                  </tr>
                </thead>
                <tbody>
                  {blueprintBenchmarks.map((b) => (
                    <tr key={b.blueprint} className="border-b border-[#edebe9]">
                      <td className="px-4 py-2 font-medium">{b.blueprint}</td>
                      <td className="px-4 py-2 text-right">{b.avgWES}</td>
                      <td className="px-4 py-2 text-right">{b.tenantCount}</td>
                      <td className="px-4 py-2 text-right text-[#107c10]">{b.topPerformer}</td>
                      <td className="px-4 py-2 text-right text-[#ff8c00]">{b.needsImprovement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent></Card>
      </PageSection>
      <PageSection title="Component breakdown">
        <Card><CardContent className="py-8 text-center text-sm text-[#605e5c]">
          Stage flow efficiency, SLA compliance, approval velocity, queue hygiene, cash conversion cycle, dispute rate, resource utilization. Chart placeholders for component breakdown.
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
