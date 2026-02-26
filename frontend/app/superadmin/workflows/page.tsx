/**
 * Workflow List Page - Super Admin
 * 
 * Browse all workflows with filtering, search, and performance metrics.
 * Workflows are state machine definitions for different blueprints.
 */

"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Workflow as WorkflowIcon,
  Search,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  Grid3x3,
  List,
  ArrowUpRight,
  Plus,
  Play,
  Pause,
  Archive
} from "lucide-react"
import {
  getWorkflows,
  getWorkflowStatsAsync,
  searchWorkflows,
  type Workflow,
  type WorkflowStatus
} from "@/shared/services/workflowService"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"

type ViewMode = "grid" | "list"

export default function WorkflowListPage() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | "ALL">("ALL")
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  useEffect(() => {
    const load = async () => {
      try {
        const [workflowsData, statsData] = await Promise.all([
          getWorkflows(),
          getWorkflowStatsAsync()
        ])
        setWorkflows(workflowsData)
        setStats(statsData)
      } catch (e) {
        console.error("Failed to load workflows", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredWorkflows = useMemo(() => {
    let filtered = workflows

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(w => w.status === statusFilter)
    }

    // Category filter
    if (categoryFilter !== "ALL") {
      filtered = filtered.filter(w => w.category === categoryFilter)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        w =>
          w.name.toLowerCase().includes(query) ||
          w.description.toLowerCase().includes(query) ||
          w.id.toLowerCase().includes(query) ||
          w.blueprint.toLowerCase().includes(query) ||
          w.category.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [workflows, statusFilter, categoryFilter, searchQuery])

  const categories = Array.from(new Set(workflows.map(w => w.category)))

  const getStatusBadge = (status: WorkflowStatus) => {
    const map = {
      ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
      DRAFT: "bg-amber-100 text-amber-700 border-amber-200",
      ARCHIVED: "bg-slate-100 text-slate-600 border-slate-200"
    }
    return map[status]
  }

  const getStatusIcon = (status: WorkflowStatus) => {
    const map = {
      ACTIVE: <Play className="h-3 w-3" />,
      DRAFT: <Pause className="h-3 w-3" />,
      ARCHIVED: <Archive className="h-3 w-3" />
    }
    return map[status]
  }

  const handleViewWorkflow = (id: string) => {
    router.push(`/superadmin/workflows/${id}`)
  }

  return (
    <PageLayout>
      <PageHeader
        title="Workflow Engine"
        description="Manage state machine workflows for all blueprints. Workflows define the lifecycle and automation rules for business processes."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <WorkflowIcon className="h-3.5 w-3.5 text-blue-500" />
            State Machines
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/superadmin/workflows/analytics")}>
              <TrendingUp className="mr-1.5 h-4 w-4" />
              Analytics
            </Button>
            <Button size="sm" onClick={() => router.push("/superadmin/workflows/designer")}>
              <Plus className="mr-1.5 h-4 w-4" />
              Create Workflow
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
                <WorkflowIcon className="h-4 w-4 text-blue-500" />
                Total Workflows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {loading ? "—" : stats?.total || 0}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {stats?.active || 0} active, {stats?.draft || 0} draft, {stats?.archived || 0} archived
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Activity className="h-4 w-4 text-emerald-500" />
                Executions (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {loading ? "—" : stats?.totalExecutions24h.toLocaleString() || 0}
              </p>
              <p className="mt-1 text-xs text-emerald-600">
                +8% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Avg Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {loading ? "—" : `${stats?.avgSuccessRate || 0}%`}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Across all workflows
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">
                {loading ? "—" : "Healthy"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      {/* Filters */}
      <PageSection>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
              {(["ALL", "ACTIVE", "DRAFT", "ARCHIVED"] as const).map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={statusFilter === status ? "default" : "ghost"}
                  onClick={() => setStatusFilter(status)}
                  className="h-7 px-2 text-xs"
                >
                  {status}
                </Button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
              <Button
                size="sm"
                variant={categoryFilter === "ALL" ? "default" : "ghost"}
                onClick={() => setCategoryFilter("ALL")}
                className="h-7 px-2 text-xs"
              >
                ALL
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant={categoryFilter === category ? "default" : "ghost"}
                  onClick={() => setCategoryFilter(category)}
                  className="h-7 px-2 text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
                className="h-7 w-7 p-0"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
                className="h-7 w-7 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="mt-4 text-sm text-slate-500">
          Showing {filteredWorkflows.length} of {workflows.length} workflows
        </p>
      </PageSection>

      {/* Workflow Grid/List */}
      <PageSection>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-500">Loading workflows...</p>
          </div>
        ) : filteredWorkflows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-slate-300" />
            <p className="mt-4 text-slate-500">No workflows found</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("ALL")
                setCategoryFilter("ALL")
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWorkflows.map((workflow) => (
              <Card
                key={workflow.id}
                className="group cursor-pointer transition-all hover:border-blue-300 hover:shadow-md"
                onClick={() => handleViewWorkflow(workflow.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusBadge(workflow.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(workflow.status)}
                            {workflow.status}
                          </span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {workflow.blueprint}
                        </Badge>
                      </div>
                      <CardTitle className="mt-2 text-base">{workflow.name}</CardTitle>
                      <p className="mt-1 text-xs text-slate-500">{workflow.category}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {workflow.description}
                  </p>

                  {/* States */}
                  <div>
                    <p className="text-xs text-slate-500 mb-1">States</p>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {workflow.states.length} states
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {workflow.transitions.length} transitions
                      </Badge>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                      <p className="text-xs text-slate-500">Executions</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {workflow.executions24h}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                      <p className="text-xs text-slate-500">Success</p>
                      <p className="text-sm font-semibold text-emerald-600">
                        {workflow.successRate}%
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                      <p className="text-xs text-slate-500">Avg Time</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {workflow.avgDuration}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredWorkflows.map((workflow) => (
              <Card
                key={workflow.id}
                className="group cursor-pointer transition-all hover:border-blue-300 hover:shadow-sm"
                onClick={() => handleViewWorkflow(workflow.id)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <WorkflowIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{workflow.name}</h3>
                      <Badge className={getStatusBadge(workflow.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(workflow.status)}
                          {workflow.status}
                        </span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {workflow.blueprint}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {workflow.category}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 line-clamp-1">
                      {workflow.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-slate-800">{workflow.executions24h}</p>
                      <p className="text-xs text-slate-500">Executions</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-emerald-600">{workflow.successRate}%</p>
                      <p className="text-xs text-slate-500">Success</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-600">{workflow.avgDuration}</p>
                      <p className="text-xs text-slate-500">Avg Time</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageSection>
    </PageLayout>
  )
}
