"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Download, TrendingUp, TrendingDown, DollarSign, FileText } from "lucide-react"
import reconciliationReports from "@/data/seed/reconciliationReports.json"

export default function ReportsPage() {
  const reports = reconciliationReports

  return (
    <PageLayout>
      <PageHeader
        title="Reconciliation Reports"
        subtitle="Financial reports and reconciliation analytics"
      />

      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400">Monthly Volume</p>
                  <p className="text-2xl font-bold text-white mt-1">${reports.summary.monthlyVolume.toLocaleString('en-IN')}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-400">+12.5%</span>
                <span className="text-slate-400">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400">Reconciliation Rate</p>
                  <p className="text-2xl font-bold text-white mt-1">{reports.summary.reconciliationRate}%</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-400">+2.3%</span>
                <span className="text-slate-400">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400">Chargeback Rate</p>
                  <p className="text-2xl font-bold text-white mt-1">{reports.summary.chargebackRate}%</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="h-4 w-4 text-green-400" />
                <span className="text-green-400">-0.8%</span>
                <span className="text-slate-400">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.monthlyTrends.map((trend: any) => (
                  <div key={trend.month} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div>
                      <p className="text-sm font-medium text-white">{trend.month}</p>
                      <p className="text-xs text-slate-400 mt-1">{trend.transactions} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">${trend.volume.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-slate-400">{trend.reconciled}% reconciled</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-white">Top Tenants by Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.topTenants.map((tenant: any, index: number) => (
                  <div key={tenant.tenantId} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{tenant.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{tenant.transactions} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">${tenant.volume.toLocaleString('en-IN')}</p>
                      <Badge className={tenant.reconciled >= 98 ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"}>
                        {tenant.reconciled}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Available Reports
              <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                Export All
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.availableReports.map((report: any) => (
                <div key={report.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{report.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{report.description}</p>
                    </div>
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-700 text-slate-300 border-slate-600">
                        {report.period}
                      </Badge>
                      <span className="text-xs text-slate-400">{report.lastGenerated}</span>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
