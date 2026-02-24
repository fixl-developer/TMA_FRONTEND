"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Gauge, ArrowRight, TrendingUp, TrendingDown } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchWesDashboard } from "@/shared/state/wesSlice"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function WesDashboardPage() {
  const dispatch = useAppDispatch()
  const { dashboard, loadingDashboard } = useAppSelector((s) => s.wes)

  useEffect(() => {
    if (!dashboard) dispatch(fetchWesDashboard())
  }, [dispatch, dashboard])

  const overview = dashboard?.overview
  const tenantScores = dashboard?.tenantScores ?? []
  const historicalTrend = dashboard?.historicalTrend ?? []
  const recommendations = dashboard?.recommendations ?? []

  return (
    <PageLayout>
      <PageHeader
        title="WES dashboard"
        description="Workflow Execution System score & metrics. Component scores, trend analysis, tenant comparison. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Gauge className="h-3.5 w-3.5 text-[#0078d4]" />WES</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/wes"><Button variant="outline" size="sm">Main WES</Button></Link>
            <Link href="/wes/executions"><Button variant="outline" size="sm">Executions</Button></Link>
            <Link href="/wes/analytics"><Button variant="outline" size="sm">Analytics</Button></Link>
            <Link href="/wes/bottlenecks"><Button variant="outline" size="sm">Bottlenecks</Button></Link>
            <Link href="/wes/kpis"><Button variant="outline" size="sm">KPIs</Button></Link>
          </div>
        }
      />
      <PageSection title="Platform overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Platform WES score</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingDashboard ? "—" : overview?.platformWES ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total tenants</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingDashboard ? "—" : overview?.totalTenants ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>High performers</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loadingDashboard ? "—" : overview?.highPerformers ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Needs improvement</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#ff8c00]">{loadingDashboard ? "—" : overview?.needsImprovement ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Avg response time</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{loadingDashboard ? "—" : overview?.avgResponseTime != null ? `${overview.avgResponseTime}h` : "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Avg resolution rate</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{loadingDashboard ? "—" : overview?.avgResolutionRate != null ? `${overview.avgResolutionRate}%` : "—"}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Tenant comparison">
        <Card><CardContent className="p-0">
          {loadingDashboard ? <div className="py-12 text-center text-sm text-[#605e5c]">Loading…</div> : tenantScores.length === 0 ? <div className="py-12 text-center text-sm text-[#605e5c]">No tenant scores</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-[#edebe9] bg-[#faf9f8]">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Tenant</th>
                    <th className="px-4 py-2 text-left font-medium">Blueprint</th>
                    <th className="px-4 py-2 text-right font-medium">WES score</th>
                    <th className="px-4 py-2 text-center font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {tenantScores.map((t) => (
                    <tr key={t.tenantId} className="border-b border-[#edebe9]">
                      <td className="px-4 py-2 font-medium">{t.name}</td>
                      <td className="px-4 py-2">{t.blueprint}</td>
                      <td className="px-4 py-2 text-right font-semibold">{t.wesScore}</td>
                      <td className="px-4 py-2 text-center">
                        {t.trend === "up" ? <TrendingUp className="inline h-4 w-4 text-[#107c10]" /> : t.trend === "down" ? <TrendingDown className="inline h-4 w-4 text-[#a80000]" /> : <span className="text-[#605e5c]">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent></Card>
      </PageSection>
      <PageSection title="Historical trend">
        <Card><CardContent className="pt-4">
          {historicalTrend.length === 0 ? <p className="text-sm text-[#605e5c]">No trend data</p> : (
            <div className="flex flex-wrap gap-4">
              {historicalTrend.map((h) => (
                <div key={h.month} className="rounded border border-[#edebe9] px-4 py-2">
                  <span className="text-xs text-[#605e5c]">{h.month}</span>
                  <p className="text-lg font-semibold">{h.score}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent></Card>
      </PageSection>
      <PageSection title="Recommendations">
        <Card><CardContent className="p-0">
          {recommendations.length === 0 ? <div className="py-12 text-center text-sm text-[#605e5c]">No recommendations</div> : (
            <div className="divide-y divide-[#edebe9]">
              {recommendations.slice(0, 5).map((r) => (
                <div key={r.id} className="px-4 py-3">
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="text-xs text-[#605e5c]">{r.description}</p>
                  <div className="mt-1 flex gap-2">
                    <span className={`rounded px-2 py-0.5 text-xs ${r.priority === "high" ? "bg-[#fff4ce]" : "bg-[#f3f2f1]"}`}>{r.priority}</span>
                    <span className="text-xs text-[#605e5c]">{r.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
