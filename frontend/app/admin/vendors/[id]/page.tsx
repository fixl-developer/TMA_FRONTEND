"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  getVendorById,
  getPurchaseOrders,
  getVendorScorecard,
  getVendorTypeLabel,
  formatCurrency,
} from "@/shared/services/vendorService"
import { Truck, Mail, Phone, Star, ArrowLeft } from "lucide-react"
import { getCreatorName, getOwnerName } from "@/shared/lib/creator"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
  AdminTableSkeleton,
} from "@/shared/components/layout/AdminPageWrapper"

function formatDateTime(iso?: string | null) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function VendorDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [vendor, setVendor] = useState<any>(null)
  const [pos, setPos] = useState<any[]>([])
  const [scorecard, setScorecard] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      getVendorById(id),
      getPurchaseOrders(undefined, { vendorId: id }),
      getVendorScorecard(id),
    ]).then(([v, p, s]) => {
      setVendor(v)
      setPos(p)
      setScorecard(s)
      setLoading(false)
    })
  }, [id])

  if (loading || !vendor) {
    return (
      <AdminPageWrapper>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-white/60">Loading vendor…</p>
        </div>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={vendor.name}
        subtitle={`${getVendorTypeLabel(vendor.type)} · ${vendor.status}`}
        action={
          <div className="flex gap-2">
            <Link href="/admin/vendors">
              <AdminButton variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Vendors
              </AdminButton>
            </Link>
            <Link href="/admin/procurement/rfqs">
              <AdminButton variant="secondary" size="sm">RFQs</AdminButton>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <AdminCard>
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-white/60" />
            <h2 className="text-lg font-semibold text-white">Vendor details</h2>
          </div>
          <div className="space-y-3">
            <AdminBadge variant={vendor.status === "ACTIVE" ? "success" : "default"}>
              {vendor.status}
            </AdminBadge>
            <p className="text-sm text-white/70">
              Contact: {vendor.contactName}
            </p>
            {vendor.email && (
              <p className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="h-4 w-4" />
                {vendor.email}
              </p>
            )}
            {vendor.phone && (
              <p className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="h-4 w-4" />
                {vendor.phone}
              </p>
            )}
            {vendor.address && (
              <p className="text-sm text-white/70">{vendor.address}</p>
            )}
            {vendor.gstin && (
              <p className="text-sm text-white/70">GSTIN: {vendor.gstin}</p>
            )}
            <p className="text-sm text-white/70">
              Payment terms: {vendor.paymentTerms}
            </p>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-xs font-medium text-white/80">Ownership & attribution</p>
              <p className="mt-1 text-xs text-white/60">
                Owner: {getOwnerName(vendor.ownerId) ?? vendor.ownerId ?? "—"}
              </p>
              <p className="mt-0.5 text-xs text-white/60">
                Created by:{" "}
                {getCreatorName(vendor.createdByUserId ?? vendor.createdBy) ??
                  vendor.createdByUserId ??
                  vendor.createdBy ??
                  "System"}
              </p>
              <p className="mt-0.5 text-xs text-white/60">
                Created: {formatDateTime(vendor.createdAt)} · Updated: {formatDateTime(vendor.updatedAt)}
              </p>
            </div>
          </div>
        </AdminCard>

        {scorecard && (
          <AdminCard>
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <h2 className="text-lg font-semibold text-white">Scorecard ({scorecard.period})</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Overall</span>
                <span className="font-medium text-white">{scorecard.overall}/5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Quality</span>
                <span className="text-white">{scorecard.quality}/5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Delivery</span>
                <span className="text-white">{scorecard.delivery}/5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Communication</span>
                <span className="text-white">{scorecard.communication}/5</span>
              </div>
              <p className="mt-2 text-xs text-white/50">
                {scorecard.reviewCount} reviews
              </p>
            </div>
          </AdminCard>
        )}
      </div>

      <AdminCard>
        <h2 className="mb-4 text-lg font-semibold text-white">Purchase orders</h2>
        {pos.length === 0 ? (
          <p className="py-4 text-center text-white/60">
            No purchase orders for this vendor.
          </p>
        ) : (
          <div className="space-y-2">
            {pos.map((po) => (
              <div
                key={po._id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div>
                  <p className="font-medium text-white">
                    {po.poNumber}
                  </p>
                  <p className="text-sm text-white/60">
                    {formatCurrency(po.amountMinor, po.currency)}
                  </p>
                </div>
                <AdminBadge variant={po.status === "APPROVED" ? "success" : "warning"}>
                  {po.status.replace("_", " ")}
                </AdminBadge>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
