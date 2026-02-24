/**
 * CLM Analytics - Super Admin
 *
 * Analytics and insights for contract lifecycle management.
 */

"use client"

import { useEffect, useState } from "react"
import { BarChart3, TrendingUp, DollarSign, FileText } from "lucide-react"
import clmData from "@/data/seed/clm.json"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { formatCurrency } from "@/shared/lib/utils"
import { RechartsBar } from "@/shared/components/charts/RechartsBar"
import { RechartsPie } from "@/shared/components/charts/RechartsPie"

export default function CLMAnalytics() {
  const [loading, setLoading] = useState(true)
  const analytics = clmData.analytics

  useEffect(() => {
    setLoading(false)
  }, [])

  const contractsByStatus = Object.entries(analytics.contractsByStatus).map(([status, count]) => ({
    label: status.replace(/_/g, " "),
    value: count as number,
  }))

  const contractsByCategory = Object.entries(analytics.contractsByCategory).map(([category, count]) => ({
    label: category.replace(/_/g, " "),
    value: count as number,
  }))

  const templateUsage = clmData.contractTemplates
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 6)
    .map(t => ({
      label: t.name.slice(0, 20),
      value: t.usageCount,
    }))

  return (
    <PageLayout>
      <PageHeader
        title="CLM Analytics"
        description="Analytics and insights for contract lifecycle management across the platform."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <BarChart3 className="h-3.5 w-3.5 text-blue-500" />
            Analytics
          </span>
        }
      />

      <PageSection title="Key metrics">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Total contract value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-emerald-600">
                {loading ? "—" : formatCurrency(analytics.totalContractValue * 100, "INR")}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Combined value of all active contracts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average contract value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-blue-600">
                {loading ? "—" : formatCurrency(analytics.averageContractValue * 100, "INR")}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Mean value per contract
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Renewal rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-amber-600">
                {loading ? "—" : `${(analytics.renewalRate * 100).toFixed(0)}%`}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Contracts successfully renewed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Compliance rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-800">
                {loading ? "—" : `${(analytics.complianceRate * 100).toFixed(0)}%`}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Contracts meeting compliance standards
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Contract distribution">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contracts by status</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-slate-500">Loading…</p>
              ) : (
                <>
                  <RechartsPie data={contractsByStatus} />
                  <div className="mt-4 space-y-2">
                    {contractsByStatus.map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{item.label}</span>
                        <span className="font-medium text-slate-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contracts by category</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-slate-500">Loading…</p>
              ) : (
                <>
                  <RechartsPie data={contractsByCategory} />
                  <div className="mt-4 space-y-2">
                    {contractsByCategory.map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{item.label}</span>
                        <span className="font-medium text-slate-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title="Template usage">
        <Card>
          <CardHeader>
            <CardTitle>Most used templates</CardTitle>
            <p className="text-sm text-slate-500">
              Top contract templates by usage count
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-slate-500">Loading…</p>
            ) : (
              <>
                <RechartsBar data={templateUsage} />
                <div className="mt-4 space-y-2">
                  {clmData.contractTemplates
                    .sort((a, b) => b.usageCount - a.usageCount)
                    .slice(0, 8)
                    .map((template) => (
                      <div
                        key={template._id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{template.name}</p>
                          <p className="text-xs text-slate-500">
                            {template.category.replace(/_/g, " ")} · {template.blueprintType}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-800">{template.usageCount}</p>
                          <p className="text-xs text-slate-500">uses</p>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Performance indicators">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-sm">Renewal performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-semibold text-slate-800">
                    {(analytics.renewalRate * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-slate-500">Overall renewal rate</p>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Upcoming (30 days)</span>
                    <span className="font-medium text-slate-800">{analytics.upcomingRenewals30Days}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Upcoming (90 days)</span>
                    <span className="font-medium text-slate-800">{analytics.upcomingRenewals90Days}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Upcoming (180 days)</span>
                    <span className="font-medium text-slate-800">{analytics.upcomingRenewals180Days}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-sm">Value metrics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-semibold text-slate-800">
                    {formatCurrency(analytics.averageContractValue * 100, "INR")}
                  </p>
                  <p className="text-xs text-slate-500">Average contract value</p>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total value</span>
                    <span className="font-medium text-slate-800">
                      {formatCurrency(analytics.totalContractValue * 100, "INR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Active contracts</span>
                    <span className="font-medium text-slate-800">{analytics.totalActiveContracts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Avg duration</span>
                    <span className="font-medium text-slate-800">{analytics.averageContractDuration} days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-sm">Template metrics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-semibold text-slate-800">
                    {clmData.contractTemplates.length}
                  </p>
                  <p className="text-xs text-slate-500">Total templates</p>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Active templates</span>
                    <span className="font-medium text-slate-800">
                      {clmData.contractTemplates.filter(t => t.status === "ACTIVE").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total usage</span>
                    <span className="font-medium text-slate-800">
                      {clmData.contractTemplates.reduce((sum, t) => sum + t.usageCount, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Avg usage per template</span>
                    <span className="font-medium text-slate-800">
                      {Math.round(clmData.contractTemplates.reduce((sum, t) => sum + t.usageCount, 0) / clmData.contractTemplates.length)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
