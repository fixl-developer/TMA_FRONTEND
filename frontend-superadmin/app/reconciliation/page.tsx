"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { DollarSign, AlertTriangle, CheckCircle, Clock, TrendingUp, FileText } from "lucide-react"
import Link from "next/link"
import reconciliationOverview from "@/data/seed/reconciliationOverview.json"
import recentReconciliations from "@/data/seed/recentReconciliations.json"

export default function ReconciliationDashboard() {
  const overview = reconciliationOverview
  const recent = recentReconciliations.slice(0, 8)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "matched": return "bg-[#107c10] text-white border-[#107c10]"
      case "pending": return "bg-[#ffb900] text-[#323130] border-[#ffb900]"
      case "discrepancy": return "bg-[#d13438] text-white border-[#d13438]"
      case "investigating": return "bg-[#0078d4] text-white border-[#0078d4]"
      default: return "bg-[#605e5c] text-white border-[#605e5c]"
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Reconciliation & Chargebacks"
        subtitle="Daily reconciliation, payment disputes, and chargeback management"
      />

      <PageSection>
        <MetricsGrid>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#605e5c]">Today's Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-[#605e5c]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#323130]">${overview.todayVolume.toLocaleString('en-US')}</div>
              <p className="text-xs text-[#605e5c] mt-1">{overview.todayTransactions} transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#605e5c]">Matched</CardTitle>
              <CheckCircle className="h-4 w-4 text-[#107c10]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#323130]">{overview.matchedPercentage}%</div>
              <p className="text-xs text-[#605e5c] mt-1">{overview.matchedCount} of {overview.totalCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#605e5c]">Discrepancies</CardTitle>
              <AlertTriangle className="h-4 w-4 text-[#d13438]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#323130]">{overview.discrepancyCount}</div>
              <p className="text-xs text-[#605e5c] mt-1">${overview.discrepancyAmount.toLocaleString('en-US')} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#605e5c]">Active Chargebacks</CardTitle>
              <Clock className="h-4 w-4 text-[#ffb900]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#323130]">{overview.activeChargebacks}</div>
              <p className="text-xs text-[#605e5c] mt-1">${overview.chargebackAmount.toLocaleString('en-US')} at risk</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#323130] flex items-center justify-between">
              Recent Reconciliations
              <Link href="/reconciliation/daily" className="text-sm text-[#0078d4] hover:text-[#106ebe]">
                View All →
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recent.map((rec: any) => (
                <div key={rec.id} className="flex items-center justify-between p-3 bg-[#faf9f8] rounded border border-[#edebe9] hover:bg-[#f3f2f1] transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[#323130]">{rec.date}</p>
                      <Badge className={getStatusColor(rec.status)}>{rec.status}</Badge>
                    </div>
                    <p className="text-xs text-[#605e5c] mt-1">{rec.tenant}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#323130]">${rec.amount.toLocaleString('en-US')}</p>
                    <p className="text-xs text-[#605e5c]">{rec.transactions} txns</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#323130]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/reconciliation/daily" className="block p-3 bg-[#faf9f8] rounded border border-[#edebe9] hover:border-[#0078d4] hover:bg-[#f3f2f1] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#0078d4]" />
                    <div>
                      <p className="text-sm font-medium text-[#323130]">Daily Reconciliation</p>
                      <p className="text-xs text-[#605e5c]">View daily reports</p>
                    </div>
                  </div>
                  <span className="text-[#605e5c]">→</span>
                </div>
              </Link>

              <Link href="/reconciliation/chargebacks" className="block p-3 bg-[#faf9f8] rounded border border-[#edebe9] hover:border-[#0078d4] hover:bg-[#f3f2f1] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-[#ffb900]" />
                    <div>
                      <p className="text-sm font-medium text-[#323130]">Chargebacks</p>
                      <p className="text-xs text-[#605e5c]">Manage disputes</p>
                    </div>
                  </div>
                  <span className="text-[#605e5c]">→</span>
                </div>
              </Link>

              <Link href="/reconciliation/disputes" className="block p-3 bg-[#faf9f8] rounded border border-[#edebe9] hover:border-[#0078d4] hover:bg-[#f3f2f1] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#d13438]" />
                    <div>
                      <p className="text-sm font-medium text-[#323130]">Payment Disputes</p>
                      <p className="text-xs text-[#605e5c]">Review cases</p>
                    </div>
                  </div>
                  <span className="text-[#605e5c]">→</span>
                </div>
              </Link>

              <Link href="/reconciliation/reports" className="block p-3 bg-[#faf9f8] rounded border border-[#edebe9] hover:border-[#0078d4] hover:bg-[#f3f2f1] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-[#107c10]" />
                    <div>
                      <p className="text-sm font-medium text-[#323130]">Reports</p>
                      <p className="text-xs text-[#605e5c]">Financial reports</p>
                    </div>
                  </div>
                  <span className="text-[#605e5c]">→</span>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#323130]">Monthly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#605e5c]">Total Volume</span>
                  <span className="text-sm font-semibold text-[#323130]">${overview.monthlyVolume.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#605e5c]">Reconciled</span>
                  <span className="text-sm font-semibold text-[#107c10]">{overview.monthlyReconciled}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#605e5c]">Chargebacks</span>
                  <span className="text-sm font-semibold text-[#d13438]">{overview.monthlyChargebacks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#605e5c]">Win Rate</span>
                  <span className="text-sm font-semibold text-[#0078d4]">{overview.chargebackWinRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
