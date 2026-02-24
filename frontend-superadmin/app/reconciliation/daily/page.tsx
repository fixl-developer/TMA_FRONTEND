"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Search, Download, RefreshCw, CheckCircle, AlertTriangle, Clock } from "lucide-react"
import dailyReconciliations from "@/data/seed/dailyReconciliations.json"

export default function DailyReconciliationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = dailyReconciliations.filter((rec: any) => {
    const matchesSearch = rec.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.date.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || rec.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "matched": return "bg-green-500/10 text-green-600 border-green-500/20"
      case "pending": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "discrepancy": return "bg-red-500/10 text-red-600 border-red-500/20"
      case "investigating": return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "matched": return <CheckCircle className="h-4 w-4" />
      case "pending": return <Clock className="h-4 w-4" />
      case "discrepancy": return <AlertTriangle className="h-4 w-4" />
      case "investigating": return <RefreshCw className="h-4 w-4" />
      default: return null
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Daily Reconciliation"
        subtitle="Daily transaction reconciliation and matching"
      />

      <PageSection>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by tenant or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "all" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("matched")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "matched" ? "bg-green-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Matched
            </button>
            <button
              onClick={() => setStatusFilter("discrepancy")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "discrepancy" ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Discrepancy
            </button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Reconciliation Records
              <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Tenant</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Transactions</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Expected</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Actual</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Variance</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((rec: any) => (
                    <tr key={rec.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 text-sm text-white">{rec.date}</td>
                      <td className="py-3 px-4 text-sm text-white">{rec.tenant}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(rec.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(rec.status)}
                            {rec.status}
                          </span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-white text-right">{rec.transactions}</td>
                      <td className="py-3 px-4 text-sm text-white text-right">${rec.expectedAmount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-sm text-white text-right">${rec.actualAmount.toLocaleString('en-IN')}</td>
                      <td className={`py-3 px-4 text-sm text-right font-medium ${
                        rec.variance === 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        {rec.variance === 0 ? "—" : `$${Math.abs(rec.variance).toLocaleString('en-IN')}`}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-400">{rec.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
