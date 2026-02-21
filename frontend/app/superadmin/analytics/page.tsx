"use client"

import { useState } from "react"
import { BarChart3, Users, TrendingUp, Activity, Globe, Download } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"

const MONTHLY_METRICS = [
  { month: "Sep", tenants: 18, bookings: 312, revenue: 480000, users: 2140 },
  { month: "Oct", tenants: 20, bookings: 358, revenue: 520000, users: 2380 },
  { month: "Nov", tenants: 23, bookings: 421, revenue: 610000, users: 2750 },
  { month: "Dec", tenants: 26, bookings: 503, revenue: 750000, users: 3120 },
  { month: "Jan", tenants: 28, bookings: 476, revenue: 690000, users: 3340 },
  { month: "Feb", tenants: 32, bookings: 561, revenue: 820000, users: 3810 },
]

const BLUEPRINT_USAGE = [
  { id: "B1", name: "Talent Management", tenants: 28, bookings: 1842, pct: 87 },
  { id: "B3", name: "Pageant", tenants: 12, bookings: 420, pct: 38 },
  { id: "B4", name: "Brand Deals", tenants: 8, bookings: 218, pct: 25 },
  { id: "B7", name: "Event Staffing", tenants: 6, bookings: 158, pct: 19 },
  { id: "B9", name: "Marketplace", tenants: 4, bookings: 96, pct: 13 },
  { id: "B10", name: "Holding Group", tenants: 2, bookings: 44, pct: 6 },
]

const TOP_TENANTS = [
  { name: "StarCast Agency", revenue: 49999, bookings: 187, tier: "ENTERPRISE" },
  { name: "TalentPro Mumbai", revenue: 49999, bookings: 142, tier: "ENTERPRISE" },
  { name: "ModelMarket", revenue: 75000, bookings: 98, tier: "CUSTOM" },
  { name: "Fashion Forward Studio", revenue: 14999, bookings: 74, tier: "GROWTH" },
  { name: "EventPro India", revenue: 14999, bookings: 61, tier: "GROWTH" },
]

const maxRevenue = Math.max(...MONTHLY_METRICS.map((m) => m.revenue))

function getTierBadge(tier: string) {
  const map: Record<string, string> = {
    ENTERPRISE: "border-purple-200 bg-purple-50 text-purple-700",
    GROWTH: "border-blue-200 bg-blue-50 text-blue-700",
    CUSTOM: "border-amber-200 bg-amber-50 text-amber-700",
    STARTER: "border-slate-200 bg-slate-50 text-slate-600",
  }
  return map[tier] || map.STARTER
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "blueprints" | "tenants">("overview")
  const latest = MONTHLY_METRICS[MONTHLY_METRICS.length - 1]
  const prev = MONTHLY_METRICS[MONTHLY_METRICS.length - 2]

  function exportCsv() {
    const rows = [
      ["Month", "Tenants", "Bookings", "Revenue", "Users"],
      ...MONTHLY_METRICS.map((m) => [m.month, m.tenants, m.bookings, m.revenue, m.users]),
    ]
    const a = document.createElement("a")
    a.href = "data:text/csv," + encodeURIComponent(rows.map((r) => r.join(",")).join("\n"))
    a.download = "platform_analytics.csv"
    a.click()
  }

  return (
    <PageLayout>
      <PageHeader
        title="Platform Analytics"
        description="Platform-wide metrics across all tenants: usage, blueprint adoption, revenue trends, and user growth. For tenant-specific analytics, use Tenant Admin → Reports."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <BarChart3 className="h-3.5 w-3.5 text-blue-500" />
            Platform-Wide Analytics
          </span>
        }
        actions={
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="mr-1.5 h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <PageSection>
        <MetricsGrid>
          {[
            { label: "Active Tenants", value: latest.tenants, delta: `+${latest.tenants - prev.tenants} this month`, icon: Globe, color: "text-blue-500" },
            { label: "Total Bookings (Feb)", value: latest.bookings, delta: `${Math.round(((latest.bookings - prev.bookings) / prev.bookings) * 100)}% MoM`, icon: Activity, color: "text-indigo-500" },
            { label: "Platform Revenue", value: `₹${(latest.revenue / 1000).toFixed(0)}K`, delta: "+18.8% MoM", icon: TrendingUp, color: "text-emerald-500" },
            { label: "Registered Users", value: latest.users.toLocaleString(), delta: `+${latest.users - prev.users} new`, icon: Users, color: "text-purple-500" },
          ].map((item) => (
            <Card key={item.label} className="hover:border-blue-300 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">{item.value}</p>
                <p className="mt-1 text-xs text-emerald-600">{item.delta}</p>
              </CardContent>
            </Card>
          ))}
        </MetricsGrid>
      </PageSection>

      {/* Tabs */}
      <div className="mb-6 border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          {[
            { id: "overview", label: "Platform Trends" },
            { id: "blueprints", label: "Blueprint Usage" },
            { id: "tenants", label: "Top Tenants" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-medium transition ${
                activeTab === tab.id ? "border-b-2 border-blue-500 text-blue-600" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Revenue Trend — 6 Months</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MONTHLY_METRICS.map((m) => (
                  <div key={m.month} className="flex items-center gap-4">
                    <span className="w-10 text-sm text-slate-500">{m.month}</span>
                    <div className="flex-1">
                      <div className="h-7 overflow-hidden rounded bg-slate-100">
                        <div
                          className="flex h-full items-center rounded bg-gradient-to-r from-blue-500 to-indigo-500 px-2"
                          style={{ width: `${(m.revenue / maxRevenue) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex w-48 items-center justify-between gap-4 text-sm">
                      <span className="font-semibold text-slate-800">₹{(m.revenue / 1000).toFixed(0)}K</span>
                      <span className="text-slate-400">{m.bookings} bookings</span>
                      <span className="text-slate-400">{m.tenants} tenants</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">User Growth</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {MONTHLY_METRICS.map((m) => (
                    <div key={m.month} className="flex items-center gap-3">
                      <span className="w-10 text-sm text-slate-500">{m.month}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-purple-400" style={{ width: `${(m.users / 4000) * 100}%` }} />
                      </div>
                      <span className="w-12 text-right text-sm text-slate-700">{m.users.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Platform Health KPIs</CardTitle></CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  {[
                    { label: "Avg Bookings per Tenant", value: `${Math.round(latest.bookings / latest.tenants)}` },
                    { label: "Revenue per Tenant", value: `₹${Math.round(latest.revenue / latest.tenants / 1000)}K` },
                    { label: "Users per Tenant", value: `${Math.round(latest.users / latest.tenants)}` },
                    { label: "Platform GMV (Feb)", value: "₹28.4L" },
                    { label: "Commission Earned (Feb)", value: "₹3.2L" },
                    { label: "Avg Commission Rate", value: "11.3%" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between border-b border-slate-50 pb-2">
                      <dt className="text-slate-500">{item.label}</dt>
                      <dd className="font-semibold text-slate-800">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "blueprints" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Blueprint Adoption Across Platform</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {BLUEPRINT_USAGE.map((bp) => (
                <div key={bp.id} className="flex items-center gap-4">
                  <span className="w-6 rounded bg-slate-100 px-1.5 py-0.5 text-center font-mono text-xs font-semibold text-slate-600">{bp.id}</span>
                  <span className="w-40 text-sm text-slate-700">{bp.name}</span>
                  <div className="flex-1">
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${bp.pct}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-slate-500">
                    <span className="w-20 text-right">{bp.tenants} tenants</span>
                    <span className="w-24 text-right">{bp.bookings} bookings</span>
                    <span className="w-10 text-right font-semibold text-slate-700">{bp.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "tenants" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Top Tenants by Revenue (Feb 2025)</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Tenant</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Tier</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">MRR</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Bookings</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Share</th>
                </tr>
              </thead>
              <tbody>
                {TOP_TENANTS.map((t, i) => (
                  <tr key={t.name} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{i + 1}</span>
                        <span className="font-medium text-slate-800">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${getTierBadge(t.tier)}`}>{t.tier}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">₹{t.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-600">{t.bookings}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.round((t.revenue / 204996) * 100)}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{Math.round((t.revenue / 204996) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  )
}
