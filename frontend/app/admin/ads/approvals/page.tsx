"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getPendingCreatives } from "@/shared/services/adsService"
import type { AdCreative } from "@/shared/lib/types/ads"
import { ImageIcon, Film, CheckCircle2, XCircle } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const DEMO_TENANT = "tenant_001"

export default function AdApprovalsPage() {
  const [creatives, setCreatives] = useState<AdCreative[]>([])

  useEffect(() => {
    getPendingCreatives(DEMO_TENANT).then(setCreatives)
  }, [])

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center justify-between">
          <PageBanner title="Ad approvals" subtitle="Review and approve pending creatives." variant="admin" backgroundImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80" />
          <Link href="/admin/ads/create">
            <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400">Create campaign</Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            {creatives.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-slate-500">No pending creatives.</p>
                <Link href="/admin/ads">
                  <Button variant="outline" className="mt-4 border-slate-200 text-slate-800">View campaigns</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {creatives.map((c) => (
                  <div key={c._id} className="overflow-hidden rounded-xl border border-[#E7E5E4] bg-white transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                    <div className="aspect-video flex items-center justify-center bg-slate-900">
                      {c.format === "VIDEO" ? <Film className="h-12 w-12 text-slate-600" /> : <ImageIcon className="h-12 w-12 text-slate-600" />}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-800">{c.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">{c.headline ?? "—"}</p>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" className="flex-1 bg-emerald-600 text-slate-800 hover:bg-emerald-500">
                          <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 border-rose-600 text-rose-600 hover:bg-rose-500/10">
                          <XCircle className="mr-1.5 h-4 w-4" /> Reject
                        </Button>
                      </div>
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
