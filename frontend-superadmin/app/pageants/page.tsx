/**
 * Pageants Console - Super Admin
 *
 * Cinematic overview of all pageants across tenants.
 * Seed-only for now; will be wired to real backend later.
 */

"use client"

import { useEffect, useMemo, useState } from "react"
import { BadgeCheck, Loader2, LayoutGrid, Table2, Trash2 } from "lucide-react"
import { getPageants } from "@/shared/services/pageantService"
import { getTenants } from "@/shared/services/tenantService"
import type { Pageant } from "@/shared/lib/types/pageants"
import type { Tenant } from "@/shared/lib/types/tenants"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetCloseButton,
} from "@/shared/components/ui/sheet"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { RechartsBar } from "@/shared/components/charts/RechartsBar"
import { RechartsPie } from "@/shared/components/charts/RechartsPie"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog"
import { useToast } from "@/shared/components/ui/toast"

type PageantStatus = Pageant["status"]

const statusColors: Record<PageantStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700 border border-slate-200",
  ACTIVE: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  COMPLETED: "bg-sky-100 text-sky-800 border border-sky-200",
  ARCHIVED: "bg-slate-100 text-slate-500 border border-slate-200",
}

export default function PageantsConsole() {
  const [pageants, setPageants] = useState<Pageant[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPageant, setSelectedPageant] = useState<Pageant | null>(null)
  const [processOpen, setProcessOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [tenantFilter, setTenantFilter] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<Pageant[]>([])
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const [pageantsData, tenantsData] = await Promise.all([
          getPageants(),
          getTenants(),
        ])
        setPageants(pageantsData)
        setTenants(tenantsData)
      } catch (e) {
        console.error("Failed to load data", e)
        showToast("Failed to load pageants", "error")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [showToast])

  const handleOpenProcess = (pageant: Pageant) => {
    setSelectedPageant(pageant)
    setProcessOpen(true)
  }

  const processView = useMemo(() => {
    if (!selectedPageant) return null

    const rules = (selectedPageant.rules || {}) as any
    const rounds = (rules.rounds || []) as any[]
    const scoring = rules.scoring || {}
    const criteria = (scoring.criteria || []) as any[]

    return {
      editionName: rules.editionName as string | undefined,
      ageRange: rules.ageRange as { min?: number; max?: number } | undefined,
      requiresGuardianConsent: rules.requiresGuardianConsent as boolean | undefined,
      categories: (rules.categories || []) as string[],
      eligibility: (rules.eligibility || []) as string[],
      rounds,
      scoringScale: scoring.scale as
        | { min: number; max: number; decimals: number }
        | undefined,
      criteria,
      fees: rules.fees as
        | { registrationFeeMinor?: number; currency?: string; refundPolicy?: string }
        | undefined,
    }
  }, [selectedPageant])

  const filteredPageants = useMemo(() => {
    let filtered = pageants

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.tenantId.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter((p) => statusFilter.includes(p.status))
    }

    // Tenant filter
    if (tenantFilter.length > 0) {
      filtered = filtered.filter((p) => tenantFilter.includes(p.tenantId))
    }

    return filtered
  }, [pageants, searchQuery, statusFilter, tenantFilter])

  const total = pageants.length
  const active = pageants.filter((p) => p.status === "ACTIVE").length
  const drafts = pageants.filter((p) => p.status === "DRAFT").length

  const tenantOptions: FilterOption[] = useMemo(
    () =>
      tenants.map((t) => ({
        value: t._id,
        label: t.name,
      })),
    [tenants]
  )

  const statusOptions: FilterOption[] = [
    { value: "ACTIVE", label: "Active" },
    { value: "DRAFT", label: "Draft" },
    { value: "COMPLETED", label: "Completed" },
    { value: "ARCHIVED", label: "Archived" },
  ]

  const tableColumns: Column<Pageant>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-semibold text-slate-800">{value}</p>
          {row.description && (
            <p className="text-[10px] text-slate-500 line-clamp-1">
              {row.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "tenantId",
      header: "Tenant",
      sortable: true,
      render: (value) => {
        const tenant = tenants.find((t) => t._id === value)
        return (
          <span className="font-mono text-[11px] text-slate-600">
            {tenant?.name || value}
          </span>
        )
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (value) => (
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusColors[value as PageantStatus]}`}
        >
          {String(value).toLowerCase()}
        </span>
      ),
    },
    {
      key: "createdByUserId",
      header: "Created By",
      sortable: true,
      render: (value) => (
        <span className="font-mono text-[11px] text-slate-500">{String(value)}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: (_, row) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-[11px] text-blue-600 hover:bg-blue-50"
          onClick={() => handleOpenProcess(row)}
        >
          View process
        </Button>
      ),
    },
  ]

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return
    setConfirmDeleteOpen(true)
  }

  const confirmBulkDelete = () => {
    showToast(
      `Bulk delete for ${selectedRows.length} pageants (UI-only, no backend yet)`,
      "info"
    )
    setSelectedRows([])
  }

  return (
    <PageLayout>
      <PageHeader
        title="Pageants"
        description="Monitor every pageant that tenants are designing and running. Powered by seed data for this phase."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />
            Content & Events
          </span>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <BadgeCheck className="mr-2 h-4 w-4 text-blue-600" />
            Validation rules (preview)
          </Button>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Total pageants</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-800">{total}</p>
              <p className="mt-1 text-xs text-slate-500">
                Across all tenants in the current environment.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-emerald-600">
                {active}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Tenant-facing journeys that can accept participants.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Draft blueprints</CardTitle>
            </CardHeader>
            <CardContent>
           <p className="text-3xl font-semibold text-amber-600">
                {drafts}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Processes under design, using the pageant builder spec.
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Distribution">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Pageants by status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-slate-600">
              {loading ? (
                <p className="text-slate-500">Loading…</p>
              ) : (
                <>
                  <RechartsBar
                    data={[
                      { label: "Active", value: active },
                      { label: "Draft", value: drafts },
                      {
                        label: "Completed",
                        value: pageants.filter((p) => p.status === "COMPLETED").length,
                      },
                      {
                        label: "Archived",
                        value: pageants.filter((p) => p.status === "ARCHIVED").length,
                      },
                    ]}
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Status distribution from seed data.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pageants by tenant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-slate-600">
              {loading ? (
                <p className="text-slate-500">Loading…</p>
              ) : tenants.length === 0 ? (
                <p className="text-[10px] text-slate-500">No tenants in seed.</p>
              ) : (() => {
                const pieData = tenants
                  .map((t) => ({
                    label: t.name.length > 12 ? t.name.slice(0, 12) + "…" : t.name,
                    value: pageants.filter((p) => p.tenantId === t._id).length,
                  }))
                  .filter((d) => d.value > 0)
                if (pieData.length === 0) {
                  return <p className="text-[10px] text-slate-500">No pageants assigned to tenants yet.</p>
                }
                return (
                <>
                  <RechartsPie data={pieData} />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Pageants per tenant.
                  </p>
                </>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection
        title="Pageants"
        description={filteredPageants.length !== pageants.length ? `${filteredPageants.length} of ${pageants.length} shown` : undefined}
      >
        <div className="space-y-3">
        <FilterPanel
            searchPlaceholder="Search pageants by name, description, or tenant..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              {
                key: "status",
                label: "Status",
                options: statusOptions,
                selected: statusFilter,
                onSelectionChange: setStatusFilter,
              },
              {
                key: "tenant",
                label: "Tenant",
                options: tenantOptions,
                selected: tenantFilter,
                onSelectionChange: setTenantFilter,
              },
            ]}
            onClearAll={() => {
              setSearchQuery("")
              setStatusFilter([])
              setTenantFilter([])
            }}
          />

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {selectedRows.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkDelete}
                  className="h-8 px-3 text-[11px] bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete ({selectedRows.length})
                </Button>
              )}
              <div className="flex items-center gap-1 rounded-lg border border-slate-200/80 bg-slate-100/70 p-1">
                <Button
                  size="sm"
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  onClick={() => setViewMode("cards")}
                  className="h-7 px-2 text-[11px]"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "table" ? "default" : "ghost"}
                  onClick={() => setViewMode("table")}
                  className="h-7 px-2 text-[11px]"
                >
                  <Table2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/60 py-16 text-slate-600">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-blue-300" />
              <span className="text-sm">Loading pageants from seed…</span>
            </div>
          ) : filteredPageants.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/60 py-16 text-center text-slate-600">
              <p className="text-sm font-medium">
                {pageants.length === 0
                  ? "No pageants in this environment yet."
                  : "No pageants match the current filters."}
              </p>
              <p className="max-w-md text-xs text-slate-500">
                {pageants.length === 0
                  ? "In a real deployment you'd see tenant-created pageants here. For now, populate "
                  : "Try adjusting your search or filter criteria. "}
                {pageants.length === 0 && (
                  <>
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">
                      data/seed/pageants.json
                    </code>{" "}
                    to change this view.
                  </>
                )}
              </p>
            </div>
          ) : viewMode === "table" ? (
            <DataTable
              data={filteredPageants}
              columns={tableColumns}
              pageSize={10}
              selectable={true}
              onRowSelect={setSelectedRows}
              exportable={true}
              exportFileName="pageants-export"
              emptyMessage="No pageants match the current filters"
            />
          ) : (
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur">
              <div className="grid gap-3 md:grid-cols-2">
                {filteredPageants.map((p) => (
                  <article
                    key={p._id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/80 p-[1px]"
                  >
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/10 via-slate-50 to-rose-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex h-full flex-col rounded-[1.05rem] bg-slate-50/90 px-4 py-3 sm:px-5 sm:py-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <h3 className="text-sm font-semibold text-slate-800 sm:text-[15px]">
                            {p.name}
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Tenant ID:{" "}
                            <span className="font-mono text-slate-600">
                              {p.tenantId}
                            </span>
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusColors[p.status]}`}
                        >
                          {p.status.toLowerCase()}
                        </span>
                      </div>

                      {p.description && (
                        <p className="mb-3 line-clamp-2 text-[11px] leading-relaxed text-slate-600">
                          {p.description}
                        </p>
                      )}

                      <dl className="mb-3 grid grid-cols-2 gap-3 text-[11px] text-slate-600/90">
                        <div className="space-y-0.5">
                          <dt className="text-[10px] uppercase tracking-wide text-slate-500">
                            Age rules
                          </dt>
                          <dd>
                            {p.rules?.ageRange
                              ? `${p.rules.ageRange.min ?? "?"}–${
                                  p.rules.ageRange.max ?? "?"
                                } years`
                              : "Not specified"}
                          </dd>
                        </div>
                        <div className="space-y-0.5">
                          <dt className="text-[10px] uppercase tracking-wide text-slate-500">
                            Guardian consent
                          </dt>
                          <dd>
                            {p.rules?.requiresGuardianConsent
                              ? "Required for minors"
                              : "Not required"}
                          </dd>
                        </div>
                      </dl>

                      {Array.isArray(p.rules?.eligibility) &&
                        p.rules?.eligibility.length > 0 && (
                          <div className="mb-3 rounded-xl border border-slate-200/70 bg-slate-100/70 px-3 py-2">
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                              Core eligibility
                            </p>
                            <ul className="space-y-0.5 text-[11px] text-slate-700">
                              {p.rules.eligibility.map((rule: string) => (
                                <li key={rule} className="flex items-start gap-1.5">
                                  <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-blue-400/90" />
                                  <span>{rule}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      <div className="mt-auto flex items-center justify-between pt-1">
                        <p className="text-[10px] text-slate-500">
                          Created by{" "}
                          <span className="font-mono text-slate-600">
                            {p.createdByUserId}
                          </span>
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-[11px] text-blue-200 hover:bg-blue-500/10 hover:text-blue-100"
                          onClick={() => handleOpenProcess(p)}
                        >
                          View process
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageSection>

      {/* Process detail side panel */}
      <Sheet open={processOpen} onOpenChange={setProcessOpen}>
        <SheetContent side="right" size="xl" className="flex flex-col p-0">
          {selectedPageant && processView && (
            <>
              <SheetHeader className="relative pr-12">
                <SheetCloseButton />
                <SheetTitle>
                    {selectedPageant.name}
                    {processView.editionName ? (
                      <span className="ml-2 text-xs font-normal text-slate-600/90">
                        · {processView.editionName}
                      </span>
                    ) : null}
                </SheetTitle>
                <SheetDescription>
                  Read-only view of the configured process. Parsed from seed data.
                </SheetDescription>
              </SheetHeader>

              <SheetBody className="text-sm text-slate-700">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Eligibility */}
                    <section className="space-y-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Eligibility
                      </h3>
                      <dl className="space-y-1.5">
                        <div>
                          <dt className="text-[10px] uppercase tracking-wide text-slate-500">
                            Age range
                          </dt>
                          <dd className="text-slate-700">
                            {processView.ageRange
                              ? `${processView.ageRange.min ?? "?"}–${
                                  processView.ageRange.max ?? "?"
                                } years`
                              : "Not specified"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] uppercase tracking-wide text-slate-500">
                            Guardian consent
                          </dt>
                          <dd className="text-slate-700">
                            {processView.requiresGuardianConsent
                              ? "Required for minors"
                              : "Not required / not specified"}
                          </dd>
                        </div>
                        {!!processView.categories.length && (
                          <div>
                            <dt className="text-[10px] uppercase tracking-wide text-slate-500">
                              Categories
                            </dt>
                            <dd className="text-slate-700">
                              {processView.categories.join(", ")}
                            </dd>
                          </div>
                        )}
                      </dl>

                      {!!processView.eligibility.length && (
                        <div className="mt-2 rounded-lg border border-slate-200/70 bg-slate-100/70 px-2.5 py-2">
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            Core eligibility rules
                          </p>
                          <ul className="space-y-0.5 text-[11px] text-slate-800">
                            {processView.eligibility.map((rule) => (
                              <li
                                key={rule}
                                className="flex items-start gap-1.5"
                              >
                                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-blue-400/90" />
                                <span>{rule}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </section>

                    {/* Fees & payments */}
                    <section className="space-y-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Fees & payments
                      </h3>
                      {processView.fees ? (
                        <dl className="space-y-1.5">
                          <div>
                            <dt className="text-[10px] uppercase tracking-wide text-slate-500">
                              Registration fee
                            </dt>
                            <dd className="text-slate-700">
                              {typeof processView.fees.registrationFeeMinor ===
                              "number"
                                ? `${processView.fees.registrationFeeMinor} ${
                                    processView.fees.currency || "INR"
                                  } (minor units)`
                                : "Configured, but amount not specified"}
                            </dd>
                          </div>
                          {processView.fees.refundPolicy && (
                            <div>
                              <dt className="text-[10px] uppercase tracking-wide text-slate-500">
                                Refund policy
                              </dt>
                              <dd className="text-slate-700">
                                {processView.fees.refundPolicy}
                              </dd>
                            </div>
                          )}
                        </dl>
                      ) : (
                        <p className="text-slate-600">
                          No explicit registration fee configured in rules.
                        </p>
                      )}
                    </section>
                  </div>

                  {/* Rounds & scoring */}
                  <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                    <section className="space-y-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Rounds & stages
                      </h3>
                      {processView.rounds.length === 0 ? (
                        <p className="text-[11px] text-slate-600">
                          No rounds defined in rules. The tenant will need to
                          configure these from the pageant builder.
                        </p>
                      ) : (
                        <ol className="mt-1 space-y-1.5 text-[11px] text-slate-800">
                          {processView.rounds.map((round: any, index: number) => (
                            <li
                              key={round.id || `${round.name}-${index}`}
                              className="flex items-start gap-2 rounded-lg border border-slate-200/70 bg-slate-100/70 px-2.5 py-2"
                            >
                              <span className="mt-[1px] text-[10px] font-semibold text-slate-500">
                                {index + 1}.
                              </span>
                              <div className="space-y-0.5">
                                <p className="text-[11px] font-semibold text-slate-800">
                                  {round.name || "Untitled round"}
                                  {round.type && (
                                    <span className="ml-2 rounded-full border border-blue-400/40 bg-blue-500/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-blue-200">
                                      {round.type.toLowerCase()}
                                    </span>
                                  )}
                                </p>
                                {round.description && (
                                  <p className="text-[11px] text-slate-600">
                                    {round.description}
                                  </p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ol>
                      )}
                    </section>

                    <section className="space-y-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Scoring model
                      </h3>
                      {processView.scoringScale ? (
                        <div className="space-y-2">
                          <p className="text-[11px] text-slate-700">
                            Scale: {processView.scoringScale.min} –{" "}
                            {processView.scoringScale.max} (
                            {processView.scoringScale.decimals} decimals)
                          </p>
                          {processView.criteria.length ? (
                            <ul className="space-y-1.5 text-[11px] text-slate-800">
                              {processView.criteria.map((c: any) => (
                                <li
                                  key={c.id || c.name}
                                  className="flex items-start justify-between gap-2 rounded-lg border border-slate-200/70 bg-slate-100/70 px-2.5 py-1.5"
                                >
                                  <div>
                                    <p className="text-[11px] font-semibold text-slate-800">
                                      {c.name || "Unnamed criterion"}
                                    </p>
                                    {c.description && (
                                      <p className="text-[10px] text-slate-600">
                                        {c.description}
                                      </p>
                                    )}
                                  </div>
                                  <p className="text-[10px] font-semibold text-blue-200">
                                    {typeof c.weight === "number"
                                      ? `${c.weight}%`
                                      : "—"}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-[11px] text-slate-600">
                              No criteria defined. At least one criterion should
                              be configured before going live.
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-600">
                          No scoring configuration found in rules.
                        </p>
                      )}
                    </section>
                  </div>
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>

        {/* Bulk delete confirmation */}
        <ConfirmDialog
          open={confirmDeleteOpen}
          onOpenChange={setConfirmDeleteOpen}
          title="Delete selected pageants?"
          description={`This will delete ${selectedRows.length} pageant(s). This action cannot be undone. (UI-only for now, no backend integration)`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={confirmBulkDelete}
        />
    </PageLayout>
  )
}

