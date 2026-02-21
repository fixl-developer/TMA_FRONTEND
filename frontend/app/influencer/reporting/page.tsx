"use client"

import { useEffect, useState } from "react"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getTenantCampaigns } from "@/shared/services/adminService"
import { BarChart3 } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function InfluencerReportingPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])

  useEffect(() => {
    getTenantCampaigns().then(setCampaigns)
  }, [])

  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length
  const completedCampaigns = campaigns.filter((c) => c.status === "COMPLETED").length

  return (
    <AgenciesPage>
      <PageBanner title="Reporting" subtitle="Engagement, performance, analytics." variant="influencer" backgroundImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80" />
        <section className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Performance overview</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/20"><BarChart3 className="h-5 w-5 text-pink-600" /></div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-[#E7E5E4] bg-white p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                  <p className="text-sm text-slate-500">Active campaigns</p>
                  <p className="mt-1 text-2xl font-bold text-pink-600">{activeCampaigns}</p>
                </div>
                <div className="rounded-xl border border-[#E7E5E4] bg-white p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                  <p className="text-sm text-slate-500">Completed</p>
                  <p className="mt-1 text-2xl font-bold text-slate-800">{completedCampaigns}</p>
                </div>
                <div className="rounded-xl border border-[#E7E5E4] bg-white p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                  <p className="text-sm text-slate-500">Avg engagement</p>
                  <p className="mt-1 text-2xl font-bold text-slate-800">~4.2%</p>
                </div>
                <div className="rounded-xl border border-[#E7E5E4] bg-white p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                  <p className="text-sm text-slate-500">Total reach</p>
                  <p className="mt-1 text-2xl font-bold text-slate-800">~2.1M</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">Seed data. In production, this would show real engagement metrics from social APIs.</p>
            </CardContent>
          </Card>
        </section>
    </AgenciesPage>
  )
}
