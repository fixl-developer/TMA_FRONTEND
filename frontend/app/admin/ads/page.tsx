"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAdCampaigns } from "@/shared/services/adsService"
import type { AdCampaign } from "@/shared/lib/types/ads"
import { Megaphone, Plus, TrendingUp, DollarSign, Target } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"

const DEMO_TENANT = "tenant_001"

export default function AdsCampaignsPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    setError(null)
    getAdCampaigns(DEMO_TENANT)
      .then(setCampaigns)
      .catch(() => setError("Failed to load campaigns"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const active = campaigns.filter((c) => c.status === "ACTIVE").length
  const pending = campaigns.filter((c) => c.status === "PENDING").length
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budgetMinor, 0)

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success"
      case "PENDING":
        return "warning"
      case "PAUSED":
        return "default"
      default:
        return "default"
    }
  }

  if (error) {
    return (
      <AdminPageWrapper>
        <AdminSectionHeader title="Ad Campaigns" subtitle="Sponsored ads, targeting, performance" />
        <AdminCard>
          <div className="py-12 text-center">
            <p className="text-rose-400">{error}</p>
            <AdminButton onClick={load} className="mt-4">
              Retry
            </AdminButton>
          </div>
        </AdminCard>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Ad Campaigns"
        subtitle="Sponsored ads, targeting, and performance tracking"
        action={
          <div className="flex gap-2">
            <Link href="/admin/ads/attribution">
              <AdminButton variant="secondary" size="sm">
                Attribution
              </AdminButton>
            </Link>
            <Link href="/admin/ads/create">
              <AdminButton>
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </AdminButton>
            </Link>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total Campaigns"
          value={campaigns.length}
          subtitle="All campaigns"
          icon={Megaphone}
          color="purple"
        />
        <AdminStatCard
          title="Active"
          value={active}
          subtitle="Running now"
          icon={TrendingUp}
          color="green"
        />
        <AdminStatCard
          title="Pending"
          value={pending}
          subtitle="Awaiting approval"
          icon={Target}
          color="yellow"
        />
        <AdminStatCard
          title="Total Budget"
          value={`₹${(totalBudget / 100).toLocaleString("en-IN")}`}
          subtitle="Allocated funds"
          icon={DollarSign}
          color="blue"
        />
      </div>

      {/* Campaigns List */}
      <AdminCard>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">All Campaigns</h3>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <AdminEmptyState
            icon={Megaphone}
            title="No campaigns yet"
            description="Create your first ad campaign to reach your audience"
            action={
              <Link href="/admin/ads/create">
                <AdminButton>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </AdminButton>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {campaigns.map((c) => (
              <Link key={c._id} href={`/admin/ads/${c._id}/performance`}>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Megaphone className="h-4 w-4 text-purple-400" />
                        <p className="font-semibold text-white">{c.name}</p>
                        <AdminBadge variant={getStatusBadgeVariant(c.status) as any}>
                          {c.status}
                        </AdminBadge>
                      </div>
                      <p className="mt-1 text-sm text-white/60">
                        {c.objective} · ₹{(c.budgetMinor / 100).toLocaleString("en-IN")} budget
                      </p>
                    </div>
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
