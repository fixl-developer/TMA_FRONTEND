"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Workflow as WorkflowIcon, ArrowRight, Plus, Filter } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchWorkflows, setSelectedWorkflow } from "@/shared/state/workflowsSlice"
import type { Workflow, WorkflowStatus, WorkflowType } from "@/shared/lib/types/workflows"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"

const TYPE_OPTIONS: FilterOption[] = [
  { value: "APPROVAL", label: "Approval" },
  { value: "BOOKING", label: "Booking" },
  { value: "INTAKE", label: "Intake" },
  { value: "ESCROW", label: "Escrow" },
  { value: "PAGEANT", label: "Pageant" },
  { value: "CASTING", label: "Casting" },
  { value: "CAMPAIGN", label: "Campaign" },
  { value: "GENERIC", label: "Generic" },
]

const STATUS_OPTIONS: FilterOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
  { value: "DISABLED", label: "Disabled" },
  { value: "ARCHIVED", label: "Archived" },
]

export default function WorkflowsListPage() {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((s) => s.workflows)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  useEffect(() => {
    if (!items?.length) dispatch(fetchWorkflows())
  }, [dispatch, items?.length])

  const filtered = useMemo(() => {
    let result = items
    if (typeFilter.length > 0) result = result.filter((w) => typeFilter.includes(w.type))
    if (statusFilter.length > 0) result = result.filter((w) => statusFilter.includes(w.status))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.id.toLowerCase().includes(q) ||
          (w.description?.toLowerCase().includes(q) ?? false)
      )
    }
    return result
  }, [items, typeFilter, statusFilter, searchQuery])

  const metrics = useMemo(() => {
    const total = items.length
    const active = items.filter((w) => w.status === "ACTIVE").length
    const totalExecutions = items.reduce((acc, w) => acc + (w.stats?.executionCount ?? 0), 0)
    const running = 0 // would come from executions in real API
    return { total, active, totalExecutions, running }
  }, [items])

  const columns: Column<Workflow>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Workflow",
        render: (_v, row) => (
          <div>
            <p className="text-sm font-semibold text-[#323130]">{row.name}</p>
            <p className="text-xs text-[#605e5c] font-mono">{row.id} · v{row.version}</p>
          </div>
        ),
      },
      {
        key: "type",
        header: "Type",
        render: (v) => (
          <span className="rounded border border-[#edebe9] bg-[#faf9f8] px-2 py-0.5 text-xs">
            {String(v)}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const status = String(v)
          const cls =
            status === "ACTIVE"
              ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]"
              : status === "DRAFT"
              ? "border-[#0078d4] bg-[#deecf9] text-[#0078d4]"
              : "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
          return (
            <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>
              {status}
            </span>
          )
        },
      },
      {
        key: "stats",
        header: "Executions",
        sortable: false,
        render: (_v, row) => (
          <div className="text-xs">
            <p className="font-semibold text-[#323130]">{row.stats?.executionCount ?? 0}</p>
            <p className="text-[#605e5c]">Success: {row.stats?.successCount ?? 0}</p>
          </div>
        ),
      },
      {
        key: "id",
        header: "Actions",
        sortable: false,
        render: (_v, row) => (
          <div className="flex gap-1">
            <Link href={`/workflows/${row.id}`}>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-[#0078d4]"
                onClick={() => dispatch(setSelectedWorkflow(row.id))}
              >
                Details
              </Button>
            </Link>
            <Link href={`/workflows/${row.id}/monitor`}>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-[#605e5c]">
                Monitor
              </Button>
            </Link>
          </div>
        ),
      },
    ],
    [dispatch]
  )

  return (
    <PageLayout>
      <PageHeader
        title="Workflow engine"
        description="Platform workflows with state machine definitions, execution stats, and health. Seed data only – API integration later."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <WorkflowIcon className="h-3.5 w-3.5 text-[#0078d4]" />
            Workflows
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/workflows/designer">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                New workflow
              </Button>
            </Link>
          </div>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle>Total workflows</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : metrics.total}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Platform + tenant workflows</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Active</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">{loading ? "—" : metrics.active}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Currently enabled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Total executions (seed)</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">{loading ? "—" : metrics.totalExecutions}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Sum across all workflows</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection
        title="Workflows"
        description={filtered.length !== items.length ? `${filtered.length} of ${items.length} shown` : undefined}
      >
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by name, id or description..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              { key: "type", label: "Type", options: TYPE_OPTIONS, selected: typeFilter, onSelectionChange: setTypeFilter },
              { key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter },
            ]}
            onClearAll={() => {
              setSearchQuery("")
              setTypeFilter([])
              setStatusFilter([])
            }}
          />
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading workflows…</div>
              ) : (
                <DataTable
                  data={filtered}
                  columns={columns}
                  pageSize={10}
                  exportable
                  exportFileName="workflows"
                  emptyMessage="No workflows match the filters."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
