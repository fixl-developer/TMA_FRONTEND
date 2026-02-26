/**
 * Template Analytics Page - Super Admin
 * 
 * Comprehensive analytics across all templates:
 * - Usage trends
 * - Success rates
 * - Revenue impact
 * - Adoption patterns
 * - Performance metrics
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  BarChart3,
  Clock,
  CheckCircle
} from "lucide-react"
import {
  getTemplates,
  getTemplateStatsAsync
} from "@/shared/services/templateService"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { RechartsBar } from "@/shared/components/charts/RechartsBar"
import { RechartsLine } from "@/shared/components/charts/RechartsLine"

export default function TemplateAnalyticsPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [templatesData, statsData] = await Promise.all([
          getTemplates(),
          getTemplateStatsAsync()
        ])
        setTemplates(templatesData)
        setStats(statsData)
      } catch (e) {
        console.error("Failed to load analytics", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Prepare chart data
  const tenantDistribution = templates.map(t => ({
    name: t.id,
    value: t.tenantCount
  }))

  const successRates = templates.map(t => ({
    name: t.id,
    rate: t.successRate
  }))

  const revenueData = templates.map(t => ({
    name: t.id,
    revenue: parseInt(t.monthlyRevenue.replace(/[₹K,]/g, ""))
  }))

  // Mock trend data
  const trendData = [
    { month: "Jan", T1: 22, T2: 10, T3: 10, T4: 6, T5: 5, T6: 3, T7: 5, T8: 3 },
    { month: "Feb", T1: 24, T2: 11, T3: 11, T4: 7, T5: 5, T6: 3, T7: 5, T8: 3 },
    { month: "Mar", T1: 26, T2: 11, T3: 11, T4: 7, T5: 6, T6: 4, T7: 6, T8: 4 },
    { month: "Apr", T1: 28, T2: 12, T3: 12, T4: 8, T5: 6, T6: 4, T7: 6, T8: 4 }
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
            <span>Template Analytics</span>
          </div>
        }
        description="Comprehensive analytics and insights across all templates"
      />

      {/* Overview Stats */}
      <PageSection>
        <MetricsGrid>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                Total Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {loading ? "—" : stats?.total || 0}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {stats?.simple || 0} simple, {stats?.moderate || 0} moderate, {stats?.complex || 0} complex
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="h-4 w-4 text-emerald-500" />
                Total Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {loading ? "—" : stats?.totalTenants || 0}
              </p>
              <p className="mt-1 text-xs text-emerald-600">
                +12% this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Avg Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {loading ? "—" : `${stats?.avgSuccessRate || 0}%`}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Tenant satisfaction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">
                {loading ? "—" : "₹1.3M"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Monthly across all templates
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      {/* Tenant Distribution */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle>Tenant Distribution by Template</CardTitle>
            <p className="text-sm text-slate-500">
              Number of active tenants using each template
            </p>
          </CardHeader>
          <CardContent>
            <RechartsBar
              data={tenantDistribution}
              xKey="name"
              yKey="value"
              color="#8b5cf6"
              height={300}
            />
          </CardContent>
        </Card>
      </PageSection>

      {/* Success Rates */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle>Success Rates by Template</CardTitle>
            <p className="text-sm text-slate-500">
              Tenant satisfaction and success metrics
            </p>
          </CardHeader>
          <CardContent>
            <RechartsBar
              data={successRates}
              xKey="name"
              yKey="rate"
              color="#10b981"
              height={300}
            />
          </CardContent>
        </Card>
      </PageSection>

      {/* Revenue Impact */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue by Template</CardTitle>
            <p className="text-sm text-slate-500">
              Average monthly revenue per tenant
            </p>
          </CardHeader>
          <CardContent>
            <RechartsBar
              data={revenueData}
              xKey="name"
              yKey="revenue"
              color="#059669"
              height={300}
            />
          </CardContent>
        </Card>
      </PageSection>

      {/* Growth Trends */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle>Template Adoption Trends</CardTitle>
            <p className="text-sm text-slate-500">
              Tenant growth over the last 4 months
            </p>
          </CardHeader>
          <CardContent>
            <RechartsLine
              data={trendData}
              xKey="month"
              lines={[
                { key: "T1", color: "#3b82f6", name: "T1" },
                { key: "T2", color: "#8b5cf6", name: "T2" },
                { key: "T3", color: "#f59e0b", name: "T3" },
                { key: "T4", color: "#ec4899", name: "T4" }
              ]}
              height={300}
            />
          </CardContent>
        </Card>
      </PageSection>

      {/* Template Rankings */}
      <PageSection>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Most Popular Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates
                  .sort((a, b) => b.tenantCount - a.tenantCount)
                  .slice(0, 5)
                  .map((template, i) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{template.name}</p>
                          <p className="text-xs text-slate-500">{template.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">{template.tenantCount}</p>
                        <p className="text-xs text-slate-500">tenants</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                Highest Success Rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates
                  .sort((a, b) => b.successRate - a.successRate)
                  .slice(0, 5)
                  .map((template, i) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-600">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{template.name}</p>
                          <p className="text-xs text-slate-500">{template.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-600">{template.successRate}%</p>
                        <p className="text-xs text-slate-500">success</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Complexity Distribution */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle>Templates by Complexity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-700">SIMPLE</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-900">
                      {templates.filter(t => t.complexity === "SIMPLE").length}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="mt-2 text-xs text-emerald-600">
                  {templates.filter(t => t.complexity === "SIMPLE").reduce((sum, t) => sum + t.tenantCount, 0)} tenants
                </p>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">MODERATE</p>
                    <p className="mt-1 text-2xl font-bold text-blue-900">
                      {templates.filter(t => t.complexity === "MODERATE").length}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
                <p className="mt-2 text-xs text-blue-600">
                  {templates.filter(t => t.complexity === "MODERATE").reduce((sum, t) => sum + t.tenantCount, 0)} tenants
                </p>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-700">COMPLEX</p>
                    <p className="mt-1 text-2xl font-bold text-amber-900">
                      {templates.filter(t => t.complexity === "COMPLEX").length}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-amber-500" />
                </div>
                <p className="mt-2 text-xs text-amber-600">
                  {templates.filter(t => t.complexity === "COMPLEX").reduce((sum, t) => sum + t.tenantCount, 0)} tenants
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
