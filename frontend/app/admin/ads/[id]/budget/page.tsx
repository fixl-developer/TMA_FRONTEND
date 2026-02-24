"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getAdCampaignById } from "@/shared/services/adsService"
import type { AdCampaign } from "@/shared/lib/types/ads"
import { Wallet, TrendingUp, ArrowLeft } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
} from "@/shared/components/layout/AdminPageWrapper"

export default function AdBudgetPage() {
  const params = useParams()
  const id = params.id as string
  const [campaign, setCampaign] = useState<AdCampaign | null>(null)

  useEffect(() => {
    getAdCampaignById(id).then(setCampaign)
  }, [id])

  if (!campaign) return (
    <AdminPageWrapper>
      <p className="py-12 text-center text-white/60">Loading…</p>
    </AdminPageWrapper>
  )

  const spendPct = campaign.budgetMinor > 0 ? (campaign.spentMinor / campaign.budgetMinor) * 100 : 0

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={`Budget: ${campaign.name}`}
        subtitle="Spending, pace, caps"
        action={
          <div className="flex gap-2">
            <Link href="/admin/ads">
              <AdminButton variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Campaigns
              </AdminButton>
            </Link>
            <AdminButton variant="secondary">Edit budget</AdminButton>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <AdminStatCard
          title="Total budget"
          value={`₹${(campaign.budgetMinor / 100).toLocaleString("en-IN")}`}
          icon={Wallet}
          color="yellow"
        />
        <AdminStatCard
          title="Spent"
          value={`₹${(campaign.spentMinor / 100).toLocaleString("en-IN")}`}
          icon={TrendingUp}
          color="green"
        />
        <AdminStatCard
          title="Remaining"
          value={`₹${((campaign.budgetMinor - campaign.spentMinor) / 100).toLocaleString("en-IN")}`}
          icon={Wallet}
          color="blue"
        />
      </div>

      <AdminCard>
        <h2 className="mb-4 text-lg font-semibold text-white">Spending progress</h2>
        <div className="h-4 rounded-full bg-white/10">
          <div className="h-full rounded-full bg-[#d4ff00] transition-all" style={{ width: `${Math.min(spendPct, 100)}%` }} />
        </div>
        <p className="mt-2 text-sm text-white/60">{spendPct.toFixed(1)}% of budget used</p>
        <div className="mt-4 flex gap-4 text-sm text-white/60">
          <span>Start: {campaign.startDate}</span>
          <span>End: {campaign.endDate}</span>
        </div>
      </AdminCard>
    </AdminPageWrapper>
  )
}
