"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Globe2, ArrowLeft } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import financeCurrencies from "@/data/seed/financeCurrencies.json"

type Currency = (typeof financeCurrencies)[number]

const STATUS_OPTIONS: FilterOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "BETA", label: "Beta" },
  { value: "PLANNED", label: "Planned" },
]

const REGION_OPTIONS: FilterOption[] = [
  { value: "India", label: "India" },
  { value: "North America", label: "North America" },
  { value: "Europe", label: "Europe" },
  { value: "Middle East", label: "Middle East" },
  { value: "APAC", label: "APAC" },
]

export default function FinanceCurrenciesPage() {
  const currencies = financeCurrencies as Currency[]
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [regionFilter, setRegionFilter] = useState<string[]>([])

  const filtered = useMemo(() => {
    let result = currencies
    if (statusFilter.length > 0) result = result.filter((c) => statusFilter.includes(c.status))
    if (regionFilter.length > 0) result = result.filter((c) => regionFilter.includes(c.region))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q)
      )
    }
    return result
  }, [currencies, statusFilter, regionFilter, searchQuery])

  const metrics = useMemo(() => {
    const active = currencies.filter((c) => c.status === "ACTIVE").length
    const beta = currencies.filter((c) => c.status === "BETA").length
    const planned = currencies.filter((c) => c.status === "PLANNED").length
    const base = currencies.find((c) => c.isBase)?.code ?? "—"
    return { total: currencies.length, active, beta, planned, base }
  }, [currencies])

  const columns: Column<Currency>[] = useMemo(
    () => [
      {
        key: "code",
        header: "Currency",
        render: (_v, row) => (
          <div>
            <p className="text-sm font-semibold text-[#323130]">
              {row.code} · {row.symbol}
            </p>
            <p className="text-xs text-[#605e5c]">{row.name}</p>
          </div>
        ),
      },
      {
        key: "region",
        header: "Region",
        render: (v) => <span className="text-sm text-[#605e5c]">{String(v)}</span>,
      },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls =
            s === "ACTIVE"
              ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]"
              : s === "BETA"
                ? "border-[#ff8c00] bg-[#fff4ce] text-[#c75000]"
                : "border-[#605e5c] bg-[#f3f2f1] text-[#605e5c]"
          return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
        },
      },
      {
        key: "tenantsUsing",
        header: "Tenants",
        render: (v) => (
          <span className="text-sm text-[#605e5c]">{(v as string[])?.length ?? 0}</span>
        ),
      },
      {
        key: "enabledForNewTenants",
        header: "Default",
        render: (v) => (
          <span className="text-xs text-[#605e5c]">
            {v ? "Enabled for new tenants" : "Off by default"}
          </span>
        ),
      },
      {
        key: "code",
        header: "Actions",
        sortable: false,
        render: (v) => (
          <Link href={`/finance/currencies/${String(v)}`}>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]">
              Details
            </Button>
          </Link>
        ),
      },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Currencies"
        description="Supported currencies, status, tenant usage, and configuration. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Globe2 className="h-3.5 w-3.5 text-[#0078d4]" />
            Multi-currency
          </span>
        }
        actions={
          <Link href="/finance">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Finance
            </Button>
          </Link>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Total currencies</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#323130]">{metrics.total}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Active</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#107c10]">{metrics.active}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Base currency</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#0078d4]">{metrics.base}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Roadmap</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#ff8c00]">{metrics.beta + metrics.planned}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Beta + planned</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection
        title="Currencies"
        description={filtered.length !== currencies.length ? `${filtered.length} of ${currencies.length} shown` : undefined}
      >
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by code, name, region..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              { key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter },
              { key: "region", label: "Region", options: REGION_OPTIONS, selected: regionFilter, onSelectionChange: setRegionFilter },
            ]}
            onClearAll={() => {
              setSearchQuery("")
              setStatusFilter([])
              setRegionFilter([])
            }}
          />
          <Card>
            <CardContent className="p-0">
              <DataTable
                data={filtered}
                columns={columns}
                pageSize={10}
                exportable
                exportFileName="finance-currencies"
                emptyMessage="No currencies match the filters."
              />
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}

