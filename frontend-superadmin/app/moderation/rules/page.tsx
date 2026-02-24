"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { FileText, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchModerationRules, setSelectedRule } from "@/shared/state/moderationSlice"
import type { ModerationRule } from "@/shared/lib/types/moderation"
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

export default function ModerationRulesPage() {
  const dispatch = useAppDispatch()
  const { rules, loadingRules } = useAppSelector((s) => s.moderation)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  useEffect(() => {
    if (!rules.length) dispatch(fetchModerationRules())
  }, [dispatch, rules.length])

  const filtered = useMemo(() => {
    let result = rules
    if (statusFilter.length > 0) result = result.filter((r) => statusFilter.includes(r.status))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((r) => r.name.toLowerCase().includes(q) || r._id.toLowerCase().includes(q))
    }
    return result
  }, [rules, statusFilter, searchQuery])

  const metrics = useMemo(() => {
    const active = rules.filter((r) => r.status === "ACTIVE").length
    const draft = rules.filter((r) => r.status === "DRAFT").length
    const totalExecutions = rules.reduce((s, r) => s + (r.executionCount || 0), 0)
    return { total: rules.length, active, draft, totalExecutions }
  }, [rules])

  const columns: Column<ModerationRule>[] = useMemo(
    () => [
      { key: "_id", header: "Rule ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
      { key: "name", header: "Name", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
      { key: "triggerType", header: "Trigger Type", render: (v) => <span className="text-sm">{String(v)}</span> },
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
        key: "executionCount",
        header: "Executions",
        render: (v) => <span className="text-sm">{v != null ? Number(v).toLocaleString() : 0}</span>,
      },
      {
        key: "successRate",
        header: "Success Rate",
        render: (v) => {
          if (v == null) return <span className="text-sm text-[#605e5c]">—</span>
          const rate = Number(v) * 100
          return <span className={`text-sm font-medium ${rate >= 90 ? "text-[#107c10]" : rate >= 80 ? "text-[#ff8c00]" : "text-[#a80000]"}`}>{rate.toFixed(1)}%</span>
        },
      },
      {
        key: "_id",
        header: "Actions",
        sortable: false,
        render: (_v, row) => (
          <Link href={`/moderation/rules/${row._id}`}>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]" onClick={() => dispatch(setSelectedRule(row._id))}>
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
        title="Moderation rules"
        description="All moderation rules, trigger conditions, actions, status. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><FileText className="h-3.5 w-3.5 text-[#0078d4]" />Rules</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/moderation/queue"><Button variant="outline" size="sm">Queue</Button></Link>
            <Link href="/moderation/appeals"><Button variant="outline" size="sm">Appeals</Button></Link>
            <Link href="/moderation/analytics"><Button variant="outline" size="sm" className="gap-1.5"><ArrowRight className="h-3.5 w-3.5" />Analytics</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total rules</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingRules ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Active</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loadingRules ? "—" : metrics.active}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Draft</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#605e5c]">{loadingRules ? "—" : metrics.draft}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total executions</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{loadingRules ? "—" : metrics.totalExecutions.toLocaleString()}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Rules" description={filtered.length !== rules.length ? `${filtered.length} of ${rules.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by name or rule ID..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[{ key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter }]}
            onClearAll={() => { setSearchQuery(""); setStatusFilter([]) }}
          />
          <Card><CardContent className="p-0">
            {loadingRules ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={filtered} columns={columns} pageSize={10} exportable exportFileName="moderation-rules" emptyMessage="No rules match the filters." />}
          </CardContent></Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
