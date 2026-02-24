"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  getReturnAuthorizations,
  getShipmentById,
} from "@/shared/services/logisticsService"
import { useTenant } from "@/shared/context/TenantContext"
import { Package, RotateCcw, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
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

export default function ReturnsPage() {
  const { tenantId } = useTenant()
  const [returns, setReturns] = useState<any[]>([])
  const [shipments, setShipments] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReturnAuthorizations(tenantId).then(async (r) => {
      setReturns(r)
      const shipIds = [...new Set(r.map((x) => x.shipmentId))]
      const shipMap: Record<string, any> = {}
      for (const sid of shipIds) {
        const s = await getShipmentById(sid)
        if (s) shipMap[sid] = s
      }
      setShipments(shipMap)
      setLoading(false)
    })
  }, [tenantId])

  const pendingCount = returns.filter((r) => r.status === "PENDING").length
  const approvedCount = returns.filter((r) => r.status === "APPROVED").length

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Return Authorizations"
        subtitle="Return requests and approvals"
        action={
          <Link href="/admin/logistics/shipments">
            <AdminButton variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Shipments
            </AdminButton>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
        <AdminStatCard title="Pending" value={pendingCount} icon={RotateCcw} color="yellow" />
        <AdminStatCard title="Approved" value={approvedCount} icon={Package} color="green" />
      </div>

      <AdminCard>
        <div className="mb-4 flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-white/60" />
          <h2 className="text-lg font-semibold text-white">Return authorizations</h2>
        </div>
        {loading ? (
          <AdminTableSkeleton rows={5} cols={3} />
        ) : returns.length === 0 ? (
          <AdminEmptyState
            icon={RotateCcw}
            title="No return authorizations"
            description="No return requests found."
          />
        ) : (
          <div className="space-y-4">
            {returns.map((r) => {
              const ship = shipments[r.shipmentId]
              return (
                <div
                  key={r._id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-white/40" />
                    <div>
                      <p className="font-medium text-white">
                        {ship?.trackingNumber ?? r.shipmentId}
                      </p>
                      <p className="text-sm text-white/60">{r.reason}</p>
                      <p className="text-xs text-white/40">
                        Requested{" "}
                        {r.requestedAt &&
                          format(new Date(r.requestedAt), "MMM d, yyyy")}
                        {r.approvedAt &&
                          ` · Approved ${format(new Date(r.approvedAt), "MMM d, yyyy")}`}
                      </p>
                      {r.notes && (
                        <p className="mt-1 text-xs text-white/50">{r.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AdminBadge variant={r.status === "PENDING" ? "warning" : r.status === "APPROVED" ? "success" : "default"}>
                      {r.status}
                    </AdminBadge>
                    {r.status === "PENDING" && (
                      <AdminButton size="sm" variant="secondary" disabled>
                        Approve
                      </AdminButton>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
