"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  getAssignments,
  getResources,
} from "@/shared/services/resourceService"
import { useTenant } from "@/shared/context/TenantContext"
import { Briefcase, UserCircle2, ArrowLeft } from "lucide-react"
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

export default function AssignmentsPage() {
  const { tenantId } = useTenant()
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
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Assignments"
        subtitle="Resource assignments to bookings, projects, shifts"
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
        <AdminStatCard title="Confirmed" value={confirmed} icon={Briefcase} color="green" />
        <AdminStatCard title="Holds" value={holds} icon={UserCircle2} color="yellow" />
      </div>

      <AdminCard>
        <div className="mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-white/60" />
          <h2 className="text-lg font-semibold text-white">Assignment list</h2>
        </div>
        {loading ? (
          <AdminTableSkeleton rows={5} cols={3} />
        ) : assignments.length === 0 ? (
          <AdminEmptyState
            icon={Briefcase}
            title="No assignments"
            description="No resource assignments found."
          />
        ) : (
          <div className="space-y-3">
            {assignments.map((a) => {
              const res = resources[a.resourceId]
              const fromStr = a.from ? format(new Date(a.from), "MMM d, yyyy") : "—"
              const toStr = a.to ? format(new Date(a.to), "MMM d, yyyy") : "—"
              return (
                <div
                  key={a._id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <UserCircle2 className="h-5 w-5 text-white/40" />
                    <div>
                      <p className="font-medium text-white">
                        {res?.name ?? a.resourceId}
                      </p>
                      <p className="text-sm text-white/60">
                        {a.demandType} · {fromStr} – {toStr}
                        {a.hours ? ` · ${a.hours}h` : ""}
                      </p>
                    </div>
                  </div>
                  <AdminBadge variant={a.status === "CONFIRMED" ? "success" : "warning"}>
                    {a.status}
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
