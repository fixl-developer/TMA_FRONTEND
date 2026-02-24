"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getAdCampaignById, getPerformanceByCampaign } from "@/shared/services/adsService"
import type { AdCampaign, AdPerformance } from "@/shared/lib/types/ads"
import { Eye, MousePointer, Target, TrendingUp, ArrowLeft } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
} from "@/shared/components/layout/AdminPageWrapper"

export default function AdPerformancePage() {
  const params = useParams()
  const id = params.id as string
  const [campaign, setCampaign] = useState<AdCampaign | null>(null)
  const [performance, setPerformance] = useState<AdPerformance | null>(null)

  useEffect(() => {
    Promise.all([getAdCampaignById(id), getPerformanceByCampaign(id)]).then(([c, p]) => {
      setCampaign(c ?? null)
      setPerformance(p ?? null)
    })
  }, [id])

  if (!campaign) return (
    <AdminPageWrapper>
      <p className="py-12 text-center text-white/60">Loading…</p>
    </AdminPageWrapper>
  )

  const perf = performance ?? { impressions: 0, clicks: 0, conversions: 0, ctr: 0, spendMinor: 0 }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={`Performance: ${campaign.name}`}
        subtitle="KPIs, timeline, placement"
        action={
          <Link href="/admin/ads">
            <AdminButton variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Campaigns
            </AdminButton>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <AdminStatCard
          title="Impressions"
          value={perf.impressions.toLocaleString()}
          icon={Eye}
          color="blue"
        />
        <AdminStatCard
          title="Clicks"
          value={perf.clicks.toLocaleString()}
          icon={MousePointer}
          color="purple"
        />
        <AdminStatCard
          title="CTR"
          value={`${perf.ctr}%`}
          icon={TrendingUp}
          color="green"
        />
        <AdminStatCard
          title="Conversions"
          value={perf.conversions.toLocaleString()}
          icon={Target}
          color="yellow"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-white">Quick actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href={`/admin/ads/${id}/creatives`}>
              <AdminButton variant="secondary">Creatives</AdminButton>
            </Link>
            <Link href={`/admin/ads/${id}/targeting`}>
              <AdminButton variant="secondary">Targeting</AdminButton>
            </Link>
            <Link href={`/admin/ads/${id}/budget`}>
              <AdminButton variant="secondary">Budget</AdminButton>
            </Link>
            <Link href="/admin/ads/attribution">
              <AdminButton variant="secondary">Attribution</AdminButton>
            </Link>
          </div>
        </AdminCard>
        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-white">Spend</h2>
          <p className="text-2xl font-bold text-[#d4ff00]">₹{(perf.spendMinor / 100).toLocaleString("en-IN")}</p>
          <p className="mt-1 text-sm text-white/60">of ₹{(campaign.budgetMinor / 100).toLocaleString("en-IN")} budget</p>
        </AdminCard>
      </div>
    </AdminPageWrapper>
  )
}
