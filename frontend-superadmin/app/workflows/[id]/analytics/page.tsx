"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BarChart3 } from "lucide-react"
import type { WorkflowAnalytics } from "@/shared/lib/types/workflows"
import { getWorkflowById } from "@/shared/services/workflowService"
import { getWorkflowAnalytics } from "@/shared/services/workflowService"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function WorkflowAnalyticsPage() {
  const params = useParams<{ id: string }>()
  const workflowId = params?.id
  const [workflow, setWorkflow] = useState<Awaited<ReturnType<typeof getWorkflowById>>>(undefined)
  const [analytics, setAnalytics] = useState<WorkflowAnalytics | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!workflowId) return
    setLoading(true)
    Promise.all([getWorkflowById(workflowId), getWorkflowAnalytics(workflowId)])
      .then(([w, a]) => {
        setWorkflow(w)
        setAnalytics(a ?? undefined)
      })
      .finally(() => setLoading(false))
  }, [workflowId])

  const successRate =
    analytics && analytics.executionCount > 0
      ? ((analytics.successCount / analytics.executionCount) * 100).toFixed(1)
      : "—"

  if (!workflowId) {
    return (
      <PageLayout>
        <PageHeader title="Analytics" description="Invalid workflow id." />
        <Button asChild variant="outline" size="sm"><Link href="/workflows">Back</Link></Button>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title="Workflow analytics"
        description={`${workflow?.name ?? workflowId} · Execution trends, SLA, and performance. Seed data only.`}
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <BarChart3 className="h-3.5 w-3.5 text-[#0078d4]" />
            Analytics
          </span>
        }
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href={`/workflows/${workflowId}`}><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Details</Link>
          </Button>
        }
      />

      <PageSection title="Performance">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle>Executions (period)</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {loading ? "—" : analytics?.executionCount ?? 0}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">Period: {analytics?.period ?? "—"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Success rate</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">{loading ? "—" : `${successRate}%`}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Success / Failure: {analytics?.successCount ?? 0} / {analytics?.failureCount ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Avg / P95 duration</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#0078d4]">
                {loading || !analytics
                  ? "—"
                  : `${(analytics.avgDurationMs / 1000).toFixed(1)}s / ${(analytics.p95DurationMs / 1000).toFixed(1)}s`}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">Response time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>SLA compliance</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">
                {loading ? "—" : analytics?.slaCompliancePercent != null ? `${analytics.slaCompliancePercent}%` : "—"}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">Target met</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Trends">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Execution time trends</CardTitle>
            <p className="text-xs text-[#605e5c]">Full trend charts and bottleneck analysis will use real API data. Seed shows aggregate metrics above.</p>
          </CardHeader>
          <CardContent>
            <div className="rounded border border-[#edebe9] bg-[#faf9f8] px-4 py-8 text-center text-sm text-[#605e5c]">
              Chart placeholder: connect to GET /v1/superadmin/workflows/:id/analytics for time-series data.
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
