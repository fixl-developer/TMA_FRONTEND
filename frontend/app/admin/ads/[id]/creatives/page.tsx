"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getAdCampaignById, getCreativesByCampaign } from "@/shared/services/adsService"
import type { AdCampaign, AdCreative } from "@/shared/lib/types/ads"
import { ImageIcon, Film, Plus } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function AdCreativesPage() {
  const params = useParams()
  const id = params.id as string
  const [campaign, setCampaign] = useState<AdCampaign | null>(null)
  const [creatives, setCreatives] = useState<AdCreative[]>([])

  useEffect(() => {
    Promise.all([getAdCampaignById(id), getCreativesByCampaign(id)]).then(([c, cr]) => {
      setCampaign(c ?? null)
      setCreatives(cr)
    })
  }, [id])

  if (!campaign) return <p className="py-12 text-center text-slate-500">Loading…</p>

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/ads">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">← Campaigns</Button>
          </Link>
          <PageBanner title={`Creatives: ${campaign.name}`} subtitle="Creative library, A/B variants." variant="admin" backgroundImage="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&q=80" />
          <Button className="ml-auto bg-amber-500 text-slate-900 hover:bg-amber-400">
            <Plus className="mr-1.5 h-4 w-4" /> Add creative
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            {creatives.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-slate-500">No creatives yet.</p>
                <Button className="mt-4 bg-amber-500 text-slate-900 hover:bg-amber-400">Add creative</Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {creatives.map((c) => (
                  <div key={c._id} className="overflow-hidden rounded-xl border border-[#E7E5E4] bg-white transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                    <div className="relative aspect-video bg-slate-900">
                      {c.previewUrl ? (
                        <Image src={c.previewUrl} alt={c.name} fill className="object-contain" />
                      ) : c.format === "VIDEO" ? (
                        <Film className="absolute inset-0 m-auto h-12 w-12 text-slate-600" />
                      ) : (
                        <ImageIcon className="absolute inset-0 m-auto h-12 w-12 text-slate-600" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-800">{c.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">{c.headline ?? "—"}</p>
                      <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs ${
                        c.status === "APPROVED" ? "bg-emerald-100 text-emerald-600" :
                        c.status === "PENDING" ? "bg-amber-100 text-amber-600" :
                        "bg-slate-600 text-slate-600"
                      }`}>{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </AgenciesPage>
  )
}
