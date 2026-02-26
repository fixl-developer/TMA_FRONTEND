/**
 * Template Preview Page - Super Admin
 * 
 * Interactive preview of what a tenant will get when this template is applied.
 * Shows all modules, roles, dashboards, workflows, and configurations.
 */

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Package,
  Users,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Layers,
  Settings,
  Workflow
} from "lucide-react"
import {
  getTemplate,
  getTemplatePreview,
  type Template,
  type TemplateId
} from "@/shared/services/templateService"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"

export default function TemplatePreviewPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.id as TemplateId

  const [template, setTemplate] = useState<Template | null>(null)
  const [preview, setPreview] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [templateData, previewData] = await Promise.all([
          getTemplate(templateId),
          getTemplatePreview(templateId)
        ])
        setTemplate(templateData)
        setPreview(previewData)
      } catch (e) {
        console.error("Failed to load template preview", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [templateId])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Loading preview...</p>
        </div>
      </PageLayout>
    )
  }

  if (!template || !preview) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-500">Template not found</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => router.push("/superadmin/templates")}
          >
            Back to Catalog
          </Button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/superadmin/templates/${templateId}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span>Preview: {template.name}</span>
          </div>
        }
        description="Interactive preview of what a tenant will receive when this template is applied"
        actions={
          <Button onClick={() => router.push("/superadmin/templates/apply")}>
            Apply to Tenant
          </Button>
        }
      />

      {/* Overview */}
      <PageSection>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="flex items-start gap-4 p-6">
            <div className="rounded-lg bg-purple-100 p-3">
              <Layers className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900">Template Overview</h3>
              <p className="mt-1 text-sm text-purple-700">
                This template includes {preview.blueprints.length} blueprint(s), {preview.roles.length} roles,{" "}
                {preview.dashboards.length} dashboards, and {preview.features.length} features.
                Estimated setup time: {preview.estimatedSetupTime}.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Badge className="bg-purple-200 text-purple-800 border-purple-300">
                  {preview.complexity}
                </Badge>
                <span className="text-xs text-purple-600">
                  Setup: {preview.estimatedSetupTime}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Blueprints */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-500" />
              Included Blueprints
            </CardTitle>
            <p className="text-sm text-slate-500">
              These blueprints will be automatically enabled
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {preview.blueprints.map((blueprintId: string) => (
                <div
                  key={blueprintId}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded bg-purple-100 p-2">
                      <Package className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{blueprintId}</p>
                      <p className="text-xs text-slate-500">Blueprint module</p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Roles */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-500" />
              Default Roles
            </CardTitle>
            <p className="text-sm text-slate-500">
              These roles will be automatically created
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {preview.roles.map((role: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="rounded bg-emerald-100 p-2">
                    <Users className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{role}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Dashboards */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Default Dashboards
            </CardTitle>
            <p className="text-sm text-slate-500">
              These dashboards will be automatically configured
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {preview.dashboards.map((dashboard: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="rounded bg-blue-100 p-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{dashboard}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Workflows */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-amber-500" />
              Core Workflows
            </CardTitle>
            <p className="text-sm text-slate-500">
              Pre-configured workflows for common operations
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {preview.workflows.map((workflow: string, i: number) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-mono text-sm text-slate-700">{workflow}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Features */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-slate-500" />
              Included Features
            </CardTitle>
            <p className="text-sm text-slate-500">
              All features available in this template
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {preview.features.map((feature: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Actions */}
      <PageSection>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-semibold text-blue-900">Ready to apply this template?</h3>
              <p className="mt-1 text-sm text-blue-700">
                Apply this template to a tenant to provision all included features and configurations.
              </p>
            </div>
            <Button onClick={() => router.push("/superadmin/templates/apply")}>
              Apply to Tenant
            </Button>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
