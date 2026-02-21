"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getRewardByUser, getLoyaltyTiers } from "@/shared/services/rewardsService"
import type { Reward, LoyaltyTier } from "@/shared/lib/types/rewards"
import { Gift, TrendingUp, Award, Sparkles } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
} from "@/shared/components/layout/AdminPageWrapper"

const DEMO_TENANT = "tenant_001"
const DEMO_USER = "user_001"

export default function RewardsDashboardPage() {
  const [reward, setReward] = useState<Reward | null>(null)
  const [tiers, setTiers] = useState<LoyaltyTier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getRewardByUser(DEMO_TENANT, DEMO_USER), getLoyaltyTiers()]).then(([r, t]) => {
      setReward(r ?? null)
      setTiers(t)
      setLoading(false)
    })
  }, [])

  const currentTier = reward ? tiers.find((t) => t.name.toUpperCase() === reward.tier) : null
  const nextTier = reward && tiers.length > 0
    ? tiers[tiers.findIndex((t) => t.name.toUpperCase() === reward.tier) + 1]
    : null
  const currMin = currentTier?.minCredits ?? 0
  const nextMin = nextTier?.minCredits ?? 1
  const progress = nextTier && reward && nextMin > currMin
    ? Math.min(100, ((reward.credits - currMin) / (nextMin - currMin)) * 100)
    : 100

  const r = reward ?? { credits: 0, tier: "BRONZE", milestonesReached: 0 }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Rewards"
        subtitle="Tiers, credits, and milestones"
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5 admin-light-theme:bg-slate-100 transition-colors" />
            ))}
          </>
        ) : (
          <>
            <AdminStatCard
              title="Your Credits"
              value={r.credits}
              subtitle="Available to redeem"
              icon={Gift}
              color="yellow"
            />
            <AdminStatCard
              title="Current Tier"
              value={r.tier}
              subtitle={currentTier?.benefits[0] ?? "—"}
              icon={Award}
              color="purple"
            />
            <AdminStatCard
              title="Milestones"
              value={r.milestonesReached}
              subtitle="Reached this period"
              icon={TrendingUp}
              color="green"
            />
            <AdminStatCard
              title="Next Tier"
              value={nextTier?.name ?? "Max"}
              subtitle={nextTier ? `${nextTier.minCredits - r.credits} credits to go` : "You're at the top!"}
              icon={Sparkles}
              color="pink"
            />
          </>
        )}
      </div>

      {/* Progress to Next Tier */}
      {!loading && nextTier && (
        <AdminCard className="mb-8">
          <h3 className="mb-4 text-lg font-bold text-white admin-light-theme:text-slate-900 transition-colors">
            Progress to {nextTier.name}
          </h3>
          <div className="h-3 overflow-hidden rounded-full bg-white/10 admin-light-theme:bg-slate-200 transition-colors">
            <div
              className="h-full bg-[#d4ff00] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-white/60 admin-light-theme:text-slate-600 transition-colors">
            {r.credits} / {nextTier.minCredits} credits
          </p>
        </AdminCard>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/rewards/earn">
          <AdminButton>Earn Credits</AdminButton>
        </Link>
        <Link href="/admin/rewards/redeem">
          <AdminButton variant="secondary">Redeem</AdminButton>
        </Link>
        <Link href="/admin/rewards/tiers">
          <AdminButton variant="secondary">View Tiers</AdminButton>
        </Link>
        <Link href="/admin/rewards/activity">
          <AdminButton variant="secondary">Activity</AdminButton>
        </Link>
      </div>
    </AdminPageWrapper>
  )
}
