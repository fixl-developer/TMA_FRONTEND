/**
 * Workflow Execution Logs Page - Super Admin
 * 
 * View execution history and logs:
 * - Execution history with filtering
 * - Status filtering (SUCCESS, FAILED, RUNNING)
 * - Date range filtering
 * - Execution details
 * - Error messages
 * - Duration tracking
 */

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Eye
} from "lucide-react"
import {
  getWorkflow,
  getWorkflowExecutionLogs,
  type Workflow
} from "@/shared/services/workflowService"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"

type StatusFilter = "ALL" | "SUCCESS" | "FAILED" | "RUNNING"

export default function WorkflowLogsPage() {
  const params = useParams()
  const router = useRouter()
  const workflowId = params.id as string

  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [filteredLogs, setFilteredLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLog, setSelectedLog] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [workflowData, logsData] = await Promise.all([
          getWorkflow(workflowId),
          getWorkflowExecutionLogs(workflowId, 100)
        ])
        setWorkflow(workflowData)
        setLogs(logsData)
        setFilteredLogs(logsData)
      } catch (e) {
        console.error("Failed to load logs", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [workflowId])

  useEffect(() => {
    let filtered = logs

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(log => log.status === statusFilter)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        log =>
          log.executionId.toLowerCase().includes(query) ||
          log.currentState.toLowerCase().includes(query) ||
          log.metadata.entityId.toLowerCase().includes(query) ||
          (log.error && log.error.toLowerCase().includes(query))
      )
    }

    setFilteredLogs(filtered)
  }, [logs, statusFilter, searchQuery])

  const handleExport = () => {
    const csv = [
      ["Execution ID", "Status", "State", "Started", "Completed", "Duration", "Entity ID", "Error"].join(","),
      ...filteredLogs.map(log =>
        [
          log.executionId,
          log.status,
          log.currentState,
          log.startedAt,
          log.completedAt || "",
          log.duration,
          log.metadata.entityId,
          log.error || ""
        ].join(",")
      )
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `workflow_${workflowId}_logs.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Loading execution logs...</p>
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

  const getStatusIcon = (status: string) => {
    const map: Record<string, any> = {
      SUCCESS: <CheckCircle className="h-4 w-4 text-emerald-500" />,
      FAILED: <XCircle className="h-4 w-4 text-red-500" />,
      RUNNING: <Clock className="h-4 w-4 text-blue-500 animate-spin" />
    }
    return map[status] || <AlertCircle className="h-4 w-4 text-slate-400" />
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      SUCCESS: "bg-emerald-100 text-emerald-700 border-emerald-200",
      FAILED: "bg-red-100 text-red-700 border-red-200",
      RUNNING: "bg-blue-100 text-blue-700 border-blue-200"
    }
    return map[status] || "bg-slate-100 text-slate-600 border-slate-200"
  }

  const successCount = logs.filter(l => l.status === "SUCCESS").length
  const failedCount = logs.filter(l => l.status === "FAILED").length
  const successRate = logs.length > 0 ? Math.round((successCount / logs.length) * 100) : 0

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
            <span>Execution Logs: {workflow.name}</span>
          </div>
        }
        description="View and filter workflow execution history"
        actions={
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-1.5 h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      {/* Stats */}
      <PageSection>
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Executions</p>
                  <p className="text-2xl font-bold text-slate-900">{logs.length}</p>
                </div>
                <Clock className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Successful</p>
                  <p className="text-2xl font-bold text-emerald-600">{successCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{failedCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{successRate}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Filters */}
      <PageSection>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search by execution ID, state, entity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
                  {(["ALL", "SUCCESS", "FAILED", "RUNNING"] as const).map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={statusFilter === status ? "default" : "ghost"}
                      onClick={() => setStatusFilter(status)}
                      className="h-7 px-3 text-xs"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Showing {filteredLogs.length} of {logs.length} executions
            </p>
          </CardContent>
        </Card>
      </PageSection>

      {/* Execution Logs */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle>Execution History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-slate-300" />
                <p className="mt-4 text-slate-500">No executions found</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("ALL")
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Execution ID</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Current State</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Started</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Completed</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Duration</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Entity</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log, i) => (
                      <tr
                        key={log.id}
                        className={`${i % 2 === 0 ? "bg-slate-50" : ""} hover:bg-slate-100 cursor-pointer`}
                        onClick={() => setSelectedLog(log)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status)}
                            <Badge className={getStatusBadge(log.status)}>
                              {log.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-600">
                          {log.executionId.slice(0, 20)}...
                        </td>
                        <td className="px-4 py-3 text-slate-700">{log.currentState}</td>
                        <td className="px-4 py-3 text-slate-500">
                          {new Date(log.startedAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {log.completedAt ? new Date(log.completedAt).toLocaleString() : "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{log.duration}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">
                          {log.metadata.entityId}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedLog(log)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </PageSection>

      {/* Execution Detail Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedLog(null)}
        >
          <Card
            className="w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Execution Details</CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedLog(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <Badge className={`mt-1 ${getStatusBadge(selectedLog.status)}`}>
                    {selectedLog.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Current State</p>
                  <p className="mt-1 font-semibold text-slate-800">{selectedLog.currentState}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Started At</p>
                  <p className="mt-1 text-slate-700">
                    {new Date(selectedLog.startedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Completed At</p>
                  <p className="mt-1 text-slate-700">
                    {selectedLog.completedAt
                      ? new Date(selectedLog.completedAt).toLocaleString()
                      : "In Progress"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Duration</p>
                  <p className="mt-1 text-slate-700">{selectedLog.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Entity ID</p>
                  <p className="mt-1 font-mono text-xs text-slate-700">
                    {selectedLog.metadata.entityId}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500">Execution ID</p>
                <p className="mt-1 font-mono text-xs text-slate-700 break-all">
                  {selectedLog.executionId}
                </p>
              </div>

              {selectedLog.error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-800">Error</p>
                  <p className="mt-1 text-sm text-red-700">{selectedLog.error}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-500 mb-2">Metadata</p>
                <pre className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs overflow-x-auto">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  )
}
