"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Shield, ArrowRight, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchModerationQueue, setSelectedItem } from "@/shared/state/moderationSlice"
import type { ModerationItem } from "@/shared/lib/types/moderation"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { format } from "date-fns"

const STATUS_OPTIONS: FilterOption[] = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "QUARANTINED", label: "Quarantined" },
  { value: "APPEALED", label: "Appealed" },
]

const CONTENT_TYPE_OPTIONS: FilterOption[] = [
  { value: "SHOWCASE", label: "Showcase" },
  { value: "COMMUNITY", label: "Community" },
  { value: "PROFILE", label: "Profile" },
  { value: "COMMENT", label: "Comment" },
  { value: "MESSAGE", label: "Message" },
  { value: "EVENT", label: "Event" },
]

const PRIORITY_OPTIONS: FilterOption[] = [
  { value: "URGENT", label: "Urgent" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
]

export default function ModerationQueuePage() {
  const dispatch = useAppDispatch()
  const { queue, loadingQueue } = useAppSelector((s) => s.moderation)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [contentTypeFilter, setContentTypeFilter] = useState<string[]>([])
  const [priorityFilter, setPriorityFilter] = useState<string[]>([])

  useEffect(() => {
    if (!queue.length) dispatch(fetchModerationQueue())
  }, [dispatch, queue.length])

  const filtered = useMemo(() => {
    let result = queue
    if (statusFilter.length > 0) result = result.filter((i) => statusFilter.includes(i.status))
    if (contentTypeFilter.length > 0) result = result.filter((i) => contentTypeFilter.includes(i.contentType))
    if (priorityFilter.length > 0) result = result.filter((i) => priorityFilter.includes(i.priority || ""))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((i) => i._id.toLowerCase().includes(q) || i.contentId.toLowerCase().includes(q))
    }
    return result
  }, [queue, statusFilter, contentTypeFilter, priorityFilter, searchQuery])

  const metrics = useMemo(() => {
    const pending = queue.filter((i) => i.status === "PENDING" || i.status === "IN_REVIEW").length
    const approved = queue.filter((i) => i.status === "APPROVED").length
    const quarantined = queue.filter((i) => i.status === "QUARANTINED").length
    const urgent = queue.filter((i) => i.priority === "URGENT").length
    return { total: queue.length, pending, approved, quarantined, urgent }
  }, [queue])

  const columns: Column<ModerationItem>[] = useMemo(
    () => [
      { key: "_id", header: "Item ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
      { key: "contentId", header: "Content ID", render: (v) => <span className="text-sm font-mono">{String(v)}</span> },
      { key: "contentType", header: "Type", render: (v) => <span className="text-sm">{String(v)}</span> },
      {
        key: "priority",
        header: "Priority",
        render: (v) => {
          if (!v) return <span className="text-xs text-[#605e5c]">—</span>
          const p = String(v)
          const cls = p === "URGENT" ? "text-[#a80000]" : p === "HIGH" ? "text-[#ff8c00]" : p === "MEDIUM" ? "text-[#0078d4]" : "text-[#605e5c]"
          return <span className={`text-xs font-medium ${cls}`}>{p}</span>
        },
      },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls =
            s === "APPROVED" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" :
            s === "REJECTED" || s === "QUARANTINED" ? "border-[#a80000] bg-[#fde7e9] text-[#a80000]" :
            s === "PENDING" || s === "IN_REVIEW" ? "border-[#ff8c00] bg-[#fff4ce] text-[#ff8c00]" :
            "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
          return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
        },
      },
      {
        key: "strikeCount",
        header: "Strikes",
        render: (v) => <span className="text-sm">{v != null ? Number(v) : 0}</span>,
      },
      {
        key: "assignedTo",
        header: "Assigned",
        render: (v) => <span className="text-xs text-[#605e5c]">{v ? String(v) : "—"}</span>,
      },
      {
        key: "createdAt",
        header: "Created",
        render: (v) => <span className="text-xs text-[#605e5c]">{v ? format(new Date(v as string), "PPp") : "—"}</span>,
      },
      {
        key: "_id",
        header: "Actions",
        sortable: false,
        render: (_v, row) => (
          <Link href={`/moderation/queue/${row._id}`}>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]" onClick={() => dispatch(setSelectedItem(row._id))}>
              Review
            </Button>
          </Link>
        ),
      },
    ],
    [dispatch]
  )

  return (
    <PageLayout>
      <PageHeader
        title="Moderation queue"
        description="Pending content, priority sorting, filter by type and tenant. Bulk actions and assignment. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Shield className="h-3.5 w-3.5 text-[#0078d4]" />Queue</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/moderation/rules"><Button variant="outline" size="sm">Rules</Button></Link>
            <Link href="/moderation/appeals"><Button variant="outline" size="sm">Appeals</Button></Link>
            <Link href="/moderation/moderators"><Button variant="outline" size="sm">Moderators</Button></Link>
            <Link href="/moderation/analytics"><Button variant="outline" size="sm" className="gap-1.5"><ArrowRight className="h-3.5 w-3.5" />Analytics</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total items</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingQueue ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Pending/In review</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#ff8c00]">{loadingQueue ? "—" : metrics.pending}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Approved</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loadingQueue ? "—" : metrics.approved}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Quarantined</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#a80000]">{loadingQueue ? "—" : metrics.quarantined}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Urgent</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#a80000]">{loadingQueue ? "—" : metrics.urgent}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Queue" description={filtered.length !== queue.length ? `${filtered.length} of ${queue.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by item ID or content ID..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              { key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter },
              { key: "contentType", label: "Content Type", options: CONTENT_TYPE_OPTIONS, selected: contentTypeFilter, onSelectionChange: setContentTypeFilter },
              { key: "priority", label: "Priority", options: PRIORITY_OPTIONS, selected: priorityFilter, onSelectionChange: setPriorityFilter },
            ]}
            onClearAll={() => { setSearchQuery(""); setStatusFilter([]); setContentTypeFilter([]); setPriorityFilter([]) }}
          />
          <Card><CardContent className="p-0">
            {loadingQueue ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={filtered} columns={columns} pageSize={10} exportable exportFileName="moderation-queue" emptyMessage="No items match the filters." />}
          </CardContent></Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
