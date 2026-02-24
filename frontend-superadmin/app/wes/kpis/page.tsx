"use client"

import { useEffect, useMemo } from "react"
import Link from "next/link"
import { Sliders, ArrowLeft } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchWesKpis } from "@/shared/state/wesSlice"
import type { WesKpi } from "@/shared/lib/types/wes"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"

export default function WesKpisPage() {
  const dispatch = useAppDispatch()
  const { kpis, loadingKpis } = useAppSelector((s) => s.wes)

  useEffect(() => {
    if (!kpis.length) dispatch(fetchWesKpis())
  }, [dispatch, kpis.length])

  const metrics = useMemo(() => {
    const active = kpis.filter((k) => k.status === "active").length
    return { total: kpis.length, active }
  }, [kpis])

  const columns: Column<WesKpi>[] = useMemo(
    () => [
      { key: "id", header: "ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
      { key: "name", header: "Name", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
      { key: "metric", header: "Metric", render: (v) => <span className="text-sm font-mono">{String(v)}</span> },
      { key: "targetValue", header: "Target", render: (v) => <span className="font-semibold">{Number(v)}</span> },
      { key: "unit", header: "Unit", render: (v) => <span className="text-sm">{String(v)}</span> },
      { key: "thresholdWarning", header: "Warning at", render: (v) => <span className="text-sm text-[#ff8c00]">{v != null ? Number(v) : "—"}</span> },
      { key: "thresholdCritical", header: "Critical at", render: (v) => <span className="text-sm text-[#a80000]">{v != null ? Number(v) : "—"}</span> },
      { key: "status", header: "Status", render: (v) => <span className={`rounded border px-2 py-0.5 text-xs ${String(v) === "active" ? "border-[#107c10] bg-[#dff6dd]" : "border-[#edebe9]"}`}>{String(v)}</span> },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="KPI target configuration"
        description="KPI definitions, target values per template, threshold alerts. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Sliders className="h-3.5 w-3.5 text-[#0078d4]" />KPIs</span>}
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
          <Card><CardHeader><CardTitle>Total KPIs</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingKpis ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Active</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loadingKpis ? "—" : metrics.active}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="KPI definitions">
        <Card><CardContent className="p-0">
          {loadingKpis ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={kpis} columns={columns} pageSize={10} exportable exportFileName="wes-kpis" emptyMessage="No KPIs in seed." />}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
