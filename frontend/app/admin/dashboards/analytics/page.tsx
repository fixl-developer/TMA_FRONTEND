/**
 * Analytics Dashboard - Tenant Admin
 * Microsoft 365 Professional Style
 */

"use client"

import { useEffect, useState } from "react"
import {
  getJobsFunnelStats,
  getRevenueOverTimeStats,
  getFinanceOverviewStats,
  getTalentGrowthStats,
  getDisputeRateStats,
  formatCurrency,
} from "@/shared/services/dashboardService"
import { useTenant } from "@/shared/context/TenantContext"
import { BarChart3, TrendingUp, Users, Scale, Wallet, DollarSign } from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const COLORS = {
  primary: "#0078d4",
  success: "#107c10",
  warning: "#ffb900",
  danger: "#d13438",
  purple: "#8764b8",
  teal: "#00b7c3",
}

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

  const totalEscrow = finance
    ? Object.values(finance.escrowAmounts).reduce((sum: number, val) => sum + (val as number), 0)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1600px]">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-xs text-gray-600 mt-1">Financial overview, jobs funnel, talent growth, and dispute metrics</p>
        </div>

        {/* Finance Overview Cards */}
        {!loading && finance && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded bg-white border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-600">Wallet Balance</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {formatCurrency(finance.walletBalance, finance.walletCurrency)}
                  </p>
                </div>
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <div className="rounded bg-white border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-600">Escrow Total</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {formatCurrency(totalEscrow, finance.walletCurrency)}
                  </p>
                </div>
                <Scale className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            <div className="rounded bg-white border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-600">Payouts Settled</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {formatCurrency(finance.payoutSettled, finance.walletCurrency)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{finance.payoutCount} transactions</p>
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {loading ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-sm text-gray-600">Loading analytics...</p>
            </div>
          ) : (
            <>
              {/* Jobs Funnel */}
              <div className="rounded bg-white border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <h2 className="text-base font-semibold text-gray-900">Jobs Funnel</h2>
                </div>
                <div className="p-6">
                  {jobs?.funnel && jobs.funnel.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={jobs.funnel}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#edebe9" />
                        <XAxis dataKey="stage" tick={{ fill: "#605e5c", fontSize: 12 }} />
                        <YAxis tick={{ fill: "#605e5c", fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #edebe9",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="count" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-64 items-center justify-center text-sm text-gray-400">
                      No job data available
                    </div>
                  )}
                </div>
              </div>

              {/* Revenue Over Time */}
              <div className="rounded bg-white border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h2 className="text-base font-semibold text-gray-900">
                    {revenue?.source === "tenant" ? "Income Over Time" : "Revenue Over Time"}
                  </h2>
                </div>
                <div className="p-6">
                  {revenue?.data && revenue.data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={revenue.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#edebe9" />
                        <XAxis dataKey="period" tick={{ fill: "#605e5c", fontSize: 12 }} />
                        <YAxis tick={{ fill: "#605e5c", fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #edebe9",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                          formatter={(value: any) => formatCurrency(value, "INR")}
                        />
                        {revenue.source === "tenant" ? (
                          <>
                            <Line type="monotone" dataKey="contract" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="deposit" stroke={COLORS.success} strokeWidth={2} dot={{ r: 4 }} />
                          </>
                        ) : (
                          <>
                            <Line type="monotone" dataKey="subscription" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="usage" stroke={COLORS.warning} strokeWidth={2} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="platformFee" stroke={COLORS.success} strokeWidth={2} dot={{ r: 4 }} />
                          </>
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-64 items-center justify-center text-sm text-gray-400">
                      No revenue data available
                    </div>
                  )}
                </div>
              </div>

              {/* Talent Growth */}
              <div className="rounded bg-white border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <h2 className="text-base font-semibold text-gray-900">Talent Growth</h2>
                </div>
                <div className="p-6">
                  {talent?.byMonth && talent.byMonth.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={talent.byMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#edebe9" />
                        <XAxis dataKey="month" tick={{ fill: "#605e5c", fontSize: 12 }} />
                        <YAxis tick={{ fill: "#605e5c", fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #edebe9",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="count" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-64 items-center justify-center text-sm text-gray-400">
                      No talent data available
                    </div>
                  )}
                </div>
              </div>

              {/* Dispute Rate */}
              <div className="rounded bg-white border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-red-600" />
                  <h2 className="text-base font-semibold text-gray-900">Dispute Rate</h2>
                </div>
                <div className="p-6">
                  {disputes?.byStatus && disputes.byStatus.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={disputes.byStatus}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#edebe9" />
                          <XAxis dataKey="name" tick={{ fill: "#605e5c", fontSize: 12 }} />
                          <YAxis tick={{ fill: "#605e5c", fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #edebe9",
                              borderRadius: "4px",
                              fontSize: "12px",
                            }}
                          />
                          <Bar dataKey="value" fill={COLORS.danger} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="mt-4 flex items-center justify-between rounded bg-gray-50 p-3">
                        <span className="text-xs font-semibold text-gray-600">Open Rate</span>
                        <span className="text-sm font-semibold text-gray-900">{disputes.ratePercent}%</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between rounded bg-gray-50 p-3">
                        <span className="text-xs font-semibold text-gray-600">Total Disputes</span>
                        <span className="text-sm font-semibold text-gray-900">{disputes.total}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-64 items-center justify-center text-sm text-gray-400">
                      No dispute data available
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
