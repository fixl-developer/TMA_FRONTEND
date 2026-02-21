"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Trash2, ChevronDown, ChevronUp, ArrowRight, Save, Play } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"

type TriggerType = "MANUAL" | "LEAD_CREATED" | "CONTRACT_SIGNED" | "BOOKING_CONFIRMED" | "DATE_RELATIVE"
type ConditionField = "lead_score" | "deal_value" | "tag" | "assignee" | "region"
type ConditionOp = "EQUALS" | "GREATER_THAN" | "LESS_THAN" | "CONTAINS"
type ActionType = "SEND_EMAIL" | "ASSIGN_OWNER" | "ADD_TAG" | "UPDATE_STATUS" | "NOTIFY_SLACK" | "CREATE_TASK"

interface Stage {
  id: string
  name: string
  description: string
  trigger?: { type: TriggerType; value?: string }
  conditions: { id: string; field: ConditionField; op: ConditionOp; value: string }[]
  actions: { id: string; type: ActionType; config: string }[]
}

const TRIGGERS: { value: TriggerType; label: string }[] = [
  { value: "MANUAL", label: "Manual / On-demand" },
  { value: "LEAD_CREATED", label: "Lead Created" },
  { value: "CONTRACT_SIGNED", label: "Contract Signed" },
  { value: "BOOKING_CONFIRMED", label: "Booking Confirmed" },
  { value: "DATE_RELATIVE", label: "Date Relative" },
]

const CONDITION_FIELDS: { value: ConditionField; label: string }[] = [
  { value: "lead_score", label: "Lead Score" },
  { value: "deal_value", label: "Deal Value" },
  { value: "tag", label: "Tag" },
  { value: "assignee", label: "Assignee" },
  { value: "region", label: "Region" },
]

const OPS: { value: ConditionOp; label: string }[] = [
  { value: "EQUALS", label: "=" },
  { value: "GREATER_THAN", label: ">" },
  { value: "LESS_THAN", label: "<" },
  { value: "CONTAINS", label: "contains" },
]

const ACTIONS: { value: ActionType; label: string; placeholder: string }[] = [
  { value: "SEND_EMAIL", label: "Send Email", placeholder: "Template ID or subject" },
  { value: "ASSIGN_OWNER", label: "Assign Owner", placeholder: "User ID or name" },
  { value: "ADD_TAG", label: "Add Tag", placeholder: "Tag name" },
  { value: "UPDATE_STATUS", label: "Update Status", placeholder: "New status value" },
  { value: "NOTIFY_SLACK", label: "Notify Slack", placeholder: "Channel name" },
  { value: "CREATE_TASK", label: "Create Task", placeholder: "Task description" },
]

const STORAGE_KEY = "talentos_campaign_builders"

function saveCampaign(campaign: any) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  existing.unshift(campaign)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
}

const uid = () => `id_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

function newStage(name: string): Stage {
  return {
    id: uid(),
    name,
    description: "",
    conditions: [],
    actions: [],
  }
}

export default function CampaignBuilderPage() {
  const router = useRouter()
  const [name, setName] = useState("Untitled Campaign")
  const [budget, setBudget] = useState("")
  const [budgetCurrency, setBudgetCurrency] = useState("INR")
  const [stages, setStages] = useState<Stage[]>([
    newStage("Awareness"),
    newStage("Engagement"),
    newStage("Conversion"),
  ])
  const [expandedStage, setExpandedStage] = useState<string | null>(stages[0]?.id || null)
  const [saved, setSaved] = useState(false)

  function addStage() {
    const stage = newStage(`Stage ${stages.length + 1}`)
    setStages((prev) => [...prev, stage])
    setExpandedStage(stage.id)
  }

  function removeStage(id: string) {
    setStages((prev) => prev.filter((s) => s.id !== id))
  }

  function updateStage(id: string, patch: Partial<Stage>) {
    setStages((prev) => prev.map((s) => s.id === id ? { ...s, ...patch } : s))
  }

  function addCondition(stageId: string) {
    const cond = { id: uid(), field: "lead_score" as ConditionField, op: "GREATER_THAN" as ConditionOp, value: "0" }
    setStages((prev) => prev.map((s) => s.id === stageId ? { ...s, conditions: [...s.conditions, cond] } : s))
  }

  function removeCondition(stageId: string, condId: string) {
    setStages((prev) => prev.map((s) => s.id === stageId ? { ...s, conditions: s.conditions.filter((c) => c.id !== condId) } : s))
  }

  function updateCondition(stageId: string, condId: string, patch: any) {
    setStages((prev) => prev.map((s) =>
      s.id === stageId ? { ...s, conditions: s.conditions.map((c) => c.id === condId ? { ...c, ...patch } : c) } : s
    ))
  }

  function addAction(stageId: string) {
    const action = { id: uid(), type: "SEND_EMAIL" as ActionType, config: "" }
    setStages((prev) => prev.map((s) => s.id === stageId ? { ...s, actions: [...s.actions, action] } : s))
  }

  function removeAction(stageId: string, actionId: string) {
    setStages((prev) => prev.map((s) => s.id === stageId ? { ...s, actions: s.actions.filter((a) => a.id !== actionId) } : s))
  }

  function updateAction(stageId: string, actionId: string, patch: any) {
    setStages((prev) => prev.map((s) =>
      s.id === stageId ? { ...s, actions: s.actions.map((a) => a.id === actionId ? { ...a, ...patch } : a) } : s
    ))
  }

  function handleSave(launch = false) {
    const campaign = {
      _id: `campaign_${Date.now()}`,
      name,
      budget: parseFloat(budget) || 0,
      budgetCurrency,
      stages,
      status: launch ? "ACTIVE" : "DRAFT",
      createdAt: new Date().toISOString(),
    }
    saveCampaign(campaign)
    setSaved(true)
    setTimeout(() => router.push("/admin/campaigns"), 800)
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Campaign Builder"
        subtitle="No-code: define stages, conditions, and automated actions"
        action={
          <div className="flex gap-2">
            <Link href="/admin/campaigns"><AdminButton variant="ghost">← Back</AdminButton></Link>
            <AdminButton variant="secondary" onClick={() => handleSave(false)}>
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </AdminButton>
            <AdminButton onClick={() => handleSave(true)}>
              <Play className="mr-2 h-4 w-4" /> Launch
            </AdminButton>
          </div>
        }
      />

      {saved && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
          Campaign saved! Redirecting...
        </div>
      )}

      {/* Campaign meta */}
      <AdminCard>
        <h3 className="mb-4 font-bold text-white">Campaign Details</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-white/60">Campaign Name</label>
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/60">Budget</label>
            <div className="flex gap-2">
              <select
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-sm text-white focus:outline-none"
                value={budgetCurrency}
                onChange={(e) => setBudgetCurrency(e.target.value)}
              >
                <option value="INR">₹</option>
                <option value="USD">$</option>
              </select>
              <input
                type="number"
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Stages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white">Pipeline Stages ({stages.length})</h3>
          <AdminButton variant="secondary" size="sm" onClick={addStage}>
            <Plus className="mr-1 h-4 w-4" /> Add Stage
          </AdminButton>
        </div>

        {/* Stage flow visual */}
        <div className="flex flex-wrap items-center gap-2">
          {stages.map((stage, i) => (
            <div key={stage.id} className="flex items-center gap-2">
              {i > 0 && <ArrowRight className="h-4 w-4 text-white/20" />}
              <button
                onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                  expandedStage === stage.id ? "border-blue-400 bg-blue-500/20 text-blue-300" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {stage.name}
              </button>
            </div>
          ))}
        </div>

        {stages.map((stage) => (
          <AdminCard key={stage.id} className={expandedStage === stage.id ? "border-blue-500/30" : ""}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                  className="flex items-center gap-2"
                >
                  {expandedStage === stage.id ? <ChevronUp className="h-4 w-4 text-white/40" /> : <ChevronDown className="h-4 w-4 text-white/40" />}
                  <h3 className="font-bold text-white">{stage.name}</h3>
                </button>
                <div className="flex gap-1">
                  {stage.conditions.length > 0 && <AdminBadge variant="default">{stage.conditions.length} conditions</AdminBadge>}
                  {stage.actions.length > 0 && <AdminBadge variant="success">{stage.actions.length} actions</AdminBadge>}
                </div>
              </div>
              <AdminButton variant="ghost" size="sm" onClick={() => removeStage(stage.id)}>
                <Trash2 className="h-4 w-4 text-red-400" />
              </AdminButton>
            </div>

            {expandedStage === stage.id && (
              <div className="mt-4 space-y-6">
                {/* Stage meta */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm text-white/60">Stage Name</label>
                    <input
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={stage.name}
                      onChange={(e) => updateStage(stage.id, { name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-white/60">Trigger</label>
                    <select
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
                      value={stage.trigger?.type || "MANUAL"}
                      onChange={(e) => updateStage(stage.id, { trigger: { type: e.target.value as TriggerType } })}
                    >
                      {TRIGGERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Conditions */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white/70">IF CONDITIONS</p>
                    <AdminButton variant="ghost" size="sm" onClick={() => addCondition(stage.id)}>
                      <Plus className="mr-1 h-3 w-3" /> Add Condition
                    </AdminButton>
                  </div>
                  {stage.conditions.length === 0 ? (
                    <p className="text-xs text-white/30">No conditions — stage runs for all records.</p>
                  ) : (
                    <div className="space-y-2">
                      {stage.conditions.map((cond) => (
                        <div key={cond.id} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2">
                          <select
                            className="rounded bg-transparent px-2 py-1 text-sm text-white/80 focus:outline-none"
                            value={cond.field}
                            onChange={(e) => updateCondition(stage.id, cond.id, { field: e.target.value })}
                          >
                            {CONDITION_FIELDS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                          </select>
                          <select
                            className="rounded bg-transparent px-2 py-1 text-sm text-white/80 focus:outline-none"
                            value={cond.op}
                            onChange={(e) => updateCondition(stage.id, cond.id, { op: e.target.value })}
                          >
                            {OPS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                          <input
                            className="flex-1 rounded bg-white/5 px-2 py-1 text-sm text-white focus:outline-none"
                            value={cond.value}
                            onChange={(e) => updateCondition(stage.id, cond.id, { value: e.target.value })}
                            placeholder="value"
                          />
                          <button onClick={() => removeCondition(stage.id, cond.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white/70">THEN ACTIONS</p>
                    <AdminButton variant="ghost" size="sm" onClick={() => addAction(stage.id)}>
                      <Plus className="mr-1 h-3 w-3" /> Add Action
                    </AdminButton>
                  </div>
                  {stage.actions.length === 0 ? (
                    <p className="text-xs text-white/30">No actions configured.</p>
                  ) : (
                    <div className="space-y-2">
                      {stage.actions.map((action) => {
                        const def = ACTIONS.find((a) => a.value === action.type)
                        return (
                          <div key={action.id} className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2">
                            <select
                              className="rounded bg-transparent px-2 py-1 text-sm text-emerald-300 focus:outline-none"
                              value={action.type}
                              onChange={(e) => updateAction(stage.id, action.id, { type: e.target.value })}
                            >
                              {ACTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                            </select>
                            <input
                              className="flex-1 rounded bg-white/5 px-2 py-1 text-sm text-white focus:outline-none"
                              value={action.config}
                              onChange={(e) => updateAction(stage.id, action.id, { config: e.target.value })}
                              placeholder={def?.placeholder || "config"}
                            />
                            <button onClick={() => removeAction(stage.id, action.id)}>
                              <Trash2 className="h-3.5 w-3.5 text-red-400" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </AdminCard>
        ))}
      </div>
    </AdminPageWrapper>
  )
}
