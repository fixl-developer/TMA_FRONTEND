"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getPendingCreatives } from "@/shared/services/adsService"
import type { AdCreative } from "@/shared/lib/types/ads"
import { ImageIcon, Film, CheckCircle2, XCircle, Plus } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminCard,
  AdminButton,
  AdminEmptyState,
} from "@/shared/components/admin/AdminPageLayout"

const DEMO_TENANT = "tenant_001"

export default function AdApprovalsPage() {
  const [creatives, setCreatives] = useState<AdCreative[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPendingCreatives(DEMO_TENANT).then((data) => {
      setCreatives(data)
      setLoading(false)
    })
  }, [])

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Ad Approvals"
        subtitle="Review and approve pending creatives"
        actions={
          <Link href="/admin/ads/create">
            <AdminButton>
              <Plus className="h-4 w-4" />
              Create Campaign
            </AdminButton>
          </Link>
        }
      >
        <AdminCard title="Pending Creatives" subtitle={`${creatives.length} awaiting review`}>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-white/5" />
              ))}
            </div>
          ) : creatives.length === 0 ? (
            <AdminEmptyState
              icon={ImageIcon}
              title="No pending creatives"
              description="All creatives have been reviewed"
              action={
                <Link href="/admin/ads">
                  <AdminButton variant="secondary">View Campaigns</AdminButton>
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {creatives.map((c) => (
                <div key={c._id} className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                  <div className="aspect-video flex items-center justify-center bg-black/20">
                    {c.format === "VIDEO" ? (
                      <Film className="h-12 w-12 text-white/40" />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-white/40" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white">{c.name}</h3>
                    <p className="mt-1 text-xs text-white/60">{c.headline ?? "—"}</p>
                    <div className="mt-4 flex gap-2">
                      <AdminButton size="sm" className="flex-1">
                        <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve
                      </AdminButton>
                      <AdminButton size="sm" variant="danger" className="flex-1">
                        <XCircle className="mr-1.5 h-4 w-4" /> Reject
                      </AdminButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
