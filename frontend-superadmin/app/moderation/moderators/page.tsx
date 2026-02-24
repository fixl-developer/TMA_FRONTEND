"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Users, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchModerators, setSelectedModerator } from "@/shared/state/moderationSlice"
import type { Moderator } from "@/shared/lib/types/moderation"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"

const STATUS_OPTIONS: FilterOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "TRAINING", label: "Training" },
]

export default function ModeratorsPage() {
  const dispatch = useAppDispatch()
  const { moderators, loadingModerators } = useAppSelector((s) => s.moderation)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  useEffect(() => {
    if (!moderators.length) dispatch(fetchModerators())
  }, [dispatch, moderators.length])

  const filtered = useMemo(() => {
    let result = moderators
    if (statusFilter.length > 0) result = result.filter((m) => statusFilter.includes(m.status))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((m) => m.name.toLowerCase().includes(q) || m._id.toLowerCase().includes(q))
    }
    return result
  }, [moderators, statusFilter, searchQuery])

  const metrics = useMemo(() => {
    const active = moderators.filter((m) => m.status === "ACTIVE").length
    const training = moderators.filter((m) => m.status === "TRAINING").length
    const totalReviewed = moderators.reduce((s, m) => s + (m.performanceMetrics?.itemsReviewed || 0), 0)
    const avgAccuracy = moderators.length > 0 ? moderators.reduce((s, m) => s + (m.performanceMetrics?.accuracyRate || 0), 0) / moderators.length : 0
    return { total: moderators.length, active, training, totalReviewed, avgAccuracy }
  }, [moderators])

  const columns: Column<Moderator>[] = useMemo(
    () => [
      { key: "_id", header: "Moderator ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
      { key: "name", header: "Name", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
      { key: "email", header: "Email", render: (v) => <span className="text-sm text-[#605e5c]">{String(v ?? "—")}</span> },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls = s === "ACTIVE" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : s === "TRAINING" ? "border-[#ff8c00] bg-[#fff4ce] text-[#ff8c00]" : "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
          return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
        },
      },
      {
        key: "performanceMetrics",
        header: "Items reviewed",
        render: (v) => <span className="text-sm">{v && typeof v === "object" && "itemsReviewed" in v ? Number(v.itemsReviewed).toLocaleString() : "—"}</span>,
      },
      {
        key: "performanceMetrics",
        header: "Avg response time",
        render: (v) => <span className="text-sm">{v && typeof v === "object" && "averageResponseTime" in v ? `${Number(v.averageResponseTime).toFixed(1)}h` : "—"}</span>,
      },
      {
        key: "performanceMetrics",
        header: "Accuracy",
        render: (v) => {
          if (!v || typeof v !== "object" || !("accuracyRate" in v)) return <span className="text-sm text-[#605e5c]">—</span>
          const rate = Number(v.accuracyRate) * 100
          return <span className={`text-sm font-medium ${rate >= 90 ? "text-[#107c10]" : rate >= 80 ? "text-[#ff8c00]" : "text-[#a80000]"}`}>{rate.toFixed(1)}%</span>
        },
      },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Moderator management"
        description="All moderators, assignment rules, performance metrics, training status. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Users className="h-3.5 w-3.5 text-[#0078d4]" />Moderators</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/moderation/queue"><Button variant="outline" size="sm">Queue</Button></Link>
            <Link href="/moderation/rules"><Button variant="outline" size="sm">Rules</Button></Link>
            <Link href="/moderation/analytics"><Button variant="outline" size="sm" className="gap-1.5"><ArrowRight className="h-3.5 w-3.5" />Analytics</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total moderators</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingModerators ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Active</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loadingModerators ? "—" : metrics.active}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>In training</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#ff8c00]">{loadingModerators ? "—" : metrics.training}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total reviewed</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{loadingModerators ? "—" : metrics.totalReviewed.toLocaleString()}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Avg accuracy</CardTitle></CardHeader><CardContent><p className={`text-2xl font-semibold ${metrics.avgAccuracy >= 0.9 ? "text-[#107c10]" : metrics.avgAccuracy >= 0.8 ? "text-[#ff8c00]" : "text-[#a80000]"}`}>{loadingModerators ? "—" : `${(metrics.avgAccuracy * 100).toFixed(1)}%`}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Moderators" description={filtered.length !== moderators.length ? `${filtered.length} of ${moderators.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by name or moderator ID..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[{ key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter }]}
            onClearAll={() => { setSearchQuery(""); setStatusFilter([]) }}
          />
          <Card><CardContent className="p-0">
            {loadingModerators ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={filtered} columns={columns} pageSize={10} exportable exportFileName="moderators" emptyMessage="No moderators match the filters." />}
          </CardContent></Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
