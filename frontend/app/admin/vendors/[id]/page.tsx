"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getVendorById,
  getPurchaseOrders,
  getVendorScorecard,
  getVendorStatusColor,
  getVendorTypeLabel,
  formatCurrency,
} from "@/shared/services/vendorService"
import { Truck, Mail, Phone, Star } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"
import { getCreatorName, getOwnerName } from "@/shared/lib/creator"

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
  const { page } = useDashboardTheme()
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
      <AgenciesPage>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-slate-500">Loading vendor…</p>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <PageBanner
        title={vendor.name}
        subtitle={`${getVendorTypeLabel(vendor.type)} · ${vendor.status}`}
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/vendors">
          <Button variant="ghost" size="sm">
            ← Vendors
          </Button>
        </Link>
        <Link href="/admin/procurement/rfqs">
          <Button variant="outline" size="sm">
            RFQs
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">
        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Vendor details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full border px-2 py-0.5 text-xs ${getVendorStatusColor(vendor.status)}`}
              >
                {vendor.status}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Contact: {vendor.contactName}
            </p>
            {vendor.email && (
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="h-4 w-4" />
                {vendor.email}
              </p>
            )}
            {vendor.phone && (
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="h-4 w-4" />
                {vendor.phone}
              </p>
            )}
            {vendor.address && (
              <p className="text-sm text-slate-600">{vendor.address}</p>
            )}
            {vendor.gstin && (
              <p className="text-sm text-slate-600">GSTIN: {vendor.gstin}</p>
            )}
            <p className="text-sm text-slate-600">
              Payment terms: {vendor.paymentTerms}
            </p>
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs font-medium text-slate-700">Ownership & attribution</p>
              <p className="mt-1 text-xs text-slate-600">
                Owner: {getOwnerName(vendor.ownerId) ?? vendor.ownerId ?? "—"}
              </p>
              <p className="mt-0.5 text-xs text-slate-600">
                Created by:{" "}
                {getCreatorName(vendor.createdByUserId ?? vendor.createdBy) ??
                  vendor.createdByUserId ??
                  vendor.createdBy ??
                  "System"}
              </p>
              <p className="mt-0.5 text-xs text-slate-600">
                Created: {formatDateTime(vendor.createdAt)} · Updated: {formatDateTime(vendor.updatedAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        {scorecard && (
          <Card style={{ borderColor: page.border }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Scorecard ({scorecard.period})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall</span>
                  <span className="font-medium">{scorecard.overall}/5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Quality</span>
                  <span>{scorecard.quality}/5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery</span>
                  <span>{scorecard.delivery}/5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Communication</span>
                  <span>{scorecard.communication}/5</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {scorecard.reviewCount} reviews
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="mt-6" style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle>Purchase orders</CardTitle>
        </CardHeader>
        <CardContent>
          {pos.length === 0 ? (
            <p className="py-4 text-center text-slate-500">
              No purchase orders for this vendor.
            </p>
          ) : (
            <div className="space-y-2">
              {pos.map((po) => (
                <div
                  key={po._id}
                  className="flex items-center justify-between rounded border p-3"
                  style={{ borderColor: page.border }}
                >
                  <div>
                    <p className="font-medium" style={{ color: page.text }}>
                      {po.poNumber}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatCurrency(po.amountMinor, po.currency)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${
                      po.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {po.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
