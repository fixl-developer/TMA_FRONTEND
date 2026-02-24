/**
 * Enhanced Audit Log Viewer - Super Admin
 *
 * Comprehensive audit tracking across the platform.
 * Phase 2: Enhanced audit log viewer with advanced search and compliance reports.
 */

"use client"

import { useEffect, useMemo, useState } from "react"
import { Shield, Search, Download, AlertTriangle, FileText } from "lucide-react"
import auditData from "@/data/seed/auditLogs.json"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { getTenantName } from "@/shared/services/userService"

type AuditEvent = {
  _id: string
  timestamp: string
  tenantId: string
  userId: string
  userEmail: string
  action: string
  resource: string
  resourceId: string
  category: string
  severity: string
  ipAddress: string
  userAgent: string
  changes: any
  metadata: any
}

type CategoryFilter = "ALL" | "USER_MANAGEMENT" | "SECURITY" | "FINANCIAL" | "COMPLIANCE" | "DATA_ACCESS" | "SYSTEM_CONFIG"
type SeverityFilter = "ALL" | "INFO" | "WARNING" | "CRITICAL"

const severityColors = {
  INFO: "bg-[#0078d4] text-white border-[#0078d4]",
  WARNING: "bg-[#ffb900] text-[#323130] border-[#ffb900]",
  CRITICAL: "bg-[#d13438] text-white border-[#d13438]",
}

const categoryColors = {
  USER_MANAGEMENT: "bg-[#605e5c] text-white border-[#605e5c]",
  SECURITY: "bg-[#d13438] text-white border-[#d13438]",
  FINANCIAL: "bg-[#107c10] text-white border-[#107c10]",
  COMPLIANCE: "bg-[#ffb900] text-[#323130] border-[#ffb900]",
  DATA_ACCESS: "bg-[#0078d4] text-white border-[#0078d4]",
  SYSTEM_CONFIG: "bg-[#8661c5] text-white border-[#8661c5]",
}

export default function AuditLogViewer() {
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [securityEvents, setSecurityEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL")
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Load seed data
    setEvents(auditData.auditEvents as AuditEvent[])
    setSecurityEvents(auditData.securityEvents)
    setLoading(false)
  }, [])

  const metrics = useMemo(() => {
    const total = events.length
    const byCategory = events.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1
      return acc
    }, {})
    const bySeverity = events.reduce<Record<string, number>>((acc, e) => {
      acc[e.severity] = (acc[e.severity] || 0) + 1
      return acc
    }, {})
    const criticalEvents = events.filter(e => e.severity === "CRITICAL").length
    const securityIncidents = securityEvents.filter(e => e.severity === "HIGH" || e.severity === "CRITICAL").length

    return {
      total,
      byCategory,
      bySeverity,
      criticalEvents,
      securityIncidents,
    }
  }, [events, securityEvents])

  const filteredEvents = useMemo(() => {
    let filtered = events

    if (categoryFilter !== "ALL") {
      filtered = filtered.filter(e => e.category === categoryFilter)
    }

    if (severityFilter !== "ALL") {
      filtered = filtered.filter(e => e.severity === severityFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(e =>
        e.action.toLowerCase().includes(query) ||
        e.userEmail.toLowerCase().includes(query) ||
        e.resource.toLowerCase().includes(query) ||
        e.resourceId.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [events, categoryFilter, severityFilter, searchQuery])

  return (
    <PageLayout>
      <PageHeader
        title="Audit Log"
        description="Comprehensive audit tracking across the platform. Monitor all actions, security events, and compliance activities."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Shield className="h-3.5 w-3.5 text-[#0078d4]" />
            Enhanced
          </span>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Total events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {loading ? "—" : metrics.total.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                All audit events in seed data
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Critical events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#d13438]">
                {loading ? "—" : metrics.criticalEvents}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Require immediate attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Security incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#ffb900]">
                {loading ? "—" : metrics.securityIncidents}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                High/critical security events
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Compliance reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">
                {loading ? "—" : auditData.complianceReports.length}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Generated compliance reports
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Security events">
        <Card>
          <CardHeader>
            <CardTitle>Recent security incidents</CardTitle>
            <p className="text-sm text-slate-500">
              High-priority security events requiring attention
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-slate-500">Loading…</p>
            ) : (
              <div className="space-y-3">
                {securityEvents.map((event) => (
                  <div
                    key={event._id}
                    className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className={`h-4 w-4 ${
                          event.severity === "CRITICAL" ? "text-rose-600" :
                          event.severity === "HIGH" ? "text-amber-600" :
                          "text-blue-600"
                        }`} />
                        <p className="font-medium text-slate-800">{event.eventType.replace(/_/g, " ")}</p>
                        <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                          event.severity === "CRITICAL" ? "bg-rose-50 text-rose-700 border-rose-200" :
                          event.severity === "HIGH" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                          {event.severity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>IP: {event.ipAddress}</span>
                        <span>Location: {event.location}</span>
                        {event.userId && <span>User: {event.userId}</span>}
                        <span>Tenant: {getTenantName(event.tenantId)}</span>
                      </div>
                      <p className="mt-2 text-xs text-slate-600">
                        <span className="font-medium">Action taken:</span> {event.actionTaken}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded border px-2.5 py-1 text-xs font-medium ${
                      event.status === "BLOCKED" ? "bg-rose-50 text-rose-700 border-rose-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Audit events">
        <div className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by action, user, resource..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Category filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-600">Category:</span>
                  {(["ALL", "USER_MANAGEMENT", "SECURITY", "FINANCIAL", "COMPLIANCE", "DATA_ACCESS", "SYSTEM_CONFIG"] as CategoryFilter[]).map((cat) => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={categoryFilter === cat ? "default" : "outline"}
                      className={categoryFilter === cat ? "h-7 px-3 text-xs" : "h-7 px-3 text-xs"}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat.replace(/_/g, " ")}
                    </Button>
                  ))}
                </div>

                {/* Severity filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-600">Severity:</span>
                  {(["ALL", "INFO", "WARNING", "CRITICAL"] as SeverityFilter[]).map((sev) => (
                    <Button
                      key={sev}
                      size="sm"
                      variant={severityFilter === sev ? "default" : "outline"}
                      className={severityFilter === sev ? "h-7 px-3 text-xs" : "h-7 px-3 text-xs"}
                      onClick={() => setSeverityFilter(sev)}
                    >
                      {sev}
                    </Button>
                  ))}
                </div>

                {/* Export button */}
                <div className="flex justify-end">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export filtered results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events list */}
          <Card>
            <CardHeader>
              <CardTitle>Audit events ({filteredEvents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-slate-500">Loading…</p>
              ) : filteredEvents.length === 0 ? (
                <p className="text-center text-slate-500 py-8">No events match the current filters</p>
              ) : (
                <div className="space-y-2">
                  {filteredEvents.map((event) => (
                    <div
                      key={event._id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-slate-800">{event.action.replace(/_/g, " ")}</p>
                            <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                              categoryColors[event.category as keyof typeof categoryColors]
                            }`}>
                              {event.category.replace(/_/g, " ")}
                            </span>
                            <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                              severityColors[event.severity as keyof typeof severityColors]
                            }`}>
                              {event.severity}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                            <span>User: {event.userEmail}</span>
                            <span>Tenant: {getTenantName(event.tenantId)}</span>
                            <span>Resource: {event.resource} ({event.resourceId})</span>
                            <span>IP: {event.ipAddress}</span>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 shrink-0">
                          {new Date(event.timestamp).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {event.changes && (
                        <div className="mt-3 rounded border border-slate-200 bg-white p-3 text-xs">
                          <p className="font-medium text-slate-700 mb-2">Changes:</p>
                          <div className="grid grid-cols-2 gap-4">
                            {event.changes.before && (
                              <div>
                                <p className="text-slate-500 mb-1">Before:</p>
                                <pre className="text-slate-600 whitespace-pre-wrap">
                                  {JSON.stringify(event.changes.before, null, 2)}
                                </pre>
                              </div>
                            )}
                            {event.changes.after && (
                              <div>
                                <p className="text-slate-500 mb-1">After:</p>
                                <pre className="text-slate-600 whitespace-pre-wrap">
                                  {JSON.stringify(event.changes.after, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <div className="mt-2 text-xs text-slate-600">
                          <span className="font-medium">Metadata:</span>{" "}
                          {Object.entries(event.metadata).map(([key, value]) => (
                            <span key={key} className="ml-2">
                              {key}: {typeof value === "object" ? JSON.stringify(value) : String(value)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title="Compliance reports">
        <Card>
          <CardHeader>
            <CardTitle>Generated compliance reports</CardTitle>
            <p className="text-sm text-slate-500">
              GDPR, SOC2, and financial audit reports
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-slate-500">Loading…</p>
            ) : (
              <div className="space-y-3">
                {auditData.complianceReports.map((report) => (
                  <div
                    key={report._id}
                    className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <p className="font-medium text-slate-800">{report.reportType.replace(/_/g, " ")}</p>
                        <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                          report.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">Period: {report.period}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
                        {Object.entries(report.metrics).map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <p className="text-slate-500">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                            <p className="font-medium text-slate-800">{String(value)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-slate-600">
                        <p className="font-medium mb-1">Key findings:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          {report.findings.map((finding: string, idx: number) => (
                            <li key={idx}>{finding}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2 shrink-0">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Export history">
        <Card>
          <CardHeader>
            <CardTitle>Recent exports</CardTitle>
            <p className="text-sm text-slate-500">
              Audit log and compliance report exports
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-slate-500">Loading…</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="pb-3 pr-4 font-medium">Export type</th>
                      <th className="pb-3 pr-4 font-medium">Requested by</th>
                      <th className="pb-3 pr-4 font-medium">Date</th>
                      <th className="pb-3 pr-4 font-medium">Format</th>
                      <th className="pb-3 pr-4 font-medium">Records</th>
                      <th className="pb-3 pr-4 font-medium">Size</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditData.exportHistory.map((exp) => (
                      <tr key={exp._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-3 pr-4 font-medium text-slate-800">{exp.exportType.replace(/_/g, " ")}</td>
                        <td className="py-3 pr-4 text-slate-600">{exp.requestedBy}</td>
                        <td className="py-3 pr-4 text-slate-600">
                          {new Date(exp.requestedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">{exp.format}</td>
                        <td className="py-3 pr-4 text-slate-600">{exp.recordCount.toLocaleString()}</td>
                        <td className="py-3 pr-4 text-slate-600">{exp.fileSize}</td>
                        <td className="py-3">
                          <span className="inline-flex rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            {exp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
