"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { FileText, Download, Eye, CheckCircle, Clock, TrendingUp } from "lucide-react"
import { useState } from "react"
import commissionEngine from "@/data/seed/commissionEngine.json"

export default function SettlementsPage() {
  const [selectedStatus, setSelectedStatus] = useState("all")
  
  const settlements = commissionEngine.settlements

  const filteredSettlements = settlements.filter(settlement => {
    return selectedStatus === "all" || settlement.status === selectedStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "in_progress": return "bg-blue-50 text-blue-700 border-blue-200"
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200"
      default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-emerald-600" />
      case "in_progress": return <Clock className="h-4 w-4 text-blue-600" />
      default: return <Clock className="h-4 w-4 text-amber-600" />
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Settlement Statements"
        subtitle="Monthly commission settlements and payout processing"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            {settlements.length} Settlements
          </span>
        }
      />

      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-slate-600">Completed</span>
              </div>
              <p className="text-2xl font-semibold text-emerald-600">
                {settlements.filter(s => s.status === 'completed').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ₹{(settlements.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.totalAmount, 0) / 100000).toFixed(2)}L total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-slate-600">In Progress</span>
              </div>
              <p className="text-2xl font-semibold text-blue-600">
                {settlements.filter(s => s.status === 'in_progress').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ₹{(settlements.filter(s => s.status === 'in_progress').reduce((sum, s) => sum + s.totalAmount, 0) / 100000).toFixed(2)}L pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-slate-600">Avg Settlement</span>
              </div>
              <p className="text-2xl font-semibold text-purple-600">
                ₹{(settlements.reduce((sum, s) => sum + s.totalAmount, 0) / settlements.length / 100000).toFixed(2)}L
              </p>
              <p className="text-xs text-slate-500 mt-1">Per period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-slate-600">Total Payouts</span>
              </div>
              <p className="text-2xl font-semibold text-amber-600">
                {settlements.reduce((sum, s) => sum + s.payoutCount, 0)}
              </p>
              <p className="text-xs text-slate-500 mt-1">Across all periods</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </PageSection>

      <PageSection title={`Settlement Statements (${filteredSettlements.length})`}>
        <div className="space-y-6">
          {filteredSettlements.map((settlement) => (
            <Card key={settlement.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">{settlement.period}</h3>
                      <Badge className={getStatusColor(settlement.status)}>
                        {getStatusIcon(settlement.status)}
                        <span className="ml-1">{settlement.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">
                      {new Date(settlement.startDate).toLocaleDateString()} - {new Date(settlement.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Total Amount</p>
                    <p className="text-xl font-semibold text-emerald-600">
                      ₹{(settlement.totalAmount / 100000).toFixed(2)}L
                    </p>
                  </div>
                  
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Tenants</p>
                    <p className="text-xl font-semibold text-blue-600">
                      {settlement.tenantCount}
                    </p>
                  </div>
                  
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Payouts</p>
                    <p className="text-xl font-semibold text-purple-600">
                      {settlement.payoutCount}
                    </p>
                  </div>
                  
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Avg per Tenant</p>
                    <p className="text-xl font-semibold text-slate-800">
                      ₹{((settlement.totalAmount / settlement.tenantCount) / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Breakdown by Blueprint</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(settlement.breakdown).map(([blueprint, amount]) => (
                      <div key={blueprint} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <span className="text-sm text-slate-600 capitalize">{blueprint}</span>
                        <span className="text-sm font-semibold text-slate-900">
                          ₹{((amount as number) / 100000).toFixed(2)}L
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-500">
                    <div>
                      <span className="font-medium">Generated:</span> {new Date(settlement.generatedDate).toLocaleString('en-IN')}
                    </div>
                    <div>
                      <span className="font-medium">Due Date:</span> {new Date(settlement.dueDate).toLocaleDateString()}
                    </div>
                    {settlement.completedDate && (
                      <div>
                        <span className="font-medium">Completed:</span> {new Date(settlement.completedDate).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>

                {settlement.status === "in_progress" && (
                  <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <Clock className="h-4 w-4 inline mr-2" />
                      Settlement processing in progress. Expected completion by {new Date(settlement.dueDate).toLocaleDateString()}.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection title="Settlement Timeline">
        <Card>
          <CardHeader>
            <CardTitle>Processing Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-700">1</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">Period End</h4>
                  <p className="text-sm text-slate-600">Last day of the month - commission period closes</p>
                </div>
                <span className="text-xs text-slate-500">Day 0</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-700">2</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">Statement Generation</h4>
                  <p className="text-sm text-slate-600">Automated calculation and statement generation</p>
                </div>
                <span className="text-xs text-slate-500">Day 1</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-amber-700">3</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">Review Period</h4>
                  <p className="text-sm text-slate-600">Tenants review statements and raise disputes if needed</p>
                </div>
                <span className="text-xs text-slate-500">Day 1-3</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-emerald-700">4</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">Payout Processing</h4>
                  <p className="text-sm text-slate-600">Approved payouts are processed and transferred</p>
                </div>
                <span className="text-xs text-slate-500">Day 4-5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}