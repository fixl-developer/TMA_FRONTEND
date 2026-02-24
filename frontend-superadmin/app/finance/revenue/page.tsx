"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import revenueAnalytics from "@/data/seed/revenueAnalytics.json"

export default function RevenueDashboard() {
  const analytics = revenueAnalytics

  return (
    <PageLayout>
      <PageHeader
        title="Revenue Analytics"
        subtitle="Revenue forecasting, churn analysis, LTV, and subscription metrics"
      />

      <PageSection>
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Recurring Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#107c10] sm:text-3xl">
                ${analytics.overview.mrr.toLocaleString('en-IN')}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-[#107c10]" />
                <span className="text-xs text-[#107c10]">+{analytics.overview.mrrGrowth}%</span>
                <span className="text-xs text-[#605e5c]">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Annual Recurring Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#0078d4] sm:text-3xl">
                ${analytics.overview.arr.toLocaleString('en-IN')}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-[#107c10]" />
                <span className="text-xs text-[#107c10]">+{analytics.overview.arrGrowth}%</span>
                <span className="text-xs text-[#605e5c]">vs last year</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Lifetime Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#323130] sm:text-3xl">
                ${analytics.overview.avgLTV.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-[#605e5c] mt-1">Average per customer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Churn Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#ffb900] sm:text-3xl">
                {analytics.overview.churnRate}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-[#107c10]" />
                <span className="text-xs text-[#107c10]">-{analytics.overview.churnImprovement}%</span>
                <span className="text-xs text-[#605e5c]">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Forecast (Next 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.forecast.map((month: any) => (
                <div key={month.month} className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] hover:bg-[#f3f2f1] transition-colors px-4 py-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#323130]">{month.month}</p>
                    <p className="text-xs text-[#605e5c]">{month.confidence}% confidence</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#323130]">${month.projected.toLocaleString('en-US')}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-[#107c10]" />
                      <span className="text-xs font-semibold text-[#107c10]">+{month.growth}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Blueprint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.byBlueprint.map((blueprint: any) => (
                <div key={blueprint.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#605e5c]">{blueprint.name}</span>
                    <span className="text-sm font-semibold text-[#323130]">${blueprint.revenue.toLocaleString('en-US')}</span>
                  </div>
                  <div className="w-full h-2 bg-[#edebe9] rounded overflow-hidden">
                    <div 
                      className="h-full bg-[#0078d4] rounded transition-all"
                      style={{ width: `${blueprint.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#605e5c]">
                    <span>{blueprint.tenants} tenants</span>
                    <span>{blueprint.percentage}% of total</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Churn Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded border border-[#edebe9] bg-[#faf9f8] px-4 py-3">
                  <p className="text-xs text-[#605e5c]">Monthly Churn</p>
                  <p className="text-xl font-bold text-[#323130] mt-1">{analytics.churn.monthly}%</p>
                </div>
                <div className="rounded border border-[#edebe9] bg-[#faf9f8] px-4 py-3">
                  <p className="text-xs text-[#605e5c]">Annual Churn</p>
                  <p className="text-xl font-bold text-[#323130] mt-1">{analytics.churn.annual}%</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#323130]">Churn Reasons</p>
                {analytics.churn.reasons.map((reason: any) => (
                  <div key={reason.reason} className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] hover:bg-[#f3f2f1] transition-colors px-3 py-2">
                    <span className="text-sm text-[#323130]">{reason.reason}</span>
                    <Badge className="bg-[#fde7e9] text-[#a80000] border-[#a80000]">
                      {reason.count} tenants
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded border border-[#edebe9] bg-[#faf9f8] px-4 py-3">
                  <p className="text-xs text-[#605e5c]">Active Subscriptions</p>
                  <p className="text-xl font-bold text-[#323130] mt-1">{analytics.subscriptions.active}</p>
                </div>
                <div className="rounded border border-[#edebe9] bg-[#faf9f8] px-4 py-3">
                  <p className="text-xs text-[#605e5c]">Trial Conversions</p>
                  <p className="text-xl font-bold text-[#323130] mt-1">{analytics.subscriptions.trialConversion}%</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#323130]">Plan Distribution</p>
                {analytics.subscriptions.byPlan.map((plan: any) => (
                  <div key={plan.plan} className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] hover:bg-[#f3f2f1] transition-colors px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-[#323130]">{plan.plan}</p>
                      <p className="text-xs text-[#605e5c]">{plan.subscribers} subscribers</p>
                    </div>
                    <span className="text-sm font-semibold text-[#323130]">${plan.mrr.toLocaleString('en-IN')}/mo</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <PageSection title="LTV Analysis">
        <Card>
          <CardHeader>
            <CardTitle>Customer Lifetime Value by Segment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#edebe9]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#605e5c]">Segment</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[#605e5c]">Avg LTV</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[#605e5c]">Avg Lifespan</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[#605e5c]">CAC</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[#605e5c]">LTV:CAC Ratio</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[#605e5c]">Customers</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.ltv.bySegment.map((segment: any, idx: number) => (
                    <tr key={segment.segment} className={`border-b border-[#edebe9] transition-colors ${idx % 2 === 0 ? 'bg-white hover:bg-[#f3f2f1]' : 'bg-[#faf9f8] hover:bg-[#f3f2f1]'}`}>
                      <td className="py-3 px-4 text-sm text-[#323130] font-medium">{segment.segment}</td>
                      <td className="py-3 px-4 text-sm text-[#323130] text-right font-semibold">${segment.avgLTV.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-sm text-[#605e5c] text-right">{segment.avgLifespan} months</td>
                      <td className="py-3 px-4 text-sm text-[#605e5c] text-right">${segment.cac.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge className={segment.ltvCacRatio >= 3 ? "bg-[#dff6dd] text-[#107c10] border-[#107c10]" : "bg-[#fff4ce] text-[#797673] border-[#797673]"}>
                          {segment.ltvCacRatio}:1
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#605e5c] text-right">{segment.customers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
