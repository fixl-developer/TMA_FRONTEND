/**
 * Workflow Monitoring Page - Super Admin
 * 
 * Real-time monitoring of workflow executions:
 * - Active executions
 * - Queue status
 * - Current load
 * - Health indicators
 * - Recent executions
 * - State breakdown
 */

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Zap,
  Users
} from "lucide-react"
import {
  getWorkflow,
  getWorkflowMonitoring,
  type Workflow
} from "@/shared/services/workflowService"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"

export default function WorkflowMonitorPage() {
  const params = useParams()
  const router = useRouter()
  const workflowId = params.id as string

  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [monitoring, setMonitoring] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const loadData = async () => {
    try {
      const [workflowData, monitoringData] = await Promise.all([
        getWorkflow(workflowId),
        getWorkflowMonitoring(workflowId)
      ])
      setWorkflow(workflowData)
      setMonitoring(monitoringData)
    } catch (e) {
      console.error("Failed to load monitoring data", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [workflowId])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      loadData()
    }, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, workflowId])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Loading monitoring data...</p>
        </div>
      </PageLayout>
    )
  }

  if (!workflow || !monitoring) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-slate-300" />
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

  const getHealthColor = (status: string) => {
    const map: Record<string, string> = {
      HEALTHY: "text-emerald-600",
      WARNING: "text-amber-600",
      CRITICAL: "text-red-600"
    }
    return map[status] || "text-slate-600"
  }

  const getHealthBadge = (status: string) => {
    const map: Record<string, string> = {
      HEALTHY: "bg-emerald-100 text-emerald-700 border-emerald-200",
      WARNING: "bg-amber-100 text-amber-700 border-amber-200",
      CRITICAL: "bg-red-100 text-red-700 border-red-200"
    }
    return map[status] || "bg-slate-100 text-slate-600 border-slate-200"
  }

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
            <span>Monitor: {workflow.name}</span>
          </div>
        }
        description="Real-time workflow execution monitoring"
        badge={
          <div className="flex items-center gap-2">
            <Badge className={getHealthBadge(monitoring.healthStatus)}>
              {monitoring.healthStatus}
            </Badge>
            {autoRefresh && (
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                Auto-refresh
              </Badge>
            )}
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw className={`mr-1.5 h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`} />
              {autoRefresh ? "Pause" : "Resume"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
            >
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Refresh Now
            </Button>
          </div>
        }
      />

      {/* Real-time Stats */}
      <PageSection>
        <MetricsGrid>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Activity className="h-4 w-4 text-blue-500" />
                Active Executions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {monitoring.activeExecutions}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Currently running
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-amber-500" />
                Queued Executions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {monitoring.queuedExecutions}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Waiting to start
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Zap className="h-4 w-4 text-purple-500" />
                Current Load
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {monitoring.currentLoad}%
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${
                    monitoring.currentLoad > 80
                      ? "bg-red-500"
                      : monitoring.currentLoad > 60
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${monitoring.currentLoad}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${getHealthColor(monitoring.healthStatus)}`}>
                {monitoring.healthStatus}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                System status
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      {/* State Breakdown */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle>Active Executions by State</CardTitle>
            <p className="text-sm text-slate-500">
              Current distribution of executions across workflow states
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {monitoring.stateBreakdown.map((item: any) => (
                <div
                  key={item.state}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{item.state}</p>
                    <p className="text-xs text-slate-500">Active executions</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-lg font-bold text-blue-600">
                      {item.activeCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Recent Executions */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle>Recent Executions</CardTitle>
            <p className="text-sm text-slate-500">
              Last 10 workflow executions
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Execution ID</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Current State</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Started</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Duration</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Entity</th>
                  </tr>
                </thead>
                <tbody>
                  {monitoring.recentExecutions.map((execution: any, i: number) => (
                    <tr key={execution.id} className={i % 2 === 0 ? "bg-slate-50" : ""}>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">
                        {execution.executionId.slice(0, 16)}...
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            execution.status === "SUCCESS"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : execution.status === "FAILED"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : "bg-blue-100 text-blue-700 border-blue-200"
                          }
                        >
                          {execution.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{execution.currentState}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(execution.startedAt).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{execution.duration}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">
                        {execution.metadata.entityId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* System Info */}
      <PageSection>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-start gap-3 p-4">
            <Activity className="h-5 w-5 shrink-0 text-blue-600" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Monitoring Information</p>
              <ul className="mt-1 list-inside list-disc space-y-1">
                <li>Data refreshes every 5 seconds when auto-refresh is enabled</li>
                <li>Active executions are currently running through the workflow</li>
                <li>Queued executions are waiting for available capacity</li>
                <li>Load percentage indicates system utilization (80%+ is high)</li>
                <li>Health status is calculated based on success rate and error rate</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
