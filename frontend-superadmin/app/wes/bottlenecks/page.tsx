"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchWesBottlenecks } from "@/shared/state/wesSlice"
import type { WesBottleneck } from "@/shared/lib/types/wes"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"

export default function WesBottlenecksPage() {
  const dispatch = useAppDispatch()
  const { bottlenecks, loadingBottlenecks } = useAppSelector((s) => s.wes)

  useEffect(() => {
    if (!bottlenecks.length) dispatch(fetchWesBottlenecks())
  }, [dispatch, bottlenecks.length])

  const metrics = useMemo(() => {
    const identified = bottlenecks.filter((b) => b.status === "identified").length
    const resolving = bottlenecks.filter((b) => b.status === "resolving").length
    const resolved = bottlenecks.filter((b) => b.status === "resolved").length
    const highImpact = bottlenecks.filter((b) => b.impact === "high").length
    return { total: bottlenecks.length, identified, resolving, resolved, highImpact }
  }, [bottlenecks])

  const columns: Column<WesBottleneck>[] = useMemo(
    () => [
      { key: "id", header: "ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
      { key: "stage", header: "Stage", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
      { key: "description", header: "Description", render: (v) => <span className="text-sm">{String(v)}</span> },
      {
        key: "impact",
        header: "Impact",
        render: (v) => {
          const s = String(v)
          const cls = s === "high" ? "border-[#a80000] bg-[#fde7e9]" : s === "medium" ? "border-[#ff8c00] bg-[#fff4ce]" : "border-[#edebe9]"
          return <span className={`rounded border px-2 py-0.5 text-xs ${cls}`}>{s}</span>
        },
      },
      { key: "avgDelayHours", header: "Avg delay (h)", render: (v) => <span className="font-medium">{Number(v)}</span> },
      { key: "affectedExecutions", header: "Affected", render: (v) => <span>{Number(v).toLocaleString()}</span> },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls = s === "resolved" ? "border-[#107c10] bg-[#dff6dd]" : s === "resolving" ? "border-[#0078d4] bg-[#d6e9f8]" : "border-[#ff8c00] bg-[#fff4ce]"
          return <span className={`rounded border px-2 py-0.5 text-xs ${cls}`}>{s}</span>
        },
      },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Bottleneck analysis"
        description="Identified bottlenecks, impact analysis, recommendations, resolution tracking. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><AlertTriangle className="h-3.5 w-3.5 text-[#0078d4]" />Bottlenecks</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/wes"><Button variant="outline" size="sm">Dashboard</Button></Link>
            <Link href="/wes/executions"><Button variant="outline" size="sm">Executions</Button></Link>
            <Link href="/wes/analytics"><Button variant="outline" size="sm">Analytics</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total bottlenecks</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingBottlenecks ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Identified</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#ff8c00]">{loadingBottlenecks ? "—" : metrics.identified}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Resolving</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#0078d4]">{loadingBottlenecks ? "—" : metrics.resolving}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>High impact</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#a80000]">{loadingBottlenecks ? "—" : metrics.highImpact}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Bottlenecks">
        <Card><CardContent className="p-0">
          {loadingBottlenecks ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={bottlenecks} columns={columns} pageSize={10} exportable exportFileName="wes-bottlenecks" emptyMessage="No bottlenecks in seed." />}
        </CardContent></Card>
      </PageSection>
      {bottlenecks.some((b) => b.recommendation) && (
        <PageSection title="Recommendations">
          <Card><CardContent className="pt-4 space-y-3">
            {bottlenecks.filter((b) => b.recommendation).map((b) => (
              <div key={b.id} className="rounded border border-[#edebe9] p-3">
                <p className="text-sm font-medium">{b.stage}</p>
                <p className="text-xs text-[#605e5c] mt-1">{b.recommendation}</p>
              </div>
            ))}
          </CardContent></Card>
        </PageSection>
      )}
    </PageLayout>
  )
}
