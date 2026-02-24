"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Shield, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchFraudSignals, setSelectedSignal } from "@/shared/state/fraudSlice"
import type { FraudSignal } from "@/shared/lib/types/fraud"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { format } from "date-fns"

const STATUS_OPTIONS: FilterOption[] = [
  { value: "active", label: "Active" },
  { value: "investigating", label: "Investigating" },
  { value: "resolved", label: "Resolved" },
  { value: "flagged", label: "Flagged" },
  { value: "blocked", label: "Blocked" },
  { value: "monitoring", label: "Monitoring" },
]

const SEVERITY_OPTIONS: FilterOption[] = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

export default function FraudSignalsPage() {
  const dispatch = useAppDispatch()
  const { signals, loadingSignals } = useAppSelector((s) => s.fraud)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [severityFilter, setSeverityFilter] = useState<string[]>([])

  useEffect(() => {
    if (!signals.length) dispatch(fetchFraudSignals())
  }, [dispatch, signals.length])

  const filtered = useMemo(() => {
    let result = signals
    if (statusFilter.length > 0) result = result.filter((s) => statusFilter.includes(s.status))
    if (severityFilter.length > 0) result = result.filter((s) => severityFilter.includes(s.severity))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((s) => s.id.toLowerCase().includes(q) || s.entityName.toLowerCase().includes(q) || s.entityId.toLowerCase().includes(q))
    }
    return result
  }, [signals, statusFilter, severityFilter, searchQuery])

  const metrics = useMemo(() => {
    const active = signals.filter((s) => s.status === "active" || s.status === "investigating").length
    const critical = signals.filter((s) => s.severity === "critical").length
    const resolved = signals.filter((s) => s.status === "resolved").length
    return { total: signals.length, active, critical, resolved }
  }, [signals])

  const columns: Column<FraudSignal>[] = useMemo(
    () => [
      { key: "id", header: "Signal ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
      { key: "entityName", header: "Entity", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
      { key: "type", header: "Type", render: (v) => <span className="text-sm">{String(v)}</span> },
      {
        key: "severity",
        header: "Severity",
        render: (v) => {
          const s = String(v)
          const cls = s === "critical" ? "border-[#a80000] bg-[#fde7e9] text-[#a80000]" : s === "high" ? "border-[#ff8c00] bg-[#fff4ce]" : s === "medium" ? "border-[#0078d4] bg-[#d6e9f8]" : "border-[#edebe9]"
          return <span className={`rounded border px-2 py-0.5 text-xs ${cls}`}>{s}</span>
        },
      },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls = s === "resolved" ? "border-[#107c10] bg-[#dff6dd]" : s === "blocked" ? "border-[#a80000] bg-[#fde7e9]" : "border-[#ff8c00] bg-[#fff4ce]"
          return <span className={`rounded border px-2 py-0.5 text-xs ${cls}`}>{s}</span>
        },
      },
      { key: "riskScore", header: "Risk", render: (v) => <span className={`font-semibold ${Number(v) >= 90 ? "text-[#a80000]" : Number(v) >= 75 ? "text-[#ff8c00]" : "text-[#323130]"}`}>{Number(v)}</span> },
      { key: "detectedAt", header: "Detected", render: (v) => <span className="text-xs text-[#605e5c]">{v ? format(new Date(v as string), "PPp") : "—"}</span> },
      {
        key: "id",
        header: "Actions",
        sortable: false,
        render: (_v, row) => (
          <Link href={`/fraud/signals/${row.id}`}>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]" onClick={() => dispatch(setSelectedSignal(row.id))}>Details</Button>
          </Link>
        ),
      },
    ],
    [dispatch]
  )

  return (
    <PageLayout>
      <PageHeader
        title="Fraud signals"
        description="All fraud signals, types, severity, status. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Shield className="h-3.5 w-3.5 text-[#0078d4]" />Signals</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/fraud/dashboard"><Button variant="outline" size="sm">Dashboard</Button></Link>
            <Link href="/fraud/models"><Button variant="outline" size="sm">Models</Button></Link>
            <Link href="/fraud/patterns"><Button variant="outline" size="sm">Patterns</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total signals</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingSignals ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Active/Investigating</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#ff8c00]">{loadingSignals ? "—" : metrics.active}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Critical</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#a80000]">{loadingSignals ? "—" : metrics.critical}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Resolved</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loadingSignals ? "—" : metrics.resolved}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Signals" description={filtered.length !== signals.length ? `${filtered.length} of ${signals.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by ID or entity..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              { key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter },
              { key: "severity", label: "Severity", options: SEVERITY_OPTIONS, selected: severityFilter, onSelectionChange: setSeverityFilter },
            ]}
            onClearAll={() => { setSearchQuery(""); setStatusFilter([]); setSeverityFilter([]) }}
          />
          <Card><CardContent className="p-0">
            {loadingSignals ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={filtered} columns={columns} pageSize={10} exportable exportFileName="fraud-signals" emptyMessage="No signals match the filters." />}
          </CardContent></Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
