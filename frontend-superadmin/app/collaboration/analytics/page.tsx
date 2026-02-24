"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3 } from "lucide-react"
import type { CollaborationAnalytics } from "@/shared/lib/types/collaboration"
import { getCollaborationAnalytics } from "@/shared/services/collaborationService"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { formatCurrency } from "@/shared/lib/utils"

export default function CollaborationAnalyticsPage() {
  const [analytics, setAnalytics] = useState<CollaborationAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { getCollaborationAnalytics().then(setAnalytics).finally(() => setLoading(false)) }, [])

  return (
    <PageLayout>
      <PageHeader
        title="Collaboration metrics"
        description="Collaboration volume, success rates, revenue generated, tenant participation. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><BarChart3 className="h-3.5 w-3.5 text-[#0078d4]" />Analytics</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/collaboration/rooms"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Rooms</Link></Button>}
      />
      <PageSection title="Performance">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Period</CardTitle></CardHeader><CardContent><p className="text-lg font-semibold text-[#323130]">{loading ? "—" : analytics?.period ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total rooms</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : analytics?.totalRooms ?? 0}</p><p className="mt-1 text-xs text-[#605e5c]">Active: {analytics?.activeRooms ?? 0}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Requests</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#0078d4]">{loading ? "—" : analytics?.totalRequests ?? 0}</p><p className="mt-1 text-xs text-[#605e5c]">Approved: {analytics?.approvedRequests ?? 0} · Rejection rate: {analytics?.rejectionRatePercent ?? 0}%</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total revenue</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#107c10]">{loading ? "—" : analytics ? formatCurrency(analytics.totalRevenueMinor, "INR") : "—"}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Participation">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Tenant participation</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#0078d4]">{loading ? "—" : analytics?.tenantParticipationCount ?? 0}</p><p className="mt-1 text-xs text-[#605e5c]">Unique tenants</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Avg room duration</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : analytics?.avgRoomDurationDays != null ? `${analytics.avgRoomDurationDays} days` : "—"}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Trends">
        <Card><CardContent className="py-8 text-center text-sm text-[#605e5c]">Chart placeholders: connect to GET /v1/superadmin/collaboration/analytics for time-series data (collaboration volume, success rates, revenue trends).</CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
