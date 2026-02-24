/**
 * Integrations - Super Admin
 *
 * APIs, Webhooks, Partners, Infra, Data & Legal. Phase 5. Seed data only.
 * Tabs: Integrations, Infrastructure, Data & Legal.
 */

"use client"

import { useEffect, useMemo, useState } from "react"
import { Plug2, Server, FileCheck } from "lucide-react"
import {
  getApiKeys,
  getWebhooks,
  getPartners,
  getDeployments,
  getMaintenanceWindows,
  getRetentionPolicies,
  getLegalHolds,
  getDsrRequests,
} from "@/shared/services/integrationsService"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { getTenantName } from "@/shared/services/userService"

type TabId = "integrations" | "infrastructure" | "data-legal"

export default function IntegrationsPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [deployments, setDeployments] = useState<any[]>([])
  const [maintenance, setMaintenance] = useState<any[]>([])
  const [retention, setRetention] = useState<any[]>([])
  const [legalHolds, setLegalHolds] = useState<any[]>([])
  const [dsrRequests, setDsrRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>("integrations")

  useEffect(() => {
    const load = async () => {
      try {
        const [keys, wh, part, dep, maint, ret, holds, dsr] = await Promise.all([
          getApiKeys(),
          getWebhooks(),
          getPartners(),
          getDeployments(),
          getMaintenanceWindows(),
          getRetentionPolicies(),
          getLegalHolds(),
          getDsrRequests(),
        ])
        setApiKeys(keys)
        setWebhooks(wh)
        setPartners(part)
        setDeployments(dep)
        setMaintenance(maint)
        setRetention(ret)
        setLegalHolds(holds)
        setDsrRequests(dsr)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const metrics = useMemo(() => {
    const activeWebhooks = webhooks.filter((w) => w.status === "ACTIVE").length
    const pendingDsr = dsrRequests.filter((d) => d.status === "PENDING").length
    const activeHolds = legalHolds.filter((h) => h.status === "ACTIVE").length
    return {
      totalApiKeys: apiKeys.length,
      activeWebhooks,
      totalPartners: partners.length,
      pendingDsr,
      activeHolds,
    }
  }, [apiKeys, webhooks, partners, dsrRequests, legalHolds])

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "integrations", label: "Integrations", icon: <Plug2 className="h-4 w-4" /> },
    { id: "infrastructure", label: "Infrastructure", icon: <Server className="h-4 w-4" /> },
    { id: "data-legal", label: "Data & Legal", icon: <FileCheck className="h-4 w-4" /> },
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Integrations"
        description="APIs, webhooks, partners, deployments, maintenance, data & legal. Phase 5."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Plug2 className="h-3.5 w-3.5 text-[#0078d4]" />
            Phase 5
          </span>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">API keys</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {loading ? "—" : metrics.totalApiKeys}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Tenant API keys
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Active webhooks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">
                {loading ? "—" : metrics.activeWebhooks}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                of {webhooks.length} configured
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">
                {loading ? "—" : metrics.totalPartners}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Payment, email, storage
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">DSR pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#ffb900]">
                {loading ? "—" : metrics.pendingDsr}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Data subject requests
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

      {/* Tab: Integrations */}
      {activeTab === "integrations" && (
        <>
          <PageSection title="API keys">
            <Card>
              <CardHeader>
                <CardTitle>Tenant API keys</CardTitle>
                <p className="text-sm text-slate-500">
                  Usage and scopes. Key prefix only (full key never shown).
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
                          <th className="pb-3 pr-4 font-medium">Tenant</th>
                          <th className="pb-3 pr-4 font-medium">Key</th>
                          <th className="pb-3 pr-4 font-medium">Requests (30d)</th>
                          <th className="pb-3 pr-4 font-medium">Last used</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apiKeys.map((k) => (
                          <tr key={k._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="py-3 pr-4 font-medium text-slate-800">{k.name}</td>
                            <td className="py-3 pr-4 text-slate-600">{getTenantName(k.tenantId)}</td>
                            <td className="py-3 pr-4 font-mono text-xs text-slate-600">{k.keyPrefix}</td>
                            <td className="py-3 pr-4 text-slate-600">{k.requestsLast30d?.toLocaleString('en-IN')}</td>
                            <td className="py-3 pr-4 text-slate-500">
                              {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString('en-IN') : "—"}
                            </td>
                            <td className="py-3">
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                k.status === "ACTIVE" ? "bg-[#107c10] text-white border-[#107c10]" :
                                "bg-[#a19f9d] text-white border-[#a19f9d]"
                              }`}>
                                {k.status}
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

          <PageSection title="Webhooks">
            <Card>
              <CardHeader>
                <CardTitle>Webhook endpoints</CardTitle>
                <p className="text-sm text-slate-500">
                  Event subscriptions. Delivery status and success rate.
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
                          <th className="pb-3 pr-4 font-medium">Tenant</th>
                          <th className="pb-3 pr-4 font-medium">URL</th>
                          <th className="pb-3 pr-4 font-medium">Events</th>
                          <th className="pb-3 pr-4 font-medium">Success rate</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {webhooks.map((w) => (
                          <tr key={w._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="py-3 pr-4 text-slate-600">{getTenantName(w.tenantId)}</td>
                            <td className="py-3 pr-4 font-mono text-xs text-slate-600 max-w-[200px] truncate">{w.url}</td>
                            <td className="py-3 pr-4 text-slate-600 text-xs">{w.events?.join(", ")}</td>
                            <td className="py-3 pr-4 text-slate-600">{w.successRate}%</td>
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

          <PageSection title="Partners">
            <Card>
              <CardHeader>
                <CardTitle>Integration partners</CardTitle>
                <p className="text-sm text-slate-500">
                  Payment, email, storage providers.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-500">Loading…</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {partners.map((p) => (
                      <div
                        key={p._id}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <p className="font-medium text-slate-800">{p.name}</p>
                        <p className="text-[11px] text-slate-500">{p.type}</p>
                        <p className="mt-1 text-sm text-slate-600">{p.tenantCount} tenants</p>
                        <span className="mt-2 inline-flex rounded border border-[#107c10] bg-[#107c10] px-2 py-0.5 text-xs font-medium text-white">
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </PageSection>
        </>
      )}

      {/* Tab: Infrastructure */}
      {activeTab === "infrastructure" && (
        <>
          <PageSection title="Deployments">
            <Card>
              <CardHeader>
                <CardTitle>Deployment history</CardTitle>
                <p className="text-sm text-slate-500">
                  Production and staging releases.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-500">Loading…</p>
                ) : (
                  <div className="space-y-3">
                    {deployments.map((d) => (
                      <div
                        key={d._id}
                        className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4"
                      >
                        <div>
                          <p className="font-medium text-slate-800">{d.version}</p>
                          <p className="text-sm text-slate-600">{d.environment}</p>
                          <p className="text-[11px] text-slate-500">
                            {d.changes?.join(" · ")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600">
                            {new Date(d.deployedAt).toLocaleString('en-IN')}
                          </p>
                          <p className="text-[11px] text-slate-500">{d.duration}s</p>
                          <span className="mt-1 inline-flex rounded border border-[#107c10] bg-[#107c10] px-2 py-0.5 text-xs font-medium text-white">
                            {d.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </PageSection>

          <PageSection title="Maintenance windows">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled maintenance</CardTitle>
                <p className="text-sm text-slate-500">
                  Planned downtime and upgrades.
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
                          <th className="pb-3 pr-4 font-medium">Title</th>
                          <th className="pb-3 pr-4 font-medium">Scheduled</th>
                          <th className="pb-3 pr-4 font-medium">Impact</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {maintenance.map((m) => (
                          <tr key={m._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="py-3 pr-4 font-medium text-slate-800">{m.title}</td>
                            <td className="py-3 pr-4 text-slate-600">
                              {new Date(m.scheduledStart).toLocaleString('en-IN')} – {new Date(m.scheduledEnd).toLocaleTimeString('en-IN')}
                            </td>
                            <td className="py-3 pr-4 text-slate-600">{m.impact}</td>
                            <td className="py-3">
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                m.status === "SCHEDULED" ? "bg-[#ffb900] text-[#323130] border-[#ffb900]" :
                                "bg-[#107c10] text-white border-[#107c10]"
                              }`}>
                                {m.status}
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

          <PageSection title="Infra health">
            <Card>
              <CardHeader>
                <CardTitle>Service status</CardTitle>
                <p className="text-sm text-slate-500">
                  API, DB, Redis, Queue. Seed placeholder.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {["API", "Database", "Redis", "Queue"].map((svc) => (
                    <div key={svc} className="rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3">
                      <p className="font-medium text-slate-800">{svc}</p>
                      <span className="mt-1 inline-flex rounded border border-[#107c10] bg-[#107c10] px-2 py-0.5 text-xs font-medium text-white">
                        Operational
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </PageSection>
        </>
      )}

      {/* Tab: Data & Legal */}
      {activeTab === "data-legal" && (
        <>
          <PageSection title="Privacy (DSR)">
            <Card>
              <CardHeader>
                <CardTitle>Data subject requests</CardTitle>
                <p className="text-sm text-slate-500">
                  Access, erasure, portability. GDPR / DPDP.
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
                          <th className="pb-3 pr-4 font-medium">ID</th>
                          <th className="pb-3 pr-4 font-medium">Tenant</th>
                          <th className="pb-3 pr-4 font-medium">Type</th>
                          <th className="pb-3 pr-4 font-medium">Requested</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dsrRequests.map((d) => (
                          <tr key={d._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="py-3 pr-4 font-mono text-xs text-slate-600">{d._id}</td>
                            <td className="py-3 pr-4 text-slate-600">{getTenantName(d.tenantId)}</td>
                            <td className="py-3 pr-4 text-slate-600">{d.type}</td>
                            <td className="py-3 pr-4 text-slate-500">
                              {new Date(d.requestedAt).toLocaleDateString()}
                            </td>
                            <td className="py-3">
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                d.status === "PENDING" ? "bg-[#ffb900] text-[#323130] border-[#ffb900]" :
                                "bg-[#107c10] text-white border-[#107c10]"
                              }`}>
                                {d.status}
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

          <PageSection title="Retention policies">
            <Card>
              <CardHeader>
                <CardTitle>Data retention</CardTitle>
                <p className="text-sm text-slate-500">
                  Per-entity retention. Configurable.
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
                          <th className="pb-3 pr-4 font-medium">Entity type</th>
                          <th className="pb-3 pr-4 font-medium">Retention</th>
                          <th className="pb-3 pr-4 font-medium">Description</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {retention.map((r) => (
                          <tr key={r._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="py-3 pr-4 font-medium text-slate-800">{r.entityType}</td>
                            <td className="py-3 pr-4 text-slate-600">{r.retentionMonths} months</td>
                            <td className="py-3 pr-4 text-slate-600">{r.description}</td>
                            <td className="py-3">
                              <span className="inline-flex rounded border border-[#107c10] bg-[#107c10] px-2 py-0.5 text-xs font-medium text-white">
                                {r.status}
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

          <PageSection title="Legal hold">
            <Card>
              <CardHeader>
                <CardTitle>Legal holds</CardTitle>
                <p className="text-sm text-slate-500">
                  Litigation, regulatory. Preserve data.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-500">Loading…</p>
                ) : (
                  <div className="space-y-3">
                    {legalHolds.map((h) => (
                      <div
                        key={h._id}
                        className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4"
                      >
                        <div>
                          <p className="font-medium text-slate-800">{getTenantName(h.tenantId)}</p>
                          <p className="text-sm text-slate-600">{h.reason}</p>
                          <p className="text-[11px] text-slate-500">
                            Entities: {h.entityTypes?.join(", ")}
                          </p>
                        </div>
                        <span className={`shrink-0 rounded border px-2.5 py-1 text-xs font-medium ${
                          h.status === "ACTIVE" ? "bg-[#ffb900] text-[#323130] border-[#ffb900]" :
                          "bg-[#a19f9d] text-white border-[#a19f9d]"
                        }`}>
                          {h.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </PageSection>
        </>
      )}
    </PageLayout>
  )
}
