"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users2, Building2 } from "lucide-react"
import type { BlueprintId } from "@/shared/lib/types/blueprints"
import type { Tenant } from "@/shared/lib/types/tenants"
import { getBlueprintTenants } from "@/shared/services/blueprintService"
import { getBlueprintById } from "@/shared/services/blueprintService"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"

type StatusFilter = "ALL" | Tenant["status"]

export default function BlueprintTenantsPage() {
  const params = useParams<{ id: string }>()
  const blueprintId = params?.id?.toUpperCase() as BlueprintId | undefined

  const [loading, setLoading] = useState(true)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [blueprintName, setBlueprintName] = useState<string>("")

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")
  const [typeFilter, setTypeFilter] = useState<string[]>([])

  useEffect(() => {
    if (!blueprintId) return
    const load = async () => {
      setLoading(true)
      try {
        const [tenantSummary, bp] = await Promise.all([
          getBlueprintTenants(blueprintId),
          getBlueprintById(blueprintId),
        ])
        setTenants(tenantSummary.tenants)
        setBlueprintName(bp?.name ?? blueprintId)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [blueprintId])

  const typeOptions: FilterOption[] = useMemo(() => {
    const types = new Set<string>()
    tenants.forEach((t) => types.add(t.type))
    return Array.from(types)
      .sort()
      .map((t) => ({ value: t, label: t }))
  }, [tenants])

  const filtered = useMemo(() => {
    let result = tenants

    if (statusFilter !== "ALL") {
      result = result.filter((t) => t.status === statusFilter)
    }

    if (typeFilter.length > 0) {
      result = result.filter((t) => typeFilter.includes(t.type))
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q) ||
          t._id.toLowerCase().includes(q) ||
          (t.agencyType ? String(t.agencyType).toLowerCase().includes(q) : false)
      )
    }

    return result
  }, [tenants, statusFilter, typeFilter, searchQuery])

  const metrics = useMemo(() => {
    const total = tenants.length
    const active = tenants.filter((t) => t.status === "ACTIVE").length
    const suspended = tenants.filter((t) => t.status === "SUSPENDED").length
    const pending = tenants.filter((t) => t.status === "PENDING").length
    return { total, active, suspended, pending }
  }, [tenants])

  const columns: Column<Tenant>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Tenant",
        render: (_value, row) => (
          <div className="space-y-0.5">
            <p className="text-[12px] font-semibold text-[#323130]">{row.name}</p>
            <p className="text-[10px] text-[#605e5c]">
              <span className="font-mono">{row._id}</span> ·{" "}
              <span className="font-mono">{row.slug}</span>
            </p>
          </div>
        ),
      },
      {
        key: "type",
        header: "Type",
        render: (value, row) => (
          <div className="space-y-0.5">
            <p className="text-[11px] text-[#323130]">{String(value)}</p>
            {row.agencyType && (
              <p className="text-[10px] text-[#605e5c]">
                {String(row.agencyType).replace(/_/g, " ")}
              </p>
            )}
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (value) => {
          const v = String(value)
          const cls =
            v === "ACTIVE"
              ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]"
              : v === "SUSPENDED"
              ? "border-[#ffb900] bg-[#fff4ce] text-[#797673]"
              : v === "PENDING"
              ? "border-[#0078d4] bg-[#deecf9] text-[#0078d4]"
              : "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
          return (
            <span
              className={`inline-flex rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}
            >
              {v.toLowerCase()}
            </span>
          )
        },
      },
      {
        key: "blueprints",
        header: "Blueprints",
        sortable: false,
        render: (_value, row) => (
          <div className="flex flex-wrap gap-1">
            {((row.blueprints as string[] | undefined) ?? []).map((b) => (
              <span
                key={b}
                className={
                  b === blueprintId
                    ? "rounded border border-[#0078d4] bg-[#deecf9] px-1.5 py-0.5 text-[10px] font-mono text-[#0078d4]"
                    : "rounded border border-[#edebe9] bg-[#f3f2f1] px-1.5 py-0.5 text-[10px] font-mono text-[#605e5c]"
                }
              >
                {b}
              </span>
            ))}
          </div>
        ),
      },
    ],
    [blueprintId]
  )

  if (!blueprintId) {
    return (
      <PageLayout>
        <PageHeader title="Blueprint tenants" description="Invalid blueprint id in URL." />
        <PageSection>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/blueprints/catalog">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to catalog
            </Link>
          </Button>
        </PageSection>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title="Tenants using this blueprint"
        description={`Blueprint ${blueprintId} · ${blueprintName}. Seed-backed adoption view; backend analytics will be integrated later.`}
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Users2 className="h-3.5 w-3.5 text-[#0078d4]" />
            Adoption
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href={`/blueprints/${blueprintId}`}>
                <ArrowLeft className="h-3.5 w-3.5" />
                Blueprint details
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href="/tenants">
                <Building2 className="h-3.5 w-3.5" />
                Tenants dashboard
              </Link>
            </Button>
          </div>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Total tenants</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {loading ? "—" : metrics.total}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">Tenants linked to {blueprintId}.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">
                {loading ? "—" : metrics.active}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">Currently enabled tenants.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">
                {loading ? "—" : metrics.pending}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">Awaiting approval.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Suspended</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#ffb900]">
                {loading ? "—" : metrics.suspended}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">Temporarily disabled.</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection
        title="Tenants"
        description={filtered.length !== tenants.length ? `${filtered.length} of ${tenants.length} shown` : undefined}
      >
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search tenants by name, slug, id, or agency type..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={
              typeOptions.length
                ? [
                    {
                      key: "type",
                      label: "Tenant type",
                      options: typeOptions,
                      selected: typeFilter,
                      onSelectionChange: setTypeFilter,
                    },
                  ]
                : []
            }
            onClearAll={() => {
              setSearchQuery("")
              setTypeFilter([])
              setStatusFilter("ALL")
            }}
          />

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#605e5c]">Status:</span>
            {([
              { key: "ALL", label: "All" },
              { key: "ACTIVE", label: "Active" },
              { key: "PENDING", label: "Pending" },
              { key: "SUSPENDED", label: "Suspended" },
              { key: "DELETED", label: "Deleted" },
            ] as { key: StatusFilter; label: string }[]).map((opt) => (
              <Button
                key={opt.key}
                size="sm"
                variant={statusFilter === opt.key ? "default" : "outline"}
                className={
                  statusFilter === opt.key
                    ? "h-7 px-3 text-xs"
                    : "h-7 px-3 text-xs bg-[#faf9f8]"
                }
                onClick={() => setStatusFilter(opt.key)}
              >
                {opt.label}
              </Button>
            ))}
          </div>

          <div className="rounded border border-[#edebe9] bg-white p-3">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-sm text-[#605e5c]">
                Loading tenants from seed…
              </div>
            ) : (
              <DataTable
                data={filtered}
                columns={columns}
                pageSize={10}
                exportable
                exportFileName={`blueprint-${blueprintId}-tenants`}
                emptyMessage="No tenants match the current filters."
              />
            )}
          </div>
        </div>
      </PageSection>
    </PageLayout>
  )
}

