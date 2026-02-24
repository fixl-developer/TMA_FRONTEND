"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileStack, Boxes, Workflow, LayoutDashboard } from "lucide-react"
import type { TemplateId } from "@/shared/lib/types/templates"
import { getTemplateById } from "@/shared/services/templateService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function TemplatePreviewPage() {
  const params = useParams<{ id: string }>()
  const templateId = params?.id?.toUpperCase() as TemplateId | undefined
  const [template, setTemplate] = useState<Awaited<ReturnType<typeof getTemplateById>>>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!templateId) return
    setLoading(true)
    getTemplateById(templateId)
      .then(setTemplate)
      .finally(() => setLoading(false))
  }, [templateId])

  if (!templateId) {
    return (
      <PageLayout>
        <PageHeader title="Preview" description="Invalid template id." />
        <Button asChild variant="outline" size="sm"><Link href="/templates">Back to catalog</Link></Button>
      </PageLayout>
    )
  }

  if (loading || !template) {
    return (
      <PageLayout>
        <PageHeader title={`Preview ${templateId}`} description="Loading…" />
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title={`Preview: ${template.name}`}
        description="Visual representation of modules, workflows, and dashboards. Full workflow diagrams and sample dashboards in a later iteration."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <FileStack className="h-3.5 w-3.5 text-[#0078d4]" />
            Preview
          </span>
        }
        actions={
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href={`/templates/${templateId}`}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Details
            </Link>
          </Button>
        }
      />

      <PageSection title="Module layout">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Boxes className="h-4 w-4 text-[#0078d4]" />
              Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {template.defaultModules.map((m, i) => (
                <div
                  key={m}
                  className="rounded border border-[#edebe9] bg-[#faf9f8] px-4 py-3 text-sm"
                >
                  {i + 1}. {m}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Workflow flow">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Workflow className="h-4 w-4 text-[#0078d4]" />
              Default workflows
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {template.defaultWorkflows.map((w) => (
              <div
                key={w}
                className="flex items-center gap-2 rounded border border-[#c7e0f4] bg-[#f3f9fd] px-4 py-2 text-sm"
              >
                <span className="text-[#0078d4]">→</span> {w}
              </div>
            ))}
          </CardContent>
        </Card>
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
              {template.defaultDashboards.map((d) => (
                <span
                  key={d}
                  className="rounded border border-[#edebe9] bg-[#f3f2f1] px-3 py-1.5 text-sm"
                >
                  {d}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
