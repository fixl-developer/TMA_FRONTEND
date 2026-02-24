"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  getAvailabilityBlocks,
  getResources,
} from "@/shared/services/resourceService"
import { useTenant } from "@/shared/context/TenantContext"
import { Calendar, UserCircle2, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { HorizontalFloatingBarChart } from "@/shared/components/charts/HorizontalFloatingBarChart"
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

export default function AvailabilityPage() {
  const { tenantId } = useTenant()
  const [blocks, setBlocks] = useState<any[]>([])
  const [resources, setResources] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAvailabilityBlocks(tenantId), getResources(tenantId)]).then(
      ([b, r]) => {
        setBlocks(b)
        const map: Record<string, any> = {}
        for (const res of r) map[res._id] = res
        setResources(map)
        setLoading(false)
      }
    )
  }, [tenantId])

  const availableCount = blocks.filter((b) => b.status === "AVAILABLE").length
  const unavailableCount = blocks.filter((b) => b.status === "UNAVAILABLE").length

  const availabilityChartData = blocks.slice(0, 12).map((b) => {
    const res = resources[b.resourceId]
    const fromTs = b.from ? new Date(b.from).getTime() : 0
    const toTs = b.to ? new Date(b.to).getTime() : fromTs
    return {
      name: `${res?.name ?? b.resourceId}${b.status === "UNAVAILABLE" ? " (unavail)" : ""}`,
      range: [fromTs, toTs] as [number, number],
      meta: { status: b.status },
    }
  })

  const dateFormatter = (ts: number) => format(new Date(ts), "MMM d")

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Availability"
        subtitle="Availability blocks and calendar"
        action={
          <Link href="/admin/resources">
            <AdminButton variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Resources
            </AdminButton>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
        <AdminStatCard title="Available blocks" value={availableCount} icon={Calendar} color="green" />
        <AdminStatCard title="Unavailable blocks" value={unavailableCount} icon={Calendar} color="yellow" />
      </div>

      {!loading && availabilityChartData.length > 0 && (
        <AdminCard className="mb-6">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-white/60" />
            <div>
              <h2 className="text-lg font-semibold text-white">Availability timeline</h2>
              <p className="text-sm text-white/60">Bars show each block's date range</p>
            </div>
          </div>
          <HorizontalFloatingBarChart
            data={availabilityChartData}
            fill="#059669"
            xAxisFormatter={dateFormatter}
            tooltipFormatter={dateFormatter}
            height={Math.min(200 + availabilityChartData.length * 28, 420)}
          />
        </AdminCard>
      )}

      <AdminCard>
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-white/60" />
          <h2 className="text-lg font-semibold text-white">Availability blocks</h2>
        </div>
        {loading ? (
          <AdminTableSkeleton rows={5} cols={3} />
        ) : blocks.length === 0 ? (
          <AdminEmptyState
            icon={Calendar}
            title="No availability blocks"
            description="No availability blocks found."
          />
        ) : (
          <div className="space-y-3">
            {blocks.map((b) => {
              const res = resources[b.resourceId]
              const fromDate = b.from ? format(new Date(b.from), "MMM d, yyyy") : "—"
              const toDate = b.to ? format(new Date(b.to), "MMM d, yyyy") : "—"
              return (
                <div
                  key={b._id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <UserCircle2 className="h-5 w-5 text-white/40" />
                    <div>
                      <p className="font-medium text-white">
                        {res?.name ?? b.resourceId}
                      </p>
                      <p className="text-sm text-white/60">
                        {fromDate} – {toDate}
                      </p>
                      {b.notes && (
                        <p className="text-xs text-white/50 mt-1">{b.notes}</p>
                      )}
                    </div>
                  </div>
                  <AdminBadge variant={b.status === "AVAILABLE" ? "success" : "default"}>
                    {b.status}
                  </AdminBadge>
                </div>
              )
            })}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
