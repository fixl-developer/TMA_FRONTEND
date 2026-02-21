"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getReturnAuthorizations,
  getShipmentById,
  getReturnStatusColor,
} from "@/shared/services/logisticsService"
import { useTenant } from "@/shared/context/TenantContext"
import { Package, RotateCcw } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"
import { format } from "date-fns"

export default function ReturnsPage() {
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
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
    <AgenciesPage>
      <PageBanner
        title="Return Authorizations"
        subtitle="Return requests and approvals"
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/logistics/shipments">
          <Button variant="ghost" size="sm">
            ← Shipments
          </Button>
        </Link>
      </div>

      <div className="mb-6 mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="text-sm">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{approvedCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Return authorizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Loading…</p>
          ) : returns.length === 0 ? (
            <p className="py-8 text-center text-slate-500">
              No return authorizations.
            </p>
          ) : (
            <div className="space-y-4">
              {returns.map((r) => {
                const ship = shipments[r.shipmentId]
                return (
                  <div
                    key={r._id}
                    className="flex items-center justify-between rounded-lg border p-4"
                    style={{ borderColor: page.border }}
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="font-medium" style={{ color: page.text }}>
                          {ship?.trackingNumber ?? r.shipmentId}
                        </p>
                        <p className="text-sm text-slate-500">{r.reason}</p>
                        <p className="text-xs text-slate-400">
                          Requested{" "}
                          {r.requestedAt &&
                            format(new Date(r.requestedAt), "MMM d, yyyy")}
                          {r.approvedAt &&
                            ` · Approved ${format(new Date(r.approvedAt), "MMM d, yyyy")}`}
                        </p>
                        {r.notes && (
                          <p className="mt-1 text-xs text-slate-500">{r.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs ${getReturnStatusColor(r.status)}`}
                      >
                        {r.status}
                      </span>
                      {r.status === "PENDING" && (
                        <Button size="sm" variant="outline" disabled>
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
