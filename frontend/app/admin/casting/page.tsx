"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getTenantCastings } from "@/shared/services/adminService"
import { Megaphone, Calendar, Users, Plus } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import { getCreatorName } from "@/shared/lib/creator"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export default function AdminCastingPage() {
  const [castings, setCastings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTenantCastings().then((data) => {
      setCastings(data)
      setLoading(false)
    })
  }, [])

  const openCastings = castings.filter((c) => c.status === "OPEN")
  const shortlistingCastings = castings.filter((c) => c.status === "SHORTLISTING")
  const closedCastings = castings.filter((c) => c.status === "CLOSED")
  const totalSubmissions = castings.reduce((sum, c) => sum + (c.submissionsCount || 0), 0)

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "OPEN":
        return "success"
      case "SHORTLISTING":
        return "warning"
      case "CLOSED":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Castings"
        subtitle="Manage casting calls and auditions"
        action={
          <CapabilityGate capability="jobs.write">
            <Link href="/admin/casting/new">
              <AdminButton>
                <Plus className="mr-2 h-4 w-4" />
                New Casting
              </AdminButton>
            </Link>
          </CapabilityGate>
        }
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total Castings"
          value={castings.length}
          icon={Megaphone}
          color="purple"
        />
        <AdminStatCard
          title="Open"
          value={openCastings.length}
          icon={Megaphone}
          color="green"
        />
        <AdminStatCard
          title="Shortlisting"
          value={shortlistingCastings.length}
          icon={Users}
          color="yellow"
        />
        <AdminStatCard
          title="Total Submissions"
          value={totalSubmissions}
          icon={Users}
          color="blue"
        />
      </div>

      {/* Castings List */}
      <AdminCard>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">All Castings</h3>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : castings.length === 0 ? (
          <AdminEmptyState
            icon={Megaphone}
            title="No castings yet"
            description="Create your first casting call to get started"
            action={
              <CapabilityGate capability="jobs.write">
                <Link href="/admin/casting/new">
                  <AdminButton>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Casting
                  </AdminButton>
                </Link>
              </CapabilityGate>
            }
          />
        ) : (
          <div className="space-y-4">
            {castings.map((c) => (
              <div
                key={c._id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Megaphone className="h-4 w-4 text-purple-400" />
                      <h3 className="font-semibold text-white">{c.title}</h3>
                      <AdminBadge variant={getStatusBadgeVariant(c.status) as any}>
                        {c.status}
                      </AdminBadge>
                    </div>
                    <p className="mt-1 text-sm text-white/70">{c.client}</p>
                    {(c.createdByUserId || c.createdBy) && (
                      <p className="mt-1 text-xs text-white/50">
                        Created by {getCreatorName(c.createdByUserId || c.createdBy) ?? "—"}
                      </p>
                    )}
                    {c.description && (
                      <p className="mt-2 text-sm text-white/60 line-clamp-2">{c.description}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-white/60">
                      <Calendar className="h-4 w-4" />
                      {formatDate(c.deadline)}
                    </span>
                    <span className="flex items-center gap-1.5 text-white/60">
                      <Users className="h-4 w-4" />
                      {c.submissionsCount} submissions
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
