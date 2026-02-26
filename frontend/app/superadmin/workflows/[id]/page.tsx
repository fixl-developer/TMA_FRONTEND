/**
 * Workflow Detail Page - Super Admin
 * 
 * View detailed information about a specific workflow including:
 * - State machine visualization
 * - States and transitions
 * - Guardrails and SLAs
 * - Execution statistics
 * - Performance metrics
 */

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Workflow as WorkflowIcon,
  Play,
  Pause,
  Edit,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  TrendingUp,
  Eye
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
import { WorkflowCanvas } from "@/shared/components/workflow/WorkflowCanvas"

type TabId = "overview" | "states" | "transitions" | "guardrails" | "slas" | "analytics"

export default function WorkflowDetailPage() {
  const params = useParams()
  const router = useRouter()
  const workflowId = params.id as string

  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>("overview")

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
        console.error("Failed to load workflow", e)
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
          <p className="text-slate-500">Loading workflow...</p>
        </div>
      </PageLayout>
    )
  }

  if (!workflow) {
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

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
      DRAFT: "bg-amber-100 text-amber-700 border-amber-200",
      ARCHIVED: "bg-slate-100 text-slate-600 border-slate-200"
    }
    return map[status] || "bg-slate-100 text-slate-600 border-slate-200"
  }

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: WorkflowIcon },
    { id: "states", label: "States", icon: Activity },
    { id: "transitions", label: "Transitions", icon: TrendingUp },
    { id: "guardrails", label: "Guardrails", icon: Shield },
    { id: "slas", label: "SLAs", icon: Clock },
    { id: "analytics", label: "Analytics", icon: TrendingUp }
  ]

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/superadmin/workflows")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span>{workflow.name}</span>
          </div>
        }
        description={workflow.description}
        badge={
          <div className="flex items-center gap-2">
            <Badge className={getStatusBadge(workflow.status)}>
              {workflow.status}
            </Badge>
            <Badge variant="outline">{workflow.blueprint}</Badge>
            <Badge variant="outline">{workflow.category}</Badge>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/superadmin/workflows/${workflow.id}/monitor`)}
            >
              <Eye className="mr-1.5 h-4 w-4" />
              Monitor
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/superadmin/workflows/designer")}
            >
              <Edit className="mr-1.5 h-4 w-4" />
              Edit
            </Button>
            <Button size="sm">
              <Play className="mr-1.5 h-4 w-4" />
              Test Run
            </Button>
          </div>
        }
      />

      {/* Stats */}
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
              <p className="text-3xl font-bold text-slate-900">{workflow.executions24h}</p>
              <p className="mt-1 text-xs text-emerald-600">+12% from yesterday</p>
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
              <p className="text-3xl font-bold text-slate-900">{workflow.successRate}%</p>
              <p className="mt-1 text-xs text-slate-500">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-amber-500" />
                Avg Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{workflow.avgDuration}</p>
              <p className="mt-1 text-xs text-slate-500">Per execution</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">Healthy</p>
              <p className="mt-1 text-xs text-slate-500">All systems operational</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      {/* Tabs */}
      <div className="mb-6 border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* State Machine Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>State Machine Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] rounded-lg border border-slate-200 bg-slate-50">
                <WorkflowCanvas
                  initialStates={workflow.states}
                  initialTransitions={workflow.transitions}
                  readOnly={true}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Workflow Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Trigger Type:</span>
                  <Badge variant="outline">{workflow.trigger}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">States:</span>
                  <span className="font-semibold text-slate-800">{workflow.states.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Transitions:</span>
                  <span className="font-semibold text-slate-800">{workflow.transitions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Actions:</span>
                  <span className="font-semibold text-slate-800">{workflow.actions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Guardrails:</span>
                  <span className="font-semibold text-slate-800">{workflow.guardrails.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">SLAs:</span>
                  <span className="font-semibold text-slate-800">{workflow.slas.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Version Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Version:</span>
                  <Badge variant="outline">{workflow.version}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Created:</span>
                  <span className="text-slate-600">
                    {new Date(workflow.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Updated:</span>
                  <span className="text-slate-600">
                    {new Date(workflow.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "states" && (
        <Card>
          <CardHeader>
            <CardTitle>Workflow States</CardTitle>
            <p className="text-sm text-slate-500">
              {workflow.states.length} states defined in this workflow
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left font-medium text-slate-600">State</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Description</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">SLA</th>
                  </tr>
                </thead>
                <tbody>
                  {workflow.states.map((state, i) => (
                    <tr key={state.id} className={i % 2 === 0 ? "bg-slate-50" : ""}>
                      <td className="px-4 py-3 font-medium text-slate-800">{state.name}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{state.type}</Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{state.description}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {state.actions?.length || 0}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {state.sla ? state.sla.duration : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "transitions" && (
        <Card>
          <CardHeader>
            <CardTitle>Workflow Transitions</CardTitle>
            <p className="text-sm text-slate-500">
              {workflow.transitions.length} transitions defined in this workflow
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left font-medium text-slate-600">From</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">To</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Label</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Condition</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Approval</th>
                  </tr>
                </thead>
                <tbody>
                  {workflow.transitions.map((transition, i) => (
                    <tr key={transition.id} className={i % 2 === 0 ? "bg-slate-50" : ""}>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{transition.from}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{transition.to}</Badge>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {transition.label}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">
                        {transition.condition || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {transition.requiresApproval ? (
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                            Required
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "guardrails" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500" />
              Workflow Guardrails
            </CardTitle>
            <p className="text-sm text-slate-500">
              {workflow.guardrails.length} guardrails configured
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workflow.guardrails.map((guardrail, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="mb-2">{guardrail.type}</Badge>
                      <p className="text-sm text-slate-700">{guardrail.config.message}</p>
                      <p className="mt-1 font-mono text-xs text-slate-500">
                        Condition: {guardrail.condition}
                      </p>
                    </div>
                    <Shield className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "slas" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              SLA Configuration
            </CardTitle>
            <p className="text-sm text-slate-500">
              {workflow.slas.length} SLAs configured
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workflow.slas.map((sla, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{sla.state}</p>
                    <p className="mt-1 text-sm text-slate-600">{sla.escalation}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    {sla.duration}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "analytics" && analytics && (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600">Executions (7d)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">
                  {analytics.executions7d.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600">Executions (30d)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">
                  {analytics.executions30d.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600">Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">
                  {analytics.errorRate}%
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bottlenecks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.bottlenecks.map((bottleneck: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{bottleneck.state}</p>
                      <p className="text-xs text-slate-500">{bottleneck.count} executions</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                      {bottleneck.avgTime}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.topErrors.map((error: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <p className="text-sm text-slate-700">{error.error}</p>
                    <Badge variant="outline">{error.count} occurrences</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  )
}
