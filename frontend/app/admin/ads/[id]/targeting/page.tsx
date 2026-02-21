"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getAdCampaignById, getTargetingByCampaign } from "@/shared/services/adsService"
import type { AdCampaign, AdTargeting } from "@/shared/lib/types/ads"
import { MapPin, Users } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function AdTargetingPage() {
  const params = useParams()
  const id = params.id as string
  const [campaign, setCampaign] = useState<AdCampaign | null>(null)
  const [targeting, setTargeting] = useState<AdTargeting | null>(null)

  useEffect(() => {
    Promise.all([getAdCampaignById(id), getTargetingByCampaign(id)]).then(([c, t]) => {
      setCampaign(c ?? null)
      setTargeting(t ?? null)
    })
  }, [id])

  if (!campaign) return <p className="py-12 text-center text-slate-500">Loading…</p>

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/ads">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">← Campaigns</Button>
          </Link>
          <PageBanner title={`Targeting: ${campaign.name}`} subtitle="Audience, geography, demographics." variant="admin" backgroundImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80" />
          <Button className="ml-auto border-amber-500/50 text-amber-600 hover:bg-amber-500/10">Edit targeting</Button>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Audience</CardTitle>
            <MapPin className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            {!targeting ? (
              <p className="py-8 text-slate-500">No targeting configured yet.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                    <MapPin className="h-4 w-4" /> Locations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {targeting.locations.map((loc) => (
                      <span key={loc} className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-800">{loc}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Users className="h-4 w-4" /> Age range
                  </h4>
                  <p className="text-slate-800">{targeting.ageMin} – {targeting.ageMax} years</p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-slate-600">Genders</h4>
                  <div className="flex flex-wrap gap-2">
                    {targeting.genders.map((g) => (
                      <span key={g} className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-800">{g}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-slate-600">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {targeting.interests.map((i) => (
                      <span key={i} className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-600">{i}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </AgenciesPage>
  )
}
