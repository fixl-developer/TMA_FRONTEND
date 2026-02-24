"use client"

import { useEffect, useState } from "react"
import { getTenantTalents } from "@/shared/services/adminService"
import { useTenant } from "@/shared/context/TenantContext"
import { UserCircle2, Users, Star, TrendingUp, UserPlus, Mail, Phone } from "lucide-react"
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
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"

export default function AdminTalentPage() {
  const [talents, setTalents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { tenantId } = useTenant()

  useEffect(() => {
    getTenantTalents(tenantId).then((data) => {
      setTalents(data)
      setLoading(false)
    })
  }, [tenantId])

  const activeTalents = talents.filter((t) => t.status !== "INACTIVE").length
  const featuredTalents = talents.filter((t) => t.featured).length

  const filteredTalents = talents.filter((t) =>
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Talent"
        subtitle="Manage talent profiles, portfolios, and availability"
        actions={
        <AdminButton>
          <UserPlus className="h-4 w-4" />
          Add Talent
        </AdminButton>
      }
    >
      {/* Stats */}
      <AdminStatsGrid columns={4}>
        <AdminStatCard
          label="Total Talent"
          value={talents.length}
          icon={Users}
          color="purple"
          subtitle="All profiles"
        />
        <AdminStatCard
          label="Active"
          value={activeTalents}
          icon={UserCircle2}
          color="green"
          subtitle="Available for work"
          trend={{ value: "+12%", direction: "up" }}
        />
        <AdminStatCard
          label="Featured"
          value={featuredTalents}
          icon={Star}
          color="yellow"
          subtitle="Highlighted profiles"
        />
        <AdminStatCard
          label="Growth"
          value="+18%"
          icon={TrendingUp}
          color="blue"
          subtitle="This month"
        />
      </AdminStatsGrid>

      {/* Talent Grid */}
      <AdminCard
        title="Talent Roster"
        actions={<AdminSearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search talent..." />}
      >
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded bg-[#f3f2f1]" />
            ))}
          </div>
        ) : filteredTalents.length === 0 ? (
          <AdminEmptyState
            icon={UserCircle2}
            title={searchQuery ? "No talent found" : "No talent yet"}
            description={searchQuery ? "Try adjusting your search" : "Add talent profiles to get started"}
            action={
              !searchQuery && (
                <AdminButton>
                  <UserPlus className="h-4 w-4" />
                  Add Talent
                </AdminButton>
              )
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTalents.map((talent) => (
              <div
                key={talent._id}
                className="group rounded border border-[#edebe9] bg-white p-4 transition-all hover:border-[#0078d4] hover:shadow-sm cursor-pointer"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0078d4] text-sm font-semibold text-white">
                    {talent.name?.charAt(0)?.toUpperCase() ?? "T"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#323130] truncate">{talent.name}</h3>
                    <p className="text-xs text-[#605e5c] truncate">{talent.category || "Talent"}</p>
                  </div>
                  {talent.featured && (
                    <Star className="h-4 w-4 text-[#ffb900] fill-[#ffb900]" />
                  )}
                </div>

                <div className="space-y-2 mb-3">
                  {talent.email && (
                    <div className="flex items-center gap-2 text-xs text-[#605e5c]">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{talent.email}</span>
                    </div>
                  )}
                  {talent.phone && (
                    <div className="flex items-center gap-2 text-xs text-[#605e5c]">
                      <Phone className="h-3 w-3" />
                      <span>{talent.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <AdminBadge variant={talent.status === "ACTIVE" ? "success" : "default"}>
                    {talent.status || "ACTIVE"}
                  </AdminBadge>
                  <AdminButton size="sm" variant="ghost">
                    View Profile
                  </AdminButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
