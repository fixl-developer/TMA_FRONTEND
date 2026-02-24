"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Scale, ArrowRight } from "lucide-react"
import { getAppeals } from "@/shared/services/moderationService"
import type { Appeal } from "@/shared/lib/types/moderation"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { format } from "date-fns"

const STATUS_OPTIONS: FilterOption[] = [
  { value: "PENDING", label: "Pending" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
]

export default function ModerationAppealsPage() {
  const [appeals, setAppeals] = useState<Appeal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  useEffect(() => {
    getAppeals().then(setAppeals).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let result = appeals
    if (statusFilter.length > 0) result = result.filter((a) => statusFilter.includes(a.status))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((a) => a._id.toLowerCase().includes(q) || a.moderationId.toLowerCase().includes(q))
    }
    return result
  }, [appeals, statusFilter, searchQuery])

  const metrics = useMemo(() => {
    const pending = appeals.filter((a) => a.status === "PENDING" || a.status === "UNDER_REVIEW").length
    const approved = appeals.filter((a) => a.status === "APPROVED").length
    const rejected = appeals.filter((a) => a.status === "REJECTED").length
    return { total: appeals.length, pending, approved, rejected }
  }, [appeals])

  const columns: Column<Appeal>[] = useMemo(
    () => [
      { key: "_id", header: "Appeal ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
      { key: "moderationId", header: "Moderation ID", render: (v) => <span className="text-sm font-mono">{String(v)}</span> },
      { key: "contentType", header: "Content Type", render: (v) => <span className="text-sm">{String(v)}</span> },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls =
            s === "APPROVED" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" :
            s === "REJECTED" ? "border-[#a80000] bg-[#fde7e9] text-[#a80000]" :
            s === "PENDING" || s === "UNDER_REVIEW" ? "border-[#ff8c00] bg-[#fff4ce] text-[#ff8c00]" :
            "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
          return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
        },
      },
      { key: "reason", header: "Reason", render: (v) => <span className="text-sm text-[#605e5c]">{String(v).substring(0, 50)}...</span> },
      {
        key: "submittedAt",
        header: "Submitted",
        render: (v) => <span className="text-xs text-[#605e5c]">{v ? format(new Date(v as string), "PPp") : "—"}</span>,
      },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Appeal management"
        description="All appeals, appeal status, review workflow, decision tracking. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Scale className="h-3.5 w-3.5 text-[#0078d4]" />Appeals</span>}
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
          <Card><CardHeader><CardTitle>Total appeals</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Pending/Under review</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#ff8c00]">{loading ? "—" : metrics.pending}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Approved</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loading ? "—" : metrics.approved}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Rejected</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#a80000]">{loading ? "—" : metrics.rejected}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Appeals" description={filtered.length !== appeals.length ? `${filtered.length} of ${appeals.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by appeal ID or moderation ID..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[{ key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter }]}
            onClearAll={() => { setSearchQuery(""); setStatusFilter([]) }}
          />
          <Card><CardContent className="p-0">
            {loading ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={filtered} columns={columns} pageSize={10} exportable exportFileName="moderation-appeals" emptyMessage="No appeals match the filters." />}
          </CardContent></Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
