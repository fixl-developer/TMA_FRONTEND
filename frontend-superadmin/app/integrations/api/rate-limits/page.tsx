"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Gauge, Shield, AlertTriangle } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { getApiRateLimits } from "@/shared/services/integrationsService"
import { getTenantName } from "@/shared/services/userService"

type RateLimitRule = {
  _id: string
  scope: "tenant" | "endpoint"
  tenantId: string | null
  endpoint: string
  method: string
  windowSeconds: number
  limit: number
  burst: number
  status: "ACTIVE" | "DISABLED"
  notes?: string
}

const STATUS_OPTIONS: FilterOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "DISABLED", label: "Disabled" },
]

const SCOPE_OPTIONS: FilterOption[] = [
  { value: "tenant", label: "Tenant" },
  { value: "endpoint", label: "Endpoint" },
]

export default function ApiRateLimitsPage() {
  const [rules, setRules] = useState<RateLimitRule[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [scopeFilter, setScopeFilter] = useState<string[]>([])

  useEffect(() => {
    getApiRateLimits()
      .then((d) => setRules(d as RateLimitRule[]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let result = rules
    if (statusFilter.length > 0) result = result.filter((r) => statusFilter.includes(r.status))
    if (scopeFilter.length > 0) result = result.filter((r) => scopeFilter.includes(r.scope))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r._id.toLowerCase().includes(q) ||
          r.endpoint.toLowerCase().includes(q) ||
          r.method.toLowerCase().includes(q) ||
          (r.tenantId ? getTenantName(r.tenantId).toLowerCase().includes(q) : "platform".includes(q)) ||
          (r.notes?.toLowerCase().includes(q) ?? false)
      )
    }
    return result
  }, [rules, statusFilter, scopeFilter, searchQuery])

  const metrics = useMemo(() => {
    const active = rules.filter((r) => r.status === "ACTIVE").length
    const disabled = rules.filter((r) => r.status === "DISABLED").length
    const tenantScoped = rules.filter((r) => r.scope === "tenant").length
    const endpointScoped = rules.filter((r) => r.scope === "endpoint").length
    return { total: rules.length, active, disabled, tenantScoped, endpointScoped }
  }, [rules])

  const columns: Column<RateLimitRule>[] = useMemo(
    () => [
      {
        key: "endpoint",
        header: "Rule",
        render: (_v, row) => (
          <div>
            <p className="text-sm font-semibold text-[#323130]">
              <span className="mr-2 rounded border border-[#edebe9] bg-[#f3f2f1] px-1.5 py-0.5 text-xs font-medium">
                {row.method}
              </span>
              <span className="font-mono text-xs">{row.endpoint}</span>
            </p>
            <p className="text-xs text-[#605e5c]">
              {row.scope === "tenant" ? `Tenant: ${row.tenantId ? getTenantName(row.tenantId) : "—"}` : "Platform endpoint rule"}
            </p>
          </div>
        ),
      },
      {
        key: "windowSeconds",
        header: "Window",
        render: (v) => <span className="text-sm text-[#605e5c]">{Number(v)}s</span>,
      },
      {
        key: "limit",
        header: "Limit",
        render: (v) => <span className="text-sm font-medium text-[#323130]">{Number(v).toLocaleString()}</span>,
      },
      {
        key: "burst",
        header: "Burst",
        render: (v) => <span className="text-sm text-[#605e5c]">{Number(v).toLocaleString()}</span>,
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
      {
        key: "_id",
        header: "Actions",
        sortable: false,
        render: () => (
          <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]">
            Edit
          </Button>
        ),
      },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="API rate limits"
        description="Configure rate limit rules per tenant and per endpoint. Seed data only (UI placeholders for editing)."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Gauge className="h-3.5 w-3.5 text-[#0078d4]" />
            Rate limits
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/integrations/api/usage">
              <Button variant="outline" size="sm">Usage</Button>
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
            <CardHeader><CardTitle className="text-sm font-semibold">Total rules</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : metrics.total}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Active</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#107c10]">{loading ? "—" : metrics.active}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Tenant-scoped</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#0078d4]">{loading ? "—" : metrics.tenantScoped}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Endpoint-scoped</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : metrics.endpointScoped}</p></CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Rules" description={filtered.length !== rules.length ? `${filtered.length} of ${rules.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by endpoint, method, tenant, notes..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              { key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter },
              { key: "scope", label: "Scope", options: SCOPE_OPTIONS, selected: scopeFilter, onSelectionChange: setScopeFilter },
            ]}
            onClearAll={() => {
              setSearchQuery("")
              setStatusFilter([])
              setScopeFilter([])
            }}
          />

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading rate limits…</div>
              ) : (
                <DataTable
                  data={filtered}
                  columns={columns}
                  pageSize={10}
                  exportable
                  exportFileName="api-rate-limits"
                  emptyMessage="No rate limit rules match the filters."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title="Guardrails">
        <Card>
          <CardContent className="pt-4 text-sm text-[#605e5c]">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 mt-0.5 text-[#0078d4]" />
              <p>
                Use tenant-level defaults for predictable throughput, then add endpoint-specific rules for sensitive paths (auth,
                job creation) or high-volume callbacks (payment webhooks).
              </p>
            </div>
            <div className="mt-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-[#ff8c00]" />
              <p>
                Editing is a UI placeholder in Phase 3.2 seed mode. Later this page will call
                <span className="mx-1 font-mono text-xs">PATCH /v1/superadmin/integrations/api/rate-limits</span>.
              </p>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

