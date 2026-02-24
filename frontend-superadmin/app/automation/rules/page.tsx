"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { List, ArrowRight, Play } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchAutomationRules, fetchAutomationPacks, setSelectedRule } from "@/shared/state/automationSlice"
import type { AutomationRule } from "@/shared/lib/types/automation"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"

export default function AutomationRulesPage() {
  const dispatch = useAppDispatch()
  const { rules, packs, loadingRules } = useAppSelector((s) => s.automation)
  const [searchQuery, setSearchQuery] = useState("")
  const [packFilter, setPackFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [triggerFilter, setTriggerFilter] = useState<string[]>([])

  useEffect(() => {
    if (!rules.length) dispatch(fetchAutomationRules())
    if (!packs.length) dispatch(fetchAutomationPacks())
  }, [dispatch, rules.length, packs.length])

  const packOptions: FilterOption[] = useMemo(
    () => packs.map((p) => ({ value: p.id, label: p.name })),
    [packs]
  )

  const filtered = useMemo(() => {
    let result = rules
    if (packFilter.length > 0) result = result.filter((r) => packFilter.includes(r.packId))
    if (statusFilter.length > 0) result = result.filter((r) => statusFilter.includes(r.status))
    if (triggerFilter.length > 0) result = result.filter((r) => triggerFilter.includes(r.trigger.type))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          (r.description?.toLowerCase().includes(q) ?? false) ||
          (r.trigger.event?.toLowerCase().includes(q) ?? false)
      )
    }
    return result
  }, [rules, packFilter, statusFilter, triggerFilter, searchQuery])

  const metrics = useMemo(() => {
    const active = rules.filter((r) => r.status === "ACTIVE").length
    const totalRuns = rules.reduce((acc, r) => acc + (r.stats?.executionCount ?? 0), 0)
    return { total: rules.length, active, totalRuns }
  }, [rules])

  const columns: Column<AutomationRule>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Rule",
        render: (_v, row) => (
          <div>
            <p className="text-sm font-semibold text-[#323130]">{row.name}</p>
            <p className="text-xs text-[#605e5c] font-mono">{row.id}</p>
          </div>
        ),
      },
      {
        key: "packId",
        header: "Pack",
        render: (v) => {
          const pack = packs.find((p) => p.id === v)
          return <span className="text-sm">{pack?.name ?? String(v)}</span>
        },
      },
      {
        key: "trigger",
        header: "Trigger",
        render: (_v, row) => (
          <span className="text-xs">
            {row.trigger.type}
            {row.trigger.event ? ` · ${row.trigger.event}` : ""}
            {row.trigger.schedule ? ` · ${row.trigger.schedule}` : ""}
          </span>
        ),
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
      {
        key: "stats",
        header: "Executions",
        sortable: false,
        render: (_v, row) => (
          <span className="text-sm">
            {row.stats?.executionCount ?? 0} · {row.stats?.successCount ?? 0} ok
          </span>
        ),
      },
      {
        key: "id",
        header: "Actions",
        sortable: false,
        render: (_v, row) => (
          <div className="flex gap-1">
            <Link href={`/automation/rules/${row.id}`}>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]" onClick={() => dispatch(setSelectedRule(row.id))}>
                Details
              </Button>
            </Link>
            <Link href={`/automation/rules/${row.id}/test`}>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-[#605e5c]">
                <Play className="h-3 w-3 mr-0.5" /> Test
              </Button>
            </Link>
          </div>
        ),
      },
    ],
    [dispatch, packs]
  )

  return (
    <PageLayout>
      <PageHeader
        title="Automation rules"
        description="All rules organized by pack. Filter by pack, status, trigger type. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <List className="h-3.5 w-3.5 text-[#0078d4]" />
            Rules
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/automation">
              <Button variant="outline" size="sm">Overview</Button>
            </Link>
            <Link href="/automation/builder">
              <Button size="sm" className="gap-1.5">
                <ArrowRight className="h-3.5 w-3.5" />
                Rule builder
              </Button>
            </Link>
          </div>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle>Total rules</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">{loadingRules ? "—" : metrics.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Active</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">{loadingRules ? "—" : metrics.active}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Total runs (seed)</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">{loadingRules ? "—" : metrics.totalRuns.toLocaleString()}</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Rules" description={filtered.length !== rules.length ? `${filtered.length} of ${rules.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by name, id, event..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              { key: "pack", label: "Pack", options: packOptions, selected: packFilter, onSelectionChange: setPackFilter },
              { key: "status", label: "Status", options: [{ value: "ACTIVE", label: "Active" }, { value: "DRAFT", label: "Draft" }, { value: "DISABLED", label: "Disabled" }], selected: statusFilter, onSelectionChange: setStatusFilter },
              { key: "trigger", label: "Trigger", options: [{ value: "EVENT", label: "Event" }, { value: "SCHEDULE", label: "Schedule" }, { value: "MANUAL", label: "Manual" }, { value: "WEBHOOK", label: "Webhook" }], selected: triggerFilter, onSelectionChange: setTriggerFilter },
            ]}
            onClearAll={() => {
              setSearchQuery("")
              setPackFilter([])
              setStatusFilter([])
              setTriggerFilter([])
            }}
          />
          <Card>
            <CardContent className="p-0">
              {loadingRules ? (
                <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading rules…</div>
              ) : (
                <DataTable
                  data={filtered}
                  columns={columns}
                  pageSize={10}
                  exportable
                  exportFileName="automation-rules"
                  emptyMessage="No rules match the filters."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
