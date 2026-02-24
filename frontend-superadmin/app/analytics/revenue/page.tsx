"use client"

import { useEffect } from "react"
import Link from "next/link"
import { DollarSign, ArrowLeft } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchRevenueReports, fetchRevenueAnalytics } from "@/shared/state/analyticsSlice"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function RevenueAnalyticsPage() {
  const dispatch = useAppDispatch()
  const { revenueReports, revenueAnalytics, loadingRevenue } = useAppSelector((s) => s.analytics)

  useEffect(() => {
    if (!revenueReports.length) dispatch(fetchRevenueReports())
    if (!revenueAnalytics) dispatch(fetchRevenueAnalytics())
  }, [dispatch, revenueReports.length, revenueAnalytics])

  const formatCurrency = (n: number) => n >= 1000000 ? `₹${(n / 1000000).toFixed(2)}M` : `₹${(n / 1000).toFixed(0)}K`
  const overview = revenueAnalytics?.overview
  const byBlueprint = revenueAnalytics?.byBlueprint ?? []
  const latestReport = revenueReports[0]

  return (
    <PageLayout>
      <PageHeader
        title="Revenue analytics"
        description="Subscription, transaction, commission revenue. Revenue by tenant, trends, forecasting. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><DollarSign className="h-3.5 w-3.5 text-[#0078d4]" />Revenue</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/analytics/platform"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Platform</Link></Button>}
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>MRR</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingRevenue ? "—" : overview ? formatCurrency(overview.mrr) : "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>ARR</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingRevenue ? "—" : overview ? formatCurrency(overview.arr) : "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>MRR growth</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#107c10]">{loadingRevenue ? "—" : overview ? `${overview.mrrGrowth}%` : "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Churn rate</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#605e5c]">{loadingRevenue ? "—" : overview ? `${overview.churnRate}%` : "—"}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      {latestReport && (
        <PageSection title="Latest monthly report">
          <Card><CardContent className="pt-4 space-y-2 text-sm">
            <p><strong>Period:</strong> {latestReport.period}</p>
            <p><strong>Subscription:</strong> {formatCurrency(latestReport.subscriptionRevenue ?? 0)}</p>
            <p><strong>Usage:</strong> {formatCurrency(latestReport.usageRevenue ?? 0)}</p>
            <p><strong>Platform fee:</strong> {formatCurrency(latestReport.platformFeeRevenue ?? 0)}</p>
            <p><strong>Tenants:</strong> {latestReport.tenantCount} | New: {latestReport.newTenants} | Churned: {latestReport.churnedTenants}</p>
          </CardContent></Card>
        </PageSection>
      )}
      <PageSection title="Revenue by blueprint">
        <Card><CardContent className="pt-4">
          {byBlueprint.length === 0 ? <p className="text-sm text-[#605e5c]">No data</p> : (
            <div className="space-y-3">
              {byBlueprint.map((b: any) => (
                <div key={b.name} className="flex items-center justify-between rounded border border-[#edebe9] px-4 py-2">
                  <span className="text-sm font-medium">{b.name}</span>
                  <span className="font-semibold">{formatCurrency(b.revenue)} ({b.percentage}%)</span>
                </div>
              ))}
            </div>
          )}
        </CardContent></Card>
      </PageSection>
      <PageSection title="Forecasting">
        <Card><CardContent className="py-8 text-center text-sm text-[#605e5c]">Revenue forecasting charts. GET /v1/superadmin/analytics/revenue.</CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
