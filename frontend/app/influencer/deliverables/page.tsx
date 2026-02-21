"use client"

import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Package } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const DELIVERABLES = [
  { _id: "d1", campaign: "Summer Beauty Launch", type: "Instagram Reel", status: "DONE", dueDate: "2024-07-15" },
  { _id: "d2", campaign: "Summer Beauty Launch", type: "Instagram Story", status: "DONE", dueDate: "2024-07-20" },
  { _id: "d3", campaign: "Fashion Week Promo", type: "YouTube Video", status: "DONE", dueDate: "2024-03-10" },
  { _id: "d4", campaign: "Wellness Campaign", type: "Instagram Post", status: "PENDING", dueDate: "2024-09-15" },
  { _id: "d5", campaign: "Wellness Campaign", type: "Blog Post", status: "PENDING", dueDate: "2024-09-20" },
]

const statusColors: Record<string, string> = {
  DONE: "bg-emerald-100 text-emerald-600 border-emerald-500/40",
  PENDING: "bg-amber-100 text-amber-600 border-amber-500/40",
}

export default function InfluencerDeliverablesPage() {
  return (
    <AgenciesPage>
      <PageBanner title="Deliverables" subtitle="Campaign deliverables, content approval." variant="influencer" backgroundImage="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&q=80" />
        <section className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Deliverables</CardTitle>
              <Button className="bg-pink-500 text-slate-800 hover:bg-pink-400">Add deliverable</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DELIVERABLES.map((d) => (
                  <div key={d._id} className="flex items-center justify-between rounded-xl border border-[#E7E5E4] bg-white p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-500/20"><Package className="h-5 w-5 text-pink-600" /></div>
                      <div>
                        <p className="font-semibold text-slate-800">{d.type}</p>
                        <p className="text-sm text-slate-500">{d.campaign}</p>
                      </div>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[d.status] ?? "bg-[#E7E5E4]/60 text-[#57534E] border-[#E7E5E4]"}`}>{d.status}</span>
                    </div>
                    <p className="text-xs text-slate-500">Due {d.dueDate}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
    </AgenciesPage>
  )
}
