"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, KeyRound } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { getApiKeys } from "@/shared/services/integrationsService"
import { getTenantName } from "@/shared/services/userService"

type ApiKey = {
  _id: string
  tenantId: string
  name: string
  keyPrefix: string
  scopes: string[]
  lastUsedAt: string | null
  requestsLast30d: number
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

const STATUS_OPTIONS: FilterOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "DISABLED", label: "Disabled" },
]

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  useEffect(() => {
    getApiKeys()
      .then((d) => setKeys(d as ApiKey[]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let result = keys
    if (statusFilter.length > 0) result = result.filter((k) => statusFilter.includes(k.status))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (k) =>
          k.name.toLowerCase().includes(q) ||
          k._id.toLowerCase().includes(q) ||
          k.keyPrefix.toLowerCase().includes(q) ||
          getTenantName(k.tenantId).toLowerCase().includes(q) ||
          k.scopes.some((s) => s.toLowerCase().includes(q))
      )
    }
    return result
  }, [keys, statusFilter, searchQuery])

  const metrics = useMemo(() => {
    const active = keys.filter((k) => k.status === "ACTIVE").length
    const totalRequests = keys.reduce((acc, k) => acc + (k.requestsLast30d ?? 0), 0)
    return { total: keys.length, active, totalRequests }
  }, [keys])

  const columns: Column<ApiKey>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Key",
        render: (_v, row) => (
          <div>
            <p className="text-sm font-semibold text-[#323130]">{row.name}</p>
            <p className="text-xs font-mono text-[#605e5c]">{row.keyPrefix}</p>
          </div>
        ),
      },
      {
        key: "tenantId",
        header: "Tenant",
        render: (v) => (
          <span className="text-sm text-[#605e5c]">{getTenantName(String(v))}</span>
        ),
      },
      {
        key: "scopes",
        header: "Scopes",
        render: (v) => (
          <span className="text-xs text-[#605e5c]">{(v as string[]).join(", ")}</span>
        ),
      },
      {
        key: "requestsLast30d",
        header: "Requests (30d)",
        render: (v) => (
          <span className="text-sm font-medium text-[#323130]">{Number(v).toLocaleString()}</span>
        ),
      },
      {
        key: "lastUsedAt",
        header: "Last used",
        render: (v) => (
          <span className="text-sm text-[#605e5c]">
            {v ? new Date(String(v)).toLocaleDateString("en-IN") : "—"}
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
        title="API keys"
        description="API key lifecycle, tenant ownership, scopes, usage tracking, and revocation. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <KeyRound className="h-3.5 w-3.5 text-[#0078d4]" />
            Keys
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/integrations/api/usage">
              <Button variant="outline" size="sm">Usage</Button>
            </Link>
            <Link href="/integrations/api/versions">
              <Button variant="outline" size="sm">Versions</Button>
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
            <CardHeader><CardTitle className="text-sm font-semibold">Total keys</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : metrics.total}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Active</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#107c10]">{loading ? "—" : metrics.active}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Requests (30d)</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#0078d4]">{loading ? "—" : metrics.totalRequests.toLocaleString()}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Actions</CardTitle></CardHeader>
            <CardContent>
              <Button size="sm" className="bg-[#0078d4] hover:bg-[#106ebe]">Create key</Button>
              <p className="mt-2 text-xs text-[#605e5c]">UI placeholder</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Keys" description={filtered.length !== keys.length ? `${filtered.length} of ${keys.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by key name, tenant, scope..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              { key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter },
            ]}
            onClearAll={() => {
              setSearchQuery("")
              setStatusFilter([])
            }}
          />
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading API keys…</div>
              ) : (
                <DataTable
                  data={filtered}
                  columns={columns}
                  pageSize={10}
                  exportable
                  exportFileName="api-keys"
                  emptyMessage="No API keys match the filters."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}

