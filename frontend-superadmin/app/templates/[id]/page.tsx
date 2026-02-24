"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileStack, Users2, Boxes, Workflow, LayoutDashboard } from "lucide-react"
import type { TenantTemplate, TemplateId } from "@/shared/lib/types/templates"
import type { Tenant } from "@/shared/lib/types/tenants"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchTemplates } from "@/shared/state/templatesSlice"
import { getTemplateById } from "@/shared/services/templateService"
import { getTemplateTenants } from "@/shared/services/templateService"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

interface TemplateTenantsState {
  tenants: Tenant[]
  loading: boolean
}

export default function TemplateDetailPage() {
  const params = useParams<{ id: string }>()
  const templateId = params?.id?.toUpperCase() as TemplateId | undefined

  const dispatch = useAppDispatch()
  const { items, loading: listLoading } = useAppSelector((s) => s.templates)

  const [template, setTemplate] = useState<TenantTemplate | undefined>(undefined)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | undefined>(undefined)
  const [tenantState, setTenantState] = useState<TemplateTenantsState>({
    tenants: [],
    loading: false,
  })

  useEffect(() => {
    if (!items || items.length === 0) {
      dispatch(fetchTemplates())
    }
  }, [dispatch, items.length])

  useEffect(() => {
    const fromStore = items.find((t) => t.id === templateId)
    if (fromStore) {
      setTemplate(fromStore)
    } else if (templateId) {
      setDetailLoading(true)
      setDetailError(undefined)
      getTemplateById(templateId)
        .then(setTemplate)
        .catch(() => setDetailError("Failed to load template"))
        .finally(() => setDetailLoading(false))
    }
  }, [items, templateId])

  useEffect(() => {
    if (!templateId) return
    setTenantState((prev) => ({ ...prev, loading: true }))
    getTemplateTenants(templateId)
      .then((summary) => setTenantState({ tenants: summary.tenants, loading: false }))
      .catch(() => setTenantState({ tenants: [], loading: false }))
  }, [templateId])

  const isLoading = listLoading || detailLoading

  if (!templateId) {
    return (
      <PageLayout>
        <PageHeader title="Template not found" description="Invalid template id in URL." />
        <PageSection>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/templates">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to catalog
            </Link>
          </Button>
        </PageSection>
      </PageLayout>
    )
  }

  if (!template && !isLoading) {
    return (
      <PageLayout>
        <PageHeader
          title={`Template ${templateId}`}
          description={detailError || "This template is not in the current seed data."}
        />
        <PageSection>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/templates">
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
        title={template?.name ?? `Template ${templateId}`}
        description={
          template?.description ??
          "Tenant template details. Seed data only – API integration later."
        }
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <FileStack className="h-3.5 w-3.5 text-[#0078d4]" />
            {templateId}
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href="/templates">
                <ArrowLeft className="h-3.5 w-3.5" />
                Catalog
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href={`/templates/${templateId}/preview`}>
                Preview
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href="/templates/apply">
                <Users2 className="h-3.5 w-3.5" />
                Apply to tenant
              </Link>
            </Button>
          </div>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Template code</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold font-mono text-[#323130]">{template?.code}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Use case: {template?.useCase}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pricing tier</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-[#0078d4]">
                {template?.pricingTierRecommendation ?? "—"}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">Recommended for this template.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tenant adoption</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">
                {template?.tenantCount ?? "—"}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">Tenants using this template (seed).</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Included blueprints">
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              {template?.includedBlueprints?.length ? (
                template.includedBlueprints.map((b) => (
                  <Link key={b} href={`/blueprints/${b}`}>
                    <span className="inline-flex rounded border border-[#0078d4] bg-[#deecf9] px-3 py-1.5 text-sm font-mono text-[#0078d4] hover:bg-[#c7e0f9]">
                      {b}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-[#605e5c]">No blueprints defined in seed.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Default modules & workflows">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Boxes className="h-4 w-4 text-[#0078d4]" />
                Default modules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs">
              {template?.defaultModules?.length ? (
                template.defaultModules.map((m) => (
                  <div
                    key={m}
                    className="rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2"
                  >
                    {m}
                  </div>
                ))
              ) : (
                <p className="text-[#605e5c]">No modules in seed.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Workflow className="h-4 w-4 text-[#0078d4]" />
                Default workflows
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs">
              {template?.defaultWorkflows?.length ? (
                template.defaultWorkflows.map((w) => (
                  <div
                    key={w}
                    className="rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2"
                  >
                    {w}
                  </div>
                ))
              ) : (
                <p className="text-[#605e5c]">No workflows in seed.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title="Default dashboards">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <LayoutDashboard className="h-4 w-4 text-[#0078d4]" />
              Dashboards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {template?.defaultDashboards?.length ? (
                template.defaultDashboards.map((d) => (
                  <span
                    key={d}
                    className="rounded border border-[#edebe9] bg-[#f3f2f1] px-3 py-1.5 text-sm"
                  >
                    {d}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[#605e5c]">No dashboards in seed.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Tenants using this template (seed)">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm">
              <span>Tenants matching {template?.name ?? templateId}</span>
              <Button asChild size="sm" variant="outline" className="h-7 px-2 text-[11px] gap-1.5">
                <Link href="/tenants">
                  <Users2 className="h-3.5 w-3.5" />
                  All tenants
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {tenantState.loading ? (
              <p className="text-[#605e5c]">Loading tenants…</p>
            ) : tenantState.tenants.length === 0 ? (
              <p className="text-[#605e5c]">
                No tenants match this template in the current seed (tenants must have all of this
                template’s blueprints).
              </p>
            ) : (
              <ul className="space-y-1.5">
                {tenantState.tenants.slice(0, 10).map((t) => (
                  <li
                    key={t._id}
                    className="flex items-center justify-between rounded border border-[#edebe9] bg-white px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-[#323130]">{t.name}</p>
                      <p className="text-[11px] text-[#605e5c]">
                        {t.type} · <span className="font-mono">{t.slug}</span>
                      </p>
                    </div>
                    <Link href={`/tenants`}>
                      <Button size="sm" variant="ghost" className="h-7 text-[10px]">
                        View
                      </Button>
                    </Link>
                  </li>
                ))}
                {tenantState.tenants.length > 10 && (
                  <p className="text-[11px] text-[#605e5c]">
                    +{tenantState.tenants.length - 10} more tenants
                  </p>
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
