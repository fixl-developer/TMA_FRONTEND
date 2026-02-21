"use client"

import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FileText } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const MEDIA_KITS = [
  { _id: "mk1", talentName: "Priya Sharma", followers: "125K", lastUpdated: "2024-06-01" },
  { _id: "mk2", talentName: "Rahul Kapoor", followers: "89K", lastUpdated: "2024-05-15" },
  { _id: "mk3", talentName: "Ananya Patel", followers: "210K", lastUpdated: "2024-06-10" },
]

export default function InfluencerMediaKitsPage() {
  return (
    <AgenciesPage>
      <PageBanner title="Media Kits" subtitle="Talent media kits, rates, reach." variant="influencer" backgroundImage="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&q=80" />
        <section className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Media kits</CardTitle>
              <Button className="bg-pink-500 text-slate-800 hover:bg-pink-400">Generate media kit</Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MEDIA_KITS.map((m) => (
                  <div key={m._id} className="flex items-center gap-4 rounded-xl border border-[#E7E5E4] bg-white p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-pink-500/20"><FileText className="h-6 w-6 text-pink-600" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800">{m.talentName}</p>
                      <p className="text-sm text-slate-500">{m.followers} followers</p>
                      <p className="text-xs text-slate-500">Updated {m.lastUpdated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
    </AgenciesPage>
  )
}
