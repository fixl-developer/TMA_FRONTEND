"use client"

import { useEffect, useState } from "react"
import { getTenantTeams } from "@/shared/services/adminService"
import { useTenant } from "@/shared/context/TenantContext"
import { Users2, UserCircle2, Users, Shield } from "lucide-react"
import { seedUsers } from "@/data/seed"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"

export default function AdminTeamsPage() {
  const { tenantId } = useTenant()
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Teams"
        subtitle="Manage teams and team members"
      />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total Teams"
          value={teams.length}
          subtitle="All teams"
          icon={Users2}
          color="purple"
        />
        <AdminStatCard
          title="Total Members"
          value={totalMembers}
          subtitle="Across all teams"
          icon={Users}
          color="blue"
        />
        <AdminStatCard
          title="Avg Team Size"
          value={avgTeamSize}
          subtitle="Members per team"
          icon={UserCircle2}
          color="green"
        />
        <AdminStatCard
          title="Active"
          value={teams.length}
          subtitle="Active teams"
          icon={Shield}
          color="yellow"
        />
      </div>

      {/* Teams List */}
      <AdminCard>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Teams</h3>
        </div>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : teams.length === 0 ? (
          <AdminEmptyState
            icon={Users2}
            title="No teams yet"
            description="Create teams to organize your users and assign them to projects."
          />
        ) : (
          <div className="space-y-4">
            {teams.map((team) => (
              <div
                key={team._id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-400/20">
                      <Users2 className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{team.name}</p>
                      <p className="text-xs text-white/50">
                        {team.memberIds?.length ?? 0} member
                        {(team.memberIds?.length ?? 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
                {team.memberIds?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {team.memberIds.map((uid: string) => (
                      <div
                        key={uid}
                        className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5"
                      >
                        <UserCircle2 className="h-3 w-3 text-white/70" />
                        <span className="text-xs font-medium text-white/70">{getUserName(uid)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
