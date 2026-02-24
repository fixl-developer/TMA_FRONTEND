"use client"

import { useEffect, useMemo, useState } from "react"
import { FileStack, ArrowRight, LayoutTemplate } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchTemplates, setSelectedTemplate } from "@/shared/state/templatesSlice"
import type { TenantTemplate } from "@/shared/lib/types/templates"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import Link from "next/link"

export default function TemplatesCatalogPage() {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((s) => s.templates)
  const [searchQuery, setSearchQuery] = useState("")
  const [useCaseFilter, setUseCaseFilter] = useState<string[]>([])

  useEffect(() => {
    if (!items || items.length === 0) {
      dispatch(fetchTemplates())
    }
  }, [dispatch, items.length])

  const useCaseOptions: FilterOption[] = useMemo(() => {
    const set = new Set<string>()
    items.forEach((t) => set.add(t.useCase))
    return Array.from(set).sort().map((c) => ({ value: c, label: c }))
  }, [items])

  const filtered = useMemo(() => {
    let result = items
    if (useCaseFilter.length > 0) {
      result = result.filter((t) => useCaseFilter.includes(t.useCase))
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.useCase.toLowerCase().includes(q)
      )
    }
    return result
  }, [items, useCaseFilter, searchQuery])

  const metrics = useMemo(() => {
    const total = items.length
    const totalTenants = items.reduce((acc, t) => acc + (t.tenantCount || 0), 0)
    return { total, totalTenants }
  }, [items])

  const handleViewDetails = (t: TenantTemplate) => {
    dispatch(setSelectedTemplate(t.id))
  }

  return (
    <PageLayout>
      <PageHeader
        title="Tenant templates"
        description="T1–T8 preset configurations (blueprints + modules + workflows). Use case descriptions and tenant counts. Seed data only – API later."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <FileStack className="h-3.5 w-3.5 text-[#0078d4]" />
            Templates
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/templates/compare">
              <Button variant="outline" size="sm" className="gap-1.5">
                Compare templates
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/templates/apply">
              <Button size="sm" className="gap-1.5">
                Apply to tenant
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/blueprints/catalog">
              <Button variant="outline" size="sm" className="gap-1.5">
                Blueprints
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
              <CardTitle>Total templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {loading ? "—" : metrics.total}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                T1–T8 presets for different agency types.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tenant adoption (seed)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">
                {loading ? "—" : metrics.totalTenants}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Sum of tenant counts per template.
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection
        title="Templates"
        description={
          filtered.length !== items.length
            ? `${filtered.length} of ${items.length} shown`
            : undefined
        }
      >
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by name, code, description or use case..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={
              useCaseOptions.length
                ? [
                    {
                      key: "useCase",
                      label: "Use case",
                      options: useCaseOptions,
                      selected: useCaseFilter,
                      onSelectionChange: setUseCaseFilter,
                    },
                  ]
                : []
            }
            onClearAll={() => {
              setSearchQuery("")
              setUseCaseFilter([])
            }}
          />

          <div className="rounded border border-[#edebe9] bg-white p-3">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-sm text-[#605e5c]">
                Loading template catalog from seed…
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-[#605e5c]">
                <p className="text-sm font-medium">No templates match this filter.</p>
                <p className="max-w-md text-xs">
                  Adjust filters or{" "}
                  <code className="rounded bg-[#f3f2f1] px-1.5 py-0.5 text-[11px]">
                    data/seed/templates.json
                  </code>
                  .
                </p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 text-xs text-[#323130]">
                {filtered.map((t) => (
                  <article
                    key={t.id}
                    className="flex flex-col justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2.5 hover:bg-[#f3f2f1] transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[#323130]">{t.name}</p>
                          <p className="mt-0.5 text-[11px] text-[#605e5c]">
                            Code <span className="font-mono text-[#323130]">{t.code}</span> · {t.useCase}
                          </p>
                        </div>
                        <span className="rounded border border-[#0078d4] bg-[#deecf9] px-2 py-0.5 text-[10px] font-semibold text-[#0078d4]">
                          {t.pricingTierRecommendation}
                        </span>
                      </div>
                      <p className="line-clamp-3 text-[11px] text-[#605e5c]">
                        {t.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {t.includedBlueprints.slice(0, 4).map((b) => (
                          <span
                            key={b}
                            className="rounded bg-[#f3f2f1] px-1.5 py-0.5 text-[10px] font-mono text-[#605e5c]"
                          >
                            {b}
                          </span>
                        ))}
                        {t.includedBlueprints.length > 4 && (
                          <span className="text-[10px] text-[#605e5c]">
                            +{t.includedBlueprints.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-[#605e5c]">
                      <span>
                        Tenants: <span className="font-semibold text-[#0078d4]">{t.tenantCount}</span>
                      </span>
                      <div className="flex gap-1.5">
                        <Link href={`/templates/${t.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-[10px] text-[#0078d4] hover:bg-[#f3f2f1]"
                            onClick={() => handleViewDetails(t)}
                          >
                            Details
                          </Button>
                        </Link>
                        <Link href={`/templates/${t.id}/preview`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-[10px] text-[#605e5c] hover:bg-[#f3f2f1]"
                          >
                            Preview
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
