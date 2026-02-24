"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Cpu, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchFraudModels } from "@/shared/state/fraudSlice"
import type { FraudModel } from "@/shared/lib/types/fraud"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { format } from "date-fns"

const STATUS_OPTIONS: FilterOption[] = [
  { value: "active", label: "Active" },
  { value: "training", label: "Training" },
  { value: "deprecated", label: "Deprecated" },
]

export default function FraudModelsPage() {
  const dispatch = useAppDispatch()
  const { models, loadingModels } = useAppSelector((s) => s.fraud)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  useEffect(() => {
    if (!models.length) dispatch(fetchFraudModels())
  }, [dispatch, models.length])

  const filtered = useMemo(() => {
    let result = models
    if (statusFilter.length > 0) result = result.filter((m) => statusFilter.includes(m.status))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((m) => m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q))
    }
    return result
  }, [models, statusFilter, searchQuery])

  const metrics = useMemo(() => {
    const active = models.filter((m) => m.status === "active").length
    const training = models.filter((m) => m.status === "training").length
    const avgAccuracy = models.length ? models.reduce((s, m) => s + (m.accuracy ?? 0), 0) / models.length : 0
    return { total: models.length, active, training, avgAccuracy }
  }, [models])

  const columns: Column<FraudModel>[] = useMemo(
    () => [
      { key: "id", header: "Model ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
      { key: "name", header: "Name", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
      { key: "version", header: "Version", render: (v) => <span className="text-sm font-mono">{String(v)}</span> },
      { key: "entityType", header: "Entity type", render: (v) => <span className="text-sm">{String(v)}</span> },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls = s === "active" ? "border-[#107c10] bg-[#dff6dd]" : s === "training" ? "border-[#ff8c00] bg-[#fff4ce]" : "border-[#edebe9]"
          return <span className={`rounded border px-2 py-0.5 text-xs ${cls}`}>{s}</span>
        },
      },
      { key: "accuracy", header: "Accuracy", render: (v) => v != null ? `${(Number(v) * 100).toFixed(1)}%` : "—" },
      { key: "lastTrained", header: "Last trained", render: (v) => v ? format(new Date(v as string), "PP") : "—" },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="ML model management"
        description="All fraud detection models, performance, training status. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Cpu className="h-3.5 w-3.5 text-[#0078d4]" />Models</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/fraud/dashboard"><Button variant="outline" size="sm">Dashboard</Button></Link>
            <Link href="/fraud/signals"><Button variant="outline" size="sm">Signals</Button></Link>
            <Link href="/fraud/patterns"><Button variant="outline" size="sm">Patterns</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total models</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingModels ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Active</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loadingModels ? "—" : metrics.active}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Training</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#ff8c00]">{loadingModels ? "—" : metrics.training}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Avg accuracy</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#107c10]">{loadingModels ? "—" : `${(metrics.avgAccuracy * 100).toFixed(1)}%`}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Models" description={filtered.length !== models.length ? `${filtered.length} of ${models.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by name or ID..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[{ key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter }]}
            onClearAll={() => { setSearchQuery(""); setStatusFilter([]) }}
          />
          <Card><CardContent className="p-0">
            {loadingModels ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={filtered} columns={columns} pageSize={10} exportable exportFileName="fraud-models" emptyMessage="No models match the filters." />}
          </CardContent></Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
