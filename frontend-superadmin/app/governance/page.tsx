/**
 * Governance & Moderation Dashboard - Super Admin
 *
 * Trust & Safety (Disputes, Enforcement, Appeals) and Moderation (Content Review, Takedowns, Audit).
 * Phase 3. Seed data only.
 */

"use client"

import { useEffect, useMemo, useState } from "react"
import { ShieldAlert, ShieldCheck, Scale, FileText } from "lucide-react"
import {
  getModerationLogs,
  getDisputes,
  getEnforcementActions,
  getAppeals,
  getTakedowns,
} from "@/shared/services/governanceService"
import type {
  ModerationLog,
  ModerationSeverity,
  ModerationStatus,
} from "@/shared/lib/types/governance"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { RechartsPie } from "@/shared/components/charts/RechartsPie"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { getTenantName } from "@/shared/services/userService"
import { formatCurrency } from "@/shared/lib/utils"

type StatusFilter = "ALL" | ModerationStatus
type GovernanceTab = "trust" | "moderation"

const severityColors: Record<ModerationSeverity, string> = {
  LOW: "bg-[#a19f9d] text-white border border-[#a19f9d]",
  MEDIUM: "bg-[#ffb900] text-[#323130] border border-[#ffb900]",
  HIGH: "bg-[#d13438] text-white border border-[#d13438]",
}

const statusLabels: Record<ModerationStatus, string> = {
  OPEN: "Open",
  RESOLVED: "Resolved",
  ESCALATED: "Escalated",
}

export default function GovernanceDashboard() {
  const [logs, setLogs] = useState<ModerationLog[]>([])
  const [disputes, setDisputes] = useState<any[]>([])
  const [enforcement, setEnforcement] = useState<any[]>([])
  const [appeals, setAppeals] = useState<any[]>([])
  const [takedowns, setTakedowns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StatusFilter>("ALL")
  const [activeTab, setActiveTab] = useState<GovernanceTab>("trust")

  useEffect(() => {
    const load = async () => {
      try {
        const [l, d, e, a, t] = await Promise.all([
          getModerationLogs(),
          getDisputes(),
          getEnforcementActions(),
          getAppeals(),
          getTakedowns(),
        ])
        setLogs(l)
        setDisputes(d)
        setEnforcement(e)
        setAppeals(a)
        setTakedowns(t)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const metrics = useMemo(() => {
    const total = logs.length
    const open = logs.filter((l) => l.status === "OPEN").length
    const escalated = logs.filter((l) => l.status === "ESCALATED").length
    const resolved = logs.filter((l) => l.status === "RESOLVED").length
    const highSeverityOpen = logs.filter(
      (l) => l.status !== "RESOLVED" && l.severity === "HIGH"
    ).length

    const tenantsImpacted = new Set(logs.map((l) => l.tenantId)).size

    const byCategory = logs.reduce<Record<string, number>>((acc, l) => {
      acc[l.category] = (acc[l.category] || 0) + 1
      return acc
    }, {})

    return {
      total,
      open,
      escalated,
      resolved,
      highSeverityOpen,
      tenantsImpacted,
      byCategory,
    }
  }, [logs])

  const filteredLogs = useMemo(() => {
    if (filter === "ALL") return logs
    return logs.filter((l) => l.status === filter)
  }, [logs, filter])

  return (
    <PageLayout>
      <PageHeader
        title="Governance"
        description="Trust & Safety (disputes, enforcement, appeals) and Moderation (content review, takedowns, audit). Phase 3."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <ShieldAlert className="h-3.5 w-3.5 text-[#d13438]" />
            Phase 3
          </span>
        }
      />

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded border border-[#edebe9] bg-white p-1">
        {[
          { id: "trust" as const, label: "Trust & Safety", icon: <Scale className="h-4 w-4" /> },
          { id: "moderation" as const, label: "Moderation", icon: <FileText className="h-4 w-4" /> },
        ].map((tab) => (
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

      {activeTab === "trust" && (
        <>
          <PageSection title="Disputes queue">
            <Card>
              <CardHeader>
                <CardTitle>Cross-tenant disputes</CardTitle>
                <p className="text-sm text-slate-500">
                  Escrow, booking, payout disputes. Evidence and resolution workflow.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-500">Loading…</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-[#edebe9] text-left text-[#605e5c]">
                          <th className="pb-3 pr-4 font-medium">ID</th>
                          <th className="pb-3 pr-4 font-medium">Tenant</th>
                          <th className="pb-3 pr-4 font-medium">Type</th>
                          <th className="pb-3 pr-4 font-medium">Amount</th>
                          <th className="pb-3 pr-4 font-medium">Reason</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {disputes.map((d) => (
                          <tr key={d._id} className="border-b border-[#f3f2f1] hover:bg-[#faf9f8]">
                            <td className="py-3 pr-4 font-mono text-xs text-[#605e5c]">{d._id}</td>
                            <td className="py-3 pr-4 text-[#605e5c]">{getTenantName(d.tenantId)}</td>
                            <td className="py-3 pr-4 text-[#605e5c]">{d.referenceType}</td>
                            <td className="py-3 pr-4 text-[#605e5c]">{formatCurrency(d.amountMinor, d.currency)}</td>
                            <td className="py-3 pr-4 text-[#605e5c] max-w-[180px] truncate">{d.reason}</td>
                            <td className="py-3">
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                d.status === "OPEN" ? "bg-[#ffb900] text-[#323130] border-[#ffb900]" :
                                d.status === "RESOLVED" ? "bg-[#107c10] text-white border-[#107c10]" :
                                "bg-[#a19f9d] text-white border-[#a19f9d]"
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

          <PageSection title="Enforcement actions">
            <Card>
              <CardHeader>
                <CardTitle>Actions taken</CardTitle>
                <p className="text-sm text-slate-500">
                  Suspend, ban, warning. Platform and tenant-level enforcement.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-500">Loading…</p>
                ) : (
                  <div className="space-y-3">
                    {enforcement.map((e) => (
                      <div
                        key={e._id}
                        className="flex items-center justify-between gap-4 rounded border border-[#edebe9] bg-[#faf9f8] p-4"
                      >
                        <div>
                          <p className="font-medium text-[#323130]">{e.actionType} · {getTenantName(e.tenantId)}</p>
                          <p className="text-xs text-[#605e5c]">{e.reason}</p>
                          <p className="text-xs text-[#605e5c]">
                            User {e.userId} · {e.durationDays ? `${e.durationDays} days` : "Permanent"}
                          </p>
                        </div>
                        <span className={`shrink-0 rounded border px-2.5 py-1 text-xs font-medium ${
                          e.status === "ACTIVE" ? "bg-[#d13438] text-white border-[#d13438]" :
                          "bg-[#a19f9d] text-white border-[#a19f9d]"
                        }`}>
                          {e.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </PageSection>

          <PageSection title="Appeals workflow">
            <Card>
              <CardHeader>
                <CardTitle>User appeals</CardTitle>
                <p className="text-sm text-slate-500">
                  Appeals against enforcement actions. Pending, approved, rejected.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-500">Loading…</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-[#edebe9] text-left text-[#605e5c]">
                          <th className="pb-3 pr-4 font-medium">Appeal</th>
                          <th className="pb-3 pr-4 font-medium">Enforcement</th>
                          <th className="pb-3 pr-4 font-medium">Tenant</th>
                          <th className="pb-3 pr-4 font-medium">Message</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appeals.map((a) => (
                          <tr key={a._id} className="border-b border-[#f3f2f1] hover:bg-[#faf9f8]">
                            <td className="py-3 pr-4 font-mono text-xs text-[#605e5c]">{a._id}</td>
                            <td className="py-3 pr-4 text-[#605e5c]">{a.enforcementId}</td>
                            <td className="py-3 pr-4 text-[#605e5c]">{getTenantName(a.tenantId)}</td>
                            <td className="py-3 pr-4 text-[#605e5c] max-w-[200px] truncate">{a.message}</td>
                            <td className="py-3">
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                a.status === "PENDING" ? "bg-[#ffb900] text-[#323130] border-[#ffb900]" :
                                a.status === "REJECTED" ? "bg-[#d13438] text-white border-[#d13438]" :
                                "bg-[#107c10] text-white border-[#107c10]"
                              }`}>
                                {a.status}
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
        </>
      )}

      {activeTab === "moderation" && (
      <>
      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Total incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {loading ? "—" : metrics.total}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                All seeded moderation logs across modules.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Open</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#ffb900]">
                {loading ? "—" : metrics.open}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Items still awaiting final decision.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Escalated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#d13438]">
                {loading ? "—" : metrics.escalated}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Flagged for platform-level review.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Tenants impacted</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {loading ? "—" : metrics.tenantsImpacted}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Tenants with at least one moderation log.
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Incidents">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Incident categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[11px] text-slate-700">
              {loading ? (
                <p className="text-slate-500">Loading seeded incidents…</p>
              ) : metrics.total === 0 ? (
                <p className="text-slate-500">
                  No moderation logs in the current seed. Populate{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">
                    data/seed/moderationLogs.json
                  </code>{" "}
                  to simulate real-world governance scenarios.
                </p>
              ) : (
                <>
                  <RechartsPie
                    data={Object.entries(metrics.byCategory).map(
                      ([category, count]) => ({
                        label:
                          category === "OFF_PLATFORM_DEAL"
                            ? "Off-platform deals"
                            : category === "SPAM_PROMOTION"
                            ? "Spam / promotion"
                            : category === "ABUSIVE_CONTENT"
                            ? "Abusive content"
                            : "Minor protection",
                        value: count,
                      })
                    )}
                  />
                  <ul className="space-y-1.5">
                    {Object.entries(metrics.byCategory).map(
                      ([category, count]) => (
                        <li
                          key={category}
                          className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                        >
                          <div className="space-y-0.5">
                            <p className="text-[12px] font-semibold text-slate-800">
                              {category
                                .split("_")
                                .map(
                                  (p) => p.charAt(0) + p.slice(1).toLowerCase()
                                )
                                .join(" ")}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              PRD rule:{" "}
                              {category === "OFF_PLATFORM_DEAL"
                                ? "No off-platform deal circumvention"
                                : category === "SPAM_PROMOTION"
                                ? "No spam, mass recruiting, or fake jobs"
                                : category === "ABUSIVE_CONTENT"
                                ? "No defamatory or abusive content"
                                : "Strict consent & minor-protection rules"}
                            </p>
                          </div>
                          <p className="text-[12px] font-semibold text-slate-800">
                            {count}
                          </p>
                        </li>
                      )
                    )}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-slate-700">
              <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-600" />
                  <div>
                    <p className="text-[11px] font-semibold text-rose-800">
                      High severity (open / escalated)
                    </p>
                    <p className="text-[10px] text-rose-600">
                      Incidents that must be prioritised.
                    </p>
                  </div>
                </div>
                <p className="text-[12px] font-semibold text-rose-800">
                  {loading ? "—" : metrics.highSeverityOpen}
                </p>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="text-[11px] font-semibold text-emerald-800">
                      Resolved (seed)
                    </p>
                    <p className="text-[10px] text-emerald-700">
                      Cases where action was taken and logged.
                    </p>
                  </div>
                </div>
                <p className="text-[12px] font-semibold text-emerald-800">
                  {loading ? "—" : metrics.resolved}
                </p>
              </div>
              <p className="text-[10px] text-slate-500">
                In a real deployment this panel would tie into the ModerationLog
                and Rules Engine from the PRD, with drill-down into each
                incident&apos;s audit trail.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title="Moderation incidents">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-slate-500">Status:</span>
              {([
                { key: "ALL", label: "All" },
                { key: "OPEN", label: "Open" },
                { key: "ESCALATED", label: "Escalated" },
                { key: "RESOLVED", label: "Resolved" },
              ] as { key: StatusFilter; label: string }[]).map((opt) => (
                <Button
                  key={opt.key}
                  size="sm"
                  variant={filter === opt.key ? "default" : "outline"}
                  className={
                    filter === opt.key
                      ? "h-7 px-3 text-[11px]"
                      : "h-7 px-3 text-[11px] bg-slate-50/70"
                  }
                  onClick={() => setFilter(opt.key)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-3">
            {loading ? (
              <div className="flex items-center justify-center py-14 text-slate-600">
                <span className="text-sm">
                  Loading governance incidents from seed…
                </span>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-14 text-center text-slate-600">
                <p className="text-sm font-medium">
                  No incidents match this filter in the current seed.
                </p>
                <p className="max-w-md text-[11px] text-slate-500">
                  Adjust{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">
                    data/seed/moderationLogs.json
                  </code>{" "}
                  to simulate more governance edge cases.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-[11px] text-slate-700 sm:text-xs">
                {filteredLogs.map((log) => (
                  <article
                    key={log._id}
                    className="grid grid-cols-[minmax(0,1.8fr)_minmax(0,1.1fr)_minmax(0,0.9fr)] items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4"
                  >
                    {/* Summary */}
                    <div className="space-y-0.5">
                      <p className="text-[12px] font-semibold text-slate-800">
                        {log.summary || log.category}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Tenant{" "}
                        <span className="font-mono text-slate-600">
                          {log.tenantId}
                        </span>{" "}
                        · Source {log.source.toLowerCase()} · Content{" "}
                        <span className="font-mono text-slate-600">
                          {log.contentId}
                        </span>
                      </p>
                      {log.rule && (
                        <p className="text-[10px] text-slate-600">
                          Rule: {log.rule}
                        </p>
                      )}
                    </div>

                    {/* Severity / status */}
                    <div className="space-y-1">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${severityColors[log.severity]}`}
                      >
                        {log.severity.toLowerCase()} severity
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Status: {statusLabels[log.status]} · Reported by{" "}
                        {log.reportedBy || "system"}
                      </p>
                      {log.actionTaken && (
                        <p className="text-[10px] text-slate-600">
                          Action: {log.actionTaken}
                        </p>
                      )}
                    </div>

                    {/* Timestamps */}
                    <div className="text-right text-[10px] text-slate-500">
                      <p>
                        Created:{" "}
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Unknown"}
                      </p>
                      {log.resolvedAt && (
                        <p>
                          Resolved:{" "}
                          {new Date(log.resolvedAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageSection>

      <PageSection title="Takedowns">
        <Card>
          <CardHeader>
            <CardTitle>Takedown requests</CardTitle>
            <p className="text-sm text-slate-500">
              Content removal requests. Consent, DMCA, policy violations.
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-slate-500">Loading…</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#edebe9] text-left text-[#605e5c]">
                      <th className="pb-3 pr-4 font-medium">ID</th>
                      <th className="pb-3 pr-4 font-medium">Tenant</th>
                      <th className="pb-3 pr-4 font-medium">Content</th>
                      <th className="pb-3 pr-4 font-medium">Reason</th>
                      <th className="pb-3 pr-4 font-medium">Requested by</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {takedowns.map((td) => (
                      <tr key={td._id} className="border-b border-[#f3f2f1] hover:bg-[#faf9f8]">
                        <td className="py-3 pr-4 font-mono text-xs text-[#605e5c]">{td._id}</td>
                        <td className="py-3 pr-4 text-[#605e5c]">{getTenantName(td.tenantId)}</td>
                        <td className="py-3 pr-4 text-[#605e5c]">{td.contentType} · {td.contentId}</td>
                        <td className="py-3 pr-4 text-[#605e5c] max-w-[180px] truncate">{td.reason}</td>
                        <td className="py-3 pr-4 text-[#605e5c]">{td.requestedBy}</td>
                        <td className="py-3">
                          <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                            td.status === "PENDING" ? "bg-[#ffb900] text-[#323130] border-[#ffb900]" :
                            "bg-[#107c10] text-white border-[#107c10]"
                          }`}>
                            {td.status}
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

      <PageSection title="Audit trail">
        <Card>
          <CardHeader>
            <CardTitle>Resolved incidents (audit)</CardTitle>
            <p className="text-sm text-slate-500">
              Moderation actions taken. Immutable audit log.
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-slate-500">Loading…</p>
            ) : logs.filter((l) => l.status === "RESOLVED" && l.actionTaken).length === 0 ? (
              <p className="text-slate-500">No resolved incidents with actions in seed.</p>
            ) : (
              <ul className="space-y-2">
                {logs
                  .filter((l) => l.status === "RESOLVED" && l.actionTaken)
                  .map((log) => (
                    <li
                      key={log._id}
                      className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">{log.summary}</p>
                        <p className="text-[11px] text-slate-500">
                          {getTenantName(log.tenantId)} · {log.category} · Action: {log.actionTaken}
                        </p>
                      </div>
                      <span className="text-[11px] text-slate-500 shrink-0">
                        {log.resolvedAt ? new Date(log.resolvedAt).toLocaleDateString() : "—"}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </PageSection>
      </>
      )}
    </PageLayout>
  )
}

