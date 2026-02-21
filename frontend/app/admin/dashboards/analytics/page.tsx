/**
 * Analytics Dashboard - Tenant Admin
 *
 * Jobs funnel, revenue over time, talent growth, dispute rate.
 */

"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import {
  getJobsFunnelStats,
  getRevenueOverTimeStats,
  getFinanceOverviewStats,
  getTalentGrowthStats,
  getDisputeRateStats,
  formatCurrency,
} from "@/shared/services/dashboardService"
import { useTenant } from "@/shared/context/TenantContext"
import { BarChart3, TrendingUp, Users, Scale, Wallet } from "lucide-react"
import { FinanceOverviewCard } from "@/shared/components/charts/FinanceOverviewCard"
import { CreativeChartWithToggle } from "@/shared/components/charts/CreativeChartWithToggle"
import { CreativeStackedBarChart } from "@/shared/components/charts/CreativeStackedBarChart"

export default function AnalyticsDashboardPage() {
  const { tenantId } = useTenant()
  const [jobs, setJobs] = useState<any>(null)
  const [revenue, setRevenue] = useState<{ data: any[]; source: "tenant" | "platform" } | null>(null)
  const [finance, setFinance] = useState<Awaited<ReturnType<typeof getFinanceOverviewStats>> | null>(null)
  const [talent, setTalent] = useState<any>(null)
  const [disputes, setDisputes] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [j, r, f, t, d] = await Promise.all([
          getJobsFunnelStats(tenantId),
          getRevenueOverTimeStats(tenantId),
          getFinanceOverviewStats(tenantId),
          getTalentGrowthStats(tenantId),
          getDisputeRateStats(tenantId),
        ])
        setJobs(j)
        setRevenue(r)
        setFinance(f)
        setTalent(t)
        setDisputes(d)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tenantId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Analytics</h1>
          <p className="mt-2 text-base text-white/60">Overview, jobs funnel, finance, talent growth, dispute rate</p>
        </div>
        {/* Finance Overview Cards */}
        {!loading && finance && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Wallet Balance */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
              <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-[#d4ff00]/20 to-[#b8e600]/20 blur-2xl" />
              <div className="relative">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-white/50">Wallet</p>
                    <p className="mt-1 text-sm text-white/60">Balance</p>
                  </div>
                  <div className="rounded-lg bg-[#d4ff00]/10 p-2">
                    <Wallet className="h-5 w-5 text-[#d4ff00]" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(finance.walletBalance, finance.walletCurrency)}
                </p>
              </div>
            </div>

            {/* Escrow */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
              <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-2xl" />
              <div className="relative">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-white/50">Escrow</p>
                    <p className="mt-1 text-sm text-white/60">Total Held</p>
                  </div>
                  <div className="rounded-lg bg-purple-500/10 p-2">
                    <Scale className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(
                    Object.values(finance.escrowAmounts).reduce((sum: number, val) => sum + (val as number), 0),
                    finance.walletCurrency
                  )}
                </p>
              </div>
            </div>

            {/* Payouts */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
              <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-2xl" />
              <div className="relative">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-white/50">Payouts</p>
                    <p className="mt-1 text-sm text-white/60">Settled</p>
                  </div>
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(finance.payoutSettled, finance.walletCurrency)}
                </p>
                <p className="mt-2 text-xs text-white/50">{finance.payoutCount} transactions</p>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {loading ? (
            <p className="col-span-full py-8 text-center text-white/60">Loading…</p>
          ) : (
            <>
              {/* Jobs Funnel */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-[#d4ff00]/10 p-2">
                    <BarChart3 className="h-5 w-5 text-[#d4ff00]" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Jobs funnel</h3>
                </div>
                <CreativeChartWithToggle
                  data={jobs?.funnel ?? []}
                  dataKey="count"
                  xAxisKey="stage"
                  variants={["bar", "line", "pie"]}
                  height={260}
                  theme="dark"
                  emptyMessage="No job data"
                />
              </div>

              {/* Revenue Over Time */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-emerald-500/10 p-2">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {revenue?.source === "tenant" ? "Income over time" : "Revenue over time"}
                  </h3>
                </div>
                {revenue?.data && revenue.data.length > 0 ? (
                  <CreativeStackedBarChart
                    data={revenue.data}
                    xAxisKey="period"
                    segments={
                      revenue.source === "tenant"
                        ? [
                            { dataKey: "contract", label: "Contract payments", color: "#d4ff00" },
                            { dataKey: "deposit", label: "Deposits", color: "#10b981" },
                          ]
                        : [
                            { dataKey: "subscription", label: "Subscription", color: "#d4ff00" },
                            { dataKey: "usage", label: "Usage", color: "#f59e0b" },
                            { dataKey: "platformFee", label: "Platform fee", color: "#10b981" },
                          ]
                    }
                    valueFormatter={(v) => formatCurrency(v, "INR")}
                    height={260}
                    theme="dark"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center text-white/50">No revenue data</div>
                )}
              </div>

              {/* Talent Growth */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-purple-500/10 p-2">
                    <Users className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Talent growth</h3>
                </div>
                <CreativeChartWithToggle
                  data={talent?.byMonth ?? []}
                  dataKey="count"
                  xAxisKey="month"
                  variants={["bar", "line", "area", "pie"]}
                  height={260}
                  theme="dark"
                  emptyMessage="No talent data"
                />
              </div>

              {/* Dispute Rate */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-rose-500/10 p-2">
                    <Scale className="h-5 w-5 text-rose-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Dispute rate</h3>
                </div>
                {disputes?.byStatus?.length > 0 ? (
                  <div className="space-y-3">
                    <CreativeChartWithToggle
                      data={disputes.byStatus}
                      dataKey="value"
                      xAxisKey="name"
                      variants={["bar", "pie"]}
                      height={220}
                      theme="dark"
                      emptyMessage="No dispute data"
                    />
                    <p className="text-sm text-white/60">
                      Open rate: {disputes.ratePercent}% · Total: {disputes.total}
                    </p>
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center text-white/50">No dispute data</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
