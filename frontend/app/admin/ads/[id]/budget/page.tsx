"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getAdCampaignById } from "@/shared/services/adsService"
import type { AdCampaign } from "@/shared/lib/types/ads"
import { Wallet, TrendingUp } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function AdBudgetPage() {
  const params = useParams()
  const id = params.id as string
  const [campaign, setCampaign] = useState<AdCampaign | null>(null)

  useEffect(() => {
    getAdCampaignById(id).then(setCampaign)
  }, [id])

  if (!campaign) return <p className="py-12 text-center text-slate-500">Loading…</p>

  const spendPct = campaign.budgetMinor > 0 ? (campaign.spentMinor / campaign.budgetMinor) * 100 : 0

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/ads">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">← Campaigns</Button>
          </Link>
          <PageBanner title={`Budget: ${campaign.name}`} subtitle="Spending, pace, caps." variant="admin" backgroundImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80" />
          <Button className="ml-auto border-amber-500/50 text-amber-600 hover:bg-amber-500/10">Edit budget</Button>
        </div>
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Total budget</CardTitle>
              <Wallet className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-800">₹{(campaign.budgetMinor / 100).toLocaleString("en-IN")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Spent</CardTitle>
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">₹{(campaign.spentMinor / 100).toLocaleString("en-IN")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Remaining</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-800">₹{((campaign.budgetMinor - campaign.spentMinor) / 100).toLocaleString("en-IN")}</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader><CardTitle>Spending progress</CardTitle></CardHeader>
          <CardContent>
            <div className="h-4 rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${Math.min(spendPct, 100)}%` }} />
            </div>
            <p className="mt-2 text-sm text-slate-500">{spendPct.toFixed(1)}% of budget used</p>
            <div className="mt-4 flex gap-4 text-sm">
              <span className="text-slate-500">Start: {campaign.startDate}</span>
              <span className="text-slate-500">End: {campaign.endDate}</span>
            </div>
          </CardContent>
        </Card>
      </AgenciesPage>
  )
}
