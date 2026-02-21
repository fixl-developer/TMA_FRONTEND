"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getShipments,
  getShipmentStatusColor,
  getShipmentTypeLabel,
  getCampaignById,
  getTalentById,
} from "@/shared/services/logisticsService"
import { useTenant } from "@/shared/context/TenantContext"
import { Package, ChevronRight } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

export default function ShipmentsPage() {
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
  const [shipments, setShipments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getShipments(tenantId).then((data) => {
      setShipments(data)
      setLoading(false)
    })
  }, [tenantId])

  const deliveredCount = shipments.filter((s) => s.status === "DELIVERED").length
  const inTransitCount = shipments.filter(
    (s) => s.status === "IN_TRANSIT" || s.status === "OUT_FOR_DELIVERY"
  ).length

  return (
    <AgenciesPage>
      <PageBanner
        title="Shipments"
        subtitle="Product seeding, kits, wardrobe – track deliveries"
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/logistics/returns">
          <Button variant="ghost" size="sm">
            Returns
          </Button>
        </Link>
      </div>

      <div className="mb-6 mt-6 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card style={{ borderColor: page.border }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total shipments</CardTitle>
            <Package className="h-5 w-5" style={{ color: page.accent }} />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" style={{ color: page.text }}>
              {loading ? "—" : shipments.length}
            </p>
            <p className="text-sm text-slate-500">{deliveredCount} delivered</p>
          </CardContent>
        </Card>
        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="text-sm">In transit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{inTransitCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle>Shipment list</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Loading…</p>
          ) : shipments.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No shipments yet.</p>
          ) : (
            <div className="space-y-3">
              {shipments.map((s) => (
                <Link key={s._id} href={`/admin/logistics/shipments/${s._id}`}>
                  <div
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-slate-50"
                    style={{ borderColor: page.border }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                        <Package className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: page.text }}>
                          {s.trackingNumber}
                        </p>
                        <p className="text-sm text-slate-500">
                          {getShipmentTypeLabel(s.type)} · {s.carrier} ·{" "}
                          {s.origin} → {s.destination}
                        </p>
                        {s.notes && (
                          <p className="mt-0.5 text-xs text-slate-400 truncate max-w-md">
                            {s.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs ${getShipmentStatusColor(s.status)}`}
                      >
                        {s.status.replace("_", " ")}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button size="sm" variant="outline" disabled>
          Create kit (coming soon)
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/logistics/returns">Returns</Link>
        </Button>
      </div>
    </AgenciesPage>
  )
}
