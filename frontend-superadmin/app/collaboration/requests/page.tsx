"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Users, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchCollaborationRequests, setSelectedRequest } from "@/shared/state/collaborationSlice"
import type { CollaborationRequest } from "@/shared/lib/types/collaboration"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { format } from "date-fns"

const STATUS_OPTIONS: FilterOption[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "EXPIRED", label: "Expired" },
]

const TYPE_OPTIONS: FilterOption[] = [
  { value: "JOINT_CAMPAIGN", label: "Joint Campaign" },
  { value: "SHARED_TALENT", label: "Shared Talent" },
  { value: "COLLABORATIVE_EVENT", label: "Collaborative Event" },
  { value: "RESOURCE_SHARING", label: "Resource Sharing" },
]

export default function CollaborationRequestsPage() {
  const dispatch = useAppDispatch()
  const { requests, loadingRequests } = useAppSelector((s) => s.collaboration)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<string[]>([])

  useEffect(() => {
    if (!requests.length) dispatch(fetchCollaborationRequests())
  }, [dispatch, requests.length])

  const filtered = useMemo(() => {
    let result = requests
    if (statusFilter.length > 0) result = result.filter((r) => statusFilter.includes(r.status))
    if (typeFilter.length > 0) result = result.filter((r) => typeFilter.includes(r.type))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((r) => r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
    }
    return result
  }, [requests, statusFilter, typeFilter, searchQuery])

  const metrics = useMemo(() => {
    const pending = requests.filter((r) => r.status === "PENDING").length
    const approved = requests.filter((r) => r.status === "APPROVED").length
    const rejected = requests.filter((r) => r.status === "REJECTED").length
    return { total: requests.length, pending, approved, rejected }
  }, [requests])

  const columns: Column<CollaborationRequest>[] = useMemo(
    () => [
      {
        key: "title",
        header: "Request",
        render: (_v, row) => (
          <div>
            <p className="text-sm font-semibold text-[#323130]">{row.title}</p>
            <p className="text-xs text-[#605e5c] font-mono">{row.id}</p>
          </div>
        ),
      },
      {
        key: "requesterTenantId",
        header: "From → To",
        render: (_v, row) => (
          <span className="text-sm">
            {row.requesterTenantName ?? row.requesterTenantId} → {row.targetTenantName ?? row.targetTenantId}
          </span>
        ),
      },
      { key: "type", header: "Type", render: (v) => <span className="text-sm">{String(v).replace(/_/g, " ")}</span> },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls =
            s === "APPROVED" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" :
            s === "PENDING" ? "border-[#ff8c00] bg-[#fff4ce] text-[#ff8c00]" :
            s === "REJECTED" ? "border-[#a80000] bg-[#fde7e9] text-[#a80000]" :
            "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
          return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
        },
      },
      {
        key: "requestedAt",
        header: "Requested",
        render: (v) => <span className="text-xs text-[#605e5c]">{v ? format(new Date(v as string), "PPp") : "—"}</span>,
      },
      {
        key: "id",
        header: "Actions",
        sortable: false,
        render: (_v, row) => (
          <Link href={`/collaboration/requests/${row.id}`}>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]" onClick={() => dispatch(setSelectedRequest(row.id))}>
              Details
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
        title="Collaboration requests"
        description="All cross-tenant collaboration requests. Filter by status, type. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Users className="h-3.5 w-3.5 text-[#0078d4]" />Requests</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/collaboration/rooms"><Button variant="outline" size="sm">Rooms</Button></Link>
            <Link href="/collaboration/analytics"><Button variant="outline" size="sm" className="gap-1.5"><ArrowRight className="h-3.5 w-3.5" />Analytics</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total requests</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingRequests ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Pending</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#ff8c00]">{loadingRequests ? "—" : metrics.pending}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Approved</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loadingRequests ? "—" : metrics.approved}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Rejected</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#a80000]">{loadingRequests ? "—" : metrics.rejected}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Requests" description={filtered.length !== requests.length ? `${filtered.length} of ${requests.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by title or id..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              { key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter },
              { key: "type", label: "Type", options: TYPE_OPTIONS, selected: typeFilter, onSelectionChange: setTypeFilter },
            ]}
            onClearAll={() => { setSearchQuery(""); setStatusFilter([]); setTypeFilter([]) }}
          />
          <Card><CardContent className="p-0">
            {loadingRequests ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={filtered} columns={columns} pageSize={10} exportable exportFileName="collaboration-requests" emptyMessage="No requests match the filters." />}
          </CardContent></Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
