"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getCampaigns, formatCurrency } from "@/shared/services/influencerService"
import { useTenant } from "@/shared/context/TenantContext"
import { Sparkles, TrendingUp } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"

export default function AdminInfluencersPage() {
  const { tenantId } = useTenant()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCampaigns(tenantId).then((data) => {
      setCampaigns(data)
      setLoading(false)
    })
  }, [tenantId])

  const activeCount = campaigns.filter((c) => c.status === "ACTIVE").length
  const completedCount = campaigns.filter((c) => c.status === "COMPLETED").length

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE": return "success"
      case "COMPLETED": return "default"
      case "DRAFT": return "warning"
      default: return "default"
    }
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Influencers"
        subtitle="Campaigns and creator management"
        action={
          <Link href="/admin/influencers/campaigns/new">
            <AdminButton>New Campaign</AdminButton>
          </Link>
        }
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5 admin-light-theme:bg-slate-100 transition-colors" />
            ))}
          </>
        ) : (
          <>
            <AdminStatCard
              title="Total Campaigns"
              value={campaigns.length}
              subtitle="All campaigns"
              icon={Sparkles}
              color="purple"
            />
            <AdminStatCard
              title="Active"
              value={activeCount}
              subtitle="Running now"
              icon={TrendingUp}
              color="green"
            />
            <AdminStatCard
              title="Completed"
              value={completedCount}
              subtitle="Finished"
              icon={Sparkles}
              color="blue"
            />
          </>
        )}
      </div>

      {/* Campaigns */}
      <AdminCard>
        <h3 className="mb-6 text-lg font-bold text-white admin-light-theme:text-slate-900 transition-colors">
          Campaigns
        </h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-white/5 admin-light-theme:bg-slate-100 transition-colors" />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <AdminEmptyState
            icon={Sparkles}
            title="No campaigns yet"
            description="Create influencer campaigns to work with creators"
            action={
              <Link href="/admin/influencers/campaigns/new">
                <AdminButton>New Campaign</AdminButton>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {campaigns.map((c) => (
              <Link key={c._id} href={`/admin/influencers/campaigns/${c._id}`}>
                <div className="flex items-center justify-between rounded-xl border p-4 backdrop-blur-sm transition-all hover:border-white/20 admin-light-theme:border-slate-200 admin-light-theme:bg-white admin-light-theme:hover:border-slate-300 admin-light-theme:hover:shadow-md border-white/10 bg-white/5 hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 admin-light-theme:bg-pink-100 admin-light-theme:text-pink-600 transition-colors">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white admin-light-theme:text-slate-900 transition-colors">{c.name}</p>
                      <p className="text-sm text-white/60 admin-light-theme:text-slate-600 transition-colors">{c.brand}</p>
                    </div>
                    <AdminBadge variant={getStatusVariant(c.status)}>
                      {c.status}
                    </AdminBadge>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#d4ff00]">{formatCurrency(c.budgetMinor, c.currency)}</p>
                    <p className="text-xs text-white/50 admin-light-theme:text-slate-500 transition-colors">
                      {c.startDate} – {c.endDate}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
