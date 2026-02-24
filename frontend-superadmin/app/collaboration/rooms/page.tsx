"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Building2, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchCollaborationRooms, setSelectedRoom } from "@/shared/state/collaborationSlice"
import type { CollaborationRoom } from "@/shared/lib/types/collaboration"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"

const STATUS_OPTIONS: FilterOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "ARCHIVED", label: "Archived" },
  { value: "CLOSED", label: "Closed" },
]

export default function CollaborationRoomsPage() {
  const dispatch = useAppDispatch()
  const { rooms, loadingRooms } = useAppSelector((s) => s.collaboration)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  useEffect(() => {
    if (!rooms.length) dispatch(fetchCollaborationRooms())
  }, [dispatch, rooms.length])

  const filtered = useMemo(() => {
    let result = rooms
    if (statusFilter.length > 0) result = result.filter((r) => statusFilter.includes(r.status))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((r) => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
    }
    return result
  }, [rooms, statusFilter, searchQuery])

  const metrics = useMemo(() => {
    const active = rooms.filter((r) => r.status === "ACTIVE").length
    const archived = rooms.filter((r) => r.status === "ARCHIVED").length
    const totalParticipants = rooms.reduce((s, r) => s + r.participantCount, 0)
    return { total: rooms.length, active, archived, totalParticipants }
  }, [rooms])

  const columns: Column<CollaborationRoom>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Room",
        render: (_v, row) => (
          <div>
            <p className="text-sm font-semibold text-[#323130]">{row.name}</p>
            <p className="text-xs text-[#605e5c] font-mono">{row.id}</p>
          </div>
        ),
      },
      {
        key: "tenantNames",
        header: "Tenants",
        render: (_v, row) => <span className="text-sm">{row.tenantNames?.join(", ") ?? row.tenantIds.join(", ")}</span>,
      },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls = s === "ACTIVE" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
          return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
        },
      },
      { key: "participantCount", header: "Participants", render: (v) => <span className="text-sm">{Number(v)}</span> },
      { key: "contractCount", header: "Contracts", render: (v) => <span className="text-sm">{Number(v ?? 0)}</span> },
      {
        key: "id",
        header: "Actions",
        sortable: false,
        render: (_v, row) => (
          <Link href={`/collaboration/rooms/${row.id}`}>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]" onClick={() => dispatch(setSelectedRoom(row.id))}>
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
        title="Active collaboration rooms"
        description="All active collaborations with participants, shared resources, contracts. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Building2 className="h-3.5 w-3.5 text-[#0078d4]" />Rooms</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/collaboration/requests"><Button variant="outline" size="sm">Requests</Button></Link>
            <Link href="/collaboration/analytics"><Button variant="outline" size="sm" className="gap-1.5"><ArrowRight className="h-3.5 w-3.5" />Analytics</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total rooms</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingRooms ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Active</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loadingRooms ? "—" : metrics.active}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Archived</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#605e5c]">{loadingRooms ? "—" : metrics.archived}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total participants</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#0078d4]">{loadingRooms ? "—" : metrics.totalParticipants}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Rooms" description={filtered.length !== rooms.length ? `${filtered.length} of ${rooms.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by name or id..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[{ key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter }]}
            onClearAll={() => { setSearchQuery(""); setStatusFilter([]) }}
          />
          <Card><CardContent className="p-0">
            {loadingRooms ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={filtered} columns={columns} pageSize={10} exportable exportFileName="collaboration-rooms" emptyMessage="No rooms match the filters." />}
          </CardContent></Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
