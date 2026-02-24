"use client"

import { useEffect } from "react"
import Link from "next/link"
import { BarChart3, ArrowLeft } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchModerationAnalytics } from "@/shared/state/moderationSlice"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function ModerationAnalyticsPage() {
  const dispatch = useAppDispatch()
  const { analytics, loadingAnalytics } = useAppSelector((s) => s.moderation)

  useEffect(() => {
    if (!analytics) dispatch(fetchModerationAnalytics())
  }, [dispatch, analytics])

  return (
    <PageLayout>
      <PageHeader
        title="Moderation metrics"
        description="Queue health, response times, action distribution, moderator performance, trend analysis. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><BarChart3 className="h-3.5 w-3.5 text-[#0078d4]" />Analytics</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/moderation/queue"><Button variant="outline" size="sm">Queue</Button></Link>
            <Link href="/moderation/rules"><Button variant="outline" size="sm">Rules</Button></Link>
            <Link href="/moderation/appeals"><Button variant="outline" size="sm">Appeals</Button></Link>
          </div>
        }
      />
      <PageSection title="Queue health">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total pending</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingAnalytics ? "—" : analytics?.queueHealth.totalPending ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Avg wait time</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingAnalytics ? "—" : analytics?.queueHealth.averageWaitTime ? `${analytics.queueHealth.averageWaitTime}h` : "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Oldest pending age</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#ff8c00]">{loadingAnalytics ? "—" : analytics?.queueHealth.oldestPendingAge ? `${analytics.queueHealth.oldestPendingAge}h` : "—"}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Response times">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Average</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingAnalytics ? "—" : analytics?.responseTimes.average ? `${analytics.responseTimes.average}h` : "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>P50</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingAnalytics ? "—" : analytics?.responseTimes.p50 ? `${analytics.responseTimes.p50}h` : "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>P95</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingAnalytics ? "—" : analytics?.responseTimes.p95 ? `${analytics.responseTimes.p95}h` : "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>P99</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingAnalytics ? "—" : analytics?.responseTimes.p99 ? `${analytics.responseTimes.p99}h` : "—"}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      {analytics?.actionDistribution && (
        <PageSection title="Action distribution">
          <Card><CardContent className="pt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(analytics.actionDistribution).map(([action, count]) => (
                <div key={action} className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-4 py-2">
                  <span className="text-sm font-medium">{action}</span>
                  <span className="text-lg font-semibold text-[#323130]">{Number(count).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </PageSection>
      )}
      {analytics?.moderatorPerformance && analytics.moderatorPerformance.length > 0 && (
        <PageSection title="Moderator performance">
          <Card><CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-[#edebe9] bg-[#faf9f8]">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Moderator</th>
                    <th className="px-4 py-2 text-right font-medium">Items reviewed</th>
                    <th className="px-4 py-2 text-right font-medium">Avg response time</th>
                    <th className="px-4 py-2 text-right font-medium">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.moderatorPerformance.map((perf) => (
                    <tr key={perf.moderatorId} className="border-b border-[#edebe9]">
                      <td className="px-4 py-2 font-mono text-xs">{perf.moderatorId}</td>
                      <td className="px-4 py-2 text-right">{perf.itemsReviewed.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">{perf.averageResponseTime.toFixed(1)}h</td>
                      <td className={`px-4 py-2 text-right font-medium ${perf.accuracyRate >= 0.9 ? "text-[#107c10]" : perf.accuracyRate >= 0.8 ? "text-[#ff8c00]" : "text-[#a80000]"}`}>{(perf.accuracyRate * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent></Card>
        </PageSection>
      )}
      <PageSection title="Trends">
        <Card><CardContent className="py-8 text-center text-sm text-[#605e5c]">Trend charts (items queued, items resolved, average response time over time) will use GET /v1/superadmin/moderation/analytics. Chart placeholders for time series visualization.</CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
