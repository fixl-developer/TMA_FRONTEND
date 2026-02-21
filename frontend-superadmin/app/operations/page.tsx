/**
 * Operations - Super Admin
 *
 * Automation, Security, Analytics. Phase 4. Seed data only.
 * Tabs: Automation, Security, Analytics.
 */

"use client"

import { useEffect, useMemo, useState } from "react"
import { Workflow, Shield, BarChart3 } from "lucide-react"
import {
  getAutomationWorkflows,
  getSecurityIncidents,
  getSecurityThreats,
  getAnalyticsAlerts,
  getComplianceMapping,
} from "@/shared/services/operationsService"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"

type TabId = "automation" | "security" | "analytics"

export default function OperationsPage() {
  const [workflows, setWorkflows] = useState<any[]>([])
  const [incidents, setIncidents] = useState<any[]>([])
  const [threats, setThreats] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [compliance, setCompliance] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>("automation")

  useEffect(() => {
    const load = async () => {
      try {
        const [w, i, t, a, c] = await Promise.all([
          getAutomationWorkflows(),
          getSecurityIncidents(),
          getSecurityThreats(),
          getAnalyticsAlerts(),
          getComplianceMapping(),
        ])
        setWorkflows(w)
        setIncidents(i)
        setThreats(t)
        setAlerts(a)
        setCompliance(c)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const metrics = useMemo(() => {
    const activeWorkflows = workflows.filter((w) => w.status === "ACTIVE").length
    const openIncidents = incidents.filter((i) => i.status === "OPEN").length
    const activeThreats = threats.filter((t) => t.status !== "RESOLVED" && t.status !== "REVIEWED").length
    const enabledAlerts = alerts.filter((a) => a.enabled).length
    return {
      totalWorkflows: workflows.length,
      activeWorkflows,
      openIncidents,
      activeThreats,
      enabledAlerts,
    }
  }, [workflows, incidents, threats, alerts])

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "automation", label: "Automation", icon: <Workflow className="h-4 w-4" /> },
    { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Operations"
        description="Automation workflows, security threats & incidents, analytics alerts. Phase 4."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Workflow className="h-3.5 w-3.5 text-blue-500" />
            Phase 4
          </span>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Active workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-800">
                {loading ? "—" : metrics.activeWorkflows}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                of {metrics.totalWorkflows} automation workflows
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Open incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-amber-600">
                {loading ? "—" : metrics.openIncidents}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                P0/P1 requiring attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active threats</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-rose-600">
                {loading ? "—" : metrics.activeThreats}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Security signals
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Alerts enabled</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-sky-600">
                {loading ? "—" : metrics.enabledAlerts}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                SLO / metric alerts
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Automation */}
      {activeTab === "automation" && (
        <>
          <PageSection title="Workflows">
            <Card>
              <CardHeader>
                <CardTitle>Automation workflows</CardTitle>
                <p className="text-sm text-slate-500">
                  Trigger-based workflows. Policies and guardrails.
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
                          <th className="pb-3 pr-4 font-medium">Name</th>
                          <th className="pb-3 pr-4 font-medium">Trigger</th>
                          <th className="pb-3 pr-4 font-medium">Runs (24h)</th>
                          <th className="pb-3 pr-4 font-medium">Last run</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workflows.map((w) => (
                          <tr key={w._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="py-3 pr-4 font-medium text-slate-800">{w.name}</td>
                            <td className="py-3 pr-4 font-mono text-xs text-slate-600">{w.trigger}</td>
                            <td className="py-3 pr-4 text-slate-600">{w.runsLast24h}</td>
                            <td className="py-3 pr-4 text-slate-500">
                              {w.lastRunAt ? new Date(w.lastRunAt).toLocaleString() : "—"}
                            </td>
                            <td className="py-3">
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                w.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                                "bg-slate-100 text-slate-600 border-slate-200"
                              }`}>
                                {w.status}
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

          <PageSection title="Controls & guardrails">
            <Card>
              <CardHeader>
                <CardTitle>Automation controls</CardTitle>
                <p className="text-sm text-slate-500">
                  Rate limits, approval gates, idempotency.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-medium text-slate-500">Max runs/hour</p>
                    <p className="text-lg font-semibold text-slate-800">100</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-medium text-slate-500">Approval required</p>
                    <p className="text-lg font-semibold text-slate-800">Payout &gt; ₹50k</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-medium text-slate-500">Idempotency</p>
                    <p className="text-lg font-semibold text-slate-800">Enabled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PageSection>
        </>
      )}

      {/* Tab: Security */}
      {activeTab === "security" && (
        <>
          <PageSection title="Incidents (P0/P1)">
            <Card>
              <CardHeader>
                <CardTitle>Incident log</CardTitle>
                <p className="text-sm text-slate-500">
                  Platform incidents. Resolution timeline.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-500">Loading…</p>
                ) : (
                  <div className="space-y-3">
                    {incidents.map((i) => (
                      <div
                        key={i._id}
                        className={`flex items-center justify-between gap-4 rounded-lg border p-4 ${
                          i.type === "P0" ? "border-rose-200 bg-rose-50/50" : "border-amber-200 bg-amber-50/50"
                        }`}
                      >
                        <div>
                          <p className="font-medium text-slate-800">{i.title}</p>
                          <p className="text-sm text-slate-600">{i.module} · {i.impact}</p>
                          <p className="text-[11px] text-slate-500">
                            {new Date(i.createdAt).toLocaleString()}
                            {i.resolvedAt && ` → Resolved ${new Date(i.resolvedAt).toLocaleString()}`}
                          </p>
                        </div>
                        <span className={`shrink-0 rounded border px-2.5 py-1 text-xs font-medium ${
                          i.type === "P0" ? "bg-rose-100 text-rose-800 border-rose-200" :
                          "bg-amber-100 text-amber-800 border-amber-200"
                        }`}>
                          {i.type}
                        </span>
                        <span className={`shrink-0 rounded border px-2.5 py-1 text-xs font-medium ${
                          i.status === "RESOLVED" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                          "bg-amber-100 text-amber-800 border-amber-200"
                        }`}>
                          {i.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </PageSection>

          <PageSection title="Threats dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Security signals</CardTitle>
                <p className="text-sm text-slate-500">
                  Brute force, suspicious API, cross-tenant attempts.
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
                          <th className="pb-3 pr-4 font-medium">Type</th>
                          <th className="pb-3 pr-4 font-medium">Severity</th>
                          <th className="pb-3 pr-4 font-medium">Count</th>
                          <th className="pb-3 pr-4 font-medium">Action</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {threats.map((t) => (
                          <tr key={t._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="py-3 pr-4 font-medium text-slate-800">{t.type.replace(/_/g, " ")}</td>
                            <td className="py-3 pr-4">
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${
                                t.severity === "HIGH" ? "bg-rose-100 text-rose-800 border-rose-200" :
                                t.severity === "MEDIUM" ? "bg-amber-100 text-amber-800 border-amber-200" :
                                "bg-slate-100 text-slate-600 border-slate-200"
                              }`}>
                                {t.severity}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-slate-600">{t.count}</td>
                            <td className="py-3 pr-4 text-slate-600">{t.action}</td>
                            <td className="py-3">
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                t.status === "BLOCKED" || t.status === "MITIGATED" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                                "bg-slate-100 text-slate-600 border-slate-200"
                              }`}>
                                {t.status}
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

          <PageSection title="Compliance mapping">
            <Card>
              <CardHeader>
                <CardTitle>SOC 2 / ISO 27001</CardTitle>
                <p className="text-sm text-slate-500">
                  Control mapping and evidence.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-500">Loading…</p>
                ) : compliance ? (
                  <div className="space-y-6">
                    {Object.entries(compliance).map(([framework, controls]: [string, any]) => (
                      <div key={framework}>
                        <h3 className="mb-2 text-sm font-semibold text-slate-800">{framework}</h3>
                        <ul className="space-y-1">
                          {controls.map((c: any, i: number) => (
                            <li
                              key={i}
                              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2"
                            >
                              <span className="font-mono text-xs text-slate-600">{c.control}</span>
                              <span className="text-sm text-slate-800">{c.name}</span>
                              <span className="text-[11px] text-slate-500">{c.evidence}</span>
                              <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                                {c.status}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No compliance data.</p>
                )}
              </CardContent>
            </Card>
          </PageSection>
        </>
      )}

      {/* Tab: Analytics */}
      {activeTab === "analytics" && (
        <>
          <PageSection title="Alerts config">
            <Card>
              <CardHeader>
                <CardTitle>SLO / metric alerts</CardTitle>
                <p className="text-sm text-slate-500">
                  Threshold-based alerts. P0/P1 severity.
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
                          <th className="pb-3 pr-4 font-medium">Alert</th>
                          <th className="pb-3 pr-4 font-medium">Metric</th>
                          <th className="pb-3 pr-4 font-medium">Threshold</th>
                          <th className="pb-3 pr-4 font-medium">Severity</th>
                          <th className="pb-3 pr-4 font-medium">Last triggered</th>
                          <th className="pb-3 font-medium">Enabled</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alerts.map((a) => (
                          <tr key={a._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="py-3 pr-4 font-medium text-slate-800">{a.name}</td>
                            <td className="py-3 pr-4 font-mono text-xs text-slate-600">{a.metric}</td>
                            <td className="py-3 pr-4 text-slate-600">&gt; {a.threshold} {a.unit}</td>
                            <td className="py-3 pr-4">
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${
                                a.severity === "P0" ? "bg-rose-100 text-rose-800 border-rose-200" :
                                "bg-amber-100 text-amber-800 border-amber-200"
                              }`}>
                                {a.severity}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-slate-500">
                              {a.lastTriggeredAt ? new Date(a.lastTriggeredAt).toLocaleString() : "Never"}
                            </td>
                            <td className="py-3">
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                a.enabled ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                                "bg-slate-100 text-slate-600 border-slate-200"
                              }`}>
                                {a.enabled ? "ON" : "OFF"}
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

          <PageSection title="Insights">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard exports</CardTitle>
                <p className="text-sm text-slate-500">
                  Platform, finance, tenant dashboards. CSV/PDF export.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-medium text-slate-500">Platform overview</p>
                    <p className="text-sm text-slate-800">Tenants, GMV, active users</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-medium text-slate-500">Finance</p>
                    <p className="text-sm text-slate-800">Revenue, payouts, escrow</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-medium text-slate-500">Trust & Safety</p>
                    <p className="text-sm text-slate-800">Disputes, moderation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PageSection>
        </>
      )}
    </PageLayout>
  )
}
