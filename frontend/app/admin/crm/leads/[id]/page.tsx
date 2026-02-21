"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { getLeads, formatCurrency } from "@/shared/services/crmService"
import { useToast } from "@/shared/components/ui/toast"
import {
  Users2,
  Phone,
  Mail,
  DollarSign,
  Tag,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
} from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { format } from "date-fns"

const PIPELINE_STAGES = ["NEW", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CONVERTED", "DISQUALIFIED"]

const STATUS_LABEL: Record<string, string> = {
  NEW: "New", QUALIFIED: "Qualified", PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation", CONVERTED: "Won", DISQUALIFIED: "Lost",
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  NEW: "info", QUALIFIED: "default", PROPOSAL: "warning",
  NEGOTIATION: "warning", CONVERTED: "success", DISQUALIFIED: "danger",
}

const OVERRIDES_KEY = "talentos_leads_overrides"
const ACTIVITIES_KEY = "talentos_lead_activities"

function getLeadOverrides(): Record<string, any> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}") } catch { return {} }
}

function saveLeadOverride(id: string, patch: any) {
  const ov = getLeadOverrides()
  ov[id] = { ...(ov[id] || {}), ...patch }
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(ov))
}

function getLeadActivities(leadId: string): any[] {
  if (typeof window === "undefined") return []
  try {
    const all = JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || "{}")
    return all[leadId] || []
  } catch { return [] }
}

function saveLeadActivity(leadId: string, activity: any) {
  const all: any = {}
  try { Object.assign(all, JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || "{}")) } catch {}
  all[leadId] = [activity, ...(all[leadId] || [])]
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(all))
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { showToast } = useToast()
  const [lead, setLead] = useState<any | null>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activityNote, setActivityNote] = useState("")
  const [activityType, setActivityType] = useState("NOTE")

  useEffect(() => {
    getLeads(null).then((all: any[]) => {
      const found = all.find((l) => l._id === id)
      if (found) {
        const ov = getLeadOverrides()
        setLead(ov[found._id] ? { ...found, ...ov[found._id] } : found)
      }
      setActivities(getLeadActivities(id))
      setLoading(false)
    })
  }, [id])

  const handleStatusChange = (newStatus: string) => {
    saveLeadOverride(id, { status: newStatus })
    setLead((l: any) => ({ ...l, status: newStatus }))
    showToast(`Lead moved to ${STATUS_LABEL[newStatus]}.`, "success")
  }

  const addActivity = () => {
    if (!activityNote.trim()) return
    const activity = {
      id: `act_${Date.now()}`,
      type: activityType,
      note: activityNote.trim(),
      createdAt: new Date().toISOString(),
    }
    saveLeadActivity(id, activity)
    setActivities((prev) => [activity, ...prev])
    setActivityNote("")
    showToast("Activity logged.", "success")
  }

  if (loading) return (
    <AdminPageWrapper>
      <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />)}</div>
    </AdminPageWrapper>
  )

  if (!lead) return (
    <AdminPageWrapper>
      <AdminCard><p className="text-center text-white/50">Lead not found.</p></AdminCard>
    </AdminPageWrapper>
  )

  const stageIdx = PIPELINE_STAGES.indexOf(lead.status)

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={lead.name}
        subtitle={`Lead · ${lead.category || "Uncategorized"}`}
        action={
          <div className="flex gap-2">
            <Link href="/admin/crm/leads"><AdminButton variant="ghost">← Leads</AdminButton></Link>
            {lead.status !== "CONVERTED" && lead.status !== "DISQUALIFIED" && (
              <AdminButton onClick={() => handleStatusChange("CONVERTED")}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Convert to Account
              </AdminButton>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lead details */}
        <div className="space-y-6 lg:col-span-1">
          <AdminCard>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-white">Lead Details</h3>
              <AdminBadge variant={STATUS_VARIANT[lead.status] ?? "default"}>
                {STATUS_LABEL[lead.status] ?? lead.status}
              </AdminBadge>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-white/30" />
                <span className="text-white/70">{lead.email}</span>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-white/30" />
                  <span className="text-white/70">{lead.phone}</span>
                </div>
              )}
              {lead.budgetMinor && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-white/30" />
                  <span className="font-medium text-emerald-400">{formatCurrency(lead.budgetMinor, lead.currency)}</span>
                </div>
              )}
              {lead.source && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-white/30" />
                  <span className="text-white/70">Source: {lead.source}</span>
                </div>
              )}
              {lead.createdAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-white/30" />
                  <span className="text-white/50">Created {format(new Date(lead.createdAt), "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
            {lead.notes && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs font-semibold text-white/40">Notes</p>
                <p className="mt-1 text-sm text-white/70">{lead.notes}</p>
              </div>
            )}
          </AdminCard>

          {/* Pipeline progress */}
          <AdminCard>
            <h3 className="mb-3 font-bold text-white">Pipeline Stage</h3>
            <div className="space-y-2">
              {["NEW", "QUALIFIED", "PROPOSAL", "NEGOTIATION"].map((s, i) => {
                const idx = ["NEW", "QUALIFIED", "PROPOSAL", "NEGOTIATION"].indexOf(s)
                const done = i < stageIdx && lead.status !== "DISQUALIFIED"
                const active = s === lead.status
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${done || active ? "bg-purple-400 text-black" : "bg-white/10 text-white/30"}`}>
                      {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="text-xs">{i + 1}</span>}
                    </div>
                    <p className={`text-sm ${active ? "font-bold text-white" : done ? "text-white/70" : "text-white/30"}`}>{STATUS_LABEL[s]}</p>
                    {active && <ArrowRight className="ml-auto h-3.5 w-3.5 text-purple-400" />}
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {PIPELINE_STAGES.filter((s) => s !== lead.status).map((s) => (
                <AdminButton key={s} size="sm" variant={s === "DISQUALIFIED" ? "danger" : "secondary"} onClick={() => handleStatusChange(s)}>
                  → {STATUS_LABEL[s]}
                </AdminButton>
              ))}
            </div>
          </AdminCard>
        </div>

        {/* Activity timeline */}
        <div className="space-y-6 lg:col-span-2">
          <AdminCard>
            <h3 className="mb-4 font-bold text-white">Log Activity</h3>
            <div className="flex gap-2">
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white"
              >
                <option value="NOTE">Note</option>
                <option value="CALL">Call</option>
                <option value="EMAIL">Email</option>
                <option value="MEETING">Meeting</option>
                <option value="FOLLOW_UP">Follow-up</option>
              </select>
              <Input
                placeholder="Add a note or activity log…"
                value={activityNote}
                onChange={(e) => setActivityNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addActivity()}
                className="flex-1 border-white/20 bg-white/5 text-white placeholder:text-white/30"
              />
              <AdminButton onClick={addActivity}>
                <Plus className="h-4 w-4" />
              </AdminButton>
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="mb-4 font-bold text-white">Activity Timeline</h3>
            {activities.length === 0 ? (
              <p className="text-center text-sm text-white/40 py-6">No activities yet. Log a call, email, or note above.</p>
            ) : (
              <div className="relative space-y-4 pl-4">
                <div className="absolute left-0 top-2 bottom-2 w-px bg-white/10" />
                {activities.map((act) => (
                  <div key={act.id} className="relative flex gap-3">
                    <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-purple-400" />
                    <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3 pl-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white/50">{act.type}</span>
                        <span className="text-xs text-white/30">{format(new Date(act.createdAt), "MMM d, HH:mm")}</span>
                      </div>
                      <p className="mt-1 text-sm text-white">{act.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>
      </div>
    </AdminPageWrapper>
  )
}
