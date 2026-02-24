"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Package, ArrowRight, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchAutomationPacks, setSelectedPack } from "@/shared/state/automationSlice"
import type { AutomationPack } from "@/shared/lib/types/automation"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"

const HEALTH_OPTIONS: FilterOption[] = [
  { value: "ok", label: "Healthy" },
  { value: "warning", label: "Warning" },
  { value: "error", label: "Error" },
]

const STATUS_OPTIONS: FilterOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
  { value: "DEPRECATED", label: "Deprecated" },
]

export default function AutomationPacksPage() {
  const dispatch = useAppDispatch()
  const { packs, loadingPacks } = useAppSelector((s) => s.automation)
  const [searchQuery, setSearchQuery] = useState("")
  const [healthFilter, setHealthFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  useEffect(() => {
    if (!packs.length) dispatch(fetchAutomationPacks())
  }, [dispatch, packs.length])

  const filtered = useMemo(() => {
    let result = packs
    if (healthFilter.length > 0) result = result.filter((p) => healthFilter.includes(p.health))
    if (statusFilter.length > 0) result = result.filter((p) => statusFilter.includes(p.status))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false)
      )
    }
    return result
  }, [packs, healthFilter, statusFilter, searchQuery])

  const metrics = useMemo(() => {
    const active = packs.filter((p) => p.status === "ACTIVE").length
    const healthy = packs.filter((p) => p.health === "ok").length
    const totalTenants = packs.reduce((acc, p) => acc + p.tenantAdoptionCount, 0)
    return { total: packs.length, active, healthy, totalTenants }
  }, [packs])

  const columns: Column<AutomationPack>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Pack",
        render: (_v, row) => (
          <div>
            <p className="text-sm font-semibold text-[#323130]">{row.name}</p>
            <p className="text-xs text-[#605e5c] font-mono">{row.id}</p>
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls =
            s === "ACTIVE" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" :
            s === "DRAFT" ? "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]" :
            "border-[#a80000] bg-[#fde7e9] text-[#a80000]"
          return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
        },
      },
      {
        key: "health",
        header: "Health",
        render: (v) => {
          const h = String(v)
          const Icon = h === "ok" ? CheckCircle : h === "warning" ? AlertTriangle : XCircle
          const cls = h === "ok" ? "text-[#107c10]" : h === "warning" ? "text-[#ff8c00]" : "text-[#a80000]"
          return (
            <span className={`inline-flex items-center gap-1 text-xs ${cls}`}>
              <Icon className="h-3.5 w-3.5" />
              {h}
            </span>
          )
        },
      },
      {
        key: "ruleIds",
        header: "Rules",
        render: (v) => <span className="text-sm">{(v as string[])?.length ?? 0}</span>,
      },
      {
        key: "tenantAdoptionCount",
        header: "Tenants",
        render: (v) => <span className="text-sm">{Number(v)}</span>,
      },
      {
        key: "id",
        header: "Actions",
        sortable: false,
        render: (_v, row) => (
          <Link href={`/automation/packs/${row.id}`}>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]" onClick={() => dispatch(setSelectedPack(row.id))}>
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
        title="Automation packs"
        description="11 packs: Core Ops, Approvals, Finance, Change Control, Privacy, Disputes, Staffing, Pageant Integrity, Content Safety, Vendor Procurement, Logistics. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Package className="h-3.5 w-3.5 text-[#0078d4]" />
            Packs
          </span>
        }
        actions={
          <Link href="/automation">
            <Button variant="outline" size="sm">Overview</Button>
          </Link>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle>Total packs</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">{loadingPacks ? "—" : metrics.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Active</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">{loadingPacks ? "—" : metrics.active}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Healthy</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">{loadingPacks ? "—" : metrics.healthy}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Tenant adoptions</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">{loadingPacks ? "—" : metrics.totalTenants}</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Packs" description={filtered.length !== packs.length ? `${filtered.length} of ${packs.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by name or id..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              { key: "health", label: "Health", options: HEALTH_OPTIONS, selected: healthFilter, onSelectionChange: setHealthFilter },
              { key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter },
            ]}
            onClearAll={() => {
              setSearchQuery("")
              setHealthFilter([])
              setStatusFilter([])
            }}
          />
          <Card>
            <CardContent className="p-0">
              {loadingPacks ? (
                <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading packs…</div>
              ) : (
                <DataTable
                  data={filtered}
                  columns={columns}
                  pageSize={10}
                  exportable
                  exportFileName="automation-packs"
                  emptyMessage="No packs match the filters."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
