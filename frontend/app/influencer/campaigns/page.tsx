"use client"

import { useEffect, useState } from "react"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getTenantCampaigns } from "@/shared/services/adminService"
import { Megaphone } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-600 border-emerald-500/40",
  COMPLETED: "bg-slate-500/20 text-slate-500 border-slate-500/40",
  DRAFT: "bg-amber-100 text-amber-600 border-amber-500/40",
}

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency === "INR" ? "INR" : "USD", maximumFractionDigits: 0 }).format(amountMinor / 100)
}

export default function InfluencerCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTenantCampaigns().then((data) => {
      setCampaigns(data)
      setLoading(false)
    })
  }, [])

  return (
    <AgenciesPage>
      <PageBanner title="Campaigns" subtitle="Brand campaigns, deliverables, tracking." variant="influencer" backgroundImage="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80" />
        <section className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Campaigns</CardTitle>
              <Button className="bg-pink-500 text-slate-800 hover:bg-pink-400">New campaign</Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-center text-slate-500">Loading campaigns…</p>
              ) : campaigns.length === 0 ? (
                <p className="py-8 text-center text-slate-500">No campaigns yet.</p>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((c) => (
                    <div key={c._id} className="flex items-center justify-between rounded-xl border border-[#E7E5E4] bg-white p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-500/20">
                          <Megaphone className="h-5 w-5 text-pink-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{c.name}</p>
                          <p className="text-sm text-slate-500">{c.brand}</p>
                        </div>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[c.status] ?? "bg-[#E7E5E4]/60 text-[#57534E] border-[#E7E5E4]"}`}>{c.status}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-pink-600">{formatCurrency(c.budgetMinor, c.currency)}</p>
                        <p className="text-xs text-slate-500">{c.startDate} – {c.endDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
    </AgenciesPage>
  )
}
