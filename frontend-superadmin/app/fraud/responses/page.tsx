"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Zap, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchFraudResponses } from "@/shared/state/fraudSlice"
import type { FraudResponseRule } from "@/shared/lib/types/fraud"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { format } from "date-fns"

export default function FraudResponsesPage() {
  const dispatch = useAppDispatch()
  const { responses, loadingResponses } = useAppSelector((s) => s.fraud)

  useEffect(() => {
    if (!responses.length) dispatch(fetchFraudResponses())
  }, [dispatch, responses.length])

  const metrics = useMemo(() => {
    const active = responses.filter((r) => r.status === "active").length
    const totalExecutions = responses.reduce((s, r) => s + (r.executionCount ?? 0), 0)
    return { total: responses.length, active, totalExecutions }
  }, [responses])

  const columns: Column<FraudResponseRule>[] = useMemo(
    () => [
      { key: "id", header: "ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
      { key: "name", header: "Name", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
      { key: "triggerType", header: "Trigger type", render: (v) => <span className="text-sm">{String(v)}</span> },
      { key: "severityThreshold", header: "Threshold", render: (v) => <span className="font-medium">{Number(v)}</span> },
      { key: "action", header: "Action", render: (v) => <span className="text-sm">{String(v)}</span> },
      { key: "status", header: "Status", render: (v) => <span className={`rounded border px-2 py-0.5 text-xs ${String(v) === "active" ? "border-[#107c10] bg-[#dff6dd]" : "border-[#edebe9]"}`}>{String(v)}</span> },
      { key: "executionCount", header: "Executions", render: (v) => <span>{Number(v ?? 0).toLocaleString()}</span> },
      { key: "lastTriggered", header: "Last triggered", render: (v) => v ? format(new Date(v as string), "PPp") : "—" },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Automated responses"
        description="Response rules, trigger configuration, action types, execution history. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Zap className="h-3.5 w-3.5 text-[#0078d4]" />Responses</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/fraud/dashboard"><Button variant="outline" size="sm">Dashboard</Button></Link>
            <Link href="/fraud/signals"><Button variant="outline" size="sm">Signals</Button></Link>
            <Link href="/fraud/thresholds"><Button variant="outline" size="sm">Thresholds</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total rules</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingResponses ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Active</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loadingResponses ? "—" : metrics.active}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total executions</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{loadingResponses ? "—" : metrics.totalExecutions.toLocaleString()}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Response rules">
        <Card><CardContent className="p-0">
          {loadingResponses ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={responses} columns={columns} pageSize={10} exportable exportFileName="fraud-responses" emptyMessage="No response rules in seed." />}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
