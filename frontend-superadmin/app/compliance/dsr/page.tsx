"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ShieldCheck, ArrowRight, Download, Trash2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchDsrRequests, setSelectedDsr } from "@/shared/state/complianceSlice"
import type { DsrRequest } from "@/shared/lib/types/compliance"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { format } from "date-fns"

const STATUS_OPTIONS: FilterOption[] = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
  { value: "EXPIRED", label: "Expired" },
]

const TYPE_OPTIONS: FilterOption[] = [
  { value: "ACCESS", label: "Access" },
  { value: "ERASURE", label: "Erasure" },
  { value: "PORTABILITY", label: "Portability" },
  { value: "RECTIFICATION", label: "Rectification" },
]

export default function DsrRequestsPage() {
  const dispatch = useAppDispatch()
  const { dsrRequests, loadingDsr } = useAppSelector((s) => s.compliance)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<string[]>([])

  useEffect(() => {
    if (!dsrRequests.length) dispatch(fetchDsrRequests())
  }, [dispatch, dsrRequests.length])

  const filtered = useMemo(() => {
    let result = dsrRequests
    if (statusFilter.length > 0) result = result.filter((r) => statusFilter.includes(r.status))
    if (typeFilter.length > 0) result = result.filter((r) => typeFilter.includes(r.type))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((r) => r._id.toLowerCase().includes(q) || r.userId.toLowerCase().includes(q))
    }
    return result
  }, [dsrRequests, statusFilter, typeFilter, searchQuery])

  const metrics = useMemo(() => {
    const pending = dsrRequests.filter((r) => r.status === "PENDING" || r.status === "IN_PROGRESS").length
    const completed = dsrRequests.filter((r) => r.status === "COMPLETED").length
    const overdue = dsrRequests.filter((r) => r.slaStatus === "BREACHED").length
    return { total: dsrRequests.length, pending, completed, overdue }
  }, [dsrRequests])

  const columns: Column<DsrRequest>[] = useMemo(
    () => [
      { key: "_id", header: "Request ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
      { key: "userId", header: "User", render: (v) => <span className="text-sm font-mono">{String(v)}</span> },
      { key: "tenantId", header: "Tenant", render: (v) => <span className="text-sm font-mono">{String(v)}</span> },
      { key: "type", header: "Type", render: (v) => <span className="text-sm">{String(v)}</span> },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls =
            s === "COMPLETED" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" :
            s === "PENDING" || s === "IN_PROGRESS" ? "border-[#ff8c00] bg-[#fff4ce] text-[#ff8c00]" :
            s === "REJECTED" ? "border-[#a80000] bg-[#fde7e9] text-[#a80000]" :
            "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
          return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
        },
      },
      {
        key: "slaStatus",
        header: "SLA",
        render: (v) => {
          if (!v) return <span className="text-xs text-[#605e5c]">—</span>
          const s = String(v)
          const cls = s === "BREACHED" ? "text-[#a80000]" : s === "AT_RISK" ? "text-[#ff8c00]" : "text-[#107c10]"
          return <span className={`text-xs font-medium ${cls}`}>{s}</span>
        },
      },
      {
        key: "requestedAt",
        header: "Requested",
        render: (v) => <span className="text-xs text-[#605e5c]">{v ? format(new Date(v as string), "PPp") : "—"}</span>,
      },
      {
        key: "_id",
        header: "Actions",
        sortable: false,
        render: (_v, row) => (
          <Link href={`/compliance/dsr/${row._id}`}>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]" onClick={() => dispatch(setSelectedDsr(row._id))}>
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
        title="DSR requests"
        description="Data Subject Rights requests (GDPR, CCPA). Filter by type, status, tenant. SLA tracking. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><ShieldCheck className="h-3.5 w-3.5 text-[#0078d4]" />DSR</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/compliance/legal-holds"><Button variant="outline" size="sm">Legal Holds</Button></Link>
            <Link href="/compliance/dsr/export"><Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" />Export</Button></Link>
            <Link href="/compliance/dsr/delete"><Button variant="outline" size="sm" className="gap-1.5"><Trash2 className="h-3.5 w-3.5" />Delete</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total requests</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingDsr ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Pending/In progress</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#ff8c00]">{loadingDsr ? "—" : metrics.pending}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Completed</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loadingDsr ? "—" : metrics.completed}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>SLA breached</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#a80000]">{loadingDsr ? "—" : metrics.overdue}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Requests" description={filtered.length !== dsrRequests.length ? `${filtered.length} of ${dsrRequests.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by request ID or user ID..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              { key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter },
              { key: "type", label: "Type", options: TYPE_OPTIONS, selected: typeFilter, onSelectionChange: setTypeFilter },
            ]}
            onClearAll={() => { setSearchQuery(""); setStatusFilter([]); setTypeFilter([]) }}
          />
          <Card><CardContent className="p-0">
            {loadingDsr ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={filtered} columns={columns} pageSize={10} exportable exportFileName="dsr-requests" emptyMessage="No requests match the filters." />}
          </CardContent></Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
