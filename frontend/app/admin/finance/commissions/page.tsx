"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/shared/components/ui/toast"
import { DollarSign, Plus, Trash2, Percent } from "lucide-react"
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

const STORAGE_KEY = "talentos_commission_rules"

const SEED_RULES = [
  { id: "cr_001", name: "Standard Booking", bookingType: "GENERAL", type: "FLAT", platformPct: 15, tenantPct: 70, talentPct: 15, active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "cr_002", name: "Premium Campaign", bookingType: "CAMPAIGN", type: "TIERED", platformPct: 12, tenantPct: 68, talentPct: 20, active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "cr_003", name: "Pageant Win Bonus", bookingType: "PAGEANT", type: "CONDITIONAL", platformPct: 10, tenantPct: 60, talentPct: 30, active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "cr_004", name: "Brand Deal - Macro", bookingType: "BRAND_DEAL", type: "TIERED", platformPct: 15, tenantPct: 55, talentPct: 30, active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "cr_005", name: "Staffing Shift", bookingType: "SHIFT", type: "FLAT", platformPct: 8, tenantPct: 72, talentPct: 20, active: true, createdAt: "2024-01-01T00:00:00Z" },
]

function getRules(): any[] {
  if (typeof window === "undefined") return SEED_RULES
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")
    return stored || SEED_RULES
  } catch { return SEED_RULES }
}

function saveRules(rules: any[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rules))
}

const BOOKING_TYPES = ["GENERAL", "CAMPAIGN", "PAGEANT", "BRAND_DEAL", "SHIFT", "CASTING", "MARKETPLACE", "ACADEMY"]
const COMMISSION_TYPES = [
  { id: "FLAT", label: "Flat %", desc: "Fixed percentage split" },
  { id: "TIERED", label: "Tiered %", desc: "Percentage changes with deal size" },
  { id: "CONDITIONAL", label: "Conditional", desc: "Different splits based on conditions" },
]

export default function CommissionsPage() {
  const { showToast } = useToast()
  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewRule, setPreviewRule] = useState<any | null>(null)
  const [previewAmount, setPreviewAmount] = useState("100000")
  const [form, setForm] = useState({
    name: "", bookingType: "GENERAL", type: "FLAT",
    platformPct: "15", tenantPct: "70", talentPct: "15"
  })

  useEffect(() => {
    setRules(getRules())
    setLoading(false)
  }, [])

  const pctTotal = (parseFloat(form.platformPct) || 0) + (parseFloat(form.tenantPct) || 0) + (parseFloat(form.talentPct) || 0)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (Math.abs(pctTotal - 100) > 0.01) {
      showToast("Platform + Tenant + Talent must equal 100%.", "error")
      return
    }
    const rule = {
      id: `cr_${Date.now()}`,
      name: form.name,
      bookingType: form.bookingType,
      type: form.type,
      platformPct: parseFloat(form.platformPct),
      tenantPct: parseFloat(form.tenantPct),
      talentPct: parseFloat(form.talentPct),
      active: true,
      createdAt: new Date().toISOString(),
    }
    const updated = [rule, ...rules]
    setRules(updated)
    saveRules(updated)
    setCreateOpen(false)
    setForm({ name: "", bookingType: "GENERAL", type: "FLAT", platformPct: "15", tenantPct: "70", talentPct: "15" })
    showToast(`Commission rule "${rule.name}" created.`, "success")
  }

  const handleDelete = (id: string) => {
    const updated = rules.filter((r) => r.id !== id)
    setRules(updated)
    saveRules(updated)
    showToast("Commission rule removed.", "info")
  }

  const toggleActive = (id: string) => {
    const updated = rules.map((r) => r.id === id ? { ...r, active: !r.active } : r)
    setRules(updated)
    saveRules(updated)
  }

  // Preview calculation
  const calcPreview = (rule: any, amountMinor: number) => {
    return {
      platform: Math.round(amountMinor * rule.platformPct / 100),
      tenant: Math.round(amountMinor * rule.tenantPct / 100),
      talent: Math.round(amountMinor * rule.talentPct / 100),
    }
  }

  function fmt(v: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v / 100)
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Commission Rules"
        subtitle="Define commission splits: Platform % + Tenant % + Talent % = 100%"
        action={
          <AdminButton onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Rule
          </AdminButton>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard title="Total Rules" value={rules.length} subtitle="All booking types" icon={Percent} color="purple" />
        <AdminStatCard title="Active Rules" value={rules.filter((r) => r.active).length} subtitle="In use" icon={Percent} color="green" />
        <AdminStatCard title="Booking Types" value={new Set(rules.map((r) => r.bookingType)).size} subtitle="Covered" icon={DollarSign} color="blue" />
      </div>

      <AdminCard>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />)}</div>
        ) : rules.length === 0 ? (
          <AdminEmptyState icon={Percent} title="No commission rules" action={<AdminButton onClick={() => setCreateOpen(true)}>Create Rule</AdminButton>} />
        ) : (
          <AdminTable headers={["Rule", "Booking Type", "Type", "Split", "Status", "Actions"]}>
            {rules.map((r) => (
              <AdminTableRow key={r.id}>
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{r.name}</p>
                </td>
                <td className="px-6 py-4">
                  <AdminBadge variant="info">{r.bookingType}</AdminBadge>
                </td>
                <td className="px-6 py-4 text-sm text-white/70">{r.type}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-blue-400">P: {r.platformPct}%</span>
                    <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-purple-400">T: {r.tenantPct}%</span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-400">C: {r.talentPct}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <AdminBadge variant={r.active ? "success" : "default"}>{r.active ? "Active" : "Inactive"}</AdminBadge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    <AdminButton size="sm" variant="secondary" onClick={() => { setPreviewRule(r); setPreviewOpen(true) }}>
                      Preview
                    </AdminButton>
                    <AdminButton size="sm" variant="ghost" onClick={() => toggleActive(r.id)}>
                      {r.active ? "Disable" : "Enable"}
                    </AdminButton>
                    <AdminButton size="sm" variant="danger" onClick={() => handleDelete(r.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </AdminButton>
                  </div>
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      {/* Create Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>New Commission Rule</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>Rule Name *</Label>
              <Input placeholder="e.g. Standard Booking" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Booking Type</Label>
                <Select value={form.bookingType} onValueChange={(v) => setForm((f) => ({ ...f, bookingType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BOOKING_TYPES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Commission Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COMMISSION_TYPES.map((t) => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Commission Split (must total 100%)</Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-blue-400">Platform %</p>
                  <Input type="number" min="0" max="100" step="0.5" value={form.platformPct} onChange={(e) => setForm((f) => ({ ...f, platformPct: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-purple-400">Tenant %</p>
                  <Input type="number" min="0" max="100" step="0.5" value={form.tenantPct} onChange={(e) => setForm((f) => ({ ...f, tenantPct: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-emerald-400">Talent %</p>
                  <Input type="number" min="0" max="100" step="0.5" value={form.talentPct} onChange={(e) => setForm((f) => ({ ...f, talentPct: e.target.value }))} />
                </div>
              </div>
              <p className={`mt-2 text-xs ${Math.abs(pctTotal - 100) < 0.01 ? "text-emerald-400" : "text-rose-400"}`}>
                Total: {pctTotal.toFixed(1)}% {Math.abs(pctTotal - 100) < 0.01 ? "✓" : "(must be 100%)"}
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit">Create Rule</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={(o) => { if (!o) setPreviewOpen(false) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Commission Preview: {previewRule?.name}</DialogTitle></DialogHeader>
          {previewRule && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Deal Amount (INR)</Label>
                <Input
                  type="number"
                  value={previewAmount}
                  onChange={(e) => setPreviewAmount(e.target.value)}
                  placeholder="100000"
                />
              </div>
              {(() => {
                const amount = Math.round(parseFloat(previewAmount || "0") * 100)
                const calc = calcPreview(previewRule, amount)
                return (
                  <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-white">Split on {fmt(amount)}</p>
                    <div className="space-y-2">
                      {[
                        { label: "Platform", pct: previewRule.platformPct, amount: calc.platform, color: "text-blue-400" },
                        { label: "Tenant", pct: previewRule.tenantPct, amount: calc.tenant, color: "text-purple-400" },
                        { label: "Talent", pct: previewRule.talentPct, amount: calc.talent, color: "text-emerald-400" },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-current" style={{ color: "inherit" }} />
                            <span className={`text-sm font-medium ${row.color}`}>{row.label} ({row.pct}%)</span>
                          </div>
                          <span className="font-mono text-sm text-white">{fmt(row.amount)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      <div className="flex h-3 overflow-hidden rounded-full">
                        <div className="bg-blue-400" style={{ width: `${previewRule.platformPct}%` }} />
                        <div className="bg-purple-400" style={{ width: `${previewRule.tenantPct}%` }} />
                        <div className="bg-emerald-400" style={{ width: `${previewRule.talentPct}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  )
}
