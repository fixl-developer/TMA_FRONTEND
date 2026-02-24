"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  getConflicts,
  getResources,
} from "@/shared/services/resourceService"
import { useTenant } from "@/shared/context/TenantContext"
import { AlertTriangle, UserCircle2, ArrowLeft } from "lucide-react"
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

export default function ConflictsPage() {
  const { tenantId } = useTenant()
  const [conflicts, setConflicts] = useState<any[]>([])
  const [resources, setResources] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getConflicts(tenantId), getResources(tenantId)]).then(
      ([c, r]) => {
        setConflicts(c)
        const map: Record<string, any> = {}
        for (const res of r) map[res._id] = res
        setResources(map)
        setLoading(false)
      }
    )
  }, [tenantId])

  const openCount = conflicts.filter((c) => c.status === "OPEN").length
  const resolvedCount = conflicts.filter((c) => c.status === "RESOLVED").length

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Conflicts"
        subtitle="Conflict resolution queue"
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
        <AdminStatCard title="Open" value={openCount} icon={AlertTriangle} color="yellow" />
        <AdminStatCard title="Resolved" value={resolvedCount} icon={UserCircle2} color="green" />
      </div>

      <AdminCard>
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          <h2 className="text-lg font-semibold text-white">Conflict list</h2>
        </div>
        {loading ? (
          <AdminTableSkeleton rows={5} cols={3} />
        ) : conflicts.length === 0 ? (
          <AdminEmptyState
            icon={AlertTriangle}
            title="No conflicts"
            description="All clear. No conflicts found."
          />
        ) : (
          <div className="space-y-4">
            {conflicts.map((c) => {
              const res = resources[c.resourceId]
              const detectedStr = c.detectedAt
                ? format(new Date(c.detectedAt), "MMM d, yyyy")
                : ""
              const resolvedStr = c.resolvedAt
                ? format(new Date(c.resolvedAt), "MMM d, yyyy")
                : ""
              return (
                <div
                  key={c._id}
                  className={`rounded-xl border p-4 ${
                    c.status === "OPEN"
                      ? "border-yellow-500/30 bg-yellow-500/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <UserCircle2 className="h-5 w-5 shrink-0 text-white/40" />
                      <div>
                        <p className="font-medium text-white">
                          {res?.name ?? c.resourceId}
                        </p>
                        <p className="mt-1 text-sm text-white/70">
                          {c.description}
                        </p>
                        <p className="mt-1 text-xs text-white/50">
                          {c.type} · {c.status === "OPEN" ? `Detected ${detectedStr}` : `Resolved ${resolvedStr}`}
                        </p>
                      </div>
                    </div>
                    <AdminBadge variant={c.status === "OPEN" ? "warning" : "success"}>
                      {c.status}
                    </AdminBadge>
                  </div>
                  {c.status === "OPEN" && (
                    <div className="mt-3 flex gap-2">
                      <AdminButton size="sm" variant="secondary" disabled>
                        Resolve
                      </AdminButton>
                      <AdminButton size="sm" variant="ghost" disabled>
                        Dismiss
                      </AdminButton>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
