"use client"

import { useEffect } from "react"
import Link from "next/link"
import { BarChart3, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchPlatformMetrics } from "@/shared/state/analyticsSlice"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function PlatformAnalyticsPage() {
  const dispatch = useAppDispatch()
  const { platformMetrics, loadingPlatform } = useAppSelector((s) => s.analytics)

  useEffect(() => {
    if (!platformMetrics) dispatch(fetchPlatformMetrics())
  }, [dispatch, platformMetrics])

  const formatCurrency = (n: number) => `₹${(n / 100000).toFixed(1)}L`
  const formatNum = (n: number) => n.toLocaleString()

  return (
    <PageLayout>
      <PageHeader
        title="Platform metrics"
        description="Active tenants, total users, transaction volume, revenue metrics, growth trends. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><BarChart3 className="h-3.5 w-3.5 text-[#0078d4]" />Platform</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/analytics/tenants"><Button variant="outline" size="sm">Tenants</Button></Link>
            <Link href="/analytics/revenue"><Button variant="outline" size="sm">Revenue</Button></Link>
            <Link href="/analytics/reports"><Button variant="outline" size="sm">Reports</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Active tenants</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingPlatform ? "—" : formatNum(platformMetrics?.activeTenants ?? 0)}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total users</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingPlatform ? "—" : formatNum(platformMetrics?.totalUsers ?? 0)}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Transaction volume</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingPlatform ? "—" : formatNum(platformMetrics?.transactionVolume ?? 0)}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Revenue total</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loadingPlatform ? "—" : formatCurrency(platformMetrics?.revenueTotal ?? 0)}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Tenant growth</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#107c10]">{loadingPlatform ? "—" : `${platformMetrics?.growthTenants ?? 0}%`}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Revenue growth</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#107c10]">{loadingPlatform ? "—" : `${platformMetrics?.growthRevenue ?? 0}%`}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Growth trends">
        <Card><CardContent className="py-8 text-center text-sm text-[#605e5c]">Trend charts (tenant growth, revenue growth over time) will use GET /v1/superadmin/analytics/platform. Chart placeholders.</CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
