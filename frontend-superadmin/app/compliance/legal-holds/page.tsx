"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Lock, Plus, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchLegalHolds, setSelectedHold } from "@/shared/state/complianceSlice"
import type { LegalHold } from "@/shared/lib/types/compliance"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { format } from "date-fns"

const STATUS_OPTIONS: FilterOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "RELEASED", label: "Released" },
  { value: "EXPIRED", label: "Expired" },
]

export default function LegalHoldsPage() {
  const dispatch = useAppDispatch()
  const { legalHolds, loadingHolds } = useAppSelector((s) => s.compliance)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  useEffect(() => {
    if (!legalHolds.length) dispatch(fetchLegalHolds())
  }, [dispatch, legalHolds.length])

  const filtered = useMemo(() => {
    let result = legalHolds
    if (statusFilter.length > 0) result = result.filter((h) => statusFilter.includes(h.status))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((h) => h._id.toLowerCase().includes(q) || h.reason.toLowerCase().includes(q))
    }
    return result
  }, [legalHolds, statusFilter, searchQuery])

  const metrics = useMemo(() => {
    const active = legalHolds.filter((h) => h.status === "ACTIVE").length
    const released = legalHolds.filter((h) => h.status === "RELEASED").length
    const totalAffected = legalHolds.reduce((s, h) => s + (h.affectedDataCount ?? 0), 0)
    return { total: legalHolds.length, active, released, totalAffected }
  }, [legalHolds])

  const columns: Column<LegalHold>[] = useMemo(
    () => [
      { key: "_id", header: "Hold ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
      { key: "tenantId", header: "Tenant", render: (v) => <span className="text-sm font-mono">{String(v)}</span> },
      { key: "reason", header: "Reason", render: (v) => <span className="text-sm">{String(v)}</span> },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls = s === "ACTIVE" ? "border-[#a80000] bg-[#fde7e9] text-[#a80000]" : "border-[#107c10] bg-[#dff6dd] text-[#107c10]"
          return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
        },
      },
      {
        key: "affectedDataCount",
        header: "Affected data",
        render: (v) => <span className="text-sm">{v != null ? Number(v).toLocaleString() : "—"}</span>,
      },
      {
        key: "expiresAt",
        header: "Expires",
        render: (v) => <span className="text-xs text-[#605e5c]">{v ? format(new Date(v as string), "PPp") : "—"}</span>,
      },
      {
        key: "_id",
        header: "Actions",
        sortable: false,
        render: (_v, row) => (
          <Link href={`/compliance/legal-holds/${row._id}`}>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]" onClick={() => dispatch(setSelectedHold(row._id))}>
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
        title="Legal holds"
        description="All active holds, affected data count, expiry dates. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Lock className="h-3.5 w-3.5 text-[#0078d4]" />Legal Holds</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/compliance/dsr"><Button variant="outline" size="sm">DSR</Button></Link>
            <Link href="/compliance/legal-holds/create"><Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Create hold</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total holds</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingHolds ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Active</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#a80000]">{loadingHolds ? "—" : metrics.active}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Released</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loadingHolds ? "—" : metrics.released}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Affected data</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{loadingHolds ? "—" : metrics.totalAffected.toLocaleString()}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Legal holds" description={filtered.length !== legalHolds.length ? `${filtered.length} of ${legalHolds.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by hold ID or reason..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[{ key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter }]}
            onClearAll={() => { setSearchQuery(""); setStatusFilter([]) }}
          />
          <Card><CardContent className="p-0">
            {loadingHolds ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={filtered} columns={columns} pageSize={10} exportable exportFileName="legal-holds" emptyMessage="No holds match the filters." />}
          </CardContent></Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
