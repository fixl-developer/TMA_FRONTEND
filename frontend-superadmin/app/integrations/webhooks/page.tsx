"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, PlugZap } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { getWebhooks } from "@/shared/services/integrationsService"
import { getTenantName } from "@/shared/services/userService"

type Webhook = {
  _id: string
  tenantId: string
  url: string
  events: string[]
  status: "ACTIVE" | "DISABLED"
  lastDeliveryAt: string | null
  successRate: number
  createdAt: string
}

const STATUS_OPTIONS: FilterOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "DISABLED", label: "Disabled" },
]

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  useEffect(() => {
    getWebhooks()
      .then((d) => setWebhooks(d as Webhook[]))
      .finally(() => setLoading(false))
  }, [])

  const eventOptions: FilterOption[] = useMemo(() => {
    const all = new Set<string>()
    for (const w of webhooks) (w.events ?? []).forEach((e) => all.add(e))
    return Array.from(all)
      .sort()
      .slice(0, 30)
      .map((e) => ({ value: e, label: e }))
  }, [webhooks])

  const [eventFilter, setEventFilter] = useState<string[]>([])

  const filtered = useMemo(() => {
    let result = webhooks
    if (statusFilter.length > 0) result = result.filter((w) => statusFilter.includes(w.status))
    if (eventFilter.length > 0) result = result.filter((w) => w.events?.some((e) => eventFilter.includes(e)))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (w) =>
          w._id.toLowerCase().includes(q) ||
          w.url.toLowerCase().includes(q) ||
          getTenantName(w.tenantId).toLowerCase().includes(q) ||
          (w.events ?? []).some((e) => e.toLowerCase().includes(q))
      )
    }
    return result
  }, [webhooks, statusFilter, eventFilter, searchQuery])

  const metrics = useMemo(() => {
    const active = webhooks.filter((w) => w.status === "ACTIVE").length
    const avgSuccess =
      webhooks.length > 0
        ? Math.round((webhooks.reduce((acc, w) => acc + (w.successRate ?? 0), 0) / webhooks.length) * 10) / 10
        : 0
    const lowHealth = webhooks.filter((w) => (w.successRate ?? 100) < 95).length
    return { total: webhooks.length, active, avgSuccess, lowHealth }
  }, [webhooks])

  const columns: Column<Webhook>[] = useMemo(
    () => [
      {
        key: "tenantId",
        header: "Tenant",
        render: (v) => <span className="text-sm font-medium text-[#323130]">{getTenantName(String(v))}</span>,
      },
      {
        key: "url",
        header: "URL",
        render: (v) => (
          <span className="block max-w-[360px] truncate font-mono text-xs text-[#605e5c]" title={String(v)}>
            {String(v)}
          </span>
        ),
      },
      {
        key: "events",
        header: "Events",
        render: (v) => (
          <span className="text-xs text-[#605e5c]">{(v as string[])?.join(", ")}</span>
        ),
      },
      {
        key: "successRate",
        header: "Success rate",
        render: (v) => {
          const rate = Number(v)
          const cls = rate >= 98 ? "text-[#107c10]" : rate >= 95 ? "text-[#ff8c00]" : "text-[#a80000]"
          return <span className={`text-sm font-semibold ${cls}`}>{rate.toFixed(1)}%</span>
        },
      },
      {
        key: "lastDeliveryAt",
        header: "Last delivery",
        render: (v) => (
          <span className="text-sm text-[#605e5c]">
            {v ? new Date(String(v)).toLocaleString("en-IN") : "—"}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls =
            s === "ACTIVE"
              ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]"
              : "border-[#605e5c] bg-[#f3f2f1] text-[#605e5c]"
          return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
        },
      },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Webhooks"
        description="Webhook endpoints, event subscriptions, delivery status, retry configuration, and security settings. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <PlugZap className="h-3.5 w-3.5 text-[#0078d4]" />
            Webhooks
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/integrations/api/keys">
              <Button variant="outline" size="sm">API keys</Button>
            </Link>
            <Link href="/integrations">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                Integrations
              </Button>
            </Link>
          </div>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Total webhooks</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : metrics.total}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Active</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#107c10]">{loading ? "—" : metrics.active}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Avg success</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#0078d4]">{loading ? "—" : `${metrics.avgSuccess}%`}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Needs attention</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#ff8c00]">{loading ? "—" : metrics.lowHealth}</p></CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Endpoints" description={filtered.length !== webhooks.length ? `${filtered.length} of ${webhooks.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by tenant, URL, event..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              { key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter },
              { key: "event", label: "Event", options: eventOptions, selected: eventFilter, onSelectionChange: setEventFilter },
            ]}
            onClearAll={() => {
              setSearchQuery("")
              setStatusFilter([])
              setEventFilter([])
            }}
          />
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading webhooks…</div>
              ) : (
                <DataTable
                  data={filtered}
                  columns={columns}
                  pageSize={10}
                  exportable
                  exportFileName="webhooks"
                  emptyMessage="No webhooks match the filters."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}

