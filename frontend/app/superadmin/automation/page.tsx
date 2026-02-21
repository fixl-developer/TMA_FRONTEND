"use client"

import { useState } from "react"
import { Layers, Zap, CheckCircle, Clock, AlertTriangle, Plus } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"

const PLATFORM_RULES = [
  { _id: "plat_001", name: "KYC incomplete → suspend payout", trigger: "kyc.expired", scope: "PLATFORM", status: "ACTIVE", runsLast24h: 3 },
  { _id: "plat_002", name: "Blueprint approved → notify tenant admin", trigger: "blueprint.approved", scope: "PLATFORM", status: "ACTIVE", runsLast24h: 1 },
  { _id: "plat_003", name: "Escrow overdue (14d) → flag for review", trigger: "escrow.overdue", scope: "PLATFORM", status: "ACTIVE", runsLast24h: 0 },
  { _id: "plat_004", name: "New tenant onboarded → send welcome sequence", trigger: "tenant.created", scope: "PLATFORM", status: "ACTIVE", runsLast24h: 2 },
  { _id: "plat_005", name: "Payout risk flag → pause disbursement", trigger: "payment.risk_flag", scope: "PLATFORM", status: "ACTIVE", runsLast24h: 0 },
  { _id: "plat_006", name: "Support case escalation (SLA breach)", trigger: "support.sla_breach", scope: "PLATFORM", status: "INACTIVE", runsLast24h: 0 },
]

const SLA_CONFIGS = [
  { module: "Support Cases", tier: "P1 — Critical", target: "1 hour", current: "0.8h", status: "MET" },
  { module: "Support Cases", tier: "P2 — High", target: "4 hours", current: "3.2h", status: "MET" },
  { module: "Support Cases", tier: "P3 — Medium", target: "24 hours", current: "18h", status: "MET" },
  { module: "Blueprint Approvals", tier: "Standard", target: "48 hours", current: "62h", status: "BREACHED" },
  { module: "KYC Verification", tier: "Standard", target: "72 hours", current: "48h", status: "MET" },
  { module: "Escrow Settlement", tier: "Standard", target: "5 days", current: "4.2d", status: "MET" },
]

export default function AutomationPage() {
  const [rules, setRules] = useState(PLATFORM_RULES)

  function toggleRule(id: string) {
    setRules((prev) => prev.map((r) => r._id === id ? { ...r, status: r.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : r))
  }

  const activeCount = rules.filter((r) => r.status === "ACTIVE").length
  const totalRuns = rules.reduce((s, r) => s + r.runsLast24h, 0)
  const slaMet = SLA_CONFIGS.filter((s) => s.status === "MET").length
  const slaBreached = SLA_CONFIGS.filter((s) => s.status === "BREACHED").length

  return (
    <PageLayout>
      <PageHeader
        title="Automation"
        description="Platform-wide automation rules, SLA policies, and workflow triggers."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Layers className="h-3.5 w-3.5 text-blue-500" />
            Platform Automation
          </span>
        }
      />

      <PageSection>
        <MetricsGrid>
          {[
            { label: "Platform Rules", value: rules.length, icon: Zap, color: "text-blue-500" },
            { label: "Active Rules", value: activeCount, icon: CheckCircle, color: "text-emerald-500" },
            { label: "Runs (24h)", value: totalRuns, icon: Clock, color: "text-indigo-500" },
            { label: "SLA Breaches", value: slaBreached, icon: AlertTriangle, color: slaBreached > 0 ? "text-red-500" : "text-slate-400" },
          ].map((item) => (
            <Card key={item.label} className={`transition-colors ${item.label === "SLA Breaches" && slaBreached > 0 ? "border-red-200 hover:border-red-300" : "hover:border-blue-300"}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${item.label === "SLA Breaches" && slaBreached > 0 ? "text-red-600" : "text-slate-900"}`}>{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </MetricsGrid>
      </PageSection>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Platform Rules */}
        <PageSection title="Platform-wide Rules">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Rule</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Trigger</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Runs</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule) => (
                    <tr key={rule._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{rule.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-500">{rule.trigger}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{rule.runsLast24h}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleRule(rule._id)}
                          className={`relative inline-flex h-5 w-9 cursor-pointer rounded-full border-2 border-transparent transition-colors ${rule.status === "ACTIVE" ? "bg-blue-600" : "bg-slate-200"}`}
                          aria-label={`Toggle ${rule.name}`}
                        >
                          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${rule.status === "ACTIVE" ? "translate-x-4" : "translate-x-0"}`} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </PageSection>

        {/* SLA Status */}
        <PageSection title="SLA Configuration & Status">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Module</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Tier</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Target</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Current</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {SLA_CONFIGS.map((sla, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-700">{sla.module}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{sla.tier}</td>
                      <td className="px-4 py-3 text-slate-600">{sla.target}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{sla.current}</td>
                      <td className="px-4 py-3">
                        {sla.status === "MET" ? (
                          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Met</span>
                        ) : (
                          <span className="rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">Breached</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </PageSection>
      </div>
    </PageLayout>
  )
}
