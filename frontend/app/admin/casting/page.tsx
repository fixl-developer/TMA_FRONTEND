"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getTenantCastings } from "@/shared/services/adminService"
import { Megaphone, Calendar, Users, Plus, ExternalLink } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminTable,
  AdminTableRow,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
  AdminSearchBar,
} from "@/shared/components/admin/AdminPageLayout"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import { getCreatorName } from "@/shared/lib/creator"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export default function AdminCastingPage() {
  const [castings, setCastings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

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

  const filteredCastings = castings.filter((c) =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Castings"
        subtitle="Manage casting calls and auditions"
        actions={
        <CapabilityGate capability="jobs.write">
          <Link href="/admin/casting/new">
            <AdminButton>
              <Plus className="h-4 w-4" />
              New Casting
            </AdminButton>
          </Link>
        </CapabilityGate>
      }
    >
      {/* Stats */}
      <AdminStatsGrid columns={4}>
        <AdminStatCard label="Total Castings" value={castings.length} icon={Megaphone} color="purple" />
        <AdminStatCard label="Open" value={openCastings.length} icon={Megaphone} color="green" />
        <AdminStatCard label="Shortlisting" value={shortlistingCastings.length} icon={Users} color="yellow" />
        <AdminStatCard label="Submissions" value={totalSubmissions} icon={Users} color="blue" />
      </AdminStatsGrid>

      {/* Castings Table */}
      <AdminCard
        title="All Castings"
        actions={<AdminSearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search castings..." />}
      >
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-[#f3f2f1]" />
            ))}
          </div>
        ) : filteredCastings.length === 0 ? (
          <AdminEmptyState
            icon={Megaphone}
            title={searchQuery ? "No castings found" : "No castings yet"}
            description={searchQuery ? "Try adjusting your search" : "Create your first casting call"}
            action={
              !searchQuery && (
                <CapabilityGate capability="jobs.write">
                  <Link href="/admin/casting/new">
                    <AdminButton>
                      <Plus className="h-4 w-4" />
                      New Casting
                    </AdminButton>
                  </Link>
                </CapabilityGate>
              )
            }
          />
        ) : (
          <AdminTable headers={["Casting", "Status", "Submissions", "Deadline", "Created By", "Actions"]}>
            {filteredCastings.map((casting) => (
              <AdminTableRow key={casting._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#0078d4] text-xs font-semibold text-white">
                      {casting.title?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#323130]">{casting.title}</p>
                      <p className="text-xs text-[#605e5c] truncate max-w-xs">{casting.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <AdminBadge
                    variant={
                      casting.status === "OPEN"
                        ? "success"
                        : casting.status === "SHORTLISTING"
                        ? "warning"
                        : "default"
                    }
                  >
                    {casting.status}
                  </AdminBadge>
                </td>
                <td className="px-6 py-4 text-xs text-[#605e5c]">
                  {casting.submissionsCount || 0}
                </td>
                <td className="px-6 py-4 text-xs text-[#605e5c]">
                  {casting.deadline ? formatDate(casting.deadline) : "—"}
                </td>
                <td className="px-6 py-4 text-xs text-[#605e5c]">
                  {getCreatorName(casting.createdBy)}
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/casting/${casting._id}`}>
                    <AdminButton size="sm" variant="ghost">
                      View
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </AdminButton>
                  </Link>
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
