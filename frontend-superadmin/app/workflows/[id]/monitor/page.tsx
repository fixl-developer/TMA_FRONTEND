"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Activity, Clock } from "lucide-react"
import type { WorkflowExecution } from "@/shared/lib/types/workflows"
import { getWorkflowById } from "@/shared/services/workflowService"
import { getWorkflowExecutions } from "@/shared/services/workflowService"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { format } from "date-fns"

export default function WorkflowMonitorPage() {
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

  const running = executions.filter((e) => e.status === "RUNNING")
  const completed = executions.filter((e) => e.status === "COMPLETED")
  const failed = executions.filter((e) => e.status === "FAILED")

  if (!workflowId) {
    return (
      <PageLayout>
        <PageHeader title="Monitor" description="Invalid workflow id." />
        <Button asChild variant="outline" size="sm"><Link href="/workflows">Back</Link></Button>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title="Workflow monitoring"
        description={`${workflow?.name ?? workflowId} · Active executions and timeline. Seed data only.`}
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Activity className="h-3.5 w-3.5 text-[#0078d4]" />
            Monitor
          </span>
        }
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href={`/workflows/${workflowId}`}><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Details</Link>
          </Button>
        }
      />

      <PageSection title="Summary">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle>Running</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">{running.length}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Active executions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Completed</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">{completed.length}</p>
              <p className="mt-1 text-xs text-[#605e5c]">In seed window</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Failed</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#a80000]">{failed.length}</p>
              <p className="mt-1 text-xs text-[#605e5c]">In seed window</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Active executions">
        <Card>
          <CardContent className="pt-4">
            {loading ? (
              <p className="text-sm text-[#605e5c]">Loading…</p>
            ) : running.length === 0 ? (
              <p className="text-sm text-[#605e5c]">No active executions in seed data.</p>
            ) : (
              <ul className="space-y-2">
                {running.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between rounded border border-[#c7e0f4] bg-[#f3f9fd] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-[#0078d4]" />
                      <div>
                        <p className="font-mono text-sm font-medium text-[#323130]">{e.id}</p>
                        <p className="text-xs text-[#605e5c]">
                          Current state: <strong>{e.currentState ?? "—"}</strong> · Started {format(new Date(e.startedAt), "PPp")}
                        </p>
                      </div>
                    </div>
                    <span className="rounded border border-[#0078d4] bg-[#deecf9] px-2 py-1 text-xs font-medium text-[#0078d4]">
                      RUNNING
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
