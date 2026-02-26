/**
 * Blueprint Configuration Page - Super Admin
 * 
 * Configure blueprint settings:
 * - Module toggles
 * - Workflow customization
 * - Role assignments
 * - Permission overrides
 * - Dashboard selection
 * - KPI target adjustments
 */

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Settings,
  Package,
  Users,
  BarChart3,
  Target,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import {
  getBlueprint,
  type Blueprint,
  type BlueprintId
} from "@/shared/services/blueprintService"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/toast"

type ConfigSection = "modules" | "workflows" | "roles" | "dashboards" | "kpis"

export default function BlueprintConfigurePage() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const blueprintId = params.id as BlueprintId

  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<ConfigSection>("modules")

  // Configuration state
  const [enabledModules, setEnabledModules] = useState<Set<string>>(new Set())
  const [enabledRoles, setEnabledRoles] = useState<Set<string>>(new Set())
  const [enabledDashboards, setEnabledDashboards] = useState<Set<string>>(new Set())
  const [kpiOverrides, setKpiOverrides] = useState<Record<string, string>>({})

  useEffect(() => {
    const load = async () => {
      try {
        const blueprintData = await getBlueprint(blueprintId)
        if (blueprintData) {
          setBlueprint(blueprintData)
          // Initialize enabled states
          setEnabledModules(new Set(blueprintData.defaultModules))
          setEnabledRoles(new Set(blueprintData.defaultRoles))
          setEnabledDashboards(new Set(blueprintData.defaultDashboards))
        }
      } catch (e) {
        console.error("Failed to load blueprint", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [blueprintId])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000))
      showToast("Configuration saved successfully", "success")
    } catch (e) {
      showToast("Failed to save configuration", "error")
    } finally {
      setSaving(false)
    }
  }

  const toggleModule = (module: string) => {
    setEnabledModules(prev => {
      const next = new Set(prev)
      if (next.has(module)) {
        next.delete(module)
      } else {
        next.add(module)
      }
      return next
    })
  }

  const toggleRole = (role: string) => {
    setEnabledRoles(prev => {
      const next = new Set(prev)
      if (next.has(role)) {
        next.delete(role)
      } else {
        next.add(role)
      }
      return next
    })
  }

  const toggleDashboard = (dashboard: string) => {
    setEnabledDashboards(prev => {
      const next = new Set(prev)
      if (next.has(dashboard)) {
        next.delete(dashboard)
      } else {
        next.add(dashboard)
      }
      return next
    })
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Loading configuration...</p>
        </div>
      </PageLayout>
    )
  }

  if (!blueprint) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-500">Blueprint not found</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => router.push("/superadmin/blueprints/catalog")}
          >
            Back to Catalog
          </Button>
        </div>
      </PageLayout>
    )
  }

  const sections: { id: ConfigSection; label: string; icon: any }[] = [
    { id: "modules", label: "Modules", icon: Package },
    { id: "workflows", label: "Workflows", icon: Settings },
    { id: "roles", label: "Roles", icon: Users },
    { id: "dashboards", label: "Dashboards", icon: BarChart3 },
    { id: "kpis", label: "KPI Targets", icon: Target }
  ]

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/superadmin/blueprints/${blueprintId}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span>Configure {blueprint.name}</span>
          </div>
        }
        description="Customize blueprint settings, modules, roles, and KPI targets"
        actions={
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-1.5 h-4 w-4" />
            {saving ? "Saving..." : "Save Configuration"}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-sm">Configuration Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 p-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                    activeSection === section.id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Content */}
        <div className="space-y-6">
          {activeSection === "modules" && (
            <Card>
              <CardHeader>
                <CardTitle>Module Configuration</CardTitle>
                <p className="text-sm text-slate-500">
                  Enable or disable modules for this blueprint
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {blueprint.defaultModules.map((module) => (
                  <div
                    key={module}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded bg-blue-100 p-2">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{module}</p>
                        <p className="text-xs text-slate-500">Core module</p>
                      </div>
                    </div>
                    <Switch
                      checked={enabledModules.has(module)}
                      onCheckedChange={() => toggleModule(module)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === "workflows" && (
            <Card>
              <CardHeader>
                <CardTitle>Workflow Configuration</CardTitle>
                <p className="text-sm text-slate-500">
                  Key workflows for this blueprint
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {blueprint.keyWorkflows.map((workflow, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{workflow}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Workflow {i + 1} of {blueprint.keyWorkflows.length}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === "roles" && (
            <Card>
              <CardHeader>
                <CardTitle>Role Configuration</CardTitle>
                <p className="text-sm text-slate-500">
                  Enable or disable default roles
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {blueprint.defaultRoles.map((role) => (
                  <div
                    key={role}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded bg-emerald-100 p-2">
                        <Users className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{role}</p>
                        <p className="text-xs text-slate-500">Default role</p>
                      </div>
                    </div>
                    <Switch
                      checked={enabledRoles.has(role)}
                      onCheckedChange={() => toggleRole(role)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === "dashboards" && (
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Configuration</CardTitle>
                <p className="text-sm text-slate-500">
                  Enable or disable default dashboards
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {blueprint.defaultDashboards.map((dashboard) => (
                  <div
                    key={dashboard}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded bg-purple-100 p-2">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{dashboard}</p>
                        <p className="text-xs text-slate-500">Default dashboard</p>
                      </div>
                    </div>
                    <Switch
                      checked={enabledDashboards.has(dashboard)}
                      onCheckedChange={() => toggleDashboard(dashboard)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === "kpis" && (
            <div className="space-y-6">
              {/* Timing KPIs */}
              <Card>
                <CardHeader>
                  <CardTitle>Timing Targets</CardTitle>
                  <p className="text-sm text-slate-500">
                    Adjust timing KPI targets for this blueprint
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(blueprint.kpiTargets.timing).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`timing-${key}`} className="text-sm text-slate-700">
                        {key}
                      </Label>
                      <Input
                        id={`timing-${key}`}
                        defaultValue={value}
                        onChange={(e) =>
                          setKpiOverrides((prev) => ({
                            ...prev,
                            [`timing-${key}`]: e.target.value
                          }))
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Cash KPIs */}
              <Card>
                <CardHeader>
                  <CardTitle>Cash Targets</CardTitle>
                  <p className="text-sm text-slate-500">
                    Adjust cash KPI targets for this blueprint
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(blueprint.kpiTargets.cash).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`cash-${key}`} className="text-sm text-slate-700">
                        {key}
                      </Label>
                      <Input
                        id={`cash-${key}`}
                        defaultValue={value}
                        onChange={(e) =>
                          setKpiOverrides((prev) => ({
                            ...prev,
                            [`cash-${key}`]: e.target.value
                          }))
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quality KPIs */}
              <Card>
                <CardHeader>
                  <CardTitle>Quality Targets</CardTitle>
                  <p className="text-sm text-slate-500">
                    Adjust quality KPI targets for this blueprint
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(blueprint.kpiTargets.quality).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`quality-${key}`} className="text-sm text-slate-700">
                        {key}
                      </Label>
                      <Input
                        id={`quality-${key}`}
                        defaultValue={value}
                        onChange={(e) =>
                          setKpiOverrides((prev) => ({
                            ...prev,
                            [`quality-${key}`]: e.target.value
                          }))
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
