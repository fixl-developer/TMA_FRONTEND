"use client"

import { useEffect, useState } from "react"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import {
  getGoodsReceipts,
  getPurchaseOrders,
  getVendors,
  formatCurrency,
} from "@/shared/services/vendorService"
import { Truck, CheckCircle2, Clock, Package } from "lucide-react"
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
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"

const STORAGE_KEY = "talentos_gr_overrides"

function getGrOverrides(): Record<string, any> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") } catch { return {} }
}

function saveGrOverride(id: string, patch: Partial<any>) {
  const overrides = getGrOverrides()
  overrides[id] = { ...(overrides[id] || {}), ...patch }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

export default function GoodsReceiptsPage() {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [receipts, setReceipts] = useState<any[]>([])
  const [poMap, setPoMap] = useState<Record<string, any>>({})
  const [vendorMap, setVendorMap] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [confirming, setConfirming] = useState(false)

  const loadData = async () => {
    const [rawReceipts, pos, vendors] = await Promise.all([
      getGoodsReceipts(tenantId),
      getPurchaseOrders(tenantId),
      getVendors(tenantId),
    ])
    const overrides = getGrOverrides()
    const merged = rawReceipts.map((r: any) => overrides[r._id] ? { ...r, ...overrides[r._id] } : r)
    setReceipts(merged)
    const pm: Record<string, any> = {}
    pos.forEach((p: any) => { pm[p._id] = p })
    setPoMap(pm)
    const vm: Record<string, any> = {}
    vendors.forEach((v: any) => { vm[v._id] = v })
    setVendorMap(vm)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [tenantId])

  const handleMarkReceived = () => {
    if (!confirmId) return
    setConfirming(true)
    const patch = { status: "RECEIVED", receivedAt: new Date().toISOString(), notes: notes || undefined }
    saveGrOverride(confirmId, patch)
    setReceipts((prev) => prev.map((r) => r._id === confirmId ? { ...r, ...patch } : r))
    setConfirmId(null)
    setNotes("")
    setConfirming(false)
    showToast("Goods receipt confirmed. Vendor invoice can now be triggered.", "success")
  }

  const receivedCount = receipts.filter((r) => r.status === "RECEIVED").length
  const pendingCount = receipts.filter((r) => r.status === "PENDING").length
  const totalReceived = receipts
    .filter((r) => r.status === "RECEIVED")
    .reduce((sum, r) => sum + (poMap[r.poId]?.amountMinor || 0), 0)

  const selectedReceipt = confirmId ? receipts.find((r) => r._id === confirmId) : null

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Goods Receipts"
        subtitle="Confirm delivery of goods and services — triggers vendor invoice"
        action={
          <div className="flex gap-2">
            <Link href="/admin/procurement/pos">
              <AdminButton variant="ghost">← Purchase Orders</AdminButton>
            </Link>
          </div>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard title="Received" value={receivedCount} subtitle="Delivery confirmed" icon={CheckCircle2} color="green" />
        <AdminStatCard title="Pending" value={pendingCount} subtitle="Awaiting delivery" icon={Clock} color="yellow" />
        <AdminStatCard title="Value Received" value={formatCurrency(totalReceived, "INR")} subtitle="Billable amount" icon={Package} color="blue" />
      </div>

      <AdminCard>
        <h3 className="mb-4 font-bold text-white">Goods Receipts</h3>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />)}</div>
        ) : receipts.length === 0 ? (
          <AdminEmptyState icon={Truck} title="No goods receipts" description="Receipts are created when POs are approved." />
        ) : (
          <AdminTable headers={["Vendor / PO", "Amount", "Notes", "Status", "Actions"]}>
            {receipts.map((gr) => {
              const po = poMap[gr.poId]
              const vendor = vendorMap[gr.vendorId]
              return (
                <AdminTableRow key={gr._id}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{vendor?.name ?? gr.vendorId}</p>
                    <p className="text-xs text-white/50">{po?.poNumber ?? gr.poId}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {po ? formatCurrency(po.amountMinor, po.currency) : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">
                    {gr.status === "RECEIVED" && gr.receivedAt
                      ? `Received ${format(new Date(gr.receivedAt), "MMM d, yyyy")}`
                      : "Awaiting delivery"}
                    {gr.notes && (
                      <p className="mt-0.5 text-xs text-white/40 line-clamp-1">{gr.notes}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <AdminBadge variant={gr.status === "RECEIVED" ? "success" : "warning"}>
                      {gr.status}
                    </AdminBadge>
                  </td>
                  <td className="px-6 py-4">
                    {gr.status === "PENDING" && (
                      <AdminButton
                        size="sm"
                        variant="secondary"
                        onClick={() => { setConfirmId(gr._id); setNotes("") }}
                      >
                        Mark Received
                      </AdminButton>
                    )}
                    {gr.status === "RECEIVED" && (
                      <AdminButton size="sm" variant="ghost" disabled>
                        Invoice Triggered
                      </AdminButton>
                    )}
                  </td>
                </AdminTableRow>
              )
            })}
          </AdminTable>
        )}
      </AdminCard>

      {/* Confirm Receipt Modal */}
      <Dialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Goods Receipt</DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-white">
                  {vendorMap[selectedReceipt.vendorId]?.name ?? selectedReceipt.vendorId}
                </p>
                <p className="text-xs text-white/50">
                  {poMap[selectedReceipt.poId]?.poNumber ?? selectedReceipt.poId}
                  {poMap[selectedReceipt.poId] && ` · ${formatCurrency(poMap[selectedReceipt.poId].amountMinor, poMap[selectedReceipt.poId].currency)}`}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <textarea
                  className="min-h-[80px] w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-400 focus:outline-none"
                  placeholder="Any notes on delivery..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <p className="text-sm text-white/60">
                Confirming receipt will mark the delivery as received and allow a vendor invoice to be triggered.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmId(null)}>Cancel</Button>
                <Button onClick={handleMarkReceived} disabled={confirming}>
                  {confirming ? "Confirming…" : "Confirm Receipt"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  )
}
