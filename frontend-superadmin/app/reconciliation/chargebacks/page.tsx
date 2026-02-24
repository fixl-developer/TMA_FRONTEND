"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Search, AlertTriangle, Clock, CheckCircle, XCircle, FileText } from "lucide-react"
import chargebacks from "@/data/seed/chargebacks.json"

export default function ChargebacksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = chargebacks.filter((cb: any) => {
    const matchesSearch = cb.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cb.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cb.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || cb.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "under_review": return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "won": return "bg-green-500/10 text-green-600 border-green-500/20"
      case "lost": return "bg-red-500/10 text-red-600 border-red-500/20"
      case "pending_evidence": return "bg-purple-500/10 text-purple-600 border-purple-500/20"
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20"
    }
  }

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case "fraudulent": return "text-red-400"
      case "product_not_received": return "text-yellow-400"
      case "product_unacceptable": return "text-orange-400"
      case "duplicate": return "text-blue-400"
      case "credit_not_processed": return "text-purple-400"
      default: return "text-slate-400"
    }
  }

  const stats = {
    total: chargebacks.length,
    open: chargebacks.filter((cb: any) => cb.status === "open").length,
    underReview: chargebacks.filter((cb: any) => cb.status === "under_review").length,
    won: chargebacks.filter((cb: any) => cb.status === "won").length,
    lost: chargebacks.filter((cb: any) => cb.status === "lost").length,
    totalAmount: chargebacks.reduce((sum: number, cb: any) => sum + cb.amount, 0),
    winRate: Math.round((chargebacks.filter((cb: any) => cb.status === "won").length / chargebacks.filter((cb: any) => cb.status === "won" || cb.status === "lost").length) * 100)
  }

  return (
    <PageLayout>
      <PageHeader
        title="Chargeback Management"
        subtitle="Monitor and respond to payment chargebacks"
      />

      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Open Cases</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.open}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Under Review</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.underReview}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total at Risk</p>
                  <p className="text-2xl font-bold text-white mt-1">${stats.totalAmount.toLocaleString('en-IN')}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Win Rate</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.winRate}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by transaction ID, tenant, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "all" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("open")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "open" ? "bg-yellow-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setStatusFilter("under_review")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "under_review" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Under Review
            </button>
            <button
              onClick={() => setStatusFilter("won")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "won" ? "bg-green-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Won
            </button>
            <button
              onClick={() => setStatusFilter("lost")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "lost" ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Lost
            </button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-white">Chargeback Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Case ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Transaction</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Tenant</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Reason</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Filed Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cb: any) => (
                    <tr key={cb.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-mono text-blue-400">{cb.caseId}</td>
                      <td className="py-3 px-4 text-sm font-mono text-slate-300">{cb.transactionId}</td>
                      <td className="py-3 px-4 text-sm text-white">{cb.tenant}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm ${getReasonColor(cb.reason)}`}>
                          {cb.reason.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-white text-right font-medium">${cb.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(cb.status)}>
                          {cb.status.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-400">{cb.filedDate}</td>
                      <td className="py-3 px-4 text-sm text-slate-400">{cb.deadline}</td>
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
