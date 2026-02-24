"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { AlertCircle, CheckCircle, Clock, Eye, MessageSquare, Search, FileText } from "lucide-react"
import { useState } from "react"
import commissionEngine from "@/data/seed/commissionEngine.json"

export default function DisputesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  
  const disputes = commissionEngine.disputes

  const filteredDisputes = disputes.filter(dispute => {
    const matchesSearch = dispute.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dispute.tenantId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || dispute.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || dispute.priority === selectedPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "under_review": return "bg-blue-50 text-blue-700 border-blue-200"
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200"
      case "escalated": return "bg-red-50 text-red-700 border-red-200"
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
      case "resolved": return <CheckCircle className="h-4 w-4" />
      case "under_review": return <Clock className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Commission Disputes"
        subtitle="Manage and resolve commission calculation disputes and discrepancies"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
            {disputes.length} Disputes
          </span>
        }
      />

      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-slate-600">Under Review</span>
              </div>
              <p className="text-2xl font-semibold text-blue-600">
                {disputes.filter(d => d.status === 'under_review').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ₹{(disputes.filter(d => d.status === 'under_review').reduce((sum, d) => sum + d.amount, 0) / 100000).toFixed(2)}L disputed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-slate-600">Resolved</span>
              </div>
              <p className="text-2xl font-semibold text-emerald-600">
                {disputes.filter(d => d.status === 'resolved').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ₹{(disputes.filter(d => d.status === 'resolved').reduce((sum, d) => sum + d.amount, 0) / 100000).toFixed(2)}L resolved
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
                {disputes.filter(d => d.priority === 'high').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Urgent disputes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-slate-600">Avg Resolution</span>
              </div>
              <p className="text-2xl font-semibold text-amber-600">
                3.2 days
              </p>
              <p className="text-xs text-slate-500 mt-1">Average time</p>
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
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
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
        </div>
      </PageSection>

      <PageSection title={`Disputes (${filteredDisputes.length})`}>
        <div className="space-y-6">
          {filteredDisputes.map((dispute) => (
            <Card key={dispute.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-800">{dispute.tenantName}</h3>
                      <Badge className={getStatusColor(dispute.status)}>
                        {getStatusIcon(dispute.status)}
                        <span className="ml-1">{dispute.status.replace('_', ' ')}</span>
                      </Badge>
                      <Badge className={getPriorityColor(dispute.priority)}>
                        {dispute.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-500 mb-3">
                      Dispute ID: {dispute.id} • Payout ID: {dispute.payoutId}
                    </p>
                    
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mb-4">
                      <h4 className="font-semibold text-amber-900 mb-2">{dispute.reason}</h4>
                      <p className="text-sm text-amber-800">{dispute.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Disputed Amount</p>
                        <p className="text-lg font-semibold text-red-600">
                          ₹{(dispute.amount / 1000).toFixed(0)}K
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Filed Date</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {new Date(dispute.filedDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Assigned To</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {dispute.assignedTo}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                  </div>
                </div>

                {dispute.evidence && dispute.evidence.length > 0 && (
                  <div className="border-t border-slate-200 pt-4 mb-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Evidence Submitted</h4>
                    <div className="flex flex-wrap gap-2">
                      {dispute.evidence.map((item: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {dispute.status === "under_review" && dispute.expectedResolution && (
                  <div className="border-t border-slate-200 pt-4">
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <Clock className="h-4 w-4 inline mr-2" />
                        Expected resolution by {new Date(dispute.expectedResolution).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {dispute.status === "resolved" && dispute.resolution && (
                  <div className="border-t border-slate-200 pt-4">
                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                      <div className="flex items-start gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-emerald-900 mb-1">Resolved</h4>
                          <p className="text-sm text-emerald-800">{dispute.resolution}</p>
                          {dispute.resolvedDate && (
                            <p className="text-xs text-emerald-700 mt-2">
                              Resolved on {new Date(dispute.resolvedDate).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection title="Dispute Statistics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Dispute Reasons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-sm text-slate-600">Commission calculation discrepancy</span>
                  <Badge variant="outline">45%</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-sm text-slate-600">Missing commission entries</span>
                  <Badge variant="outline">30%</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-sm text-slate-600">Incorrect tier application</span>
                  <Badge variant="outline">15%</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-sm text-slate-600">Payment timing issues</span>
                  <Badge variant="outline">10%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resolution Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Average Resolution Time</span>
                    <span className="text-lg font-semibold text-slate-800">3.2 days</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="w-8/12 h-full bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Resolution Rate</span>
                    <span className="text-lg font-semibold text-emerald-600">94.5%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="w-11/12 h-full bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Tenant Satisfaction</span>
                    <span className="text-lg font-semibold text-blue-600">4.6/5.0</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="w-11/12 h-full bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}