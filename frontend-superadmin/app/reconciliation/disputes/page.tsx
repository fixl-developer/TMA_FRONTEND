"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Search, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react"
import paymentDisputes from "@/data/seed/paymentDisputes.json"

export default function DisputesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = paymentDisputes.filter((dispute: any) => {
    const matchesSearch = dispute.disputeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dispute.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dispute.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || dispute.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "investigating": return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "resolved": return "bg-green-500/10 text-green-600 border-green-500/20"
      case "rejected": return "bg-red-500/10 text-red-600 border-red-500/20"
      case "escalated": return "bg-purple-500/10 text-purple-600 border-purple-500/20"
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-400"
      case "high": return "text-orange-400"
      case "medium": return "text-yellow-400"
      case "low": return "text-green-400"
      default: return "text-slate-400"
    }
  }

  const stats = {
    total: paymentDisputes.length,
    open: paymentDisputes.filter((d: any) => d.status === "open").length,
    investigating: paymentDisputes.filter((d: any) => d.status === "investigating").length,
    resolved: paymentDisputes.filter((d: any) => d.status === "resolved").length,
    avgResolutionTime: "4.2 days"
  }

  return (
    <PageLayout>
      <PageHeader
        title="Payment Disputes"
        subtitle="Manage payment disputes and resolution workflows"
      />

      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Open Disputes</p>
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
                  <p className="text-sm text-slate-400">Investigating</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.investigating}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Resolved</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Avg Resolution</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.avgResolutionTime}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by dispute ID, tenant, or type..."
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
              onClick={() => setStatusFilter("investigating")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "investigating" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Investigating
            </button>
            <button
              onClick={() => setStatusFilter("resolved")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "resolved" ? "bg-green-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-white">Dispute Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Dispute ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Tenant</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Priority</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Filed</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((dispute: any) => (
                    <tr key={dispute.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer">
                      <td className="py-3 px-4 text-sm font-mono text-blue-400">{dispute.disputeId}</td>
                      <td className="py-3 px-4 text-sm text-white">{dispute.tenant}</td>
                      <td className="py-3 px-4 text-sm text-slate-300">{dispute.type}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-medium ${getPriorityColor(dispute.priority)}`}>
                          {dispute.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-white text-right font-medium">${dispute.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(dispute.status)}>
                          {dispute.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-400">{dispute.filedDate}</td>
                      <td className="py-3 px-4 text-sm text-slate-300">{dispute.assignedTo}</td>
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
