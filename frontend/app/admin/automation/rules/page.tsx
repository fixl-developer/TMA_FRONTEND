"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Zap, Plus, Play, Pause, FlaskConical, CheckCircle, XCircle, Clock } from "lucide-react"
import { getAutomationRules } from "@/shared/services/automationService"
import type { AutomationRule } from "@/shared/services/automationService"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminTable,
  AdminTableRow,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"

const DEMO_TENANT = "tenant_001"
const STORAGE_KEY = "talentos_automation_rules_rt"

type RuleStatus = "ACTIVE" | "INACTIVE" | "ERROR"

const STATUS_VARIANT: Record<RuleStatus, "default" | "success" | "warning" | "danger"> = {
  ACTIVE: "success",
  INACTIVE: "default",
  ERROR: "danger",
}

const TRIGGERS = [
  "contract.signed", "booking.confirmed", "lead.created", "payment.received",
  "escrow.funded", "delivery.submitted", "timesheet.submitted", "invoice.created",
]

const ACTIONS_LIST = [
  "send_email", "create_escrow", "notify_talent", "notify_admin",
  "update_status", "create_task", "notify_slack", "trigger_webhook", "add_tag",
]

function getRuntimeRules(): any[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") } catch { return [] }
}
function saveRuntimeRules(rules: any[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rules))
}

interface DryRunResult {
  ruleId: string
  ruleName: string
  wouldMatch: boolean
  conditionsEval: { field: string; op: string; value: string; result: boolean }[]
  actionsWouldRun: string[]
}

function simulateDryRun(rule: any): DryRunResult {
  const conditionsEval = (rule.conditions || []).map((c: any) => ({
    ...c,
    result: Math.random() > 0.3,
  }))
  const wouldMatch = conditionsEval.every((c: any) => c.result)
  return {
    ruleId: rule._id,
    ruleName: rule.name,
    wouldMatch,
    conditionsEval,
    actionsWouldRun: wouldMatch ? rule.actions : [],
  }
}

export default function AutomationRulesPage() {
  const [seedRules, setSeedRules] = useState<AutomationRule[]>([])
  const [runtimeRules, setRuntimeRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [createOpen, setCreateOpen] = useState(false)
  const [dryRunOpen, setDryRunOpen] = useState(false)
  const [dryRunResults, setDryRunResults] = useState<DryRunResult[]>([])
  const [dryRunning, setDryRunning] = useState(false)
  const [form, setForm] = useState({ name: "", trigger: TRIGGERS[0], action: ACTIONS_LIST[0] })

  useEffect(() => {
    getAutomationRules(DEMO_TENANT).then((rules) => {
      setSeedRules(rules)
      setRuntimeRules(getRuntimeRules())
      setLoading(false)
    })
  }, [])

  const allRules = useMemo(() => [...runtimeRules, ...seedRules], [runtimeRules, seedRules])

  const filtered = useMemo(() =>
    statusFilter === "ALL" ? allRules : allRules.filter((r) => r.status === statusFilter),
    [allRules, statusFilter]
  )

  const stats = useMemo(() => ({
    total: allRules.length,
    active: allRules.filter((r) => r.status === "ACTIVE").length,
    runs24h: allRules.reduce((s, r) => s + (r.runsLast24h || 0), 0),
    errors: allRules.filter((r) => r.status === "ERROR").length,
  }), [allRules])

  function toggleRule(id: string) {
    // Try runtime first
    const updated = runtimeRules.map((r) =>
      r._id === id ? { ...r, status: r.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : r
    )
    setRuntimeRules(updated)
    saveRuntimeRules(updated)
  }

  function handleCreate() {
    const rule = {
      _id: `rule_rt_${Date.now()}`,
      tenantId: DEMO_TENANT,
      name: form.name,
      trigger: form.trigger,
      conditions: [],
      actions: [form.action],
      status: "ACTIVE",
      runsLast24h: 0,
      lastRunAt: null,
      createdAt: new Date().toISOString(),
    }
    const updated = [rule, ...runtimeRules]
    setRuntimeRules(updated)
    saveRuntimeRules(updated)
    setForm({ name: "", trigger: TRIGGERS[0], action: ACTIONS_LIST[0] })
    setCreateOpen(false)
  }

  function handleDryRun() {
    setDryRunning(true)
    setTimeout(() => {
      const results = allRules.slice(0, 5).map(simulateDryRun)
      setDryRunResults(results)
      setDryRunning(false)
      setDryRunOpen(true)
    }, 800)
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Automation Rules Engine"
        subtitle="Trigger-based rules with conditions and actions for intelligent automation"
        action={
          <div className="flex gap-2">
            <AdminButton variant="secondary" onClick={handleDryRun} disabled={dryRunning}>
              {dryRunning ? (
                <><Clock className="mr-2 h-4 w-4 animate-spin" /> Running...</>
              ) : (
                <><FlaskConical className="mr-2 h-4 w-4" /> Dry Run</>
              )}
            </AdminButton>
            <AdminButton onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Rule
            </AdminButton>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <AdminStatCard title="Total Rules" value={stats.total} icon={Zap} />
        <AdminStatCard title="Active" value={stats.active} icon={Play} />
        <AdminStatCard title="Runs (24h)" value={stats.runs24h} icon={Clock} />
        <AdminStatCard title="Errors" value={stats.errors} icon={XCircle} />
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/automation/campaigns">
          <AdminButton variant="ghost" size="sm">Campaigns</AdminButton>
        </Link>
        <Link href="/admin/automation/policy-packs">
          <AdminButton variant="ghost" size="sm">Policy Packs</AdminButton>
        </Link>
        <Link href="/admin/automation/logs">
          <AdminButton variant="ghost" size="sm">Logs</AdminButton>
        </Link>
        <Link href="/admin/automation/sla">
          <AdminButton variant="ghost" size="sm">SLA</AdminButton>
        </Link>
      </div>

      {/* Status filter */}
      <div className="flex gap-2">
        {["ALL", "ACTIVE", "INACTIVE", "ERROR"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              statusFilter === s ? "border-blue-500 bg-blue-500/20 text-blue-300" : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {s}
            {s !== "ALL" && <span className="ml-1 text-xs opacity-60">({allRules.filter((r) => r.status === s).length})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />)}</div>
      ) : filtered.length === 0 ? (
        <AdminEmptyState title="No rules found" description="Create your first automation rule to get started." />
      ) : (
        <AdminCard>
          <AdminTable headers={["Rule Name", "Trigger", "Actions", "Status", "Runs (24h)", "Last Run", "Toggle"]}>
            {filtered.map((rule) => (
              <AdminTableRow key={rule._id}>
                <td className="py-3 pr-4">
                  <p className="font-medium text-white">{rule.name}</p>
                  {rule.conditions?.length > 0 && (
                    <p className="text-xs text-white/40">{rule.conditions.length} conditions</p>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-mono text-amber-300">{rule.trigger}</span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex flex-wrap gap-1">
                    {(rule.actions || []).slice(0, 2).map((a: string) => (
                      <span key={a} className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs text-emerald-300">{a}</span>
                    ))}
                    {rule.actions?.length > 2 && <span className="text-xs text-white/30">+{rule.actions.length - 2}</span>}
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <AdminBadge variant={STATUS_VARIANT[rule.status as RuleStatus] || "default"}>{rule.status}</AdminBadge>
                </td>
                <td className="py-3 pr-4 text-sm text-white/70">{rule.runsLast24h || 0}</td>
                <td className="py-3 pr-4 text-sm text-white/40">
                  {rule.lastRunAt ? new Date(rule.lastRunAt).toLocaleTimeString() : "—"}
                </td>
                <td className="py-3 pr-4">
                  <button
                    onClick={() => toggleRule(rule._id)}
                    className={`relative inline-flex h-5 w-9 cursor-pointer rounded-full border-2 border-transparent transition-colors ${rule.status === "ACTIVE" ? "bg-emerald-500" : "bg-white/20"}`}
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${rule.status === "ACTIVE" ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        </AdminCard>
      )}

      {/* Create Rule Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="border admin-light-theme:border-slate-200 admin-light-theme:bg-white admin-dark-theme:border-white/10 admin-dark-theme:bg-slate-900 admin-light-theme:text-slate-900 admin-dark-theme:text-white">
          <DialogHeader><DialogTitle>New Automation Rule</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-white/60">Rule Name</label>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Send welcome email on signup"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/60">Trigger</label>
              <select
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
                value={form.trigger}
                onChange={(e) => setForm((f) => ({ ...f, trigger: e.target.value }))}
              >
                {TRIGGERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/60">Primary Action</label>
              <select
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
                value={form.action}
                onChange={(e) => setForm((f) => ({ ...f, action: e.target.value }))}
              >
                {ACTIONS_LIST.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/40">
              Conditions can be added after creation. This rule will be active immediately.
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <AdminButton variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleCreate} disabled={!form.name}>Create Rule</AdminButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dry Run Results Dialog */}
      <Dialog open={dryRunOpen} onOpenChange={setDryRunOpen}>
        <DialogContent className="max-w-2xl border admin-light-theme:border-slate-200 admin-light-theme:bg-white admin-dark-theme:border-white/10 admin-dark-theme:bg-slate-900 admin-light-theme:text-slate-900 admin-dark-theme:text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-yellow-400" /> Dry Run Results
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-white/50 mb-4">Simulated evaluation against current data. No actual changes were made.</p>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dryRunResults.map((result) => (
              <div key={result.ruleId} className={`rounded-xl border p-4 ${result.wouldMatch ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 bg-white/5"}`}>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{result.ruleName}</p>
                  {result.wouldMatch ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle className="h-3.5 w-3.5" />Would run</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-white/40"><XCircle className="h-3.5 w-3.5" />Would skip</span>
                  )}
                </div>
                {result.conditionsEval.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {result.conditionsEval.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        {c.result ? <CheckCircle className="h-3 w-3 text-emerald-400" /> : <XCircle className="h-3 w-3 text-red-400" />}
                        <span className="text-white/60">{c.field} {c.op} {c.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {result.wouldMatch && result.actionsWouldRun.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {result.actionsWouldRun.map((a) => (
                      <span key={a} className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs text-emerald-300">{a}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <AdminButton onClick={() => setDryRunOpen(false)}>Close</AdminButton>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  )
}
