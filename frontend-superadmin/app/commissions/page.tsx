"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { DollarSign, TrendingUp, Clock, AlertCircle, CheckCircle, FileText } from "lucide-react"
import Link from "next/link"
import commissionEngine from "@/data/seed/commissionEngine.json"

export default function CommissionsDashboard() {
  const data = commissionEngine

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-[#107c10] text-white border-[#107c10]"
      case "in_progress": return "bg-[#0078d4] text-white border-[#0078d4]"
      case "pending": return "bg-[#ffb900] text-[#323130] border-[#ffb900]"
      case "on_hold": return "bg-[#d13438] text-white border-[#d13438]"
      default: return "bg-[#605e5c] text-white border-[#605e5c]"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-[#d13438] text-white border-[#d13438]"
      case "medium": return "bg-[#ffb900] text-[#323130] border-[#ffb900]"
      default: return "bg-[#605e5c] text-white border-[#605e5c]"
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Commission Engine & Settlement"
        subtitle="Automated commission calculation, settlement processing, and payout management"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
            {data.overview.activeRules} Active Rules
          </span>
        }
      />

      <PageSection>
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Total Commissions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-emerald-600 sm:text-3xl">
                ₹{(data.overview.totalCommissions / 100000).toFixed(2)}L
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Across all blueprints
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Settlements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-amber-600 sm:text-3xl">
                ₹{(data.overview.pendingSettlements / 100000).toFixed(2)}L
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {data.overview.totalPayouts} payouts in queue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settled This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-sky-600 sm:text-3xl">
                ₹{(data.overview.settledThisMonth / 100000).toFixed(2)}L
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-emerald-600" />
                <span className="text-xs text-emerald-600">+8.3% vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avg Processing Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-800 sm:text-3xl">
                {data.overview.avgProcessingTime} days
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {data.overview.disputeRate}% dispute rate
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Settlements</CardTitle>
            <Link href="/commissions/settlements">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.settlements.slice(0, 3).map((settlement: any) => (
                <div key={settlement.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-800">{settlement.period}</h4>
                      <p className="text-xs text-slate-500">
                        {settlement.tenantCount} tenants • {settlement.payoutCount} payouts
                      </p>
                    </div>
                    <Badge className={getStatusColor(settlement.status)}>
                      {settlement.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-slate-600">Total Amount</span>
                    <span className="text-lg font-semibold text-emerald-600">
                      ₹{(settlement.totalAmount / 100000).toFixed(2)}L
                    </span>
                  </div>
                  {settlement.status === "in_progress" && (
                    <div className="mt-3 text-xs text-slate-500">
                      Due: {new Date(settlement.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Commission by Blueprint</CardTitle>
            <Link href="/commissions/rules">
              <Button variant="outline" size="sm">View Rules</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.analytics.byBlueprint.map((blueprint: any) => (
                <div key={blueprint.blueprint} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-slate-800 capitalize">{blueprint.blueprint}</span>
                      <p className="text-xs text-slate-500">
                        {blueprint.tenantCount} tenants • {blueprint.payoutCount} payouts
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-900">
                        ₹{(blueprint.totalCommissions / 100000).toFixed(2)}L
                      </span>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-emerald-600" />
                        <span className="text-xs text-emerald-600">+{blueprint.growthRate}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${(blueprint.totalCommissions / data.overview.totalCommissions) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Payout Queue</CardTitle>
            <Link href="/commissions/payouts">
              <Button variant="outline" size="sm">Manage Queue</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.payoutQueue.slice(0, 4).map((payout: any) => (
                <div key={payout.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{payout.tenantName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {payout.blueprint}
                      </Badge>
                      <Badge className={getPriorityColor(payout.priority)}>
                        {payout.priority}
                      </Badge>
                      <Badge className={getStatusColor(payout.status)}>
                        {payout.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-slate-900">
                      ₹{(payout.amount / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-slate-500">
                      Due: {new Date(payout.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Disputes</CardTitle>
            <Link href="/commissions/disputes">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.disputes.filter((d: any) => d.status !== 'resolved').map((dispute: any) => (
                <div key={dispute.id} className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-800">{dispute.tenantName}</h4>
                      <p className="text-sm text-red-700 mt-1">{dispute.reason}</p>
                    </div>
                    <Badge className={getPriorityColor(dispute.priority)}>
                      {dispute.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-red-600">
                    <span>Amount: ₹{(dispute.amount / 1000).toFixed(0)}K</span>
                    <span>Filed: {new Date(dispute.filedDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                  </div>
                </div>
              ))}
              {data.disputes.filter((d: any) => d.status !== 'resolved').length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-emerald-500" />
                  <p className="text-sm">No active disputes</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <PageSection title="Monthly Trend">
        <Card>
          <CardHeader>
            <CardTitle>Commission Volume (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.analytics.monthlyTrend.map((month: any, index: number) => {
                const prevAmount = index > 0 ? data.analytics.monthlyTrend[index - 1].amount : month.amount
                const change = ((month.amount - prevAmount) / prevAmount) * 100
                return (
                  <div key={month.month} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{month.month}</p>
                      {index > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          {change > 0 ? (
                            <TrendingUp className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
                          )}
                          <span className={`text-xs ${change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {change > 0 ? '+' : ''}{change.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-lg font-semibold text-slate-900">
                      ₹{(month.amount / 100000).toFixed(2)}L
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/commissions/rules">
            <Card className="hover:border-blue-300 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold text-slate-800">Manage Rules</h3>
                <p className="text-xs text-slate-500 mt-1">{data.overview.activeRules} active rules</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/commissions/settlements">
            <Card className="hover:border-emerald-300 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold text-slate-800">Settlements</h3>
                <p className="text-xs text-slate-500 mt-1">View all settlements</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/commissions/payouts">
            <Card className="hover:border-amber-300 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold text-slate-800">Payout Queue</h3>
                <p className="text-xs text-slate-500 mt-1">{data.overview.totalPayouts} pending</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/commissions/disputes">
            <Card className="hover:border-red-300 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <h3 className="font-semibold text-slate-800">Disputes</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {data.disputes.filter((d: any) => d.status !== 'resolved').length} active
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </PageSection>
    </PageLayout>
  )
}