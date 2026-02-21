"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getAvailabilityBlocks,
  getResources,
  getResourceTypeLabel,
} from "@/shared/services/resourceService"
import { useTenant } from "@/shared/context/TenantContext"
import { Calendar, UserCircle2 } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"
import { format } from "date-fns"
import { HorizontalFloatingBarChart } from "@/shared/components/charts/HorizontalFloatingBarChart"

export default function AvailabilityPage() {
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
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
    <AgenciesPage>
      <PageBanner
        title="Availability"
        subtitle="Availability blocks and calendar"
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/resources">
          <Button variant="ghost" size="sm">
            ← Resources
          </Button>
        </Link>
      </div>

      <div className="mb-6 mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="text-sm">Available blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{availableCount}</p>
          </CardContent>
        </Card>
        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="text-sm">Unavailable blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{unavailableCount}</p>
          </CardContent>
        </Card>
      </div>

      {!loading && availabilityChartData.length > 0 && (
        <Card className="mb-6" style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Availability timeline
            </CardTitle>
            <p className="text-sm font-normal text-slate-500">
              Bars show each block’s date range
            </p>
          </CardHeader>
          <CardContent>
            <HorizontalFloatingBarChart
              data={availabilityChartData}
              fill="#059669"
              xAxisFormatter={dateFormatter}
              tooltipFormatter={dateFormatter}
              height={Math.min(200 + availabilityChartData.length * 28, 420)}
            />
          </CardContent>
        </Card>
      )}

      <Card style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Availability blocks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Loading…</p>
          ) : blocks.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No availability blocks.</p>
          ) : (
            <div className="space-y-3">
              {blocks.map((b) => {
                const res = resources[b.resourceId]
                const fromDate = b.from ? format(new Date(b.from), "MMM d, yyyy") : "—"
                const toDate = b.to ? format(new Date(b.to), "MMM d, yyyy") : "—"
                return (
                  <div
                    key={b._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                    style={{ borderColor: page.border }}
                  >
                    <div className="flex items-center gap-3">
                      <UserCircle2 className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="font-medium" style={{ color: page.text }}>
                          {res?.name ?? b.resourceId}
                        </p>
                        <p className="text-sm text-slate-500">
                          {fromDate} – {toDate}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs ${
                        b.status === "AVAILABLE"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {b.status}
                    </span>
                    {b.notes && (
                      <span className="max-w-[200px] truncate text-xs text-slate-500">
                        {b.notes}
                      </span>
                    )}
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
