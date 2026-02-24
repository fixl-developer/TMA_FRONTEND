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
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Workflow className="h-3.5 w-3.5 text-[#0078d4]" />
            Phase 4
          </span>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Active workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {loading ? "—" : metrics.activeWorkflows}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                of {metrics.totalWorkflows} automation workflows
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Open incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#ffb900]">
                {loading ? "—" : metrics.openIncidents}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                P0/P1 requiring attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Active threats</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#d13438]">
                {loading ? "—" : metrics.activeThreats}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Security signals
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Alerts enabled</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">
                {loading ? "—" : metrics.enabledAlerts}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                SLO / metric alerts
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded border border-[#edebe9] bg-white p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[#0078d4] text-white"
                : "text-[#605e5c] hover:bg-[#f3f2f1] hover:text-[#323130]"
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
                <CardTitle className="text-sm font-semibold">Automation workflows</CardTitle>
                <p className="text-xs text-[#605e5c]">
                  Trigger-based workflows. Policies and guardrails.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-[#605e5c]">Loading…</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-[#edebe9] text-left text-[#605e5c]">
                          <th className="pb-3 pr-4 font-medium">Name</th>
                          <th className="pb-3 pr-4 font-medium">Trigger</th>
                          <th className="pb-3 pr-4 font-medium">Runs (24h)</th>
                          <th className="pb-3 pr-4 font-medium">Last run</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workflows.map((w) => (
                          <tr key={w._id} className="border-b border-[#f3f2f1] hover:bg-[#faf9f8]">
                            <td className="py-3 pr-4 font-medium text-[#323130]">{w.name}</td>
                            <td className="py-3 pr-4 font-mono text-xs text-[#605e5c]">{w.trigger}</td>
                            <td className="py-3 pr-4 text-[#605e5c]">{w.runsLast24h}</td>
                            <td className="py-3 pr-4 text-[#605e5c]">
                              {w.lastRunAt ? new Date(w.lastRunAt).toLocaleString('en-IN') : "—"}
                            </td>
                            <td className="py-3">
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                w.status === "ACTIVE" ? "bg-[#107c10] text-white border-[#107c10]" :
                                "bg-[#a19f9d] text-white border-[#a19f9d]"
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
                <CardTitle className="text-sm font-semibold">Automation controls</CardTitle>
                <p className="text-xs text-[#605e5c]">
                  Rate limits, approval gates, idempotency.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded border border-[#edebe9] bg-[#faf9f8] px-4 py-3">
                    <p className="text-xs font-medium text-[#605e5c]">Max runs/hour</p>
                    <p className="text-lg font-semibold text-[#323130]">100</p>
                  </div>
                  <div className="rounded border border-[#edebe9] bg-[#faf9f8] px-4 py-3">
                    <p className="text-xs font-medium text-[#605e5c]">Approval required</p>
                    <p className="text-lg font-semibold text-[#323130]">Payout &gt; ₹50k</p>
                  </div>
                  <div className="rounded border border-[#edebe9] bg-[#faf9f8] px-4 py-3">
                    <p className="text-xs font-medium text-[#605e5c]">Idempotency</p>
                    <p className="text-lg font-semibold text-[#323130]">Enabled</p>
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
                <CardTitle className="text-sm font-semibold">Incident log</CardTitle>
                <p className="text-xs text-[#605e5c]">
                  Platform incidents. Resolution timeline.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-[#605e5c]">Loading…</p>
                ) : (
                  <div className="space-y-3">
                    {incidents.map((i) => (
                      <div
                        key={i._id}
                        className={`flex items-center justify-between gap-4 rounded border p-4 ${
                          i.type === "P0" ? "border-[#d13438] bg-[#fef6f6]" : "border-[#ffb900] bg-[#fffef5]"
                        }`}
                      >
                        <div>
                          <p className="font-medium text-[#323130]">{i.title}</p>
                          <p className="text-xs text-[#605e5c]">{i.module} · {i.impact}</p>
                          <p className="text-xs text-[#605e5c]">
                            {new Date(i.createdAt).toLocaleString('en-IN')}
                            {i.resolvedAt && ` → Resolved ${new Date(i.resolvedAt).toLocaleString('en-IN')}`}
                          </p>
                        </div>
                        <span className={`shrink-0 rounded border px-2.5 py-1 text-xs font-medium ${
                          i.type === "P0" ? "bg-[#d13438] text-white border-[#d13438]" :
                          "bg-[#ffb900] text-[#323130] border-[#ffb900]"
                        }`}>
                          {i.type}
                        </span>
                        <span className={`shrink-0 rounded border px-2.5 py-1 text-xs font-medium ${
                          i.status === "RESOLVED" ? "bg-[#107c10] text-white border-[#107c10]" :
                          "bg-[#ffb900] text-[#323130] border-[#ffb900]"
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
                <CardTitle className="text-sm font-semibold">Security signals</CardTitle>
                <p className="text-xs text-[#605e5c]">
                  Brute force, suspicious API, cross-tenant attempts.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-[#605e5c]">Loading…</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-[#edebe9] text-left text-[#605e5c]">
                          <th className="pb-3 pr-4 font-medium">Type</th>
                          <th className="pb-3 pr-4 font-medium">Severity</th>
                          <th className="pb-3 pr-4 font-medium">Count</th>
                          <th className="pb-3 pr-4 font-medium">Action</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {threats.map((t) => (
                          <tr key={t._id} className="border-b border-[#f3f2f1] hover:bg-[#faf9f8]">
                            <td className="py-3 pr-4 font-medium text-[#323130]">{t.type.replace(/_/g, " ")}</td>
                            <td className="py-3 pr-4">
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                t.severity === "HIGH" ? "bg-[#d13438] text-white border-[#d13438]" :
                                t.severity === "MEDIUM" ? "bg-[#ffb900] text-[#323130] border-[#ffb900]" :
                                "bg-[#a19f9d] text-white border-[#a19f9d]"
                              }`}>
                                {t.severity}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-[#605e5c]">{t.count}</td>
                            <td className="py-3 pr-4 text-[#605e5c]">{t.action}</td>
                            <td className="py-3">
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                t.status === "BLOCKED" || t.status === "MITIGATED" ? "bg-[#107c10] text-white border-[#107c10]" :
                                "bg-[#a19f9d] text-white border-[#a19f9d]"
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
                <CardTitle className="text-sm font-semibold">SOC 2 / ISO 27001</CardTitle>
                <p className="text-xs text-[#605e5c]">
                  Control mapping and evidence.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-[#605e5c]">Loading…</p>
                ) : compliance ? (
                  <div className="space-y-6">
                    {Object.entries(compliance).map(([framework, controls]: [string, any]) => (
                      <div key={framework}>
                        <h3 className="mb-2 text-xs font-semibold text-[#323130]">{framework}</h3>
                        <ul className="space-y-1">
                          {controls.map((c: any, i: number) => (
                            <li
                              key={i}
                              className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2"
                            >
                              <span className="font-mono text-xs text-[#605e5c]">{c.control}</span>
                              <span className="text-xs text-[#323130]">{c.name}</span>
                              <span className="text-xs text-[#605e5c]">{c.evidence}</span>
                              <span className="rounded border border-[#107c10] bg-[#107c10] px-2 py-0.5 text-xs font-medium text-white">
                                {c.status}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#605e5c]">No compliance data.</p>
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
                <CardTitle className="text-sm font-semibold">SLO / metric alerts</CardTitle>
                <p className="text-xs text-[#605e5c]">
                  Threshold-based alerts. P0/P1 severity.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-[#605e5c]">Loading…</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-[#edebe9] text-left text-[#605e5c]">
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
                          <tr key={a._id} className="border-b border-[#f3f2f1] hover:bg-[#faf9f8]">
                            <td className="py-3 pr-4 font-medium text-[#323130]">{a.name}</td>
                            <td className="py-3 pr-4 font-mono text-xs text-[#605e5c]">{a.metric}</td>
                            <td className="py-3 pr-4 text-[#605e5c]">&gt; {a.threshold} {a.unit}</td>
                            <td className="py-3 pr-4">
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                a.severity === "P0" ? "bg-[#d13438] text-white border-[#d13438]" :
                                "bg-[#ffb900] text-[#323130] border-[#ffb900]"
                              }`}>
                                {a.severity}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-[#605e5c]">
                              {a.lastTriggeredAt ? new Date(a.lastTriggeredAt).toLocaleString('en-IN') : "Never"}
                            </td>
                            <td className="py-3">
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                a.enabled ? "bg-[#107c10] text-white border-[#107c10]" :
                                "bg-[#a19f9d] text-white border-[#a19f9d]"
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
                <CardTitle className="text-sm font-semibold">Dashboard exports</CardTitle>
                <p className="text-xs text-[#605e5c]">
                  Platform, finance, tenant dashboards. CSV/PDF export.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded border border-[#edebe9] bg-[#faf9f8] px-4 py-3">
                    <p className="text-xs font-medium text-[#605e5c]">Platform overview</p>
                    <p className="text-xs text-[#323130]">Tenants, GMV, active users</p>
                  </div>
                  <div className="rounded border border-[#edebe9] bg-[#faf9f8] px-4 py-3">
                    <p className="text-xs font-medium text-[#605e5c]">Finance</p>
                    <p className="text-xs text-[#323130]">Revenue, payouts, escrow</p>
                  </div>
                  <div className="rounded border border-[#edebe9] bg-[#faf9f8] px-4 py-3">
                    <p className="text-xs font-medium text-[#605e5c]">Trust & Safety</p>
                    <p className="text-xs text-[#323130]">Disputes, moderation</p>
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
