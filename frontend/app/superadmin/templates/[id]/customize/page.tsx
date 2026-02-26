/**
 * Template Customization Page - Super Admin
 * 
 * Customize template configuration before applying to tenant.
 * Allows toggling modules, roles, dashboards, and adjusting KPI targets.
 */

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Layers,
  Users,
  BarChart3,
  Target
} from "lucide-react"
import {
  getTemplate,
  getTemplateCustomizationOptions,
  type Template,
  type TemplateId
} from "@/shared/services/templateService"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import { useToast } from "@/shared/components/ui/toast"

export default function TemplateCustomizePage() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const templateId = params.id as TemplateId

  const [template, setTemplate] = useState<Template | null>(null)
  const [options, setOptions] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)

  // Customization state
  const [enabledModules, setEnabledModules] = useState<Set<string>>(new Set())
  const [enabledRoles, setEnabledRoles] = useState<Set<string>>(new Set())
  const [enabledDashboards, setEnabledDashboards] = useState<Set<string>>(new Set())
  const [kpiAdjustments, setKpiAdjustments] = useState<Record<string, string>>({})

  useEffect(() => {
    const load = async () => {
      try {
        const [templateData, optionsData] = await Promise.all([
          getTemplate(templateId),
          getTemplateCustomizationOptions(templateId)
        ])
        setTemplate(templateData)
        setOptions(optionsData)

        // Initialize with all enabled
        if (templateData) {
          setEnabledModules(new Set(optionsData.customizableModules))
          setEnabledRoles(new Set(optionsData.customizableRoles))
          setEnabledDashboards(new Set(optionsData.customizableDashboards))
        }
      } catch (e) {
        console.error("Failed to load template", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [templateId])

  const toggleModule = (module: string) => {
    const newSet = new Set(enabledModules)
    if (newSet.has(module)) {
      newSet.delete(module)
    } else {
      newSet.add(module)
    }
    setEnabledModules(newSet)
    setHasChanges(true)
  }

  const toggleRole = (role: string) => {
    const newSet = new Set(enabledRoles)
    if (newSet.has(role)) {
      newSet.delete(role)
    } else {
      newSet.add(role)
    }
    setEnabledRoles(newSet)
    setHasChanges(true)
  }

  const toggleDashboard = (dashboard: string) => {
    const newSet = new Set(enabledDashboards)
    if (newSet.has(dashboard)) {
      newSet.delete(dashboard)
    } else {
      newSet.add(dashboard)
    }
    setEnabledDashboards(newSet)
    setHasChanges(true)
  }

  const updateKpi = (kpi: string, value: string) => {
    setKpiAdjustments({ ...kpiAdjustments, [kpi]: value })
    setHasChanges(true)
  }

  const handleReset = () => {
    if (options) {
      setEnabledModules(new Set(options.customizableModules))
      setEnabledRoles(new Set(options.customizableRoles))
      setEnabledDashboards(new Set(options.customizableDashboards))
      setKpiAdjustments({})
      setHasChanges(false)
      showToast("Reset to defaults", "success")
    }
  }

  const handleSave = () => {
    // In real implementation, this would save the customization
    showToast("Customization saved successfully", "success")
    setHasChanges(false)
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Loading customization options...</p>
        </div>
      </PageLayout>
    )
  }

  if (!template || !options) {
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
            <span>Customize: {template.name}</span>
          </div>
        }
        description="Customize template configuration before applying to tenant"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} disabled={!hasChanges}>
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Reset
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
              <Save className="mr-1.5 h-4 w-4" />
              Save Customization
            </Button>
          </div>
        }
      />

      {hasChanges && (
        <PageSection>
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-amber-800">
                You have unsaved changes. Click "Save Customization" to apply them.
              </p>
            </CardContent>
          </Card>
        </PageSection>
      )}

      {/* Modules */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-500" />
              Blueprints / Modules
            </CardTitle>
            <p className="text-sm text-slate-500">
              Toggle blueprints to include in this template
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {options.customizableModules.map((module: string) => (
                <div
                  key={module}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded p-2 ${
                      enabledModules.has(module) ? "bg-purple-100" : "bg-slate-200"
                    }`}>
                      <Layers className={`h-4 w-4 ${
                        enabledModules.has(module) ? "text-purple-600" : "text-slate-400"
                      }`} />
                    </div>
                    <span className={`font-medium ${
                      enabledModules.has(module) ? "text-slate-800" : "text-slate-400"
                    }`}>
                      {module}
                    </span>
                  </div>
                  <Switch
                    checked={enabledModules.has(module)}
                    onCheckedChange={() => toggleModule(module)}
                  />
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
              Toggle roles to include in this template
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {options.customizableRoles.map((role: string) => (
                <div
                  key={role}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-2">
                    <div className={`rounded p-1.5 ${
                      enabledRoles.has(role) ? "bg-emerald-100" : "bg-slate-200"
                    }`}>
                      <Users className={`h-3.5 w-3.5 ${
                        enabledRoles.has(role) ? "text-emerald-600" : "text-slate-400"
                      }`} />
                    </div>
                    <span className={`text-sm font-medium ${
                      enabledRoles.has(role) ? "text-slate-800" : "text-slate-400"
                    }`}>
                      {role}
                    </span>
                  </div>
                  <Switch
                    checked={enabledRoles.has(role)}
                    onCheckedChange={() => toggleRole(role)}
                  />
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
              Toggle dashboards to include in this template
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {options.customizableDashboards.map((dashboard: string) => (
                <div
                  key={dashboard}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-2">
                    <div className={`rounded p-1.5 ${
                      enabledDashboards.has(dashboard) ? "bg-blue-100" : "bg-slate-200"
                    }`}>
                      <BarChart3 className={`h-3.5 w-3.5 ${
                        enabledDashboards.has(dashboard) ? "text-blue-600" : "text-slate-400"
                      }`} />
                    </div>
                    <span className={`text-sm font-medium ${
                      enabledDashboards.has(dashboard) ? "text-slate-800" : "text-slate-400"
                    }`}>
                      {dashboard}
                    </span>
                  </div>
                  <Switch
                    checked={enabledDashboards.has(dashboard)}
                    onCheckedChange={() => toggleDashboard(dashboard)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* KPI Adjustments */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-500" />
              KPI Target Adjustments
            </CardTitle>
            <p className="text-sm text-slate-500">
              Adjust KPI targets for this template (optional)
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {options.customizableKpis.slice(0, 6).map((kpi: string) => (
                <div
                  key={kpi}
                  className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <span className="flex-1 text-sm text-slate-700">{kpi}</span>
                  <Input
                    placeholder="e.g., 24h, ≥70%, ≤5%"
                    value={kpiAdjustments[kpi] || ""}
                    onChange={(e) => updateKpi(kpi, e.target.value)}
                    className="w-40"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Summary */}
      <PageSection>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Customization Summary</h3>
                <div className="mt-2 space-y-1 text-sm text-blue-700">
                  <p>• {enabledModules.size} of {options.customizableModules.length} blueprints enabled</p>
                  <p>• {enabledRoles.size} of {options.customizableRoles.length} roles enabled</p>
                  <p>• {enabledDashboards.size} of {options.customizableDashboards.length} dashboards enabled</p>
                  <p>• {Object.keys(kpiAdjustments).length} KPI adjustments</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
