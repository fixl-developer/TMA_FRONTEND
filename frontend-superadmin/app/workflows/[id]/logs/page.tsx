"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import type { WorkflowExecution } from "@/shared/lib/types/workflows"
import { getWorkflowById } from "@/shared/services/workflowService"
import { getWorkflowExecutions } from "@/shared/services/workflowService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { format } from "date-fns"

export default function WorkflowLogsPage() {
  const params = useParams<{ id: string }>()
  const workflowId = params?.id
  const [workflow, setWorkflow] = useState<Awaited<ReturnType<typeof getWorkflowById>>>(undefined)
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!workflowId) return
    setLoading(true)
    Promise.all([getWorkflowById(workflowId), getWorkflowExecutions(workflowId)])
      .then(([w, e]) => {
        setWorkflow(w)
        setExecutions(e)
      })
      .finally(() => setLoading(false))
  }, [workflowId])

  const columns: Column<WorkflowExecution>[] = [
    {
      key: "id",
      header: "Execution ID",
      render: (v) => <span className="font-mono text-xs">{String(v)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (v) => {
        const s = String(v)
        const cls =
          s === "COMPLETED" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" :
          s === "RUNNING" ? "border-[#0078d4] bg-[#deecf9] text-[#0078d4]" :
          s === "FAILED" ? "border-[#a80000] bg-[#fde7e9] text-[#a80000]" :
          "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
        return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
      },
    },
    {
      key: "currentState",
      header: "State",
      render: (v) => <span className="text-sm">{String(v ?? "—")}</span>,
    },
    {
      key: "startedAt",
      header: "Started",
      render: (v) => <span className="text-xs text-[#605e5c]">{v ? format(new Date(v as string), "PPp") : "—"}</span>,
    },
    {
      key: "durationMs",
      header: "Duration",
      render: (v) => (
        <span className="text-xs">
          {v != null ? `${((v as number) / 1000).toFixed(1)}s` : "—"}
        </span>
      ),
    },
    {
      key: "errorMessage",
      header: "Error",
      render: (v) => (v ? <span className="text-xs text-[#a80000]">{String(v)}</span> : "—"),
    },
  ]

  if (!workflowId) {
    return (
      <PageLayout>
        <PageHeader title="Logs" description="Invalid workflow id." />
        <Button asChild variant="outline" size="sm"><Link href="/workflows">Back</Link></Button>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title="Execution logs"
        description={`${workflow?.name ?? workflowId} · Step-by-step trace and error details. Seed data only.`}
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <FileText className="h-3.5 w-3.5 text-[#0078d4]" />
            Logs
          </span>
        }
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href={`/workflows/${workflowId}`}><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Details</Link>
          </Button>
        }
      />

      <PageSection>
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div>
            ) : (
              <DataTable
                data={executions}
                columns={columns}
                pageSize={10}
                exportable
                exportFileName={`workflow-${workflowId}-logs`}
                emptyMessage="No execution logs in seed for this workflow."
              />
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
