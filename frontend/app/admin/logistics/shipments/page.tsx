"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  getShipments,
  getShipmentTypeLabel,
} from "@/shared/services/logisticsService"
import { useTenant } from "@/shared/context/TenantContext"
import { Package, ChevronRight, RotateCcw } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
  AdminTableSkeleton,
} from "@/shared/components/layout/AdminPageWrapper"

export default function ShipmentsPage() {
  const { tenantId } = useTenant()
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
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Shipments"
        subtitle="Product seeding, kits, wardrobe – track deliveries"
        action={
          <Link href="/admin/logistics/returns">
            <AdminButton variant="secondary" size="sm">
              <RotateCcw className="h-4 w-4" />
              Returns
            </AdminButton>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <AdminStatCard
          title="Total shipments"
          value={loading ? "—" : shipments.length}
          subtitle={`${deliveredCount} delivered`}
          icon={Package}
          color="blue"
        />
        <AdminStatCard
          title="In transit"
          value={inTransitCount}
          icon={Package}
          color="yellow"
        />
      </div>

      <AdminCard>
        <div className="mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-white/60" />
          <h2 className="text-lg font-semibold text-white">Shipment list</h2>
        </div>
        {loading ? (
          <AdminTableSkeleton rows={5} cols={4} />
        ) : shipments.length === 0 ? (
          <AdminEmptyState
            icon={Package}
            title="No shipments"
            description="No shipments found yet."
          />
        ) : (
          <div className="space-y-3">
            {shipments.map((s) => (
              <Link key={s._id} href={`/admin/logistics/shipments/${s._id}`}>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-500/20">
                      <Package className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {s.trackingNumber}
                      </p>
                      <p className="text-sm text-white/60">
                        {getShipmentTypeLabel(s.type)} · {s.carrier} ·{" "}
                        {s.origin} → {s.destination}
                      </p>
                      {s.notes && (
                        <p className="mt-0.5 text-xs text-white/40 truncate max-w-md">
                          {s.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AdminBadge variant={s.status === "DELIVERED" ? "success" : s.status === "IN_TRANSIT" ? "info" : "default"}>
                      {s.status.replace("_", " ")}
                    </AdminBadge>
                    <ChevronRight className="h-4 w-4 text-white/40" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </AdminCard>

      <div className="mt-6 flex flex-wrap gap-3">
        <AdminButton size="sm" variant="secondary" disabled>
          Create kit (coming soon)
        </AdminButton>
        <Link href="/admin/logistics/returns">
          <AdminButton variant="secondary">Returns</AdminButton>
        </Link>
      </div>
    </AdminPageWrapper>
  )
}
