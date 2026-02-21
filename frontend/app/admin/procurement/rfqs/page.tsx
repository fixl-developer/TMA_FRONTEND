"use client"

import { useEffect, useState } from "react"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import {
  getRfqs,
  getPurchaseOrders,
  getVendors,
} from "@/shared/services/vendorService"
import { FileSearch, Plus, ChevronDown } from "lucide-react"
import Link from "next/link"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  BIDS_RECEIVED: "Bids Received",
  EVALUATING: "Evaluating",
  AWARDED: "Awarded",
  CLOSED: "Closed",
}
const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  OPEN: "info",
  BIDS_RECEIVED: "warning",
  EVALUATING: "warning",
  AWARDED: "success",
  CLOSED: "default",
}
const NEXT_STATUS: Record<string, string[]> = {
  OPEN: ["BIDS_RECEIVED"],
  BIDS_RECEIVED: ["EVALUATING"],
  EVALUATING: ["AWARDED", "CLOSED"],
  AWARDED: ["CLOSED"],
  CLOSED: [],
}

const STORAGE_KEY = "talentos_rfq_overrides"

function getRfqOverrides(): Record<string, any> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") } catch { return {} }
}

function saveRfqOverride(id: string, patch: Partial<any>) {
  const overrides = getRfqOverrides()
  overrides[id] = { ...(overrides[id] || {}), ...patch }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

function getRuntimeRfqs(): any[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem("talentos_rfqs_runtime") || "[]") } catch { return [] }
}

function saveRuntimeRfq(rfq: any) {
  const list = getRuntimeRfqs()
  list.unshift(rfq)
  localStorage.setItem("talentos_rfqs_runtime", JSON.stringify(list))
}

export default function RfqsPage() {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [rfqs, setRfqs] = useState<any[]>([])
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", vendorIds: "" })

  const loadData = async () => {
    const [rawRfqs, v] = await Promise.all([getRfqs(tenantId), getVendors(tenantId)])
    const overrides = getRfqOverrides()
    const runtime = getRuntimeRfqs().filter((r: any) => r.tenantId === (tenantId || "tenant_001"))
    const merged = rawRfqs.map((r: any) => overrides[r._id] ? { ...r, ...overrides[r._id] } : r)
    setRfqs([...runtime, ...merged])
    setVendors(v)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [tenantId])

  const handleStatusChange = (rfqId: string, newStatus: string) => {
    saveRfqOverride(rfqId, { status: newStatus })
    setRfqs((prev) => prev.map((r) => r._id === rfqId ? { ...r, status: newStatus } : r))
    showToast(`RFQ status updated to ${STATUS_LABELS[newStatus]}.`, "success")
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setCreating(true)
    const rfq = {
      _id: `rfq_${Date.now()}`,
      tenantId: tenantId || "tenant_001",
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate,
      status: "OPEN",
      createdAt: new Date().toISOString(),
      createdByUserId: "user_admin_002",
    }
    saveRuntimeRfq(rfq)
    setRfqs((prev) => [rfq, ...prev])
    setForm({ title: "", description: "", dueDate: "", vendorIds: "" })
    setCreateOpen(false)
    setCreating(false)
    showToast(`RFQ "${rfq.title}" created.`, "success")
  }

  const filtered = filterStatus === "ALL" ? rfqs : rfqs.filter((r) => r.status === filterStatus)
  const openCount = rfqs.filter((r) => ["OPEN", "BIDS_RECEIVED", "EVALUATING"].includes(r.status)).length
  const awardedCount = rfqs.filter((r) => r.status === "AWARDED").length

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Requests for Quotation"
        subtitle="Source vendors by creating RFQs, receive bids, and award purchase orders"
        action={
          <div className="flex gap-2">
            <Link href="/admin/procurement">
              <AdminButton variant="ghost">← Procurement</AdminButton>
            </Link>
            <AdminButton onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New RFQ
            </AdminButton>
          </div>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard title="Open RFQs" value={openCount} subtitle="Active / evaluating" icon={FileSearch} color="blue" />
        <AdminStatCard title="Awarded" value={awardedCount} subtitle="PO issued" icon={FileSearch} color="green" />
        <AdminStatCard title="Total RFQs" value={rfqs.length} subtitle="All time" icon={FileSearch} color="purple" />
      </div>

      <AdminCard>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold text-white">RFQ List</h3>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px] border-white/20 bg-white/5 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />)}</div>
        ) : filtered.length === 0 ? (
          <AdminEmptyState
            icon={FileSearch}
            title="No RFQs"
            description="Create an RFQ to source vendors for a project."
            action={<AdminButton onClick={() => setCreateOpen(true)}>New RFQ</AdminButton>}
          />
        ) : (
          <AdminTable headers={["Title", "Due Date", "Status", "Actions"]}>
            {filtered.map((r) => (
              <AdminTableRow key={r._id}>
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{r.title}</p>
                  {r.description && <p className="mt-0.5 text-xs text-white/50 line-clamp-1">{r.description}</p>}
                </td>
                <td className="px-6 py-4 text-sm text-white/70">{r.dueDate || "—"}</td>
                <td className="px-6 py-4">
                  <AdminBadge variant={STATUS_VARIANT[r.status] ?? "default"}>
                    {STATUS_LABELS[r.status] ?? r.status}
                  </AdminBadge>
                </td>
                <td className="px-6 py-4">
                  {(NEXT_STATUS[r.status] ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {(NEXT_STATUS[r.status] ?? []).map((next) => (
                        <AdminButton
                          key={next}
                          size="sm"
                          variant="secondary"
                          onClick={() => handleStatusChange(r._id, next)}
                        >
                          → {STATUS_LABELS[next]}
                        </AdminButton>
                      ))}
                    </div>
                  )}
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      {/* Create RFQ Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create RFQ</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rfq-title">Title</Label>
              <Input
                id="rfq-title"
                placeholder="e.g. Photography & Videography for Finals"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rfq-desc">Description</Label>
              <textarea
                id="rfq-desc"
                className="min-h-[80px] w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-400 focus:outline-none"
                placeholder="Scope of work..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rfq-due">Due Date</Label>
              <Input
                id="rfq-due"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={creating}>{creating ? "Creating…" : "Create RFQ"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  )
}
