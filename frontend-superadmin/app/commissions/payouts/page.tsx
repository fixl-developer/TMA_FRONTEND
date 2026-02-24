"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Clock, CheckCircle, XCircle, Play, Pause, Eye, Search, AlertCircle } from "lucide-react"
import { useState } from "react"
import commissionEngine from "@/data/seed/commissionEngine.json"

export default function PayoutsQueuePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  
  const payouts = commissionEngine.payoutQueue

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = payout.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.tenantId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || payout.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || payout.priority === selectedPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "processing": return "bg-blue-50 text-blue-700 border-blue-200"
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200"
      case "on_hold": return "bg-red-50 text-red-700 border-red-200"
      default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-50 text-red-700 border-red-200"
      case "medium": return "bg-amber-50 text-amber-700 border-amber-200"
      default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />
      case "processing": return <Clock className="h-4 w-4 animate-spin" />
      case "on_hold": return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Payout Queue Management"
        subtitle="Monitor and manage commission payouts across all tenants"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            {payouts.length} Payouts
          </span>
        }
      />

      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-slate-600">Pending</span>
              </div>
              <p className="text-2xl font-semibold text-amber-600">
                {payouts.filter(p => p.status === 'pending').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ₹{(payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0) / 100000).toFixed(2)}L
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-500 animate-spin" />
                <span className="text-sm text-slate-600">Processing</span>
              </div>
              <p className="text-2xl font-semibold text-blue-600">
                {payouts.filter(p => p.status === 'processing').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ₹{(payouts.filter(p => p.status === 'processing').reduce((sum, p) => sum + p.amount, 0) / 100000).toFixed(2)}L
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-slate-600">Completed</span>
              </div>
              <p className="text-2xl font-semibold text-emerald-600">
                {payouts.filter(p => p.status === 'completed').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ₹{(payouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0) / 100000).toFixed(2)}L
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-slate-600">On Hold</span>
              </div>
              <p className="text-2xl font-semibold text-red-600">
                {payouts.filter(p => p.status === 'on_hold').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ₹{(payouts.filter(p => p.status === 'on_hold').reduce((sum, p) => sum + p.amount, 0) / 100000).toFixed(2)}L
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-slate-600">High Priority</span>
              </div>
              <p className="text-2xl font-semibold text-red-600">
                {payouts.filter(p => p.priority === 'high').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Urgent payouts</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by tenant name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-full lg:w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="w-full lg:w-auto">
            Process Selected
          </Button>
        </div>
      </PageSection>

      <PageSection title={`Payout Queue (${filteredPayouts.length})`}>
        <div className="space-y-4">
          {filteredPayouts.map((payout) => (
            <Card key={payout.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-800">{payout.tenantName}</h3>
                      <Badge className={getStatusColor(payout.status)}>
                        {getStatusIcon(payout.status)}
                        <span className="ml-1">{payout.status.replace('_', ' ')}</span>
                      </Badge>
                      <Badge className={getPriorityColor(payout.priority)}>
                        {payout.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {payout.blueprint}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-500 mb-3">
                      Tenant ID: {payout.tenantId} • Period: {payout.period}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Payout Amount</p>
                        <p className="text-lg font-semibold text-emerald-600">
                          ₹{(payout.amount / 1000).toFixed(0)}K
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Due Date</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {new Date(payout.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Payment Method</p>
                        <p className="text-sm font-semibold text-slate-800 capitalize">
                          {payout.paymentMethod.replace('_', ' ')}
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Created</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {new Date(payout.createdDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {payout.status === "pending" && (
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Process
                      </Button>
                    )}
                    {payout.status === "processing" && (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Commission Breakdown</h4>
                  <div className="space-y-2">
                    {payout.commissionBreakdown.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{item.rule}</span>
                        <span className="font-semibold text-slate-800">
                          ₹{(item.amount / 1000).toFixed(0)}K
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 mt-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Bank Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Account Name:</span>
                      <p className="font-medium text-slate-800">{payout.bankDetails.accountName}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Account Number:</span>
                      <p className="font-medium text-slate-800">{payout.bankDetails.accountNumber}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">IFSC Code:</span>
                      <p className="font-medium text-slate-800">{payout.bankDetails.ifsc}</p>
                    </div>
                  </div>
                </div>

                {payout.status === "on_hold" && payout.holdReason && (
                  <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-800">
                      <AlertCircle className="h-4 w-4 inline mr-2" />
                      <span className="font-medium">On Hold:</span> {payout.holdReason}
                    </p>
                  </div>
                )}

                {payout.status === "processing" && payout.processingStarted && (
                  <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <Clock className="h-4 w-4 inline mr-2 animate-spin" />
                      Processing started on {new Date(payout.processingStarted).toLocaleString()}
                    </p>
                  </div>
                )}

                {payout.status === "completed" && payout.completedDate && (
                  <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-sm text-emerald-800">
                      <CheckCircle className="h-4 w-4 inline mr-2" />
                      Completed on {new Date(payout.completedDate).toLocaleString()}
                      {payout.transactionId && ` • Transaction ID: ${payout.transactionId}`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </PageLayout>
  )
}