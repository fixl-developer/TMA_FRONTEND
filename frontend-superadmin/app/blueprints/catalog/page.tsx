"use client"

import { useEffect, useMemo, useState } from "react"
import { Layers, Filter, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchBlueprints, setSelectedBlueprint } from "@/shared/state/blueprintsSlice"
import type { Blueprint, BlueprintStatus } from "@/shared/lib/types/blueprints"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import Link from "next/link"

type StatusFilter = "ALL" | BlueprintStatus

export default function BlueprintCatalogPage() {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((s) => s.blueprints)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])

  useEffect(() => {
    if (!items || items.length === 0) {
      dispatch(fetchBlueprints())
    }
  }, [dispatch, items.length])

  const categories: FilterOption[] = useMemo(() => {
    const set = new Set<string>()
    items.forEach((b) => set.add(b.category))
    return Array.from(set).map((c) => ({ value: c, label: c }))
  }, [items])

  const filtered = useMemo(() => {
    let result = items
    if (statusFilter !== "ALL") {
      result = result.filter((b) => b.status === statusFilter)
    }
    if (categoryFilter.length > 0) {
      result = result.filter((b) => categoryFilter.includes(b.category))
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.code.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      )
    }
    return result
  }, [items, statusFilter, categoryFilter, searchQuery])

  const metrics = useMemo(() => {
    const total = items.length
    const active = items.filter((b) => b.status === "ACTIVE").length
    const draft = items.filter((b) => b.status === "DRAFT").length
    const deprecated = items.filter((b) => b.status === "DEPRECATED").length
    const totalTenants = items.reduce((acc, b) => acc + (b.stats.tenantCount || 0), 0)
    return { total, active, draft, deprecated, totalTenants }
  }, [items])

  const handleViewDetails = (b: Blueprint) => {
    dispatch(setSelectedBlueprint(b.id))
  }

  return (
    <PageLayout>
      <PageHeader
        title="Blueprint catalog"
        description="B1–B10 blueprint packages with modules, default workflows and tenant adoption. Seed data only – API integration later."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Layers className="h-3.5 w-3.5 text-[#0078d4]" />
            Blueprints
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/blueprints/assign">
              <Button size="sm" className="gap-1.5">
                Assign to tenants
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/tenants">
              <Button variant="outline" size="sm" className="gap-1.5">
                View tenants
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Total blueprints</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {loading ? "—" : metrics.total}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                B1–B10 packages available on the platform.
              </p>
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
              <p className="mt-1 text-xs text-[#605e5c]">
                Ready for assignment to tenants.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Draft / Deprecated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#ffb900]">
                {loading ? "—" : metrics.draft + metrics.deprecated}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                In design, review or sunset.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tenant installations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">
                {loading ? "—" : metrics.totalTenants}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Sum of blueprint ↔ tenant relationships (from seed).
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection
        title="Blueprints"
        description={
          filtered.length !== items.length
            ? `${filtered.length} of ${items.length} shown`
            : undefined
        }
      >
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by name, code or description..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={
              categories.length
                ? [
                    {
                      key: "category",
                      label: "Category",
                      options: categories,
                      selected: categoryFilter,
                      onSelectionChange: setCategoryFilter,
                    },
                  ]
                : []
            }
            onClearAll={() => {
              setSearchQuery("")
              setCategoryFilter([])
              setStatusFilter("ALL")
            }}
            extraToolbar={
              <div className="flex items-center gap-2 text-xs text-[#605e5c]">
                <Filter className="h-3.5 w-3.5" />
                <span>Status:</span>
                {([
                  { key: "ALL", label: "All" },
                  { key: "ACTIVE", label: "Active" },
                  { key: "DRAFT", label: "Draft" },
                  { key: "DEPRECATED", label: "Deprecated" },
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
            }
          />

          <div className="rounded border border-[#edebe9] bg-white p-3">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-sm text-[#605e5c]">
                Loading blueprint catalog from seed…
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-[#605e5c]">
                <p className="text-sm font-medium">No blueprints match this filter.</p>
                <p className="max-w-md text-xs">
                  Adjust{" "}
                  <code className="rounded bg-[#f3f2f1] px-1.5 py-0.5 text-[11px]">
                    data/seed/blueprints.json
                  </code>{" "}
                  to model additional packages or statuses.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 text-xs text-[#323130]">
                {filtered.map((b) => (
                  <article
                    key={b.id}
                    className="flex flex-col justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2.5 hover:bg-[#f3f2f1] transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[#323130]">
                            {b.name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#605e5c]">
                            Code{" "}
                            <span className="font-mono text-[#323130]">{b.code}</span> ·{" "}
                            {b.category}
                          </p>
                        </div>
                        <span
                          className={
                            b.status === "ACTIVE"
                              ? "rounded border border-[#107c10] bg-[#dff6dd] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#107c10]"
                              : b.status === "DRAFT"
                              ? "rounded border border-[#0078d4] bg-[#deecf9] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0078d4]"
                              : "rounded border border-[#ffb900] bg-[#fff4ce] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#797673]"
                          }
                        >
                          {b.status.toLowerCase()}
                        </span>
                      </div>
                      <p className="line-clamp-3 text-[11px] text-[#605e5c]">
                        {b.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {b.modules.slice(0, 3).map((m) => (
                          <span
                            key={m}
                            className="rounded bg-[#f3f2f1] px-1.5 py-0.5 text-[10px] text-[#605e5c]"
                          >
                            {m}
                          </span>
                        ))}
                        {b.modules.length > 3 && (
                          <span className="text-[10px] text-[#605e5c]">
                            +{b.modules.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-[#605e5c]">
                      <div className="flex flex-wrap gap-3">
                        <span>
                          Tenants:{" "}
                          <span className="font-semibold text-[#0078d4]">
                            {b.stats.tenantCount}
                          </span>
                        </span>
                        <span>
                          Active instances:{" "}
                          <span className="font-semibold text-[#0078d4]">
                            {b.stats.activeInstances}
                          </span>
                        </span>
                        {typeof b.stats.avgWesScore === "number" && (
                          <span>
                            Avg WES:{" "}
                            <span className="font-semibold text-[#107c10]">
                              {b.stats.avgWesScore}
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        <Link href={`/blueprints/${b.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-[10px] text-[#0078d4] hover:bg-[#f3f2f1]"
                            onClick={() => handleViewDetails(b)}
                          >
                            Details
                          </Button>
                        </Link>
                        <Link href={`/blueprints/${b.id}/tenants`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-[10px] text-[#605e5c] hover:bg-[#f3f2f1]"
                          >
                            Tenants
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageSection>
    </PageLayout>
  )
}

