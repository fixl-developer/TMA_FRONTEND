/**
 * Fraud Investigations
 *
 * Manage fraud investigation cases with evidence tracking and resolution workflow.
 */

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"

interface Investigation {
  id: string
  caseNumber: string
  title: string
  status: "open" | "investigating" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  assignedTo: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  entityType: string
  entityId: string
  entityName: string
  description: string
  findings: string[]
  evidence: Array<{
    type: string
    description: string
    timestamp: string
  }>
  actions: Array<{
    action: string
    timestamp: string
    performedBy: string
  }>
  estimatedLoss: number
  currency: string
  resolution?: string
}

export default function InvestigationsPage() {
  const [investigations, setInvestigations] = useState<Investigation[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetch("/data/seed/fraudInvestigations.json")
      .then((res) => res.json())
      .then((data) => {
        setInvestigations(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-rose-100 text-rose-700 border-rose-200"
      case "high": return "bg-orange-100 text-orange-700 border-orange-200"
      case "medium": return "bg-amber-100 text-amber-700 border-amber-200"
      case "low": return "bg-blue-100 text-blue-700 border-blue-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "investigating": return "bg-blue-100 text-blue-700 border-blue-200"
      case "open": return "bg-amber-100 text-amber-700 border-amber-200"
      case "closed": return "bg-slate-100 text-slate-700 border-slate-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const statuses = ["all", "open", "investigating", "resolved", "closed"]
  const filteredInvestigations = statusFilter === "all" 
    ? investigations 
    : investigations.filter(i => i.status === statusFilter)

  return (
    <PageLayout>
      <PageHeader
        title="Fraud Investigations"
        description="Manage and track fraud investigation cases"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            {investigations.length} Cases
          </span>
        }
        actions={
          <div className="flex gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              New Investigation
            </Button>
            <Link
              href="/superadmin/fraud"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        }
      />

      <PageSection title="Filter by status">
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {status === "all" ? "All Cases" : status}
              {status !== "all" && (
                <span className="ml-2 text-xs opacity-75">
                  ({investigations.filter(i => i.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </PageSection>

      <PageSection title="Investigation cases">
        {loading ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-slate-500">Loading investigations...</p>
            </CardContent>
          </Card>
        ) : filteredInvestigations.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-slate-500">No investigations found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInvestigations.map((inv) => (
              <Card key={inv.id} className="hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{inv.title}</CardTitle>
                        <Badge className={getPriorityColor(inv.priority)}>
                          {inv.priority}
                        </Badge>
                        <Badge className={getStatusColor(inv.status)}>
                          {inv.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="font-mono text-xs">{inv.caseNumber}</span>
                        <span>•</span>
                        <span>{inv.entityName}</span>
                        <span>•</span>
                        <span>Assigned to: {inv.assignedTo}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Estimated Loss</p>
                      <p className={`text-xl font-bold ${inv.estimatedLoss > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                        {formatCurrency(inv.estimatedLoss, inv.currency)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 mb-4">{inv.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Key Findings ({inv.findings.length})
                      </p>
                      <ul className="space-y-1">
                        {inv.findings.slice(0, 3).map((finding, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-slate-400 mt-0.5">•</span>
                            <span>{finding}</span>
                          </li>
                        ))}
                        {inv.findings.length > 3 && (
                          <li className="text-sm text-blue-600 font-medium">
                            +{inv.findings.length - 3} more findings
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Evidence ({inv.evidence.length})
                      </p>
                      <ul className="space-y-1">
                        {inv.evidence.slice(0, 3).map((evidence, idx) => (
                          <li key={idx} className="text-sm text-slate-600">
                            <span className="font-medium capitalize">{evidence.type.replace(/_/g, " ")}:</span>{" "}
                            {evidence.description}
                          </li>
                        ))}
                        {inv.evidence.length > 3 && (
                          <li className="text-sm text-blue-600 font-medium">
                            +{inv.evidence.length - 3} more evidence items
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 mb-4">
                    <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Recent Actions
                    </p>
                    <div className="space-y-2">
                      {inv.actions.slice(-3).reverse().map((action, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="text-blue-800">{action.action}</p>
                          <p className="text-xs text-blue-600">
                            {new Date(action.timestamp).toLocaleString('en-IN')} • {action.performedBy}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {inv.resolution && (
                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 mb-4">
                      <p className="text-sm font-medium text-emerald-900 mb-1 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Resolution
                      </p>
                      <p className="text-sm text-emerald-800">{inv.resolution}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      Created: {new Date(inv.createdAt).toLocaleDateString()}
                      {inv.resolvedAt && (
                        <> • Resolved: {new Date(inv.resolvedAt).toLocaleDateString()}</>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {inv.status === "open" && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Start Investigation
                        </Button>
                      )}
                      {inv.status === "investigating" && (
                        <>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                            Mark Resolved
                          </Button>
                          <Button size="sm" variant="outline">
                            Add Evidence
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        View Full Case
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageSection>

      <PageSection title="Case statistics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Total Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-800">{investigations.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {investigations.filter(i => i.status === "open" || i.status === "investigating").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">
                {investigations.filter(i => i.status === "resolved").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Total Loss Prevented</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-rose-600">
                {formatCurrency(
                  investigations.reduce((sum, i) => sum + i.estimatedLoss, 0),
                  "INR"
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
