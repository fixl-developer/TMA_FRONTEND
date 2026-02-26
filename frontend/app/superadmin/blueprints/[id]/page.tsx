/**
 * Blueprint Detail Page - Super Admin
 * 
 * View detailed information about a specific blueprint including:
 * - Overview and description
 * - Key workflows
 * - Default modules
 * - Default roles & permissions
 * - Default dashboards
 * - KPI targets
 * - Dependencies
 * - Tenants using this blueprint
 * - Analytics
 */

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Package,
  Users,
  Settings,
  BarChart3,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Clock,
  DollarSign,
  Target
} from "lucide-react"
import {
  getBlueprint,
  getTenantsUsingBlueprint,
  getBlueprintAnalytics,
  getBlueprintHealth,
  type Blueprint,
  type BlueprintId
} from "@/shared/services/blueprintService"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { RechartsBar } from "@/shared/components/charts/RechartsBar"

type TabId = "overview" | "modules" | "roles" | "kpis" | "tenants" | "analytics"

export default function BlueprintDetailPage() {
  const params = useParams()
  const router = useRouter()
  const blueprintId = params.id as BlueprintId

  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [tenants, setTenants] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>("overview")

  useEffect(() => {
    const load = async () => {
      try {
        const [blueprintData, tenantsData, analyticsData, healthData] = await Promise.all([
          getBlueprint(blueprintId),
          getTenantsUsingBlueprint(blueprintId),
          getBlueprintAnalytics(blueprintId),
          getBlueprintHealth(blueprintId)
        ])
        setBlueprint(blueprintData)
        setTenants(tenantsData)
        setAnalytics(analyticsData)
        setHealth(healthData)
      } catch (e) {
        console.error("Failed to load blueprint", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [blueprintId])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Loading blueprint...</p>
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

  const getCategoryBadge = (category: string) => {
    const map: Record<string, string> = {
      CORE: "bg-blue-100 text-blue-700 border-blue-200",
      SPECIALIZED: "bg-purple-100 text-purple-700 border-purple-200",
      ADVANCED: "bg-amber-100 text-amber-700 border-amber-200"
    }
    return map[category] || "bg-slate-100 text-slate-600 border-slate-200"
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
      BETA: "bg-amber-100 text-amber-700 border-amber-200",
      DEPRECATED: "bg-slate-100 text-slate-600 border-slate-200"
    }
    return map[status] || "bg-slate-100 text-slate-600 border-slate-200"
  }

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: Package },
    { id: "modules", label: "Modules & Workflows", icon: Settings },
    { id: "roles", label: "Roles & Permissions", icon: Users },
    { id: "kpis", label: "KPI Targets", icon: Target },
    { id: "tenants", label: "Tenants", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 }
  ]

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/superadmin/blueprints/catalog")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="font-mono text-sm font-semibold text-slate-600">
              {blueprint.id}
            </span>
            <span>{blueprint.name}</span>
          </div>
        }
        description={blueprint.description}
        badge={
          <div className="flex items-center gap-2">
            <Badge className={getCategoryBadge(blueprint.category)}>
              {blueprint.category}
            </Badge>
            <Badge className={getStatusBadge(blueprint.status)}>
              {blueprint.status}
            </Badge>
            <span className="text-xs text-slate-400">v{blueprint.version}</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="mr-1.5 h-4 w-4" />
              Configure
            </Button>
            <Button size="sm">
              Assign to Tenant
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <PageSection>
        <MetricsGrid>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="h-4 w-4 text-blue-500" />
                Active Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{blueprint.tenantCount}</p>
              <p className="mt-1 text-xs text-emerald-600">
                {analytics?.monthlyGrowth > 0 ? "+" : ""}{analytics?.monthlyGrowth}% this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                Adoption Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{blueprint.adoptionRate}%</p>
              <p className="mt-1 text-xs text-slate-500">Platform-wide</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{analytics?.successRate}%</p>
              <p className="mt-1 text-xs text-slate-500">Tenant satisfaction</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-amber-500" />
                Setup Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{analytics?.avgSetupTime}</p>
              <p className="mt-1 text-xs text-slate-500">Average onboarding</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      {/* Tabs */}
      <div className="mb-6 border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Used By */}
          <Card>
            <CardHeader>
              <CardTitle>Used By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {blueprint.usedBy.map((type, i) => (
                  <Badge key={i} variant="outline" className="bg-slate-50">
                    {type}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Workflows */}
          <Card>
            <CardHeader>
              <CardTitle>Key Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {blueprint.keyWorkflows.map((workflow, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                    <p className="text-sm text-slate-700">{workflow}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dependencies */}
          {blueprint.dependencies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dependencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {blueprint.dependencies.map((depId) => (
                    <Badge
                      key={depId}
                      variant="outline"
                      className="cursor-pointer bg-amber-50 hover:bg-amber-100"
                      onClick={() => router.push(`/superadmin/blueprints/${depId}`)}
                    >
                      {depId}
                    </Badge>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  This blueprint requires the above blueprints to be installed first.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "modules" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Modules</CardTitle>
              <p className="text-sm text-slate-500">
                Modules automatically enabled when this blueprint is assigned
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {blueprint.defaultModules.map((module, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="rounded bg-blue-100 p-2">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{module}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Default Dashboards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {blueprint.defaultDashboards.map((dashboard, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="rounded bg-purple-100 p-2">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{dashboard}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "roles" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Roles</CardTitle>
              <p className="text-sm text-slate-500">
                Roles automatically created when this blueprint is assigned
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {blueprint.defaultRoles.map((role, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded bg-emerald-100 p-2">
                        <Users className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="font-medium text-slate-700">{role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Default Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {blueprint.defaultPermissions.map((permission, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="font-mono text-xs text-slate-600">{permission}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "kpis" && (
        <div className="space-y-6">
          {/* Timing KPIs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Timing Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(blueprint.kpiTargets.timing).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <span className="text-sm text-slate-700">{key}</span>
                    <span className="font-semibold text-blue-600">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cash KPIs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Cash Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(blueprint.kpiTargets.cash).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <span className="text-sm text-slate-700">{key}</span>
                    <span className="font-semibold text-emerald-600">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quality KPIs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Quality Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(blueprint.kpiTargets.quality).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <span className="text-sm text-slate-700">{key}</span>
                    <span className="font-semibold text-purple-600">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "tenants" && (
        <Card>
          <CardHeader>
            <CardTitle>Tenants Using This Blueprint</CardTitle>
            <p className="text-sm text-slate-500">
              {tenants.length} tenants currently using {blueprint.name}
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Tenant</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Plan</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Activated</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => (
                    <tr key={tenant.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{tenant.name}</td>
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            tenant.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }
                        >
                          {tenant.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{tenant.plan}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(tenant.activatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blueprint Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Overall Health</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {health?.overallHealth}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${health?.overallHealth}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(health?.metrics || {}).map(([key, value]) => (
                  <div key={key} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm capitalize text-slate-600">{key}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-800">{value}%</p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-600">
                  {analytics?.revenueImpact}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Average monthly revenue per tenant
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  )
}
