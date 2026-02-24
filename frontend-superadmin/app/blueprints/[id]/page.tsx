"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Layers, Users2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchBlueprints } from "@/shared/state/blueprintsSlice"
import type { Blueprint, BlueprintId } from "@/shared/lib/types/blueprints"
import type { Tenant } from "@/shared/lib/types/tenants"
import { getBlueprintById, getBlueprintTenants } from "@/shared/services/blueprintService"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

interface BlueprintTenantsState {
  tenants: Tenant[]
  loading: boolean
}

export default function BlueprintDetailPage() {
  const params = useParams<{ id: string }>()
  const blueprintId = params?.id?.toUpperCase() as BlueprintId | undefined

  const dispatch = useAppDispatch()
  const { items, loading: listLoading } = useAppSelector((s) => s.blueprints)

  const [blueprint, setBlueprint] = useState<Blueprint | undefined>(undefined)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | undefined>(undefined)
  const [tenantState, setTenantState] = useState<BlueprintTenantsState>({
    tenants: [],
    loading: false,
  })

  useEffect(() => {
    if (!items || items.length === 0) {
      dispatch(fetchBlueprints())
    }
  }, [dispatch, items.length])

  useEffect(() => {
    if (!blueprintId) return

    const fromStore = items.find((b) => b.id === blueprintId)
    if (fromStore) {
      setBlueprint(fromStore)
    } else {
      setDetailLoading(true)
      setDetailError(undefined)
      getBlueprintById(blueprintId)
        .then((bp) => {
          setBlueprint(bp)
        })
        .catch(() => {
          setDetailError("Failed to load blueprint")
        })
        .finally(() => {
          setDetailLoading(false)
        })
    }
  }, [items, blueprintId])

  useEffect(() => {
    if (!blueprintId) return
    setTenantState((prev) => ({ ...prev, loading: true }))
    getBlueprintTenants(blueprintId)
      .then((summary) => {
        setTenantState({ tenants: summary.tenants, loading: false })
      })
      .catch(() => {
        setTenantState({ tenants: [], loading: false })
      })
  }, [blueprintId])

  const isLoading = listLoading || detailLoading

  const tenantTypeCounts = useMemo(() => {
    return tenantState.tenants.reduce<Record<string, number>>((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1
      return acc
    }, {})
  }, [tenantState.tenants])

  if (!blueprintId) {
    return (
      <PageLayout>
        <PageHeader title="Blueprint not found" description="Invalid blueprint id in URL." />
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

  if (!blueprint && !isLoading) {
    return (
      <PageLayout>
        <PageHeader
          title={`Blueprint ${blueprintId}`}
          description={detailError || "This blueprint is not present in the current seed data."}
        />
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
        title={blueprint?.name || `Blueprint ${blueprintId}`}
        description={
          blueprint?.description ||
          "Blueprint details powered by seed data. API-backed configuration will be wired later."
        }
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Layers className="h-3.5 w-3.5 text-[#0078d4]" />
            {blueprintId}
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href="/blueprints/catalog">
                <ArrowLeft className="h-3.5 w-3.5" />
                Catalog
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href={`/blueprints/${blueprintId}/tenants`}>
                <Users2 className="h-3.5 w-3.5" />
                View tenants
              </Link>
            </Button>
          </div>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Blueprint code</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                <span className="font-mono">{blueprint?.code}</span>
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Category: {blueprint?.category ?? "—"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                <span
                  className={
                    blueprint?.status === "ACTIVE"
                      ? "rounded border border-[#107c10] bg-[#dff6dd] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#107c10]"
                      : blueprint?.status === "DRAFT"
                      ? "rounded border border-[#0078d4] bg-[#deecf9] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#0078d4]"
                      : "rounded border border-[#ffb900] bg-[#fff4ce] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#797673]"
                  }
                >
                  {blueprint?.status.toLowerCase()}
                </span>
              </p>
              <p className="mt-2 text-xs text-[#605e5c]">
                Seed-only status; lifecycle will be driven by backend policies later.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tenant adoption</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">
                {blueprint?.stats.tenantCount ?? "—"}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Tenants using this blueprint in the current seed.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active instances</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">
                {blueprint?.stats.activeInstances ?? "—"}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Combined active workflows / entities across tenants (seed approximation).
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Modules & workflows">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Included modules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs text-[#323130]">
              {blueprint?.modules.map((m) => (
                <div
                  key={m}
                  className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-1.5"
                >
                  <span>{m}</span>
                </div>
              )) || <p className="text-[#605e5c]">No modules defined in seed.</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Default workflows</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs text-[#323130]">
              {blueprint?.defaultWorkflows.map((w) => (
                <div
                  key={w}
                  className="rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-1.5"
                >
                  {w}
                </div>
              )) || <p className="text-[#605e5c]">No workflows defined in seed.</p>}
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title="Roles & capabilities">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Primary roles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs text-[#323130]">
              {blueprint?.primaryRoles.map((r) => (
                <div
                  key={r}
                  className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-1.5"
                >
                  <span>{r}</span>
                </div>
              )) || <p className="text-[#605e5c]">No roles defined in seed.</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Key capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs text-[#323130]">
              {blueprint?.capabilities.map((c) => (
                <code
                  key={c}
                  className="block rounded border border-[#edebe9] bg-[#f3f2f1] px-2 py-1 text-[11px]"
                >
                  {c}
                </code>
              )) || <p className="text-[#605e5c]">No capabilities defined in seed.</p>}
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title="Tenant usage (seed)">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm">
              <span>Tenants using {blueprint?.name ?? blueprintId}</span>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-7 px-2 text-[11px] gap-1.5"
              >
                <Link href={`/blueprints/${blueprintId}/tenants`}>
                  <Users2 className="h-3.5 w-3.5" />
                  Open tenants view
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-[#323130]">
            {tenantState.loading ? (
              <p className="text-[#605e5c]">Loading tenant usage from seed…</p>
            ) : tenantState.tenants.length === 0 ? (
              <p className="text-[#605e5c]">
                No tenants use this blueprint in the current seed. Adjust{" "}
                <code className="rounded bg-[#f3f2f1] px-1.5 py-0.5 text-[11px]">
                  data/seed/tenants.json
                </code>{" "}
                to link tenants to {blueprintId}.
              </p>
            ) : (
              <>
                <div className="grid gap-3 md:grid-cols-3">
                  {Object.entries(tenantTypeCounts).map(([type, count]) => (
                    <div
                      key={type}
                      className="rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2"
                    >
                      <p className="text-[11px] text-[#605e5c]">Type</p>
                      <p className="text-sm font-semibold text-[#323130]">{type}</p>
                      <p className="mt-0.5 text-[11px] text-[#605e5c]">
                        {count} tenant{count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  {tenantState.tenants.slice(0, 5).map((t) => (
                    <div
                      key={t._id}
                      className="flex items-center justify-between rounded border border-[#edebe9] bg-white px-3 py-1.5"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#323130]">
                          {t.name}
                        </p>
                        <p className="text-[11px] text-[#605e5c]">
                          {t.type.toLowerCase()} ·{" "}
                          <span className="font-mono">{t.slug}</span>
                        </p>
                      </div>
                      <span className="text-[10px] uppercase tracking-wide text-[#605e5c]">
                        {t.status.toLowerCase()}
                      </span>
                    </div>
                  ))}
                  {tenantState.tenants.length > 5 && (
                    <p className="text-[11px] text-[#605e5c]">
                      +{tenantState.tenants.length - 5} more tenants…
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

