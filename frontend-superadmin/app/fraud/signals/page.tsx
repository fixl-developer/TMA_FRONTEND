"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { AlertTriangle, Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import { useState } from "react"
import fraudRiskMonitoring from "@/data/seed/fraudRiskMonitoring.json"

export default function FraudSignalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  
  const signals = fraudRiskMonitoring.fraudSignals

  const filteredSignals = signals.filter(signal => {
    const matchesSearch = signal.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signal.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = selectedSeverity === "all" || signal.severity === selectedSeverity
    const matchesStatus = selectedStatus === "all" || signal.status === selectedStatus
    const matchesType = selectedType === "all" || signal.type === selectedType
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesType
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-50 text-red-700 border-red-200"
      case "high": return "bg-orange-50 text-orange-700 border-orange-200"
      case "medium": return "bg-amber-50 text-amber-700 border-amber-200"
      default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "investigating": return "bg-blue-50 text-blue-700 border-blue-200"
      case "active": return "bg-amber-50 text-amber-700 border-amber-200"
      default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved": return <CheckCircle className="h-4 w-4" />
      case "investigating": return <Clock className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Fraud Signals Monitoring"
        subtitle="Real-time fraud detection signals and automated threat identification"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
            {signals.length} Signals
          </span>
        }
      />

      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-sm text-slate-600">Critical</span>
              </div>
              <p className="text-2xl font-semibold text-red-600">
                {signals.filter(s => s.severity === 'critical').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                <span className="text-sm text-slate-600">High</span>
              </div>
              <p className="text-2xl font-semibold text-orange-600">
                {signals.filter(s => s.severity === 'high').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                <span className="text-sm text-slate-600">Medium</span>
              </div>
              <p className="text-2xl font-semibold text-amber-600">
                {signals.filter(s => s.severity === 'medium').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-slate-600">Investigating</span>
              </div>
              <p className="text-2xl font-semibold text-blue-600">
                {signals.filter(s => s.status === 'investigating').length}
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
                {signals.filter(s => s.status === 'resolved').length}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search signals by entity or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="velocity_check">Velocity Check</SelectItem>
              <SelectItem value="payment_anomaly">Payment Anomaly</SelectItem>
              <SelectItem value="behavior_anomaly">Behavior Anomaly</SelectItem>
              <SelectItem value="device_fingerprint">Device Fingerprint</SelectItem>
              <SelectItem value="content_fraud">Content Fraud</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PageSection>

      <PageSection title={`Fraud Signals (${filteredSignals.length})`}>
        <div className="space-y-4">
          {filteredSignals.map((signal) => (
            <Card key={signal.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-800">{signal.entityName}</h3>
                      <Badge className={getSeverityColor(signal.severity)}>
                        {signal.severity}
                      </Badge>
                      <Badge className={getStatusColor(signal.status)}>
                        {getStatusIcon(signal.status)}
                        <span className="ml-1">{signal.status}</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {signal.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-3">{signal.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Entity Type</p>
                        <p className="text-sm font-semibold text-slate-800 capitalize">
                          {signal.entityType}
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Risk Score</p>
                        <p className="text-sm font-semibold text-red-600">
                          {signal.riskScore}/100
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Detected</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {new Date(signal.detectedAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Assigned To</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {signal.assignedTo}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    {signal.status === "active" && (
                      <Button size="sm">
                        Investigate
                      </Button>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Fraud Indicators</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {signal.indicators.map((indicator: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{indicator}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Signal ID: {signal.id} • Entity ID: {signal.entityId}</span>
                    <span>Action: {signal.actionTaken}</span>
                  </div>
                </div>

                {signal.status === "resolved" && signal.resolution && (
                  <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-emerald-900">Resolved</p>
                        <p className="text-sm text-emerald-800 mt-1">{signal.resolution}</p>
                        <p className="text-xs text-emerald-700 mt-2">
                          Resolved on {new Date(signal.resolvedAt).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
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