"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getAdCampaignById, getPerformanceByCampaign } from "@/shared/services/adsService"
import type { AdCampaign, AdPerformance } from "@/shared/lib/types/ads"
import { Eye, MousePointer, Target, TrendingUp } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

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

  if (!campaign) return <p className="py-12 text-center text-slate-500">Loading…</p>

  const perf = performance ?? { impressions: 0, clicks: 0, conversions: 0, ctr: 0, spendMinor: 0 }

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/ads">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">← Campaigns</Button>
          </Link>
          <PageBanner title={`Performance: ${campaign.name}`} subtitle="KPIs, timeline, placement." variant="admin" backgroundImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80" />
        </div>
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Impressions</CardTitle>
              <Eye className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-800">{perf.impressions.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Clicks</CardTitle>
              <MousePointer className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-800">{perf.clicks.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>CTR</CardTitle>
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">{perf.ctr}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Conversions</CardTitle>
              <Target className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-800">{perf.conversions.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Link href={`/admin/ads/${id}/creatives`}>
                  <Button variant="outline" className="border-slate-200 text-slate-800">Creatives</Button>
                </Link>
                <Link href={`/admin/ads/${id}/targeting`}>
                  <Button variant="outline" className="border-slate-200 text-slate-800">Targeting</Button>
                </Link>
                <Link href={`/admin/ads/${id}/budget`}>
                  <Button variant="outline" className="border-slate-200 text-slate-800">Budget</Button>
                </Link>
                <Link href="/admin/ads/attribution">
                  <Button variant="outline" className="border-slate-200 text-slate-800">Attribution</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Spend</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-800">₹{(perf.spendMinor / 100).toLocaleString("en-IN")}</p>
              <p className="mt-1 text-sm text-slate-500">of ₹{(campaign.budgetMinor / 100).toLocaleString("en-IN")} budget</p>
            </CardContent>
          </Card>
        </div>
      </AgenciesPage>
  )
}
