"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Workflow as WorkflowIcon,
  Activity,
  FileText,
  BarChart3,
  Play,
  GitBranch,
} from "lucide-react"
import type { Workflow, WorkflowState, WorkflowTransition } from "@/shared/lib/types/workflows"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchWorkflows, setSelectedWorkflow } from "@/shared/state/workflowsSlice"
import { getWorkflowById } from "@/shared/services/workflowService"
import { getWorkflowExecutions } from "@/shared/services/workflowService"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { format } from "date-fns"

export default function WorkflowDetailPage() {
  const params = useParams<{ id: string }>()
  const workflowId = params?.id

  const dispatch = useAppDispatch()
  const { items, loading: listLoading } = useAppSelector((s) => s.workflows)
  const [workflow, setWorkflow] = useState<Workflow | undefined>(undefined)
  const [executions, setExecutions] = useState<Awaited<ReturnType<typeof getWorkflowExecutions>>>([])
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    if (!items?.length) dispatch(fetchWorkflows())
  }, [dispatch, items?.length])

  useEffect(() => {
    const fromStore = items.find((w) => w.id === workflowId)
    if (fromStore) setWorkflow(fromStore)
    else if (workflowId) {
      setDetailLoading(true)
      getWorkflowById(workflowId).then(setWorkflow).finally(() => setDetailLoading(false))
    }
  }, [items, workflowId])

  useEffect(() => {
    if (!workflowId) return
    getWorkflowExecutions(workflowId).then(setExecutions)
  }, [workflowId])

  const executionSummary = useMemo(() => {
    const completed = executions.filter((e) => e.status === "COMPLETED").length
    const failed = executions.filter((e) => e.status === "FAILED").length
    const running = executions.filter((e) => e.status === "RUNNING").length
    return { total: executions.length, completed, failed, running }
  }, [executions])

  const isLoading = listLoading || detailLoading

  if (!workflowId) {
    return (
      <PageLayout>
        <PageHeader title="Workflow not found" description="Invalid workflow id." />
        <PageSection>
          <Button asChild variant="outline" size="sm"><Link href="/workflows"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Back</Link></Button>
        </PageSection>
      </PageLayout>
    )
  }

  if (!workflow && !isLoading) {
    return (
      <PageLayout>
        <PageHeader title={`Workflow ${workflowId}`} description="Not found in seed data." />
        <PageSection>
          <Button asChild variant="outline" size="sm"><Link href="/workflows">Back to list</Link></Button>
        </PageSection>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title={workflow?.name ?? workflowId}
        description={workflow?.description ?? "Workflow details and state machine. Seed data only."}
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <WorkflowIcon className="h-3.5 w-3.5 text-[#0078d4]" />
            {workflow?.type} · v{workflow?.version}
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link href="/workflows"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />List</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href={`/workflows/${workflowId}/monitor`}><Activity className="h-3.5 w-3.5 mr-1.5" />Monitor</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href={`/workflows/${workflowId}/logs`}><FileText className="h-3.5 w-3.5 mr-1.5" />Logs</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href={`/workflows/${workflowId}/analytics`}><BarChart3 className="h-3.5 w-3.5 mr-1.5" />Analytics</Link></Button>
          </div>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <CardContent>
              <span
                className={
                  workflow?.status === "ACTIVE"
                    ? "rounded border border-[#107c10] bg-[#dff6dd] px-2 py-1 text-sm font-medium text-[#107c10]"
                    : "rounded border border-[#edebe9] bg-[#f3f2f1] px-2 py-1 text-sm text-[#605e5c]"
                }
              >
                {workflow?.status}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Executions (seed)</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#323130]">{workflow?.stats?.executionCount ?? 0}</p>
              <p className="text-xs text-[#605e5c]">Success: {workflow?.stats?.successCount ?? 0} · Fail: {workflow?.stats?.failureCount ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Avg duration</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#0078d4]">
                {workflow?.stats?.avgDurationMs != null
                  ? workflow.stats.avgDurationMs >= 60000
                    ? `${(workflow.stats.avgDurationMs / 60000).toFixed(1)}m`
                    : `${(workflow.stats.avgDurationMs / 1000).toFixed(1)}s`
                  : "—"}
              </p>
              <p className="text-xs text-[#605e5c]">Last run: {workflow?.stats?.lastRunAt ? format(new Date(workflow.stats.lastRunAt), "PPp") : "—"}</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="State machine">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <GitBranch className="h-4 w-4 text-[#0078d4]" />
              States & transitions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold uppercase text-[#605e5c] mb-2">States</h4>
              <div className="flex flex-wrap gap-2">
                {(workflow?.states ?? []).map((s: WorkflowState) => (
                  <span
                    key={s.id}
                    className={`rounded border px-3 py-1.5 text-sm ${
                      s.type === "initial"
                        ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]"
                        : s.type === "terminal"
                        ? "border-[#0078d4] bg-[#deecf9] text-[#0078d4]"
                        : "border-[#edebe9] bg-[#faf9f8] text-[#323130]"
                    }`}
                  >
                    {s.name}
                    {s.type ? ` (${s.type})` : ""}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase text-[#605e5c] mb-2">Transitions</h4>
              <ul className="space-y-2">
                {(workflow?.transitions ?? []).map((t: WorkflowTransition, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="rounded bg-[#f3f2f1] px-2 py-0.5 font-medium">{t.from}</span>
                    <span className="text-[#605e5c]">→</span>
                    <span className="rounded bg-[#f3f2f1] px-2 py-0.5 font-medium">{t.to}</span>
                    {t.trigger && <span className="text-xs text-[#605e5c]">({t.trigger})</span>}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Recent executions">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Execution history</CardTitle>
            <p className="text-xs text-[#605e5c]">{executionSummary.total} in seed · {executionSummary.running} running</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {executions.slice(0, 5).map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-mono text-xs text-[#605e5c]">{e.id}</p>
                    <p className="text-xs text-[#605e5c]">
                      {e.currentState ?? "—"} · {e.stepCount} steps
                      {e.durationMs != null && ` · ${(e.durationMs / 1000).toFixed(1)}s`}
                    </p>
                  </div>
                  <span
                    className={
                      e.status === "COMPLETED"
                        ? "rounded border border-[#107c10] bg-[#dff6dd] px-2 py-0.5 text-xs text-[#107c10]"
                        : e.status === "RUNNING"
                        ? "rounded border border-[#0078d4] bg-[#deecf9] px-2 py-0.5 text-xs text-[#0078d4]"
                        : e.status === "FAILED"
                        ? "rounded border border-[#a80000] bg-[#fde7e9] px-2 py-0.5 text-xs text-[#a80000]"
                        : "rounded border border-[#edebe9] bg-[#f3f2f1] px-2 py-0.5 text-xs text-[#605e5c]"
                    }
                  >
                    {e.status}
                  </span>
                </div>
              ))}
              {executions.length === 0 && <p className="text-sm text-[#605e5c]">No executions in seed for this workflow.</p>}
            </div>
            <div className="mt-3">
              <Link href={`/workflows/${workflowId}/logs`}>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  View all logs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
