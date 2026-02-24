"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3 } from "lucide-react"
import type { AutomationAnalytics } from "@/shared/lib/types/automation"
import { getAutomationAnalytics } from "@/shared/services/automationService"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function AutomationAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AutomationAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAutomationAnalytics().then(setAnalytics).finally(() => setLoading(false))
  }, [])

  return (
    <PageLayout>
      <PageHeader
        title="Automation analytics"
        description="Execution trends, success rates, rule efficiency. Seed data only – full charts with API later."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <BarChart3 className="h-3.5 w-3.5 text-[#0078d4]" />
            Analytics
          </span>
        }
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/automation"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Overview</Link>
          </Button>
        }
      />

      <PageSection title="Performance">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle>Period</CardTitle></CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-[#323130]">{loading ? "—" : analytics?.period ?? "—"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Total executions</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : analytics?.totalExecutions?.toLocaleString() ?? "—"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Success rate</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">
                {loading ? "—" : analytics?.successRatePercent != null ? `${analytics.successRatePercent}%` : "—"}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">Success / Failure: {analytics?.successCount ?? 0} / {analytics?.failureCount ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Avg / P95 duration</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#0078d4]">
                {loading || !analytics ? "—" : `${analytics.avgDurationMs}ms / ${analytics.p95DurationMs}ms`}
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="By pack">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Execution count and success rate by pack</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-8 text-center text-sm text-[#605e5c]">Loading…</div>
            ) : !analytics?.byPack?.length ? (
              <div className="py-8 text-center text-sm text-[#605e5c]">No pack breakdown in seed.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#edebe9] bg-[#faf9f8] text-left text-[#605e5c]">
                      <th className="px-4 py-2 font-medium">Pack</th>
                      <th className="px-4 py-2 font-medium">Executions</th>
                      <th className="px-4 py-2 font-medium">Success rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.byPack.map((row) => (
                      <tr key={row.packId} className="border-b border-[#edebe9]">
                        <td className="px-4 py-2">
                          <Link href={`/automation/packs/${row.packId}`} className="text-[#0078d4] hover:underline">
                            {row.packName}
                          </Link>
                        </td>
                        <td className="px-4 py-2 font-medium">{row.executionCount.toLocaleString()}</td>
                        <td className="px-4 py-2">{row.successRatePercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Trends">
        <Card>
          <CardContent className="py-8 text-center text-sm text-[#605e5c]">
            Chart placeholder: connect to GET /v1/superadmin/automation/analytics for time-series and cost data.
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
