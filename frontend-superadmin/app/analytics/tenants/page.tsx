"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Users, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchTenantAnalytics } from "@/shared/state/analyticsSlice"
import type { TenantAnalytics } from "@/shared/lib/types/analytics"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { format } from "date-fns"

export default function TenantAnalyticsPage() {
  const dispatch = useAppDispatch()
  const { tenantAnalytics, loadingTenants } = useAppSelector((s) => s.analytics)
  const [churnFilter, setChurnFilter] = useState<string>("")

  useEffect(() => {
    if (!tenantAnalytics.length) dispatch(fetchTenantAnalytics())
  }, [dispatch, tenantAnalytics.length])

  const filtered = useMemo(() => {
    if (!churnFilter) return tenantAnalytics
    return tenantAnalytics.filter((t) => t.churnRisk === churnFilter)
  }, [tenantAnalytics, churnFilter])

  const metrics = useMemo(() => {
    const totalRevenue = tenantAnalytics.reduce((s, t) => s + t.revenue, 0)
    const highRisk = tenantAnalytics.filter((t) => t.churnRisk === "high").length
    const avgHealth = tenantAnalytics.length ? tenantAnalytics.reduce((s, t) => s + t.healthScore, 0) / tenantAnalytics.length : 0
    return { tenants: tenantAnalytics.length, totalRevenue, highRisk, avgHealth }
  }, [tenantAnalytics])

  const columns: Column<TenantAnalytics>[] = useMemo(
    () => [
      { key: "name", header: "Tenant", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
      { key: "blueprint", header: "Blueprint", render: (v) => <span className="text-sm font-mono">{String(v)}</span> },
      { key: "revenue", header: "Revenue", render: (v) => <span>₹{Number(v).toLocaleString()}</span> },
      { key: "healthScore", header: "Health", render: (v) => <span className={Number(v) >= 85 ? "text-[#107c10]" : Number(v) >= 70 ? "text-[#ff8c00]" : "text-[#a80000]"}>{Number(v)}</span> },
      { key: "churnRisk", header: "Churn risk", render: (v) => <span className={`rounded border px-2 py-0.5 text-xs ${String(v) === "low" ? "border-[#107c10] bg-[#dff6dd]" : String(v) === "medium" ? "border-[#ff8c00] bg-[#fff4ce]" : "border-[#a80000] bg-[#fde7e9]"}`}>{String(v)}</span> },
      { key: "usersCount", header: "Users", render: (v) => <span>{Number(v)}</span> },
      { key: "transactionCount", header: "Transactions", render: (v) => <span>{Number(v).toLocaleString()}</span> },
      { key: "lastActivity", header: "Last activity", render: (v) => <span className="text-xs text-[#605e5c]">{v ? format(new Date(v as string), "PP") : "—"}</span> },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Tenant comparison"
        description="Tenant performance, usage metrics, revenue per tenant, health scores, churn risk. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Users className="h-3.5 w-3.5 text-[#0078d4]" />Tenants</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/analytics/platform"><Button variant="outline" size="sm">Platform</Button></Link>
            <Link href="/analytics/revenue"><Button variant="outline" size="sm">Revenue</Button></Link>
            <Link href="/analytics/reports"><Button variant="outline" size="sm">Reports</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Tenants</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingTenants ? "—" : metrics.tenants}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total revenue</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#107c10]">{loadingTenants ? "—" : `₹${(metrics.totalRevenue / 100000).toFixed(1)}L`}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>High churn risk</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#a80000]">{loadingTenants ? "—" : metrics.highRisk}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Avg health score</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{loadingTenants ? "—" : metrics.avgHealth.toFixed(1)}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Tenants">
        <div className="mb-3">
          <select value={churnFilter} onChange={(e) => setChurnFilter(e.target.value)} className="rounded border border-[#edebe9] px-3 py-1.5 text-sm">
            <option value="">All churn risk</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <Card><CardContent className="p-0">
          {loadingTenants ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={filtered} columns={columns} pageSize={10} exportable exportFileName="tenant-analytics" emptyMessage="No tenants match the filter." />}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
