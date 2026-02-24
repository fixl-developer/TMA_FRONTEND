"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, GitCompare } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchTemplates } from "@/shared/state/templatesSlice"
import type { TenantTemplate } from "@/shared/lib/types/templates"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function TemplatesComparePage() {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((s) => s.templates)

  useEffect(() => {
    if (!items?.length) dispatch(fetchTemplates())
  }, [dispatch, items?.length])

  return (
    <PageLayout>
      <PageHeader
        title="Compare templates"
        description="Side-by-side feature matrix for T1–T8. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <GitCompare className="h-3.5 w-3.5 text-[#0078d4]" />
            Compare
          </span>
        }
        actions={
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/templates">
              <ArrowLeft className="h-3.5 w-3.5" />
              Catalog
            </Link>
          </Button>
        }
      />

      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle>Template comparison</CardTitle>
            <p className="text-sm text-[#605e5c]">
              {items.length} templates. Rows: sample features (modules/dashboards). Full feature matrix and pricing comparison coming in a later iteration.
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-[#605e5c]">Loading templates…</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#edebe9] bg-[#faf9f8]">
                      <th className="px-3 py-2 font-semibold text-[#323130]">Feature / Template</th>
                      {items.map((t) => (
                        <th key={t.id} className="px-3 py-2 font-semibold text-[#323130]">
                          {t.name} ({t.code})
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#edebe9]">
                      <td className="px-3 py-2 text-[#605e5c]">Use case</td>
                      {items.map((t) => (
                        <td key={t.id} className="px-3 py-2">{t.useCase}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-[#edebe9]">
                      <td className="px-3 py-2 text-[#605e5c]">Blueprints</td>
                      {items.map((t) => (
                        <td key={t.id} className="px-3 py-2">
                          <span className="font-mono text-xs">{t.includedBlueprints.join(", ")}</span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-[#edebe9]">
                      <td className="px-3 py-2 text-[#605e5c]">Pricing tier</td>
                      {items.map((t) => (
                        <td key={t.id} className="px-3 py-2">{t.pricingTierRecommendation}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-[#edebe9]">
                      <td className="px-3 py-2 text-[#605e5c]">Tenant count</td>
                      {items.map((t) => (
                        <td key={t.id} className="px-3 py-2">{t.tenantCount}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
