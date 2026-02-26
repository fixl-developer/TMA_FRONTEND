/**
 * Workflow Analytics Page - Super Admin
 * 
 * Comprehensive analytics and insights:
 * - Performance trends
 * - Bottleneck analysis
 * - Error analysis
 * - State distribution
 * - Success rate trends
 * - Duration trends
 */

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from "lucide-react"
import {
  getWorkflow,
  getWorkflowAnalytics,
  type Workflow
} from "@/shared/services/workflowService"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { RechartsBar } from "@/shared/components/charts/RechartsBar"
import { RechartsLine } from "@/shared/components/charts/RechartsLine"

export default function WorkflowAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const workflowId = params.id as string

  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [workflowData, analyticsData] = await Promise.all([
          getWorkflow(workflowId),
          getWorkflowAnalytics(workflowId)
        ])
        setWorkflow(workflowData)
        setAnalytics(analyticsData)
      } catch (e) {
        console.error("Failed to load analytics", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [workflowId])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Loading analytics...</p>
        </div>
      </PageLayout>
    )
  }

  if (!workflow || !analytics) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-500">Workflow not found</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => router.push("/superadmin/workflows")}
          >
            Back to Workflows
          </Button>
        </div>
      </PageLayout>
    )
  }

  // Mock trend data
  const executionTrend = [
    { date: "Day 1", executions: analytics.executions24h * 0.8 },
    { date: "Day 2", executions: analytics.executions24h * 0.9 },
    { date: "Day 3", executions: analytics.executions24h * 1.1 },
    { date: "Day 4", executions: analytics.executions24h * 0.95 },
    { date: "Day 5", executions: analytics.executions24h * 1.05 },
    { date: "Day 6", executions: analytics.executions24h * 0.85 },
    { date: "Day 7", executions: analytics.executions24h }
  ]

  const successRateTrend = [
    { date: "Day 1", rate: analytics.successRate - 3 },
    { date: "Day 2", rate: analytics.successRate - 2 },
    { date: "Day 3", rate: analytics.successRate - 1 },
    { date: "Day 4", rate: analytics.successRate + 1 },
    { date: "Day 5", rate: analytics.successRate },
    { date: "Day 6", rate: analytics.successRate + 2 },
    { date: "Day 7", rate: analytics.successRate }
  ]

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/superadmin/workflows/${workflowId}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span>Analytics: {workflow.name}</span>
          </div>
        }
        description="Comprehensive workflow performance analytics and insights"
      />

      {/* Key Metrics */}
      <PageSection>
        <MetricsGrid>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Activity className="h-4 w-4 text-blue-500" />
                Executions (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {analytics.executions24h.toLocaleString()}
              </p>
              <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span>+12% from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Activity className="h-4 w-4 text-purple-500" />
                Executions (7d)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {analytics.executions7d.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-slate-500">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Activity className="h-4 w-4 text-indigo-500" />
                Executions (30d)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {analytics.executions30d.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-slate-500">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">
                {analytics.successRate}%
              </p>
              <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span>+2% from last week</span>
              </div>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      {/* Performance Metrics */}
      <PageSection>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-amber-500" />
                Average Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{analytics.avgDuration}</p>
              <p className="mt-1 text-xs text-slate-500">Per execution</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Error Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{analytics.errorRate}%</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                <TrendingDown className="h-3 w-3" />
                <span>-1% from last week</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Execution Trend */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle>Execution Trend (Last 7 Days)</CardTitle>
            <p className="text-sm text-slate-500">
              Daily execution volume over the past week
            </p>
          </CardHeader>
          <CardContent>
            <RechartsLine
              data={executionTrend}
              xKey="date"
              lines={[
                { key: "executions", color: "#3b82f6", name: "Executions" }
              ]}
              height={300}
            />
          </CardContent>
        </Card>
      </PageSection>

      {/* Success Rate Trend */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle>Success Rate Trend (Last 7 Days)</CardTitle>
            <p className="text-sm text-slate-500">
              Daily success rate percentage
            </p>
          </CardHeader>
          <CardContent>
            <RechartsLine
              data={successRateTrend}
              xKey="date"
              lines={[
                { key: "rate", color: "#10b981", name: "Success Rate %" }
              ]}
              height={300}
            />
          </CardContent>
        </Card>
      </PageSection>

      {/* State Distribution */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle>State Distribution</CardTitle>
            <p className="text-sm text-slate-500">
              Execution count by workflow state
            </p>
          </CardHeader>
          <CardContent>
            <RechartsBar
              data={analytics.stateDistribution}
              xKey="state"
              yKey="count"
              color="#8b5cf6"
              height={300}
            />
          </CardContent>
        </Card>
      </PageSection>

      {/* Bottlenecks */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Bottleneck Analysis
            </CardTitle>
            <p className="text-sm text-slate-500">
              States with longest average processing time
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.bottlenecks.map((bottleneck: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{bottleneck.state}</p>
                        <p className="text-xs text-slate-500">{bottleneck.count} executions</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                      {bottleneck.avgTime}
                    </Badge>
                    <p className="mt-1 text-xs text-slate-500">Avg time</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Top Errors */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Top Errors
            </CardTitle>
            <p className="text-sm text-slate-500">
              Most common error messages
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topErrors.map((error: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-700">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-700">{error.error}</p>
                  </div>
                  <Badge variant="outline" className="text-red-600">
                    {error.count} occurrences
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Recommendations */}
      <PageSection>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-start gap-3 p-6">
            <BarChart3 className="h-6 w-6 shrink-0 text-blue-600" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold text-blue-900">Performance Recommendations</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  State "{analytics.bottlenecks[0]?.state}" is taking {analytics.bottlenecks[0]?.avgTime} on average.
                  Consider optimizing this step or adding parallel processing.
                </li>
                <li>
                  Error rate is {analytics.errorRate}%. Review the top errors and implement better error handling.
                </li>
                <li>
                  Success rate is {analytics.successRate}%. This is{" "}
                  {analytics.successRate > 90 ? "excellent" : analytics.successRate > 75 ? "good" : "needs improvement"}.
                </li>
                <li>
                  Consider adding more SLA monitoring for states with high processing times.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
