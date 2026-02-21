"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getConflicts,
  getResources,
  getConflictStatusColor,
  getResourceTypeLabel,
} from "@/shared/services/resourceService"
import { useTenant } from "@/shared/context/TenantContext"
import { AlertTriangle, UserCircle2 } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"
import { format } from "date-fns"

export default function ConflictsPage() {
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
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
    <AgenciesPage>
      <PageBanner
        title="Conflicts"
        subtitle="Conflict resolution queue"
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80"
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
            <CardTitle className="text-sm">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{openCount}</p>
          </CardContent>
        </Card>
        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="text-sm">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{resolvedCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Conflict list
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Loading…</p>
          ) : conflicts.length === 0 ? (
            <p className="py-8 text-center text-slate-500">
              No conflicts. All clear.
            </p>
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
                    className={`rounded-lg border p-4 ${
                      c.status === "OPEN"
                        ? "border-amber-200 bg-amber-50/50"
                        : ""
                    }`}
                    style={
                      c.status !== "OPEN"
                        ? { borderColor: page.border }
                        : undefined
                    }
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <UserCircle2 className="h-5 w-5 shrink-0 text-slate-400" />
                        <div>
                          <p className="font-medium" style={{ color: page.text }}>
                            {res?.name ?? c.resourceId}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {c.description}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {c.type} · {c.status === "OPEN" ? `Detected ${detectedStr}` : `Resolved ${resolvedStr}`}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${getConflictStatusColor(c.status)}`}
                      >
                        {c.status}
                      </span>
                    </div>
                    {c.status === "OPEN" && (
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" disabled>
                          Resolve
                        </Button>
                        <Button size="sm" variant="ghost" disabled>
                          Dismiss
                        </Button>
                      </div>
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
