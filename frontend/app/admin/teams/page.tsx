"use client"

import { useEffect, useState } from "react"
import { getTenantTeams } from "@/shared/services/adminService"
import { useTenant } from "@/shared/context/TenantContext"
import { Users2, UserCircle2, Users, Shield, Plus } from "lucide-react"
import { seedUsers } from "@/data/seed"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
  AdminSearchBar,
} from "@/shared/components/admin/AdminPageLayout"

export default function AdminTeamsPage() {
  const { tenantId } = useTenant()
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    getTenantTeams(tenantId)
      .then((data) => {
        setTeams(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [tenantId])

  const getUserName = (userId: string) => {
    const u = (seedUsers as any[]).find((x) => x._id === userId)
    return u?.name ?? userId
  }

  const totalMembers = teams.reduce((sum, t) => sum + (t.memberIds?.length || 0), 0)
  const avgTeamSize = teams.length > 0 ? Math.round(totalMembers / teams.length) : 0

  const filteredTeams = teams.filter((t) =>
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Teams"
        subtitle="Organize users into teams for better collaboration"
        actions={
        <AdminButton disabled>
          <Plus className="h-4 w-4" />
          Create Team
        </AdminButton>
      }
    >
      {/* Stats */}
      <AdminStatsGrid columns={4}>
        <AdminStatCard label="Total Teams" value={teams.length} icon={Users2} color="purple" />
        <AdminStatCard label="Total Members" value={totalMembers} icon={Users} color="blue" subtitle="Across all teams" />
        <AdminStatCard label="Avg Team Size" value={avgTeamSize} icon={UserCircle2} color="green" subtitle="Members per team" />
        <AdminStatCard label="Active" value={teams.length} icon={Shield} color="yellow" subtitle="Active teams" />
      </AdminStatsGrid>

      {/* Teams List */}
      <AdminCard
        title="All Teams"
        actions={<AdminSearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search teams..." />}
      >
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded bg-gray-50" />
            ))}
          </div>
        ) : filteredTeams.length === 0 ? (
          <AdminEmptyState
            icon={Users2}
            title={searchQuery ? "No teams found" : "No teams yet"}
            description={searchQuery ? "Try adjusting your search" : "Create teams to organize your users"}
          />
        ) : (
          <div className="space-y-4">
            {filteredTeams.map((team) => (
              <div
                key={team._id}
                className="rounded border border-gray-200 bg-white p-4 transition-all hover:border-blue-600 hover:shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                      {team.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{team.name}</h3>
                      <p className="text-xs text-gray-600">{team.description || "No description"}</p>
                    </div>
                  </div>
                  <AdminBadge variant="success">Active</AdminBadge>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{team.memberIds?.length || 0} members</span>
                  </div>
                  {team.leadId && (
                    <div className="flex items-center gap-1">
                      <UserCircle2 className="h-4 w-4" />
                      <span>Lead: {getUserName(team.leadId)}</span>
                    </div>
                  )}
                </div>

                {team.memberIds && team.memberIds.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {team.memberIds.slice(0, 5).map((memberId: string) => (
                        <div
                          key={memberId}
                          className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 px-2 py-1"
                        >
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-semibold text-white">
                            {getUserName(memberId).charAt(0)}
                          </div>
                          <span className="text-xs text-gray-900">{getUserName(memberId)}</span>
                        </div>
                      ))}
                      {team.memberIds.length > 5 && (
                        <div className="flex items-center rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600">
                          +{team.memberIds.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
