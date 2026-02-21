"use client"

import { useMemo, useState } from "react"
import { DollarSign, TrendingUp, Users, AlertCircle, Download, BarChart3 } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"

const REVENUE_SERIES = [
  { month: "Sep 24", mrr: 380000, newTenants: 3, churn: 0 },
  { month: "Oct 24", mrr: 420000, newTenants: 4, churn: 1 },
  { month: "Nov 24", mrr: 510000, newTenants: 6, churn: 0 },
  { month: "Dec 24", mrr: 590000, newTenants: 5, churn: 2 },
  { month: "Jan 25", mrr: 640000, newTenants: 7, churn: 1 },
  { month: "Feb 25", mrr: 720000, newTenants: 8, churn: 0 },
]

const BILLING_PLANS = [
  { id: "STARTER", name: "Starter", price: 4999, tenants: 12, mrr: 59988 },
  { id: "GROWTH", name: "Growth", price: 14999, tenants: 8, mrr: 119992 },
  { id: "ENTERPRISE", name: "Enterprise", price: 49999, tenants: 4, mrr: 199996 },
  { id: "CUSTOM", name: "Custom", price: null, tenants: 2, mrr: 150000 },
]

const TENANT_BILLING = [
  { tenantId: "tenant_001", name: "StarCast Agency", plan: "ENTERPRISE", mrr: 49999, status: "CURRENT", lastPayment: "2025-02-01" },
  { tenantId: "tenant_004", name: "Fashion Forward Studio", plan: "GROWTH", mrr: 14999, status: "CURRENT", lastPayment: "2025-02-03" },
  { tenantId: "tenant_006", name: "TalentPro Mumbai", plan: "ENTERPRISE", mrr: 49999, status: "CURRENT", lastPayment: "2025-02-05" },
  { tenantId: "tenant_008", name: "MediaHouse India", plan: "GROWTH", mrr: 14999, status: "OVERDUE", lastPayment: "2025-01-10" },
  { tenantId: "tenant_012", name: "Cricket Academy", plan: "STARTER", mrr: 4999, status: "CURRENT", lastPayment: "2025-02-08" },
  { tenantId: "tenant_013", name: "StyleHub", plan: "STARTER", mrr: 4999, status: "TRIAL", lastPayment: null },
  { tenantId: "tenant_017", name: "EventPro India", plan: "GROWTH", mrr: 14999, status: "CURRENT", lastPayment: "2025-02-01" },
  { tenantId: "tenant_022", name: "ModelMarket", plan: "CUSTOM", mrr: 75000, status: "CURRENT", lastPayment: "2025-02-01" },
]

function getBillingStatusBadge(status: string) {
  switch (status) {
    case "CURRENT":
      return <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Current</span>
    case "OVERDUE":
      return <span className="rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">Overdue</span>
    case "TRIAL":
      return <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Trial</span>
    default:
      return <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">{status}</span>
  }
}

export default function SuperAdminRevenuePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "plans" | "tenants">("overview")

  const totals = useMemo(() => ({
    mrr: REVENUE_SERIES[REVENUE_SERIES.length - 1].mrr,
    arr: REVENUE_SERIES[REVENUE_SERIES.length - 1].mrr * 12,
    tenants: TENANT_BILLING.length,
    overdue: TENANT_BILLING.filter((t) => t.status === "OVERDUE").length,
  }), [])

  const maxMrr = Math.max(...REVENUE_SERIES.map((r) => r.mrr))

  function exportCsv() {
    const rows = [
      ["Tenant", "Plan", "MRR", "Status", "Last Payment"],
      ...TENANT_BILLING.map((t) => [t.name, t.plan, t.mrr, t.status, t.lastPayment || ""]),
    ]
    const csv = rows.map((r) => r.join(",")).join("\n")
    const a = document.createElement("a")
    a.href = "data:text/csv," + encodeURIComponent(csv)
    a.download = "billing_report.csv"
    a.click()
  }

  return (
    <PageLayout>
      <PageHeader
        title="Revenue & Billing"
        description="Platform MRR, ARR, billing plan distribution and per-tenant billing status."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <DollarSign className="h-3.5 w-3.5 text-blue-500" />
            Revenue Dashboard
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
          <Card className="hover:border-blue-400 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <DollarSign className="h-4 w-4 text-blue-500" />
                Monthly Recurring Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">₹{(totals.mrr / 1000).toFixed(0)}K</p>
              <p className="mt-1 text-xs text-emerald-600">+12.5% MoM growth</p>
            </CardContent>
          </Card>
          <Card className="hover:border-blue-400 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                Annual Recurring Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">₹{(totals.arr / 100000).toFixed(1)}L</p>
              <p className="mt-1 text-xs text-slate-400">Based on current MRR</p>
            </CardContent>
          </Card>
          <Card className="hover:border-blue-400 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="h-4 w-4 text-indigo-500" />
                Paying Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{totals.tenants}</p>
              <p className="mt-1 text-xs text-slate-400">{TENANT_BILLING.filter((t) => t.status === "TRIAL").length} on trial</p>
            </CardContent>
          </Card>
          <Card className={`transition-colors ${totals.overdue > 0 ? "border-red-300 hover:border-red-400" : "hover:border-blue-400"}`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <AlertCircle className={`h-4 w-4 ${totals.overdue > 0 ? "text-red-500" : "text-slate-400"}`} />
                Overdue Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${totals.overdue > 0 ? "text-red-600" : "text-slate-900"}`}>{totals.overdue}</p>
              <p className="mt-1 text-xs text-slate-400">Require follow-up</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      {/* Tab nav */}
      <div className="mb-6 border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          {[
            { id: "overview", label: "MRR Trend" },
            { id: "plans", label: "Billing Plans" },
            { id: "tenants", label: "Tenant Billing" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* MRR Trend */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Monthly Recurring Revenue (6 months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {REVENUE_SERIES.map((r) => (
                  <div key={r.month} className="flex items-center gap-4">
                    <span className="w-14 text-sm text-slate-500">{r.month}</span>
                    <div className="flex-1">
                      <div className="h-7 overflow-hidden rounded bg-slate-100">
                        <div
                          className="h-full rounded bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                          style={{ width: `${(r.mrr / maxMrr) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex w-44 items-center justify-between text-sm">
                      <span className="font-semibold text-slate-800">₹{(r.mrr / 1000).toFixed(0)}K</span>
                      <span className="text-slate-400 text-xs">+{r.newTenants} new</span>
                      {r.churn > 0 && <span className="text-xs text-red-500">-{r.churn}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Growth Metrics</CardTitle></CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  {[
                    { label: "MoM Growth", value: "+12.5%", color: "text-emerald-600" },
                    { label: "Net New MRR (Feb)", value: "₹80K", color: "text-emerald-600" },
                    { label: "Expansion MRR", value: "₹35K", color: "text-blue-600" },
                    { label: "Churned MRR", value: "₹0", color: "text-slate-400" },
                    { label: "Net Revenue Retention", value: "112%", color: "text-emerald-600" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between border-b border-slate-50 pb-2">
                      <dt className="text-slate-500">{item.label}</dt>
                      <dd className={`font-semibold ${item.color}`}>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Revenue by Blueprint</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "B1 Talent Management", rev: 320000, pct: 44 },
                    { name: "B4 Brand Deals", rev: 180000, pct: 25 },
                    { name: "B9 Marketplace", rev: 120000, pct: 17 },
                    { name: "Others", rev: 100000, pct: 14 },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-slate-600">{item.name}</span>
                        <span className="font-medium text-slate-800">₹{(item.rev / 1000).toFixed(0)}K ({item.pct}%)</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-blue-400" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Plans */}
      {activeTab === "plans" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BILLING_PLANS.map((plan) => (
            <Card key={plan.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    {plan.price ? (
                      <p className="mt-1 text-2xl font-bold text-slate-900">₹{plan.price.toLocaleString()}<span className="text-sm font-normal text-slate-400">/mo</span></p>
                    ) : (
                      <p className="mt-1 text-lg font-bold text-blue-600">Custom</p>
                    )}
                  </div>
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500">{plan.id}</span>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Active tenants</dt>
                    <dd className="font-semibold text-slate-900">{plan.tenants}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">MRR</dt>
                    <dd className="font-semibold text-emerald-600">₹{plan.mrr.toLocaleString()}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tenant Billing */}
      {activeTab === "tenants" && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Tenant</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Plan</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">MRR</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Last Payment</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {TENANT_BILLING.map((t) => (
                    <tr key={t.tenantId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                            {t.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{t.name}</p>
                            <p className="text-xs text-slate-400">{t.tenantId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">{t.plan}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">₹{t.mrr.toLocaleString()}</td>
                      <td className="px-4 py-3">{getBillingStatusBadge(t.status)}</td>
                      <td className="px-4 py-3 text-slate-500">{t.lastPayment || "No payments"}</td>
                      <td className="px-4 py-3">
                        {t.status === "OVERDUE" && (
                          <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                            Send Reminder
                          </Button>
                        )}
                        {t.status === "TRIAL" && (
                          <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                            Convert to Paid
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  )
}
