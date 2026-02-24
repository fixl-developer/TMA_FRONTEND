"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Clock, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchRetentionPolicies, setSelectedPolicy } from "@/shared/state/complianceSlice"
import type { RetentionPolicy } from "@/shared/lib/types/compliance"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"

const STATUS_OPTIONS: FilterOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
  { value: "DISABLED", label: "Disabled" },
]

export default function RetentionPoliciesPage() {
  const dispatch = useAppDispatch()
  const { retentionPolicies, loadingPolicies } = useAppSelector((s) => s.compliance)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  useEffect(() => {
    if (!retentionPolicies.length) dispatch(fetchRetentionPolicies())
  }, [dispatch, retentionPolicies.length])

  const filtered = useMemo(() => {
    let result = retentionPolicies
    if (statusFilter.length > 0) result = result.filter((p) => statusFilter.includes(p.status))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((p) => p.entityType.toLowerCase().includes(q) || p._id.toLowerCase().includes(q))
    }
    return result
  }, [retentionPolicies, statusFilter, searchQuery])

  const metrics = useMemo(() => {
    const active = retentionPolicies.filter((p) => p.status === "ACTIVE").length
    const draft = retentionPolicies.filter((p) => p.status === "DRAFT").length
    return { total: retentionPolicies.length, active, draft }
  }, [retentionPolicies])

  const columns: Column<RetentionPolicy>[] = useMemo(
    () => [
      { key: "_id", header: "Policy ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
      { key: "entityType", header: "Entity type", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
      { key: "retentionMonths", header: "Retention", render: (v) => <span className="text-sm">{Number(v)} months</span> },
      { key: "description", header: "Description", render: (v) => <span className="text-sm text-[#605e5c]">{String(v ?? "—")}</span> },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls = s === "ACTIVE" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
          return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
        },
      },
      {
        key: "_id",
        header: "Actions",
        sortable: false,
        render: (_v, row) => (
          <Link href={`/compliance/retention/policies/${row._id}`}>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]" onClick={() => dispatch(setSelectedPolicy(row._id))}>
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
        title="Retention policies"
        description="All retention policies. Policy status, affected data types, tenant usage. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Clock className="h-3.5 w-3.5 text-[#0078d4]" />Retention</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/compliance/dsr"><Button variant="outline" size="sm">DSR</Button></Link>
            <Link href="/compliance/retention/schedules"><Button variant="outline" size="sm">Schedules</Button></Link>
            <Link href="/compliance/retention/lifecycle"><Button variant="outline" size="sm" className="gap-1.5"><ArrowRight className="h-3.5 w-3.5" />Lifecycle</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total policies</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingPolicies ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Active</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loadingPolicies ? "—" : metrics.active}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Draft</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#605e5c]">{loadingPolicies ? "—" : metrics.draft}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Policies" description={filtered.length !== retentionPolicies.length ? `${filtered.length} of ${retentionPolicies.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by entity type or ID..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[{ key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter }]}
            onClearAll={() => { setSearchQuery(""); setStatusFilter([]) }}
          />
          <Card><CardContent className="p-0">
            {loadingPolicies ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={filtered} columns={columns} pageSize={10} exportable exportFileName="retention-policies" emptyMessage="No policies match the filters." />}
          </CardContent></Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
