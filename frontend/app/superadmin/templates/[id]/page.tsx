/**
 * Template Detail Page - Super Admin
 * 
 * View detailed information about a specific template including:
 * - Overview and description
 * - Included blueprints
 * - Default roles & dashboards
 * - KPI targets
 * - Tenants using this template
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
  Target,
  Layers,
  Eye,
  Edit
} from "lucide-react"
import {
  getTemplate,
  getTenantsUsingTemplate,
  getTemplateAnalytics,
  type Template,
  type TemplateId
} from "@/shared/services/templateService"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"

type TabId = "overview" | "blueprints" | "roles" | "kpis" | "tenants" | "analytics"

export default function TemplateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.id as TemplateId

  const [template, setTemplate] = useState<Template | null>(null)
  const [tenants, setTenants] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>("overview")

  useEffect(() => {
    const load = async () => {
      try {
        const [templateData, tenantsData, analyticsData] = await Promise.all([
          getTemplate(templateId),
          getTenantsUsingTemplate(templateId),
          getTemplateAnalytics(templateId)
        ])
        setTemplate(templateData)
        setTenants(tenantsData)
        setAnalytics(analyticsData)
      } catch (e) {
        console.error("Failed to load template", e)
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
          <p className="text-slate-500">Loading template...</p>
        </div>
      </PageLayout>
    )
  }

  if (!template) {
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

  const getComplexityBadge = (complexity: string) => {
    const map: Record<string, string> = {
      SIMPLE: "bg-emerald-100 text-emerald-700 border-emerald-200",
      MODERATE: "bg-blue-100 text-blue-700 border-blue-200",
      COMPLEX: "bg-amber-100 text-amber-700 border-amber-200"
    }
    return map[complexity] || "bg-slate-100 text-slate-600 border-slate-200"
  }

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: Package },
    { id: "blueprints", label: "Blueprints", icon: Layers },
    { id: "roles", label: "Roles & Dashboards", icon: Users },
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
              onClick={() => router.push("/superadmin/templates")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="font-mono text-sm font-semibold text-slate-600">
              {template.id}
            </span>
            <span>{template.name}</span>
          </div>
        }
        description={template.description}
        badge={
          <Badge className={getComplexityBadge(template.complexity)}>
            {template.complexity}
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/superadmin/templates/${template.id}/preview`)}
            >
              <Eye className="mr-1.5 h-4 w-4" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/superadmin/templates/${template.id}/customize`)}
            >
              <Edit className="mr-1.5 h-4 w-4" />
              Customize
            </Button>
            <Button size="sm" onClick={() => router.push("/superadmin/templates/apply")}>
              Apply to Tenant
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
              <p className="text-3xl font-bold text-slate-900">{template.tenantCount}</p>
              <p className="mt-1 text-xs text-emerald-600">
                {analytics?.monthlyGrowth > 0 ? "+" : ""}{analytics?.monthlyGrowth}% this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{template.successRate}%</p>
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
              <p className="text-3xl font-bold text-slate-900">{template.setupTime}</p>
              <p className="mt-1 text-xs text-slate-500">Average onboarding</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                Monthly Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">{template.monthlyRevenue}</p>
              <p className="mt-1 text-xs text-slate-500">Avg per tenant</p>
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
                    ? "border-b-2 border-purple-500 text-purple-600"
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
                {template.usedBy.map((type, i) => (
                  <Badge key={i} variant="outline" className="bg-slate-50">
                    {type}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Core Workflow */}
          <Card>
            <CardHeader>
              <CardTitle>Core Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="font-mono text-sm text-slate-700">{template.coreWorkflow}</p>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {template.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                    <p className="text-sm text-slate-700">{feature}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "blueprints" && (
        <Card>
          <CardHeader>
            <CardTitle>Included Blueprints</CardTitle>
            <p className="text-sm text-slate-500">
              Blueprints automatically enabled when this template is applied
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {template.blueprints.map((blueprintId) => (
                <div
                  key={blueprintId}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 cursor-pointer hover:border-purple-300"
                  onClick={() => router.push(`/superadmin/blueprints/${blueprintId}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded bg-purple-100 p-2">
                      <Layers className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{blueprintId}</p>
                      <p className="text-xs text-slate-500">Click to view details</p>
                    </div>
                  </div>
                  <ArrowLeft className="h-4 w-4 rotate-180 text-slate-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "roles" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Roles</CardTitle>
              <p className="text-sm text-slate-500">
                Roles automatically created when this template is applied
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {template.defaultRoles.map((role, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="rounded bg-emerald-100 p-2">
                      <Users className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="font-medium text-slate-700">{role}</span>
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
                {template.defaultDashboards.map((dashboard, i) => (
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
                {Object.entries(template.kpiTargets.timing).map(([key, value]) => (
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
          {Object.keys(template.kpiTargets.cash).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                  Cash Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(template.kpiTargets.cash).map(([key, value]) => (
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
          )}

          {/* Quality KPIs */}
          {Object.keys(template.kpiTargets.quality).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  Quality Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(template.kpiTargets.quality).map(([key, value]) => (
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
          )}
        </div>
      )}

      {activeTab === "tenants" && (
        <Card>
          <CardHeader>
            <CardTitle>Tenants Using This Template</CardTitle>
            <p className="text-sm text-slate-500">
              {tenants.length} tenants currently using {template.name}
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
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Setup</th>
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
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            tenant.setupCompleted
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                          }
                        >
                          {tenant.setupCompleted ? "Complete" : "In Progress"}
                        </Badge>
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600">Avg KPI Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">{analytics?.avgKpiScore}%</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${analytics?.avgKpiScore}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">{analytics?.completionRate}%</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${analytics?.completionRate}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600">Retention Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">{analytics?.retentionRate}%</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{ width: `${analytics?.retentionRate}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Use Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics?.topUseCases.map((useCase: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-600">
                      {i + 1}
                    </div>
                    <span className="text-sm text-slate-700">{useCase}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  )
}
