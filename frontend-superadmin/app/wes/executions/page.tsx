"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Play, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchWesExecutions } from "@/shared/state/wesSlice"
import type { WesExecution } from "@/shared/lib/types/wes"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { format } from "date-fns"

export default function WesExecutionsPage() {
  const dispatch = useAppDispatch()
  const { executions, loadingExecutions } = useAppSelector((s) => s.wes)
  const [statusFilter, setStatusFilter] = useState<string>("")

  useEffect(() => {
    if (!executions.length) dispatch(fetchWesExecutions())
  }, [dispatch, executions.length])

  const filtered = useMemo(() => {
    if (!statusFilter) return executions
    return executions.filter((e) => e.status === statusFilter)
  }, [executions, statusFilter])

  const metrics = useMemo(() => {
    const running = executions.filter((e) => e.status === "running").length
    const completed = executions.filter((e) => e.status === "completed").length
    const failed = executions.filter((e) => e.status === "failed").length
    const queued = executions.filter((e) => e.status === "queued").length
    return { total: executions.length, running, completed, failed, queued }
  }, [executions])

  const columns: Column<WesExecution>[] = useMemo(
    () => [
      { key: "id", header: "Execution ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
      { key: "workflowName", header: "Workflow", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
      { key: "tenantId", header: "Tenant", render: (v) => <span className="text-sm font-mono">{String(v)}</span> },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls = s === "completed" ? "border-[#107c10] bg-[#dff6dd]" : s === "failed" ? "border-[#a80000] bg-[#fde7e9]" : s === "running" ? "border-[#0078d4] bg-[#d6e9f8]" : "border-[#edebe9]"
          return <span className={`rounded border px-2 py-0.5 text-xs ${cls}`}>{s}</span>
        },
      },
      { key: "stage", header: "Stage", render: (v) => <span className="text-sm">{String(v ?? "—")}</span> },
      { key: "startedAt", header: "Started", render: (v) => <span className="text-xs text-[#605e5c]">{v ? format(new Date(v as string), "PPp") : "—"}</span> },
      { key: "duration", header: "Duration", render: (v) => <span className="text-sm">{v != null ? `${v} min` : "—"}</span> },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Execution monitoring"
        description="Active executions, queue, status tracking, performance metrics. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Play className="h-3.5 w-3.5 text-[#0078d4]" />Executions</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/wes"><Button variant="outline" size="sm">Dashboard</Button></Link>
            <Link href="/wes/analytics"><Button variant="outline" size="sm">Analytics</Button></Link>
            <Link href="/wes/bottlenecks"><Button variant="outline" size="sm">Bottlenecks</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingExecutions ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Running</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#0078d4]">{loadingExecutions ? "—" : metrics.running}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Completed</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loadingExecutions ? "—" : metrics.completed}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Failed</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#a80000]">{loadingExecutions ? "—" : metrics.failed}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Queued</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#605e5c]">{loadingExecutions ? "—" : metrics.queued}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Executions">
        <div className="mb-3 flex gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded border border-[#edebe9] px-3 py-1.5 text-sm">
            <option value="">All statuses</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="queued">Queued</option>
          </select>
        </div>
        <Card><CardContent className="p-0">
          {loadingExecutions ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={filtered} columns={columns} pageSize={10} exportable exportFileName="wes-executions" emptyMessage="No executions match the filter." />}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
