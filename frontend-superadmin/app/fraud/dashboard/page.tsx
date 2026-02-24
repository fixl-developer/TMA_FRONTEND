"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Activity, ArrowRight, AlertTriangle, Shield, TrendingUp } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchFraudDashboard } from "@/shared/state/fraudSlice"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { format } from "date-fns"

export default function FraudDashboardPage() {
  const dispatch = useAppDispatch()
  const { dashboard, loadingDashboard } = useAppSelector((s) => s.fraud)

  useEffect(() => {
    if (!dashboard) dispatch(fetchFraudDashboard())
  }, [dispatch, dashboard])

  const overview = dashboard?.overview
  const recentSignals = dashboard?.fraudSignals?.slice(0, 5) ?? []
  const byType = dashboard?.analytics?.byType ?? []
  const monthlyTrend = dashboard?.analytics?.monthlyTrend ?? []

  return (
    <PageLayout>
      <PageHeader
        title="Fraud dashboard"
        description="Real-time monitoring: active fraud signals, risk score distribution, recent alerts. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Activity className="h-3.5 w-3.5 text-[#0078d4]" />Fraud</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/fraud/signals"><Button variant="outline" size="sm">Signals</Button></Link>
            <Link href="/fraud/models"><Button variant="outline" size="sm">Models</Button></Link>
            <Link href="/fraud/patterns"><Button variant="outline" size="sm">Patterns</Button></Link>
            <Link href="/fraud/responses"><Button variant="outline" size="sm">Responses</Button></Link>
            <Link href="/fraud/thresholds"><Button variant="outline" size="sm">Thresholds</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total signals</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingDashboard ? "—" : overview?.totalSignals ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Active investigations</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#ff8c00]">{loadingDashboard ? "—" : overview?.activeInvestigations ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Blocked entities</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#a80000]">{loadingDashboard ? "—" : overview?.blockedEntities ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Platform risk score</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingDashboard ? "—" : overview?.riskScore ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Prevented loss</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#107c10]">{loadingDashboard ? "—" : overview?.preventedLoss != null ? `₹${(overview.preventedLoss / 100000).toFixed(1)}L` : "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Avg response (h)</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{loadingDashboard ? "—" : overview?.avgResponseTime ?? "—"}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Recent alerts">
        <Card><CardContent className="p-0">
          {loadingDashboard ? <div className="py-12 text-center text-sm text-[#605e5c]">Loading…</div> : recentSignals.length === 0 ? <div className="py-12 text-center text-sm text-[#605e5c]">No recent signals</div> : (
            <div className="divide-y divide-[#edebe9]">
              {recentSignals.map((s) => (
                <Link key={s.id} href={`/fraud/signals/${s.id}`} className="block px-4 py-3 hover:bg-[#faf9f8]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{s.entityName}</p>
                      <p className="text-xs text-[#605e5c]">{s.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded border px-2 py-0.5 text-xs ${s.severity === "critical" ? "border-[#a80000] bg-[#fde7e9]" : s.severity === "high" ? "border-[#ff8c00] bg-[#fff4ce]" : "border-[#edebe9]"}`}>{s.severity}</span>
                      <span className="text-sm font-mono">{s.riskScore}</span>
                      <span className="text-xs text-[#605e5c]">{format(new Date(s.detectedAt), "PP")}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent></Card>
      </PageSection>
      <PageSection title="Signals by type">
        <Card><CardContent className="pt-4">
          {byType.length === 0 ? <p className="text-sm text-[#605e5c]">No data</p> : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {byType.map((t) => (
                <div key={t.type} className="flex items-center justify-between rounded border border-[#edebe9] px-4 py-2">
                  <span className="text-sm">{t.type}</span>
                  <span className="font-semibold">{t.count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent></Card>
      </PageSection>
      <PageSection title="Monthly trend">
        <Card><CardContent className="pt-4">
          {monthlyTrend.length === 0 ? <p className="text-sm text-[#605e5c]">No trend data</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="text-left py-2">Month</th><th className="text-right py-2">Signals</th><th className="text-right py-2">Blocked</th></tr></thead>
                <tbody>
                  {monthlyTrend.map((m) => (
                    <tr key={m.month} className="border-b border-[#edebe9]"><td className="py-2">{m.month}</td><td className="text-right">{m.signals}</td><td className="text-right">{m.blocked}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
