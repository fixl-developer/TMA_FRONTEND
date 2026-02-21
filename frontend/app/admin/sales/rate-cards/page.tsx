"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getRateCards, formatCurrency } from "@/shared/services/salesService"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import { DollarSign, Plus, Edit2, Trash2 } from "lucide-react"
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

const RUNTIME_KEY = "talentos_rate_cards_runtime"
const OVERRIDES_KEY = "talentos_rate_cards_overrides"

function getRuntimeCards(): any[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(RUNTIME_KEY) || "[]") } catch { return [] }
}

function saveRuntimeCard(card: any) {
  const list = getRuntimeCards()
  list.unshift(card)
  localStorage.setItem(RUNTIME_KEY, JSON.stringify(list))
}

function deleteRuntimeCard(id: string) {
  const list = getRuntimeCards().filter((c) => c._id !== id)
  localStorage.setItem(RUNTIME_KEY, JSON.stringify(list))
}

const DELIVERABLE_TYPES = ["Instagram Post", "Instagram Reel", "YouTube Video", "Blog Post", "TikTok Video", "Twitter/X Post", "LinkedIn Post", "Event Hosting", "Voiceover", "Product Review"]
const USAGE_TYPES = ["Organic Only", "Paid Amplification", "Whitelist/Boost", "Exclusivity", "Broadcast Rights", "Digital Rights"]
const ROLE_TYPES = ["Nano Influencer", "Micro Influencer", "Macro Influencer", "Celebrity", "Model", "Actor", "Host", "Athlete"]

export default function SalesRateCardsPage() {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [rateCards, setRateCards] = useState<any[]>([])
  const [runtime, setRuntime] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    name: "", roleType: "", deliverableType: "", usageType: "Organic Only",
    rateMinor: "", currency: "INR", notes: ""
  })

  const loadData = async () => {
    const seed = await getRateCards(tenantId, categoryFilter || undefined)
    setRateCards(seed as any[])
    setRuntime(getRuntimeCards().filter((c: any) => c.tenantId === (tenantId || "tenant_001")))
    setLoading(false)
  }

  useEffect(() => { loadData() }, [tenantId, categoryFilter])

  const allCards = [...runtime, ...rateCards]

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.rateMinor) return
    setCreating(true)
    const card = {
      _id: `rc_${Date.now()}`,
      tenantId: tenantId || "tenant_001",
      name: form.name.trim(),
      roleType: form.roleType,
      deliverableType: form.deliverableType,
      usageType: form.usageType,
      rateMinor: Math.round(parseFloat(form.rateMinor) * 100),
      currency: form.currency,
      notes: form.notes.trim(),
      createdAt: new Date().toISOString(),
    }
    saveRuntimeCard(card)
    setRuntime((prev) => [card, ...prev])
    setForm({ name: "", roleType: "", deliverableType: "", usageType: "Organic Only", rateMinor: "", currency: "INR", notes: "" })
    setCreateOpen(false)
    setCreating(false)
    showToast(`Rate card "${card.name}" created.`, "success")
  }

  const handleDelete = (id: string) => {
    deleteRuntimeCard(id)
    setRuntime((prev) => prev.filter((c) => c._id !== id))
    showToast("Rate card removed.", "info")
  }

  const categories = Array.from(new Set(allCards.map((c) => c.roleType || c.category).filter(Boolean)))

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Rate Cards"
        subtitle="Standard pricing per role, deliverable type, and usage rights"
        action={
          <div className="flex gap-2">
            <Link href="/admin/sales"><AdminButton variant="ghost">← Sales</AdminButton></Link>
            <AdminButton onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Rate Card
            </AdminButton>
          </div>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard title="Total Rate Cards" value={allCards.length} subtitle="All categories" icon={DollarSign} color="purple" />
        <AdminStatCard title="Deliverable Types" value={new Set(allCards.map((c) => c.deliverableType).filter(Boolean)).size} subtitle="Unique types" icon={DollarSign} color="blue" />
        <AdminStatCard title="Role Types" value={new Set(allCards.map((c) => c.roleType).filter(Boolean)).size} subtitle="Categories" icon={DollarSign} color="green" />
      </div>

      <AdminCard>
        <div className="mb-4 flex items-center gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px] border-white/20 bg-white/5 text-white">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-white/5" />)}</div>
        ) : allCards.length === 0 ? (
          <AdminEmptyState icon={DollarSign} title="No rate cards" action={<AdminButton onClick={() => setCreateOpen(true)}>New Rate Card</AdminButton>} />
        ) : (
          <AdminTable headers={["Name", "Role Type", "Deliverable", "Usage Rights", "Rate", "Actions"]}>
            {allCards.map((rc) => (
              <AdminTableRow key={rc._id}>
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{rc.name}</p>
                  {rc.notes && <p className="text-xs text-white/40 line-clamp-1">{rc.notes}</p>}
                </td>
                <td className="px-6 py-4 text-sm text-white/70">{rc.roleType || rc.category || "—"}</td>
                <td className="px-6 py-4 text-sm text-white/70">{rc.deliverableType || "—"}</td>
                <td className="px-6 py-4 text-sm text-white/70">{rc.usageType || "—"}</td>
                <td className="px-6 py-4 text-sm font-bold text-white">
                  {rc.rateMinor ? formatCurrency(rc.rateMinor, rc.currency || "INR") : "—"}
                </td>
                <td className="px-6 py-4">
                  {runtime.some((r) => r._id === rc._id) && (
                    <AdminButton size="sm" variant="danger" onClick={() => handleDelete(rc._id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </AdminButton>
                  )}
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      {/* Create Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>New Rate Card</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input placeholder="e.g. Macro Influencer - Instagram Reel (Organic)" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Role Type</Label>
                <Select value={form.roleType} onValueChange={(v) => setForm((f) => ({ ...f, roleType: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    {ROLE_TYPES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Deliverable Type</Label>
                <Select value={form.deliverableType} onValueChange={(v) => setForm((f) => ({ ...f, deliverableType: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select deliverable" /></SelectTrigger>
                  <SelectContent>
                    {DELIVERABLE_TYPES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Usage Rights</Label>
                <Select value={form.usageType} onValueChange={(v) => setForm((f) => ({ ...f, usageType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {USAGE_TYPES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Rate (INR) *</Label>
                <Input type="number" placeholder="0" value={form.rateMinor} onChange={(e) => setForm((f) => ({ ...f, rateMinor: e.target.value }))} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input placeholder="Additional terms or conditions" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={creating}>{creating ? "Creating…" : "Create Rate Card"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  )
}
