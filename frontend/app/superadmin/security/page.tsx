"use client"

import { useState } from "react"
import { Shield, AlertTriangle, CheckCircle, XCircle, Activity, Lock, Server } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"

const SECURITY_EVENTS = [
  { _id: "sec_001", type: "FAILED_LOGIN", severity: "LOW", tenant: "tenant_008", description: "5 failed login attempts from IP 103.21.x.x", timestamp: "2025-02-20T08:42:00.000Z", resolved: false },
  { _id: "sec_002", type: "API_ABUSE", severity: "MEDIUM", tenant: "tenant_004", description: "Rate limit exceeded on /api/v1/bookings endpoint (450 req/min)", timestamp: "2025-02-20T07:18:00.000Z", resolved: true },
  { _id: "sec_003", type: "SUSPICIOUS_EXPORT", severity: "HIGH", tenant: "tenant_001", description: "Large data export of 50K records triggered by user_099", timestamp: "2025-02-19T22:05:00.000Z", resolved: false },
  { _id: "sec_004", type: "PERMISSION_ESCALATION", severity: "HIGH", tenant: "tenant_006", description: "Unauthorized role assignment attempt for user_t006", timestamp: "2025-02-19T18:30:00.000Z", resolved: true },
  { _id: "sec_005", type: "WEBHOOK_MISMATCH", severity: "LOW", tenant: "tenant_012", description: "Webhook signature mismatch from external provider", timestamp: "2025-02-18T14:00:00.000Z", resolved: true },
]

const PLATFORM_HEALTH = [
  { service: "API Gateway", status: "HEALTHY", latency: 42, uptime: 99.98 },
  { service: "Auth Service", status: "HEALTHY", latency: 18, uptime: 99.99 },
  { service: "Payment Engine", status: "DEGRADED", latency: 320, uptime: 99.85 },
  { service: "Notification Service", status: "HEALTHY", latency: 65, uptime: 99.92 },
  { service: "File Storage", status: "HEALTHY", latency: 110, uptime: 100 },
  { service: "Search Engine", status: "HEALTHY", latency: 88, uptime: 99.95 },
  { service: "Automation Engine", status: "HEALTHY", latency: 55, uptime: 99.90 },
  { service: "Analytics Pipeline", status: "INCIDENT", latency: 1200, uptime: 98.50 },
]

const API_KEYS = [
  { id: "key_001", name: "Razorpay Production", tenant: "Platform", lastUsed: "2025-02-20T09:00:00Z", status: "ACTIVE" },
  { id: "key_002", name: "Sendgrid Mail API", tenant: "Platform", lastUsed: "2025-02-20T08:55:00Z", status: "ACTIVE" },
  { id: "key_003", name: "StarCast Webhook", tenant: "tenant_001", lastUsed: "2025-02-19T17:20:00Z", status: "ACTIVE" },
  { id: "key_004", name: "Deprecated Integration", tenant: "tenant_008", lastUsed: "2025-01-10T10:00:00Z", status: "REVOKED" },
]

function getSeverityBadge(severity: string) {
  switch (severity) {
    case "LOW":
      return <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">Low</span>
    case "MEDIUM":
      return <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Medium</span>
    case "HIGH":
      return <span className="rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">High</span>
    case "CRITICAL":
      return <span className="rounded-md border border-red-300 bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800">Critical</span>
    default:
      return <span className="text-xs text-slate-400">{severity}</span>
  }
}

function getHealthDot(status: string) {
  switch (status) {
    case "HEALTHY": return <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
    case "DEGRADED": return <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
    case "INCIDENT": return <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
    default: return <span className="inline-block h-2 w-2 rounded-full bg-slate-300" />
  }
}

export default function SecurityPage() {
  const [events, setEvents] = useState(SECURITY_EVENTS)
  const [activeTab, setActiveTab] = useState<"health" | "events" | "api_keys">("health")

  const unresolvedCount = events.filter((e) => !e.resolved).length
  const healthyCount = PLATFORM_HEALTH.filter((s) => s.status === "HEALTHY").length
  const incidentCount = PLATFORM_HEALTH.filter((s) => s.status === "INCIDENT").length
  const degradedCount = PLATFORM_HEALTH.filter((s) => s.status === "DEGRADED").length

  function resolveEvent(id: string) {
    setEvents((prev) => prev.map((e) => e._id === id ? { ...e, resolved: true } : e))
  }

  return (
    <PageLayout>
      <PageHeader
        title="Platform Health & Security"
        description="Monitor service uptime, security incidents, API keys, and threat indicators."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Shield className="h-3.5 w-3.5 text-blue-500" />
            Security & Health
          </span>
        }
      />

      {/* Status banner */}
      {incidentCount > 0 ? (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm text-red-800">
            <strong>{incidentCount} service(s) experiencing issues.</strong> Analytics Pipeline latency critical at 1200ms.
          </p>
        </div>
      ) : (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
          <p className="text-sm text-emerald-800">All platform services operating normally.</p>
        </div>
      )}

      <PageSection>
        <MetricsGrid>
          <Card className="hover:border-emerald-400 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Healthy Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{healthyCount}<span className="text-lg font-normal text-slate-400">/{PLATFORM_HEALTH.length}</span></p>
            </CardContent>
          </Card>
          <Card className={`transition-colors ${incidentCount > 0 ? "border-red-300 hover:border-red-400" : "hover:border-blue-400"}`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Activity className={`h-4 w-4 ${incidentCount > 0 ? "text-red-500" : "text-slate-400"}`} />
                Active Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${incidentCount > 0 ? "text-red-600" : "text-slate-900"}`}>{incidentCount}</p>
            </CardContent>
          </Card>
          <Card className="hover:border-blue-400 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Shield className="h-4 w-4 text-blue-500" />
                Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{events.length}</p>
            </CardContent>
          </Card>
          <Card className={`transition-colors ${unresolvedCount > 0 ? "border-amber-300 hover:border-amber-400" : "hover:border-blue-400"}`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <XCircle className={`h-4 w-4 ${unresolvedCount > 0 ? "text-amber-500" : "text-slate-400"}`} />
                Unresolved Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${unresolvedCount > 0 ? "text-amber-600" : "text-slate-900"}`}>{unresolvedCount}</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      {/* Tab nav */}
      <div className="mb-6 border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          {[
            { id: "health", label: "Service Health" },
            { id: "events", label: `Security Events (${unresolvedCount} open)` },
            { id: "api_keys", label: "API Keys" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Service Health */}
      {activeTab === "health" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_HEALTH.map((service) => (
            <Card key={service.service} className={`transition-shadow hover:shadow-md ${service.status === "INCIDENT" ? "border-red-200" : service.status === "DEGRADED" ? "border-amber-200" : ""}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  {getHealthDot(service.status)}
                  {service.service}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Latency</dt>
                    <dd className={`font-semibold ${service.latency > 500 ? "text-red-600" : service.latency > 100 ? "text-amber-600" : "text-emerald-600"}`}>
                      {service.latency}ms
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Uptime</dt>
                    <dd className="font-semibold text-slate-800">{service.uptime}%</dd>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${service.status === "INCIDENT" ? "bg-red-400" : service.status === "DEGRADED" ? "bg-amber-400" : "bg-emerald-400"}`}
                      style={{ width: `${service.uptime}%` }}
                    />
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Security Events */}
      {activeTab === "events" && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Event</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Severity</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Tenant</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Timestamp</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((evt) => (
                    <tr key={evt._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-800">{evt.description}</p>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-500">{evt.type}</span>
                      </td>
                      <td className="px-4 py-3">{getSeverityBadge(evt.severity)}</td>
                      <td className="px-4 py-3 text-slate-500">{evt.tenant}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-400">{new Date(evt.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {evt.resolved ? (
                          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Resolved</span>
                        ) : (
                          <span className="rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">Open</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {!evt.resolved && (
                          <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                            onClick={() => resolveEvent(evt._id)}>
                            <CheckCircle className="mr-1 h-3.5 w-3.5" /> Resolve
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Keys */}
      {activeTab === "api_keys" && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Key Name</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Scope</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Last Used</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {API_KEYS.map((key) => (
                    <tr key={key.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-slate-400" />
                          <span className="font-medium text-slate-800">{key.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{key.tenant}</td>
                      <td className="px-4 py-3 text-slate-400">{new Date(key.lastUsed).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {key.status === "ACTIVE" ? (
                          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Active</span>
                        ) : (
                          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500">Revoked</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {key.status === "ACTIVE" ? (
                          <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">Revoke</Button>
                        ) : (
                          <Button size="sm" variant="outline">View Logs</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  )
}
