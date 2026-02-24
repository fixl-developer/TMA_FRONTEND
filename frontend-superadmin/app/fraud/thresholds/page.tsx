"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Sliders, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchFraudThresholds } from "@/shared/state/fraudSlice"
import type { FraudThreshold } from "@/shared/lib/types/fraud"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"

export default function FraudThresholdsPage() {
  const dispatch = useAppDispatch()
  const { thresholds, loadingThresholds } = useAppSelector((s) => s.fraud)

  useEffect(() => {
    if (!thresholds.length) dispatch(fetchFraudThresholds())
  }, [dispatch, thresholds.length])

  const metrics = useMemo(() => {
    const active = thresholds.filter((t) => t.status === "active").length
    return { total: thresholds.length, active }
  }, [thresholds])

  const columns: Column<FraudThreshold>[] = useMemo(
    () => [
      { key: "id", header: "ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
      { key: "name", header: "Name", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
      { key: "metric", header: "Metric", render: (v) => <span className="text-sm font-mono">{String(v)}</span> },
      { key: "value", header: "Value", render: (v) => <span className="font-semibold">{Number(v)}</span> },
      { key: "action", header: "Action", render: (v) => <span className="text-sm">{String(v)}</span> },
      { key: "status", header: "Status", render: (v) => <span className={`rounded border px-2 py-0.5 text-xs ${String(v) === "active" ? "border-[#107c10] bg-[#dff6dd]" : "border-[#edebe9]"}`}>{String(v)}</span> },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Risk score configuration"
        description="Threshold settings, action triggers, escalation rules. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Sliders className="h-3.5 w-3.5 text-[#0078d4]" />Thresholds</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/fraud/dashboard"><Button variant="outline" size="sm">Dashboard</Button></Link>
            <Link href="/fraud/signals"><Button variant="outline" size="sm">Signals</Button></Link>
            <Link href="/fraud/responses"><Button variant="outline" size="sm">Responses</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total thresholds</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingThresholds ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Active</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loadingThresholds ? "—" : metrics.active}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Thresholds">
        <Card><CardContent className="p-0">
          {loadingThresholds ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={thresholds} columns={columns} pageSize={10} exportable exportFileName="fraud-thresholds" emptyMessage="No thresholds in seed." />}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
