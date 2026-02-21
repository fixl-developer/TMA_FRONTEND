"use client"

import { useEffect, useState } from "react"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import {
  getRfqs,
  getPurchaseOrders,
  getGoodsReceipts,
  getVendors,
  formatCurrency,
} from "@/shared/services/vendorService"
import {
  ShoppingCart,
  FileSearch,
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"

const RFQ_STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  OPEN: "info",
  BIDS_RECEIVED: "warning",
  EVALUATING: "warning",
  AWARDED: "success",
  CLOSED: "default",
}

const PO_STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  PENDING_APPROVAL: "warning",
  APPROVED: "success",
  RECEIVED: "success",
  CANCELLED: "danger",
}

export default function ProcurementPage() {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [rfqs, setRfqs] = useState<any[]>([])
  const [pos, setPos] = useState<any[]>([])
  const [receipts, setReceipts] = useState<any[]>([])
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getRfqs(tenantId),
      getPurchaseOrders(tenantId),
      getGoodsReceipts(tenantId),
      getVendors(tenantId),
    ]).then(([r, p, g, v]) => {
      setRfqs(r)
      setPos(p)
      setReceipts(g)
      setVendors(v)
      setLoading(false)
    })
  }, [tenantId])

  const openRfqs = rfqs.filter((r) => ["OPEN", "BIDS_RECEIVED", "EVALUATING"].includes(r.status)).length
  const pendingApproval = pos.filter((p) => p.status === "PENDING_APPROVAL").length
  const pendingReceipts = receipts.filter((r) => r.status === "PENDING").length
  const totalSpend = pos
    .filter((p) => ["APPROVED", "RECEIVED"].includes(p.status))
    .reduce((sum, p) => sum + (p.amountMinor || 0), 0)

  const vendorMap: Record<string, any> = {}
  vendors.forEach((v) => { vendorMap[v._id] = v })

  const recentRfqs = rfqs.slice(0, 4)
  const recentPos = pos.slice(0, 4)

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Procurement"
        subtitle="RFQs, purchase orders, goods receipts, and vendor spend management"
        action={
          <div className="flex gap-2">
            <Link href="/admin/procurement/rfqs">
              <AdminButton variant="secondary">
                <FileSearch className="mr-2 h-4 w-4" />
                New RFQ
              </AdminButton>
            </Link>
            <Link href="/admin/procurement/pos">
              <AdminButton>
                <FileText className="mr-2 h-4 w-4" />
                Purchase Orders
              </AdminButton>
            </Link>
          </div>
        }
      />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Active RFQs"
          value={openRfqs}
          subtitle="Open / evaluating"
          icon={FileSearch}
          color="blue"
        />
        <AdminStatCard
          title="Pending Approval"
          value={pendingApproval}
          subtitle="POs awaiting sign-off"
          icon={Clock}
          color="yellow"
        />
        <AdminStatCard
          title="Pending Delivery"
          value={pendingReceipts}
          subtitle="Awaiting goods receipt"
          icon={Truck}
          color="purple"
        />
        <AdminStatCard
          title="Total Spend"
          value={formatCurrency(totalSpend, "INR")}
          subtitle="Approved POs"
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Quick Action Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/admin/procurement/rfqs">
          <AdminCard hoverable className="cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/20">
                <FileSearch className="h-6 w-6 text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-white">RFQs</p>
                <p className="text-sm text-white/60">{rfqs.length} total · {openRfqs} open</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-white/30" />
            </div>
          </AdminCard>
        </Link>
        <Link href="/admin/procurement/pos">
          <AdminCard hoverable className="cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20">
                <FileText className="h-6 w-6 text-amber-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-white">Purchase Orders</p>
                <p className="text-sm text-white/60">{pos.length} total · {pendingApproval} pending</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-white/30" />
            </div>
          </AdminCard>
        </Link>
        <Link href="/admin/procurement/receipts">
          <AdminCard hoverable className="cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
                <Truck className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-white">Goods Receipts</p>
                <p className="text-sm text-white/60">{receipts.length} total · {pendingReceipts} pending</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-white/30" />
            </div>
          </AdminCard>
        </Link>
      </div>

      {/* Alerts */}
      {pendingApproval > 0 && (
        <AdminCard className="mb-6 border-amber-500/30 bg-amber-500/10">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-400" />
            <p className="text-sm text-amber-300">
              {pendingApproval} purchase order{pendingApproval > 1 ? "s" : ""} awaiting your approval.
            </p>
            <Link href="/admin/procurement/pos" className="ml-auto">
              <AdminButton size="sm" variant="secondary">
                Review
              </AdminButton>
            </Link>
          </div>
        </AdminCard>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent RFQs */}
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-white">Recent RFQs</h3>
            <Link href="/admin/procurement/rfqs">
              <AdminButton size="sm" variant="ghost">View all</AdminButton>
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-white/5" />)}
            </div>
          ) : recentRfqs.length === 0 ? (
            <AdminEmptyState icon={FileSearch} title="No RFQs yet" description="Create an RFQ to source vendors." />
          ) : (
            <div className="space-y-3">
              {recentRfqs.map((r) => (
                <div key={r._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{r.title}</p>
                    <p className="text-xs text-white/50">Due {r.dueDate}</p>
                  </div>
                  <AdminBadge variant={RFQ_STATUS_VARIANT[r.status] ?? "default"}>
                    {r.status.replace("_", " ")}
                  </AdminBadge>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        {/* Recent POs */}
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-white">Recent Purchase Orders</h3>
            <Link href="/admin/procurement/pos">
              <AdminButton size="sm" variant="ghost">View all</AdminButton>
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-white/5" />)}
            </div>
          ) : recentPos.length === 0 ? (
            <AdminEmptyState icon={FileText} title="No purchase orders" description="POs are created from awarded RFQs." />
          ) : (
            <div className="space-y-3">
              {recentPos.map((po) => (
                <div key={po._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{po.poNumber}</p>
                    <p className="text-xs text-white/50">
                      {vendorMap[po.vendorId]?.name ?? po.vendorId} · {formatCurrency(po.amountMinor, po.currency)}
                    </p>
                  </div>
                  <AdminBadge variant={PO_STATUS_VARIANT[po.status] ?? "default"}>
                    {po.status.replace("_", " ")}
                  </AdminBadge>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      {/* Vendor summary */}
      <AdminCard className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-white">Active Vendors</h3>
          <Link href="/admin/vendors">
            <AdminButton size="sm" variant="ghost">Manage vendors</AdminButton>
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-white/5" />)}
          </div>
        ) : vendors.length === 0 ? (
          <AdminEmptyState icon={Users} title="No vendors yet" />
        ) : (
          <div className="flex flex-wrap gap-3">
            {vendors.slice(0, 8).map((v) => (
              <Link key={v._id} href={`/admin/vendors/${v._id}`}>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:border-white/20 hover:bg-white/10">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-xs font-bold text-purple-400">
                    {v.name?.[0] ?? "V"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{v.name}</p>
                    <p className="text-xs text-white/50">{v.type ?? v.category}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
