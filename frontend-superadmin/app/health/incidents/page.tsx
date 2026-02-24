/**
 * Incident Management
 *
 * Track and manage platform incidents.
 */

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, AlertTriangle, CheckCircle2, Clock, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"

interface Incident {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "investigating" | "resolved" | "closed"
  affectedServices: string[]
  startTime: string
  resolvedTime: string | null
  assignedTo: string
  updates: Array<{
    timestamp: string
    message: string
    author: string
  }>
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetch("/data/seed/incidents.json")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-rose-100 text-rose-700 border-rose-200"
      case "high": return "bg-orange-100 text-orange-700 border-orange-200"
      case "medium": return "bg-amber-100 text-amber-700 border-amber-200"
      case "low": return "bg-blue-100 text-blue-700 border-blue-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-rose-100 text-rose-700 border-rose-200"
      case "investigating": return "bg-amber-100 text-amber-700 border-amber-200"
      case "resolved": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "closed": return "bg-slate-100 text-slate-700 border-slate-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const statuses = ["all", "open", "investigating", "resolved", "closed"]
  const filteredIncidents = statusFilter === "all" 
    ? incidents 
    : incidents.filter(i => i.status === statusFilter)

  return (
    <PageLayout>
      <PageHeader
        title="Incident Management"
        description="Track and manage platform incidents"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            {incidents.filter(i => i.status === "open" || i.status === "investigating").length} Active
          </span>
        }
        actions={
          <div className="flex gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create Incident
            </Button>
            <Link
              href="/superadmin/health"
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
              {status === "all" ? "All Incidents" : status}
              {status !== "all" && (
                <span className="ml-2 text-xs opacity-75">
                  ({incidents.filter(i => i.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </PageSection>

      <PageSection title="Incidents">
        {loading ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-slate-500">Loading incidents...</p>
            </CardContent>
          </Card>
        ) : filteredIncidents.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-slate-500">No incidents found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <Card key={incident.id} className="hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{incident.title}</CardTitle>
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{incident.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Affected Services</p>
                      <div className="flex flex-wrap gap-1">
                        {incident.affectedServices.map((service, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Assigned To</p>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">{incident.assignedTo}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Duration</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">
                          {incident.resolvedTime 
                            ? `${Math.round((new Date(incident.resolvedTime).getTime() - new Date(incident.startTime).getTime()) / 60000)} min`
                            : "Ongoing"
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {incident.updates.length > 0 && (
                    <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-xs font-medium text-slate-700 mb-2">Recent Updates</p>
                      <div className="space-y-2">
                        {incident.updates.slice(0, 2).map((update, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-slate-700">{update.author}</span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-500">
                                {new Date(update.timestamp).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <p className="text-slate-600">{update.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      Started: {new Date(incident.startTime).toLocaleString('en-IN')}
                      {incident.resolvedTime && (
                        <> • Resolved: {new Date(incident.resolvedTime).toLocaleString('en-IN')}</>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {incident.status !== "closed" && (
                        <Button size="sm" variant="outline">
                          Update
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageSection>

      <PageSection title="Incident summary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statuses.filter(s => s !== "all").map(status => (
            <Card key={status}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-600 capitalize">
                  {status}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-800">
                  {incidents.filter(i => i.status === status).length}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </PageLayout>
  )
}
