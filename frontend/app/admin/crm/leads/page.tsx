"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { getLeads, formatCurrency } from "@/shared/services/crmService"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import { Users2, Plus, Filter, LayoutGrid, List } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Button } from "@/shared/components/ui/button"

const PIPELINE_STAGES = [
  { id: "NEW", label: "New", color: "border-t-blue-400", badge: "info" as const },
  { id: "QUALIFIED", label: "Qualified", color: "border-t-purple-400", badge: "default" as const },
  { id: "PROPOSAL", label: "Proposal", color: "border-t-yellow-400", badge: "warning" as const },
  { id: "NEGOTIATION", label: "Negotiation", color: "border-t-orange-400", badge: "warning" as const },
  { id: "CONVERTED", label: "Won", color: "border-t-emerald-400", badge: "success" as const },
  { id: "DISQUALIFIED", label: "Lost", color: "border-t-rose-400", badge: "danger" as const },
]

const OVERRIDES_KEY = "talentos_leads_overrides"
const RUNTIME_KEY = "talentos_leads_runtime"

function getLeadOverrides(): Record<string, any> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}") } catch { return {} }
}

function saveLeadOverride(id: string, patch: any) {
  const ov = getLeadOverrides()
  ov[id] = { ...(ov[id] || {}), ...patch }
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(ov))
}

function getRuntimeLeads(): any[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(RUNTIME_KEY) || "[]") } catch { return [] }
}

function saveRuntimeLead(lead: any) {
  const list = getRuntimeLeads()
  list.unshift(lead)
  localStorage.setItem(RUNTIME_KEY, JSON.stringify(list))
}

const sourceLabels: Record<string, string> = {
  INBOUND: "Inbound",
  REFERRAL: "Referral",
  PARTNER_INVITE: "Partner",
}

export default function CrmLeadsPage() {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", source: "INBOUND", category: "", budgetMinor: "", currency: "INR" })

  const tid = tenantId || "tenant_001"

  const loadData = async () => {
    const rawLeads = await getLeads(tenantId)
    const overrides = getLeadOverrides()
    const runtime = getRuntimeLeads().filter((l: any) => l.tenantId === tid)
    const merged = (rawLeads as any[]).map((l: any) => overrides[l._id] ? { ...l, ...overrides[l._id] } : l)
    setLeads([...runtime, ...merged])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [tenantId])

  const handleStatusChange = (leadId: string, newStatus: string) => {
    saveLeadOverride(leadId, { status: newStatus })
    setLeads((prev) => prev.map((l) => l._id === leadId ? { ...l, status: newStatus } : l))
    showToast(`Lead moved to ${newStatus}.`, "success")
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    setCreating(true)
    const lead = {
      _id: `lead_${Date.now()}`,
      tenantId: tid,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      source: form.source,
      category: form.category.trim(),
      budgetMinor: form.budgetMinor ? Math.round(parseFloat(form.budgetMinor) * 100) : undefined,
      currency: form.currency,
      status: "NEW",
      createdAt: new Date().toISOString(),
    }
    saveRuntimeLead(lead)
    setLeads((prev) => [lead, ...prev])
    setForm({ name: "", email: "", phone: "", source: "INBOUND", category: "", budgetMinor: "", currency: "INR" })
    setCreateOpen(false)
    setCreating(false)
    showToast(`Lead "${lead.name}" created.`, "success")
  }

  const filtered = useMemo(() => {
    if (!search) return leads
    const q = search.toLowerCase()
    return leads.filter((l) => l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.category?.toLowerCase().includes(q))
  }, [leads, search])

  const statuses = ["NEW", "QUALIFIED", "PROPOSAL", "NEGOTIATION"]
  const newCount = leads.filter((l) => l.status === "NEW").length
  const qualifiedCount = leads.filter((l) => l.status === "QUALIFIED" || l.status === "PROPOSAL" || l.status === "NEGOTIATION").length
  const wonCount = leads.filter((l) => l.status === "CONVERTED").length

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Leads Pipeline"
        subtitle="Manage leads through the sales pipeline: NEW → QUALIFIED → PROPOSAL → NEGOTIATION → WON/LOST"
        action={
          <div className="flex gap-2">
            <Link href="/admin/crm">
              <AdminButton variant="ghost">← CRM</AdminButton>
            </Link>
            <AdminButton onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </AdminButton>
          </div>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <AdminStatCard title="Total Leads" value={leads.length} subtitle="All pipeline" icon={Users2} color="purple" />
        <AdminStatCard title="New" value={newCount} subtitle="Unqualified" icon={Users2} color="blue" />
        <AdminStatCard title="In Pipeline" value={qualifiedCount} subtitle="Qualified+" icon={Users2} color="yellow" />
        <AdminStatCard title="Won" value={wonCount} subtitle="Converted" icon={Users2} color="green" />
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center gap-3">
        <Input
          placeholder="Search leads…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs border-white/20 bg-white/5 text-white placeholder:text-white/30"
        />
        <div className="flex rounded-lg border border-white/20 bg-white/5 p-0.5">
          <button onClick={() => setViewMode("kanban")} className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === "kanban" ? "bg-[#d4ff00] text-black" : "text-white/60 hover:text-white"}`}>
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button onClick={() => setViewMode("list")} className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === "list" ? "bg-[#d4ff00] text-black" : "text-white/60 hover:text-white"}`}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[1,2,3,4,5,6].map((i) => <div key={i} className="h-48 animate-pulse rounded-2xl bg-white/5" />)}
        </div>
      ) : viewMode === "kanban" ? (
        /* Kanban view */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = filtered.filter((l) => l.status === stage.id)
            return (
              <div key={stage.id} className={`min-w-[240px] flex-shrink-0 rounded-2xl border-t-4 border border-white/10 bg-white/5 p-4 ${stage.color}`}>
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold text-white">{stage.label}</p>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">{stageLeads.length}</span>
                </div>
                <div className="space-y-2">
                  {stageLeads.map((lead) => (
                    <div key={lead._id} className="rounded-xl border border-white/10 bg-white/5 p-3 transition-all hover:border-white/20 hover:bg-white/10">
                      <p className="text-sm font-semibold text-white">{lead.name}</p>
                      <p className="text-xs text-white/50">{lead.email}</p>
                      {lead.budgetMinor && (
                        <p className="mt-1 text-xs font-medium text-emerald-400">{formatCurrency(lead.budgetMinor, lead.currency)}</p>
                      )}
                      {lead.category && <p className="text-xs text-white/40">{lead.category}</p>}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {PIPELINE_STAGES.filter((s) => s.id !== stage.id && s.id !== "DISQUALIFIED").slice(0, 2).map((nextStage) => (
                          <button
                            key={nextStage.id}
                            onClick={() => handleStatusChange(lead._id, nextStage.id)}
                            className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60 hover:bg-white/20 hover:text-white"
                          >
                            → {nextStage.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <p className="text-center text-xs text-white/20 py-3">Empty</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List view */
        <AdminCard>
          {filtered.length === 0 ? (
            <AdminEmptyState icon={Users2} title="No leads found" action={<AdminButton onClick={() => setCreateOpen(true)}>Add Lead</AdminButton>} />
          ) : (
            <div className="space-y-3">
              {filtered.map((l) => {
                const stage = PIPELINE_STAGES.find((s) => s.id === l.status)
                return (
                  <div key={l._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-bold text-blue-400">
                        {l.name?.[0] ?? "L"}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{l.name}</p>
                        <p className="text-xs text-white/50">{l.email} · {sourceLabels[l.source] ?? l.source} · {l.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {l.budgetMinor && <p className="text-sm font-medium text-white/70">{formatCurrency(l.budgetMinor, l.currency)}</p>}
                      <AdminBadge variant={stage?.badge ?? "default"}>{stage?.label ?? l.status}</AdminBadge>
                      <Link href={`/admin/crm/leads/${l._id}`}>
                        <AdminButton size="sm" variant="ghost">View</AdminButton>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </AdminCard>
      )}

      {/* Create Lead Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Add Lead</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input placeholder="Company or person name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" placeholder="contact@example.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input placeholder="e.g. Beauty, Fashion" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Source</Label>
                <Select value={form.source} onValueChange={(v) => setForm((f) => ({ ...f, source: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INBOUND">Inbound</SelectItem>
                    <SelectItem value="REFERRAL">Referral</SelectItem>
                    <SelectItem value="PARTNER_INVITE">Partner</SelectItem>
                    <SelectItem value="OUTBOUND">Outbound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Budget (INR)</Label>
                <Input type="number" placeholder="0" value={form.budgetMinor} onChange={(e) => setForm((f) => ({ ...f, budgetMinor: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={creating}>{creating ? "Creating…" : "Add Lead"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  )
}
