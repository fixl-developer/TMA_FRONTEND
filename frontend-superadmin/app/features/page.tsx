/**
 * Features - Super Admin
 *
 * Feature flags, rollouts, and platform config.
 * Seed data only. Tabs: Flags, Rollouts, Config.
 */

"use client"

import { useEffect, useMemo, useState } from "react"
import { Flag, GitBranch, Settings } from "lucide-react"
import { getFeatureFlags, getRollouts, getPlatformConfig } from "@/shared/services/featuresService"
import { getTenantName } from "@/shared/services/userService"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"

type TabId = "flags" | "rollouts" | "config"

export default function FeaturesPage() {
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
        title="Features"
        description="Feature flags, gradual rollouts, and platform configuration."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Flag className="h-3.5 w-3.5 text-blue-500" />
            Platform
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
              <p className="text-3xl font-semibold text-slate-800">
                {loading ? "—" : metrics.totalFlags}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {metrics.enabledFlags} enabled
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active rollouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-emerald-600">
                {loading ? "—" : metrics.activeRollouts}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Gradual releases in progress
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Config keys</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-sky-600">
                {loading ? "—" : metrics.configKeys}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Platform settings
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
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

      {/* Tab: Flags */}
      {activeTab === "flags" && (
        <PageSection title="Feature flags">
          <Card>
            <CardHeader>
              <CardTitle>All flags</CardTitle>
              <p className="text-sm text-slate-500">
                Toggle features per tenant or platform-wide.
              </p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-slate-500">Loading…</p>
              ) : flags.length === 0 ? (
                <p className="text-slate-500">No feature flags.</p>
              ) : (
                <div className="space-y-3">
                  {flags.map((f) => (
                    <div
                      key={f._id}
                      className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4"
                    >
                      <div>
                        <p className="font-medium text-slate-800">{f.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{f.key}</p>
                        <p className="mt-1 text-sm text-slate-600">{f.description}</p>
                        <div className="mt-2 flex gap-2 text-xs text-slate-500">
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
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
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
                <p className="text-slate-500">Loading…</p>
              ) : rollouts.length === 0 ? (
                <p className="text-slate-500">No rollouts.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-500">
                        <th className="pb-3 pr-4 font-medium">Name</th>
                        <th className="pb-3 pr-4 font-medium">Flag</th>
                        <th className="pb-3 pr-4 font-medium">Strategy</th>
                        <th className="pb-3 pr-4 font-medium">Target</th>
                        <th className="pb-3 pr-4 font-medium">Status</th>
                        <th className="pb-3 font-medium">Started</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rollouts.map((r) => (
                        <tr
                          key={r._id}
                          className="border-b border-slate-100 hover:bg-slate-50/50"
                        >
                          <td className="py-3 pr-4 font-medium text-slate-800">
                            {r.name}
                          </td>
                          <td className="py-3 pr-4 text-slate-600 font-mono text-xs">
                            {r.flagKey}
                          </td>
                          <td className="py-3 pr-4 text-slate-600">{r.strategy}</td>
                          <td className="py-3 pr-4 text-slate-600">
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
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3 text-slate-500">
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
        <PageSection title="Platform config">
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
