"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Circle, Clock } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"
import seedDeals from "@/data/seed/deals.json"

type DealStatus = "LEAD" | "BRIEFED" | "EXECUTION" | "SETTLED" | "CANCELLED"

const STATUS_LABEL: Record<DealStatus, string> = {
  LEAD: "Lead",
  BRIEFED: "Briefed",
  EXECUTION: "In Execution",
  SETTLED: "Settled",
  CANCELLED: "Cancelled",
}

const STATUS_VARIANT: Record<DealStatus, "default" | "success" | "warning" | "danger"> = {
  LEAD: "default",
  BRIEFED: "warning",
  EXECUTION: "default",
  SETTLED: "success",
  CANCELLED: "danger",
}

const STAGES: DealStatus[] = ["LEAD", "BRIEFED", "EXECUTION", "SETTLED"]

const NEXT_STATUS: Partial<Record<DealStatus, DealStatus>> = {
  LEAD: "BRIEFED",
  BRIEFED: "EXECUTION",
  EXECUTION: "SETTLED",
}

const STORAGE_KEY = "talentos_deals_overrides"
const ACTIVITY_KEY = "talentos_deals_activities"

function getOverrides(): Record<string, any> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") } catch { return {} }
}
function saveOverride(id: string, patch: any) {
  const o = getOverrides(); o[id] = { ...o[id], ...patch }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(o))
}
function getActivities(id: string): any[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(`${ACTIVITY_KEY}_${id}`) || "[]") } catch { return [] }
}
function saveActivity(id: string, activity: any) {
  const activities = getActivities(id)
  activities.unshift(activity)
  localStorage.setItem(`${ACTIVITY_KEY}_${id}`, JSON.stringify(activities))
}

export default function DealDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [deal, setDeal] = useState<any | null>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [note, setNote] = useState("")

  useEffect(() => {
    const seed = (seedDeals as any[]).find((d) => d._id === id)
    const overrides = getOverrides()
    const merged = seed ? { ...seed, ...overrides[id] } : overrides[id] || null
    setDeal(merged)
    setActivities(getActivities(id))
  }, [id])

  function handleStatusChange(newStatus: DealStatus) {
    setDeal((d: any) => ({ ...d, status: newStatus }))
    saveOverride(id, { status: newStatus })
    const activity = {
      _id: `act_${Date.now()}`,
      type: "STATUS_CHANGE",
      content: `Status changed to ${STATUS_LABEL[newStatus]}`,
      createdAt: new Date().toISOString(),
    }
    setActivities((prev) => [activity, ...prev])
    saveActivity(id, activity)
  }

  function handleAddNote() {
    if (!note.trim()) return
    const activity = {
      _id: `act_${Date.now()}`,
      type: "NOTE",
      content: note.trim(),
      createdAt: new Date().toISOString(),
    }
    setActivities((prev) => [activity, ...prev])
    saveActivity(id, activity)
    setNote("")
  }

  if (!deal) return (
    <AdminPageWrapper>
      <AdminCard><p className="text-center text-white/50">Deal not found.</p></AdminCard>
    </AdminPageWrapper>
  )

  const stageIdx = STAGES.indexOf(deal.status as DealStatus)

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={deal.title}
        subtitle={deal.clientName}
        action={
          <div className="flex gap-2">
            <Link href="/admin/deals"><AdminButton variant="ghost">← All Deals</AdminButton></Link>
            {NEXT_STATUS[deal.status as DealStatus] && (
              <AdminButton onClick={() => handleStatusChange(NEXT_STATUS[deal.status as DealStatus]!)}>
                Advance → {STATUS_LABEL[NEXT_STATUS[deal.status as DealStatus]!]}
              </AdminButton>
            )}
            {deal.status === "EXECUTION" && (
              <AdminButton variant="danger" onClick={() => handleStatusChange("CANCELLED")}>Cancel Deal</AdminButton>
            )}
          </div>
        }
      />

      {/* Stage progress */}
      <AdminCard>
        <div className="flex items-center">
          {STAGES.map((stage, i) => {
            const past = i < stageIdx
            const current = i === stageIdx
            return (
              <div key={stage} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                    current ? "border-blue-400 bg-blue-500/20 text-blue-400"
                    : past ? "border-emerald-400 bg-emerald-500/20 text-emerald-400"
                    : "border-white/20 text-white/20"
                  }`}>
                    {past ? <CheckCircle className="h-4 w-4" /> : current ? <Clock className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </div>
                  <p className={`mt-1 text-xs ${current ? "font-semibold text-blue-400" : past ? "text-emerald-400" : "text-white/30"}`}>{STATUS_LABEL[stage]}</p>
                </div>
                {i < STAGES.length - 1 && (
                  <div className={`mx-1 h-0.5 flex-1 ${i < stageIdx ? "bg-emerald-400/40" : "bg-white/10"}`} />
                )}
              </div>
            )
          })}
        </div>
      </AdminCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Deal details */}
        <AdminCard>
          <h3 className="mb-4 font-bold text-white">Deal Summary</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-white/50">Status</dt>
              <dd><AdminBadge variant={STATUS_VARIANT[deal.status as DealStatus]}>{STATUS_LABEL[deal.status as DealStatus]}</AdminBadge></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Deal Value</dt>
              <dd className="font-semibold text-white">₹{deal.dealValue?.toLocaleString("en-IN")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Client</dt>
              <dd className="text-white">{deal.clientName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Deliverables</dt>
              <dd className="text-white">{deal.deliverables || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Due Date</dt>
              <dd className="text-white">{deal.dueDate || "Not set"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Currency</dt>
              <dd className="text-white">{deal.currency || "INR"}</dd>
            </div>
          </dl>
        </AdminCard>

        {/* Brief */}
        <AdminCard>
          <h3 className="mb-4 font-bold text-white">Brief</h3>
          <p className="text-sm text-white/70 leading-relaxed">{deal.brief || "No brief added yet."}</p>
          {deal.talentIds?.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs text-white/50">Assigned Talent ({deal.talentIds.length})</p>
              <div className="flex flex-wrap gap-1">
                {deal.talentIds.map((tid: string) => (
                  <span key={tid} className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">{tid}</span>
                ))}
              </div>
            </div>
          )}
        </AdminCard>

        {/* Activity timeline */}
        <AdminCard>
          <h3 className="mb-4 font-bold text-white">Activity Log</h3>
          <div className="mb-3 flex gap-2">
            <input
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
            />
            <AdminButton size="sm" onClick={handleAddNote}>Add</AdminButton>
          </div>
          {activities.length === 0 ? (
            <p className="text-sm text-white/30">No activity yet.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {activities.map((a) => (
                <div key={a._id} className="flex gap-3 text-sm">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-400" />
                  <div>
                    <p className="text-white/80">{a.content}</p>
                    <p className="text-xs text-white/30">{new Date(a.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </AdminPageWrapper>
  )
}
