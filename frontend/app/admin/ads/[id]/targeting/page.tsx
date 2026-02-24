"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getAdCampaignById, getTargetingByCampaign } from "@/shared/services/adsService"
import type { AdCampaign, AdTargeting } from "@/shared/lib/types/ads"
import { MapPin, Users, ArrowLeft } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
} from "@/shared/components/layout/AdminPageWrapper"

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

  if (!campaign) return (
    <AdminPageWrapper>
      <p className="py-12 text-center text-white/60">Loading…</p>
    </AdminPageWrapper>
  )

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={`Targeting: ${campaign.name}`}
        subtitle="Audience, geography, demographics"
        action={
          <div className="flex gap-2">
            <Link href="/admin/ads">
              <AdminButton variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Campaigns
              </AdminButton>
            </Link>
            <AdminButton variant="secondary">Edit targeting</AdminButton>
          </div>
        }
      />

      <AdminCard>
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-white/60" />
          <h2 className="text-lg font-semibold text-white">Audience</h2>
        </div>
        {!targeting ? (
          <p className="py-8 text-white/60">No targeting configured yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-white/70">
                <MapPin className="h-4 w-4" /> Locations
              </h4>
              <div className="flex flex-wrap gap-2">
                {targeting.locations.map((loc) => (
                  <span key={loc} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">{loc}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-white/70">
                <Users className="h-4 w-4" /> Age range
              </h4>
              <p className="text-white">{targeting.ageMin} – {targeting.ageMax} years</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium text-white/70">Genders</h4>
              <div className="flex flex-wrap gap-2">
                {targeting.genders.map((g) => (
                  <span key={g} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">{g}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium text-white/70">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {targeting.interests.map((i) => (
                  <span key={i} className="rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-400">{i}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
