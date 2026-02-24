"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getTenantCastings } from "@/shared/services/adminService"
import { useTenant } from "@/shared/context/TenantContext"
import { Eye, ArrowLeft, UserCircle2 } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminButton,
  AdminEmptyState,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"

/**
 * Client viewer room – casting agencies share shortlist with clients.
 * UI-only seed workflow for B2 Casting Pipeline.
 */
export default function CastingViewerPage() {
  const { tenantId } = useTenant()
  const [castings, setCastings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTenantCastings(tenantId).then((data) => {
      setCastings(data)
      setLoading(false)
    })
  }, [tenantId])

  const withShortlist = castings.filter((c) => (c.shortlistedCount ?? 0) > 0).length

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Client Viewer Room"
        subtitle="Share shortlist with clients in a controlled, view-only workspace"
        actions={
          <Link href="/admin/casting">
            <AdminButton variant="ghost">
              <ArrowLeft className="h-4 w-4" />
              Back to Castings
            </AdminButton>
          </Link>
        }
      >
        <AdminStatsGrid columns={3}>
          <AdminStatCard
            label="Shared Sessions"
            value={loading ? "—" : castings.length}
            icon={Eye}
            color="purple"
          />
          <AdminStatCard
            label="With Shortlist"
            value={loading ? "—" : withShortlist}
            icon={UserCircle2}
            color="green"
          />
          <AdminStatCard
            label="Client-Ready Links"
            value={loading ? "—" : castings.length}
            icon={Eye}
            color="blue"
          />
        </AdminStatsGrid>

        <AdminCard title="Shared Sessions" subtitle={`${castings.length} total sessions`}>
          {loading ? (
            <AdminLoading rows={3} />
          ) : castings.length === 0 ? (
            <AdminEmptyState
              icon={UserCircle2}
              title="No casting sessions to view"
              description="Clients receive a link to view shortlisted talent for a casting"
            />
          ) : (
            <div className="space-y-3">
              {castings.slice(0, 5).map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div>
                    <p className="font-medium text-white">{c.title ?? c._id}</p>
                    <p className="text-xs text-white/60">
                      {c.status ?? "—"} · {c.submissionsCount ?? 0} submissions · {c.shortlistedCount ?? 0} shortlisted
                    </p>
                  </div>
                  <Link href={`/admin/casting/viewer/${c._id}`}>
                    <AdminButton size="sm" variant="secondary">View as Client</AdminButton>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
