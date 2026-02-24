"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getCampaigns, formatCurrency } from "@/shared/services/influencerService"
import { useTenant } from "@/shared/context/TenantContext"
import { Sparkles, TrendingUp, Plus } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"

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
      <AdminPageLayout
        title="Influencers"
        subtitle="Campaigns and creator management"
        actions={
        <Link href="/admin/influencers/campaigns/new">
          <AdminButton>
            <Plus className="h-4 w-4" />
            New Campaign
          </AdminButton>
        </Link>
      }
    >
      <AdminStatsGrid columns={4}>
        <AdminStatCard
          label="Total Campaigns"
          value={campaigns.length}
          subtitle="All campaigns"
          icon={Sparkles}
          color="purple"
        />
        <AdminStatCard
          label="Active"
          value={activeCount}
          subtitle="Running now"
          icon={TrendingUp}
          color="green"
        />
        <AdminStatCard
          label="Completed"
          value={completedCount}
          subtitle="Finished"
          icon={Sparkles}
          color="blue"
        />
        <AdminStatCard
          label="Draft"
          value={campaigns.filter((c) => c.status === "DRAFT").length}
          subtitle="In planning"
          icon={Sparkles}
          color="yellow"
        />
      </AdminStatsGrid>

      <AdminCard title="Campaigns" subtitle={`${campaigns.length} total campaigns`}>
        {loading ? (
          <AdminLoading rows={5} />
        ) : campaigns.length === 0 ? (
          <AdminEmptyState
            icon={Sparkles}
            title="No campaigns yet"
            description="Create influencer campaigns to work with creators"
            action={
              <Link href="/admin/influencers/campaigns/new">
                <AdminButton>
                  <Plus className="h-4 w-4" />
                  New Campaign
                </AdminButton>
              </Link>
            }
          />
        ) : (
          <div className="space-y-2">
            {campaigns.map((c) => (
              <Link key={c._id} href={`/admin/influencers/campaigns/${c._id}`}>
                <div className="flex items-center justify-between rounded border border-[#edebe9] bg-white p-4 transition-all hover:bg-[#f3f2f1] hover:shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#8764b8] text-white">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#323130]">{c.name}</p>
                      <p className="text-xs text-[#605e5c]">{c.brand}</p>
                    </div>
                    <AdminBadge variant={getStatusVariant(c.status)}>
                      {c.status}
                    </AdminBadge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-[#107c10]">{formatCurrency(c.budgetMinor, c.currency)}</p>
                    <p className="text-xs text-[#605e5c]">
                      {c.startDate} – {c.endDate}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
