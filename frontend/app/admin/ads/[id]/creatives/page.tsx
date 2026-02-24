"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getAdCampaignById, getCreativesByCampaign } from "@/shared/services/adsService"
import type { AdCampaign, AdCreative } from "@/shared/lib/types/ads"
import { ImageIcon, Film, Plus, ArrowLeft } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"

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

  if (!campaign) return (
    <AdminPageWrapper>
      <p className="py-12 text-center text-white/60">Loading…</p>
    </AdminPageWrapper>
  )

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={`Creatives: ${campaign.name}`}
        subtitle="Creative library, A/B variants"
        action={
          <div className="flex gap-2">
            <Link href="/admin/ads">
              <AdminButton variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Campaigns
              </AdminButton>
            </Link>
            <AdminButton variant="primary">
              <Plus className="mr-1.5 h-4 w-4" /> Add creative
            </AdminButton>
          </div>
        }
      />

      <AdminCard>
        {creatives.length === 0 ? (
          <AdminEmptyState
            icon={ImageIcon}
            title="No creatives yet"
            description="Add your first creative to get started"
            action={<AdminButton variant="primary">Add creative</AdminButton>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {creatives.map((c) => (
              <div key={c._id} className="overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all hover:border-white/20 hover:bg-white/10">
                <div className="relative aspect-video bg-black/50">
                  {c.previewUrl ? (
                    <Image src={c.previewUrl} alt={c.name} fill className="object-contain" />
                  ) : c.format === "VIDEO" ? (
                    <Film className="absolute inset-0 m-auto h-12 w-12 text-white/30" />
                  ) : (
                    <ImageIcon className="absolute inset-0 m-auto h-12 w-12 text-white/30" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white">{c.name}</h3>
                  <p className="mt-1 text-xs text-white/60">{c.headline ?? "—"}</p>
                  <AdminBadge
                    variant={
                      c.status === "APPROVED" ? "success" :
                      c.status === "PENDING" ? "warning" : "default"
                    }
                    className="mt-2"
                  >
                    {c.status}
                  </AdminBadge>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
