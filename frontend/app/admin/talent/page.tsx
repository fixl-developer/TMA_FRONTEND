"use client"

import { useEffect, useState } from "react"
import { getTenantTalents } from "@/shared/services/adminService"
import { useTenant } from "@/shared/context/TenantContext"
import { UserCircle2, Users, Star, TrendingUp, UserPlus } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"

export default function AdminTalentPage() {
  const [talents, setTalents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { tenantId } = useTenant()

  useEffect(() => {
    getTenantTalents(tenantId).then((data) => {
      setTalents(data)
      setLoading(false)
    })
  }, [tenantId])

  const activeTalents = talents.filter((t) => t.status !== "INACTIVE").length
  const featuredTalents = talents.filter((t) => t.featured).length

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Talent"
        subtitle="Profiles, portfolios, and contracts"
        action={
          <AdminButton>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Talent
          </AdminButton>
        }
      />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total Talent"
          value={talents.length}
          subtitle="All profiles"
          icon={Users}
          color="purple"
        />
        <AdminStatCard
          title="Active"
          value={activeTalents}
          subtitle="Available for work"
          icon={UserCircle2}
          color="green"
          trend="up"
          trendValue="+12%"
        />
        <AdminStatCard
          title="Featured"
          value={featuredTalents}
          subtitle="Highlighted profiles"
          icon={Star}
          color="yellow"
        />
        <AdminStatCard
          title="Growth"
          value="+18%"
          subtitle="This month"
          icon={TrendingUp}
          color="blue"
          trend="up"
          trendValue="+18%"
        />
      </div>

      {/* Talent Grid */}
      <AdminCard>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Talent Roster</h3>
        </div>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        ) : talents.length === 0 ? (
          <AdminEmptyState
            icon={UserCircle2}
            title="No talents yet"
            description="Add talent profiles to get started."
            action={<AdminButton>Add Talent</AdminButton>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {talents.map((t) => (
              <div
                key={t._id}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                    <UserCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{t.stageName}</p>
                    <p className="truncate text-xs text-white/50">ID: {t._id}</p>
                    {t.status && (
                      <AdminBadge
                        variant={t.status === "ACTIVE" ? "success" : "default"}
                        className="mt-2"
                      >
                        {t.status}
                      </AdminBadge>
                    )}
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
