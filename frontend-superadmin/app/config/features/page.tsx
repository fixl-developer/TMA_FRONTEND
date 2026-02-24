"use client"

import { useEffect, useMemo, useState } from "react"
import { Flag, GitBranch, Settings } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { getFeatureFlags, getRollouts, getPlatformConfig } from "@/shared/services/featuresService"
import { getTenantName } from "@/shared/services/userService"

type TabId = "flags" | "rollouts" | "config"

export default function ConfigFeaturesPage() {
  const [flags, setFlags] = useState<any[]>([])
  const [rollouts, setRollouts] = useState<any[]>([])
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>("flags")

  useEffect(() => {
    const load = async () => {
      try {
        const [f, r, c] = await Promise.all([
          getFeatureFlags(),
          getRollouts(),
          getPlatformConfig(),
        ])
        setFlags(f)
        setRollouts(r)
        setConfig(c)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const metrics = useMemo(() => {
    const enabledFlags = flags.filter((f) => f.enabled).length
    const activeRollouts = rollouts.filter((r) => r.status === "ACTIVE").length
    const configKeys = config
      ? Object.values(config).flat().length
      : 0
    return { totalFlags: flags.length, enabledFlags, activeRollouts, configKeys }
  }, [flags, rollouts, config])

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "flags", label: "Flags", icon: <Flag className="h-4 w-4" /> },
    { id: "rollouts", label: "Rollouts", icon: <GitBranch className="h-4 w-4" /> },
    { id: "config", label: "Config", icon: <Settings className="h-4 w-4" /> },
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Feature flags & rollouts"
        description="Central view of feature flags, gradual rollouts, and related platform configuration."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Flag className="h-3.5 w-3.5 text-[#0078d4]" />
            Config
          </span>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Feature flags</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {loading ? "—" : metrics.totalFlags}
              </p>
              <p className="mt-1 text-[11px] text-[#605e5c]">
                {metrics.enabledFlags} enabled
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active rollouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">
                {loading ? "—" : metrics.activeRollouts}
              </p>
              <p className="mt-1 text-[11px] text-[#605e5c]">
                Gradual releases in progress
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Config keys</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">
                {loading ? "—" : metrics.configKeys}
              </p>
              <p className="mt-1 text-[11px] text-[#605e5c]">
                Platform settings driving feature behaviour
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded border border-[#edebe9] bg-white p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-[#f3f2f1] text-[#0078d4] border-l-2 border-[#0078d4]"
                : "text-[#605e5c] hover:bg-[#faf9f8]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Flags */}
      {activeTab === "flags" && (
        <PageSection title="Feature flags">
          <Card>
            <CardHeader>
              <CardTitle>All flags</CardTitle>
              <p className="text-sm text-slate-500">
                Toggle features per tenant or platform-wide. Read-only in this phase.
              </p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-[#605e5c]">Loading…</p>
              ) : flags.length === 0 ? (
                <p className="text-[#605e5c]">No feature flags.</p>
              ) : (
                <div className="space-y-3">
                  {flags.map((f) => (
                    <div
                      key={f._id}
                      className="flex items-start justify-between gap-4 rounded border border-[#edebe9] bg-white p-4 hover:bg-[#faf9f8] transition-colors"
                    >
                      <div>
                        <p className="font-medium text-[#323130]">{f.name}</p>
                        <p className="text-[11px] text-[#605e5c] font-mono">{f.key}</p>
                        <p className="mt-1 text-sm text-[#605e5c]">{f.description}</p>
                        <div className="mt-2 flex gap-2 text-xs text-[#605e5c]">
                          <span>Rollout: {f.rolloutPercent}%</span>
                          {f.tenantIds?.length > 0 && (
                            <span>
                              Tenants: {f.tenantIds.map(getTenantName).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded border px-2.5 py-1 text-xs font-medium ${
                          f.enabled
                            ? "bg-[#dff6dd] text-[#107c10] border-[#107c10]"
                            : "bg-[#f3f2f1] text-[#323130] border-[#8a8886]"
                        }`}
                      >
                        {f.enabled ? "ON" : "OFF"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </PageSection>
      )}

      {/* Tab: Rollouts */}
      {activeTab === "rollouts" && (
        <PageSection title="Rollouts">
          <Card>
            <CardHeader>
              <CardTitle>Rollout campaigns</CardTitle>
              <p className="text-sm text-slate-500">
                Gradual feature rollouts by percentage or tenant list.
              </p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-[#605e5c]">Loading…</p>
              ) : rollouts.length === 0 ? (
                <p className="text-[#605e5c]">No rollouts.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#edebe9] bg-[#faf9f8] text-left text-[#323130]">
                        <th className="pb-3 pr-4 font-semibold">Name</th>
                        <th className="pb-3 pr-4 font-semibold">Flag</th>
                        <th className="pb-3 pr-4 font-semibold">Strategy</th>
                        <th className="pb-3 pr-4 font-semibold">Target</th>
                        <th className="pb-3 pr-4 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Started</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rollouts.map((r, idx) => (
                        <tr
                          key={r._id}
                          className={`border-b border-[#edebe9] transition-colors ${
                            idx % 2 === 0 ? "bg-white hover:bg-[#f3f2f1]" : "bg-[#faf9f8] hover:bg-[#f3f2f1]"
                          }`}
                        >
                          <td className="py-3 pr-4 font-medium text-[#323130]">
                            {r.name}
                          </td>
                          <td className="py-3 pr-4 text-[#605e5c] font-mono text-xs">
                            {r.flagKey}
                          </td>
                          <td className="py-3 pr-4 text-[#605e5c]">{r.strategy}</td>
                          <td className="py-3 pr-4 text-[#605e5c]">
                            {r.strategy === "PERCENTAGE"
                              ? `${r.percent}%`
                              : r.targetTenantIds?.length > 0
                              ? r.targetTenantIds.map(getTenantName).join(", ")
                              : "—"}
                          </td>
                          <td className="py-3 pr-4">
                            <span
                              className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                r.status === "ACTIVE"
                                  ? "bg-[#dff6dd] text-[#107c10] border-[#107c10]"
                                  : "bg-[#f3f2f1] text-[#323130] border-[#8a8886]"
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3 text-[#605e5c]">
                            {r.startedAt
                              ? new Date(r.startedAt).toLocaleDateString()
                              : "—"}
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
      )}

      {/* Tab: Config */}
      {activeTab === "config" && (
        <PageSection title="Platform config (flags-related)">
          {loading ? (
            <p className="text-slate-500">Loading…</p>
          ) : !config ? (
            <p className="text-slate-500">No config.</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(config).map(([category, items]: [string, any]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="capitalize">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {items.map((item: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2"
                        >
                          <div>
                            <p className="font-mono text-sm text-slate-800">
                              {item.key}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {item.description}
                            </p>
                          </div>
                          <span className="shrink-0 font-medium text-slate-700">
                            {String(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </PageSection>
      )}
    </PageLayout>
  )
}

