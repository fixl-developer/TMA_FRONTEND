"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { FileText, Plus, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchAnalyticsReports } from "@/shared/state/analyticsSlice"
import type { ReportDefinition } from "@/shared/lib/types/analytics"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { format } from "date-fns"

export default function AnalyticsReportsPage() {
  const dispatch = useAppDispatch()
  const { reports, loadingReports } = useAppSelector((s) => s.analytics)
  const [typeFilter, setTypeFilter] = useState<string>("")

  useEffect(() => {
    if (!reports.length) dispatch(fetchAnalyticsReports())
  }, [dispatch, reports.length])

  const filtered = useMemo(() => {
    if (!typeFilter) return reports
    return reports.filter((r) => r.type === typeFilter)
  }, [reports, typeFilter])

  const columns: Column<ReportDefinition>[] = useMemo(
    () => [
      { key: "name", header: "Report", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
      { key: "type", header: "Type", render: (v) => <span className="text-sm">{String(v)}</span> },
      { key: "schedule", header: "Schedule", render: (v) => <span className="text-sm text-[#605e5c]">{String(v ?? "—")}</span> },
      { key: "lastRun", header: "Last run", render: (v) => <span className="text-xs text-[#605e5c]">{v ? format(new Date(v as string), "PP") : "—"}</span> },
      { key: "status", header: "Status", render: (v) => <span className={`rounded border px-2 py-0.5 text-xs ${String(v) === "active" ? "border-[#107c10] bg-[#dff6dd]" : "border-[#edebe9]"}`}>{String(v)}</span> },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Custom reports"
        description="Report list, scheduled reports, report templates, export options. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><FileText className="h-3.5 w-3.5 text-[#0078d4]" />Reports</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/analytics/platform"><Button variant="outline" size="sm">Platform</Button></Link>
            <Link href="/analytics/reports/builder"><Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Build report</Button></Link>
          </div>
        }
      />
      <PageSection title="Reports">
        <div className="mb-3">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded border border-[#edebe9] px-3 py-1.5 text-sm">
            <option value="">All types</option>
            <option value="scheduled">Scheduled</option>
            <option value="adhoc">Ad hoc</option>
            <option value="template">Template</option>
          </select>
        </div>
        <Card><CardContent className="p-0">
          {loadingReports ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={filtered} columns={columns} pageSize={10} exportable exportFileName="analytics-reports" emptyMessage="No reports match the filter." />}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
