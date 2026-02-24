"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Briefcase, TrendingUp, Clock, CheckCircle, Plus, ArrowRight } from "lucide-react"
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
import seedDeals from "@/data/seed/deals.json"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"

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

const NEXT_STATUS: Partial<Record<DealStatus, DealStatus>> = {
  LEAD: "BRIEFED",
  BRIEFED: "EXECUTION",
  EXECUTION: "SETTLED",
}

const STORAGE_KEY = "talentos_deals_overrides"

function getOverrides(): Record<string, Partial<typeof seedDeals[0]>> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") } catch { return {} }
}
function saveOverride(id: string, patch: Partial<typeof seedDeals[0]>) {
  const overrides = getOverrides()
  overrides[id] = { ...overrides[id], ...patch }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

const fmt = (n: number) => `₹${(n / 100000).toFixed(1)}L`
const fmtShort = (n: number) => `₹${n.toLocaleString("en-IN")}`

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({ title: "", clientName: "", dealValue: "", dueDate: "" })

  useEffect(() => {
    const overrides = getOverrides()
    setDeals(
      seedDeals.map((d: any) => ({ ...d, ...overrides[d._id] }))
    )
  }, [])

  const filtered = useMemo(() =>
    statusFilter === "ALL" ? deals : deals.filter((d) => d.status === statusFilter),
    [deals, statusFilter]
  )

  const stats = useMemo(() => ({
    total: deals.length,
    active: deals.filter((d) => d.status === "EXECUTION").length,
    pipeline: deals.filter((d) => ["LEAD", "BRIEFED"].includes(d.status)).reduce((s, d) => s + d.dealValue, 0),
    settled: deals.filter((d) => d.status === "SETTLED").reduce((s, d) => s + d.dealValue, 0),
  }), [deals])

  function handleStatusChange(id: string, newStatus: DealStatus) {
    setDeals((prev) => prev.map((d) => d._id === id ? { ...d, status: newStatus } : d))
    saveOverride(id, { status: newStatus } as any)
  }

  function handleCreate() {
    const newDeal = {
      _id: `deal_r${Date.now()}`,
      tenantId: "tenant_001",
      title: form.title,
      clientName: form.clientName,
      clientEmail: "",
      status: "LEAD" as DealStatus,
      dealValue: parseFloat(form.dealValue) || 0,
      currency: "INR",
      talentIds: [],
      brief: "",
      deliverables: 0,
      dueDate: form.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setDeals((prev) => [newDeal, ...prev])
    saveOverride(newDeal._id, newDeal as any)
    setForm({ title: "", clientName: "", dealValue: "", dueDate: "" })
    setCreateOpen(false)
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Deal Rooms"
        subtitle="Brand deal lifecycle: Lead → Briefed → Execution → Settled"
        action={
          <AdminButton onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Deal
          </AdminButton>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <AdminStatCard title="Total Deals" value={stats.total} icon={Briefcase} />
        <AdminStatCard title="In Execution" value={stats.active} icon={TrendingUp} />
        <AdminStatCard title="Pipeline Value" value={fmt(stats.pipeline)} icon={Clock} />
        <AdminStatCard title="Settled Value" value={fmt(stats.settled)} icon={CheckCircle} />
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "LEAD", "BRIEFED", "EXECUTION", "SETTLED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              statusFilter === s ? "border-blue-500 bg-blue-500/20 text-blue-300" : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {s === "ALL" ? "All" : STATUS_LABEL[s as DealStatus]}
            {s !== "ALL" && (
              <span className="ml-1 text-xs opacity-60">({deals.filter((d) => d.status === s).length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Pipeline funnel */}
      <AdminCard>
        <h3 className="mb-4 text-sm font-semibold text-white/70">PIPELINE STAGES</h3>
        <div className="flex items-center gap-0">
          {(["LEAD","BRIEFED","EXECUTION","SETTLED"] as DealStatus[]).map((s, i) => {
            const count = deals.filter((d) => d.status === s).length
            return (
              <div key={s} className="flex items-center">
                {i > 0 && <ArrowRight className="h-4 w-4 text-white/20" />}
                <button
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-lg border px-4 py-3 text-center transition hover:bg-white/10 ${
                    statusFilter === s ? "border-blue-400 bg-blue-500/20" : "border-white/10 bg-white/5"
                  }`}
                >
                  <p className="text-xl font-bold text-white">{count}</p>
                  <p className="text-xs text-white/50">{STATUS_LABEL[s]}</p>
                </button>
              </div>
            )
          })}
        </div>
      </AdminCard>

      {filtered.length === 0 ? (
        <AdminEmptyState title="No deals found" description="No deals match the selected filter." />
      ) : (
        <AdminCard>
          <AdminTable headers={["Deal Title", "Client", "Status", "Value", "Deliverables", "Due Date", "Actions"]}>
            {filtered.map((deal) => (
              <AdminTableRow key={deal._id}>
                <td className="whitespace-nowrap py-3 pr-4 font-medium text-white">
                  <Link href={`/admin/deals/${deal._id}`} className="hover:text-blue-400">{deal.title}</Link>
                </td>
                <td className="whitespace-nowrap py-3 pr-4 text-white/70">{deal.clientName}</td>
                <td className="py-3 pr-4">
                  <AdminBadge variant={STATUS_VARIANT[deal.status as DealStatus]}>
                    {STATUS_LABEL[deal.status as DealStatus] || deal.status}
                  </AdminBadge>
                </td>
                <td className="whitespace-nowrap py-3 pr-4 text-white/70">{fmtShort(deal.dealValue)}</td>
                <td className="py-3 pr-4 text-white/70">{deal.deliverables}</td>
                <td className="py-3 pr-4 text-white/50">{deal.dueDate || "—"}</td>
                <td className="py-3 pr-4">
                  <div className="flex gap-2">
                    {NEXT_STATUS[deal.status as DealStatus] && (
                      <AdminButton
                        variant="secondary"
                        size="sm"
                        onClick={() => handleStatusChange(deal._id, NEXT_STATUS[deal.status as DealStatus]!)}
                      >
                        → {STATUS_LABEL[NEXT_STATUS[deal.status as DealStatus]!]}
                      </AdminButton>
                    )}
                    <Link href={`/admin/deals/${deal._id}`}>
                      <AdminButton variant="ghost" size="sm">View</AdminButton>
                    </Link>
                  </div>
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        </AdminCard>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="border admin-light-theme:border-slate-200 admin-light-theme:bg-white admin-dark-theme:border-white/10 admin-dark-theme:bg-slate-900 admin-light-theme:text-slate-900 admin-dark-theme:text-white">
          <DialogHeader>
            <DialogTitle>New Deal Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-white/60">Deal Title</label>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Brand × Creator Campaign"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/60">Client Name</label>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Brand / Client name"
                value={form.clientName}
                onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm text-white/60">Deal Value (₹)</label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="200000"
                  value={form.dealValue}
                  onChange={(e) => setForm((f) => ({ ...f, dealValue: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-white/60">Due Date</label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={form.dueDate}
                  onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <AdminButton variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleCreate} disabled={!form.title || !form.clientName}>Create Deal</AdminButton>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  )
}
