"use client"

import { useEffect, useState } from "react"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import {
  getPurchaseOrders,
  getVendors,
  getRfqs,
  formatCurrency,
} from "@/shared/services/vendorService"
import { FileText, Plus, CheckCircle2 } from "lucide-react"
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
import { format } from "date-fns"

const STATUS_LABELS: Record<string, string> = {
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  RECEIVED: "Received",
  CANCELLED: "Cancelled",
}
const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  PENDING_APPROVAL: "warning",
  APPROVED: "success",
  RECEIVED: "info",
  CANCELLED: "danger",
}
const NEXT_STATUS: Record<string, string[]> = {
  PENDING_APPROVAL: ["APPROVED", "CANCELLED"],
  APPROVED: ["RECEIVED"],
  RECEIVED: [],
  CANCELLED: [],
}

const STORAGE_KEY = "talentos_po_overrides"

function getPoOverrides(): Record<string, any> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") } catch { return {} }
}

function savePoOverride(id: string, patch: Partial<any>) {
  const overrides = getPoOverrides()
  overrides[id] = { ...(overrides[id] || {}), ...patch }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

function getRuntimePos(): any[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem("talentos_pos_runtime") || "[]") } catch { return [] }
}

function saveRuntimePo(po: any) {
  const list = getRuntimePos()
  list.unshift(po)
  localStorage.setItem("talentos_pos_runtime", JSON.stringify(list))
}

export default function PurchaseOrdersPage() {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [pos, setPos] = useState<any[]>([])
  const [vendors, setVendors] = useState<any[]>([])
  const [rfqs, setRfqs] = useState<any[]>([])
  const [vendorMap, setVendorMap] = useState<Record<string, any>>({})
  const [rfqMap, setRfqMap] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ vendorId: "", rfqId: "", description: "", amountMinor: "", currency: "INR" })

  const loadData = async () => {
    const [rawPos, v, r] = await Promise.all([
      getPurchaseOrders(tenantId),
      getVendors(tenantId),
      getRfqs(tenantId),
    ])
    const overrides = getPoOverrides()
    const runtime = getRuntimePos().filter((p: any) => p.tenantId === (tenantId || "tenant_001"))
    const merged = rawPos.map((p: any) => overrides[p._id] ? { ...p, ...overrides[p._id] } : p)
    setPos([...runtime, ...merged])
    setVendors(v)
    setRfqs(r)
    const vm: Record<string, any> = {}
    v.forEach((x: any) => { vm[x._id] = x })
    setVendorMap(vm)
    const rm: Record<string, any> = {}
    r.forEach((x: any) => { rm[x._id] = x })
    setRfqMap(rm)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [tenantId])

  const handleStatusChange = (poId: string, newStatus: string) => {
    const patch: any = { status: newStatus }
    if (newStatus === "APPROVED") patch.approvedAt = new Date().toISOString()
    if (newStatus === "RECEIVED") patch.receivedAt = new Date().toISOString()
    savePoOverride(poId, patch)
    setPos((prev) => prev.map((p) => p._id === poId ? { ...p, ...patch } : p))
    showToast(`PO status updated to ${STATUS_LABELS[newStatus]}.`, "success")
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.vendorId || !form.amountMinor) return
    setCreating(true)
    const poNumber = `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`
    const po = {
      _id: `po_${Date.now()}`,
      tenantId: tenantId || "tenant_001",
      vendorId: form.vendorId,
      rfqId: form.rfqId || undefined,
      poNumber,
      amountMinor: Math.round(parseFloat(form.amountMinor) * 100),
      currency: form.currency,
      status: "PENDING_APPROVAL",
      items: [{ desc: form.description, qty: 1, rateMinor: Math.round(parseFloat(form.amountMinor) * 100) }],
      createdAt: new Date().toISOString(),
    }
    saveRuntimePo(po)
    setPos((prev) => [po, ...prev])
    setForm({ vendorId: "", rfqId: "", description: "", amountMinor: "", currency: "INR" })
    setCreateOpen(false)
    setCreating(false)
    showToast(`PO ${poNumber} created.`, "success")
  }

  const filtered = filterStatus === "ALL" ? pos : pos.filter((p) => p.status === filterStatus)
  const pendingCount = pos.filter((p) => p.status === "PENDING_APPROVAL").length
  const approvedCount = pos.filter((p) => p.status === "APPROVED").length
  const receivedCount = pos.filter((p) => p.status === "RECEIVED").length
  const totalSpend = pos.filter((p) => ["APPROVED","RECEIVED"].includes(p.status)).reduce((sum, p) => sum + (p.amountMinor || 0), 0)

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Purchase Orders"
        subtitle="PO approval workflow: PENDING → APPROVED → RECEIVED"
        action={
          <div className="flex gap-2">
            <Link href="/admin/procurement/rfqs">
              <AdminButton variant="ghost">← RFQs</AdminButton>
            </Link>
            <AdminButton onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New PO
            </AdminButton>
          </div>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <AdminStatCard title="Pending Approval" value={pendingCount} subtitle="Awaiting sign-off" icon={FileText} color="yellow" />
        <AdminStatCard title="Approved" value={approvedCount} subtitle="Ready to receive" icon={CheckCircle2} color="green" />
        <AdminStatCard title="Received" value={receivedCount} subtitle="Goods received" icon={FileText} color="blue" />
        <AdminStatCard title="Total Spend" value={formatCurrency(totalSpend, "INR")} subtitle="Approved + received" icon={FileText} color="purple" />
      </div>

      <AdminCard>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold text-white">Purchase Orders</h3>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] border-white/20 bg-white/5 text-white">
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
          <div className="space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />)}</div>
        ) : filtered.length === 0 ? (
          <AdminEmptyState icon={FileText} title="No purchase orders" action={<AdminButton onClick={() => setCreateOpen(true)}>New PO</AdminButton>} />
        ) : (
          <AdminTable headers={["PO Number", "Vendor", "Amount", "Linked RFQ", "Status", "Actions"]}>
            {filtered.map((po) => (
              <AdminTableRow key={po._id}>
                <td className="px-6 py-4">
                  <p className="font-mono text-sm font-bold text-white">{po.poNumber}</p>
                  <p className="text-xs text-white/50">
                    {po.createdAt ? format(new Date(po.createdAt), "MMM d, yyyy") : "—"}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-white/80">
                  {vendorMap[po.vendorId]?.name ?? po.vendorId}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-white">
                  {formatCurrency(po.amountMinor, po.currency)}
                </td>
                <td className="px-6 py-4 text-sm text-white/60">
                  {po.rfqId ? (rfqMap[po.rfqId]?.title ?? po.rfqId) : "—"}
                </td>
                <td className="px-6 py-4">
                  <AdminBadge variant={STATUS_VARIANT[po.status] ?? "default"}>
                    {STATUS_LABELS[po.status] ?? po.status}
                  </AdminBadge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {(NEXT_STATUS[po.status] ?? []).map((next) => (
                      <AdminButton
                        key={next}
                        size="sm"
                        variant={next === "CANCELLED" ? "danger" : "secondary"}
                        onClick={() => handleStatusChange(po._id, next)}
                      >
                        {next === "APPROVED" ? "Approve" : next === "RECEIVED" ? "Mark Received" : "Cancel"}
                      </AdminButton>
                    ))}
                  </div>
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      {/* Create PO Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>Vendor</Label>
              <Select value={form.vendorId} onValueChange={(v) => setForm((f) => ({ ...f, vendorId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((v) => (
                    <SelectItem key={v._id} value={v._id}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Linked RFQ (optional)</Label>
              <Select value={form.rfqId} onValueChange={(v) => setForm((f) => ({ ...f, rfqId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select RFQ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {rfqs.map((r) => (
                    <SelectItem key={r._id} value={r._id}>{r.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Scope / line item description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amountMinor}
                  onChange={(e) => setForm((f) => ({ ...f, amountMinor: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={form.currency} onValueChange={(v) => setForm((f) => ({ ...f, currency: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={creating}>{creating ? "Creating…" : "Create PO"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  )
}
