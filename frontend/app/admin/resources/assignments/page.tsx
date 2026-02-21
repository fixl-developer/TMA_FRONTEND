"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getAssignments,
  getResources,
  getAssignmentStatusColor,
  getResourceTypeLabel,
} from "@/shared/services/resourceService"
import { useTenant } from "@/shared/context/TenantContext"
import { Briefcase, UserCircle2 } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"
import { format } from "date-fns"

export default function AssignmentsPage() {
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
  const [assignments, setAssignments] = useState<any[]>([])
  const [resources, setResources] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAssignments(tenantId), getResources(tenantId)]).then(
      ([a, r]) => {
        setAssignments(a)
        const map: Record<string, any> = {}
        for (const res of r) map[res._id] = res
        setResources(map)
        setLoading(false)
      }
    )
  }, [tenantId])

  const confirmed = assignments.filter((a) => a.status === "CONFIRMED").length
  const holds = assignments.filter((a) => a.status === "HOLD").length

  return (
    <AgenciesPage>
      <PageBanner
        title="Assignments"
        subtitle="Resource assignments to bookings, projects, shifts"
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
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
            <CardTitle className="text-sm">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{confirmed}</p>
          </CardContent>
        </Card>
        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="text-sm">Holds</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{holds}</p>
          </CardContent>
        </Card>
      </div>

      <Card style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Assignment list
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Loading…</p>
          ) : assignments.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No assignments.</p>
          ) : (
            <div className="space-y-3">
              {assignments.map((a) => {
                const res = resources[a.resourceId]
                const fromStr = a.from ? format(new Date(a.from), "MMM d, yyyy") : "—"
                const toStr = a.to ? format(new Date(a.to), "MMM d, yyyy") : "—"
                return (
                  <div
                    key={a._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                    style={{ borderColor: page.border }}
                  >
                    <div className="flex items-center gap-3">
                      <UserCircle2 className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="font-medium" style={{ color: page.text }}>
                          {res?.name ?? a.resourceId}
                        </p>
                        <p className="text-sm text-slate-500">
                          {a.demandType} · {fromStr} – {toStr}
                          {a.hours ? ` · ${a.hours}h` : ""}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs ${getAssignmentStatusColor(a.status)}`}
                    >
                      {a.status}
                    </span>
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
