"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getSponsors, type Sponsor } from "@/shared/services/pageantDataService"
import { BadgeDollarSign } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageantPageHeader } from "@/shared/components/layout/PageantPageHeader"
import { usePageantModeStyles } from "@/shared/lib/pageantModeStyles"

const tierColors: Record<string, string> = {
  PLATINUM: "bg-slate-400/20 text-slate-600 border-slate-400/40",
  GOLD: "bg-amber-100 text-amber-600 border-amber-500/40",
  SILVER: "bg-slate-500/20 text-slate-500 border-slate-500/40",
}

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency === "INR" ? "INR" : "USD", maximumFractionDigits: 0 }).format(amountMinor / 100)
}

export default function PageantSponsorsPage() {
  const { cardVariant, colors } = usePageantModeStyles()
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSponsors().then((data) => {
      setSponsors(data)
      setLoading(false)
    })
  }, [])

  return (
    <AgenciesPage>
      <PageantPageHeader title="Sponsors" subtitle="Integration, visibility." />
        <section className="mt-8">
          <Card variant={cardVariant}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sponsors</CardTitle>
              <Button className="bg-violet-500 text-slate-800 hover:bg-violet-400">Add sponsor</Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-center" style={{ color: colors.textSoft }}>Loading sponsors…</p>
              ) : sponsors.length === 0 ? (
                <p className="py-8 text-center" style={{ color: colors.textSoft }}>No sponsors yet.</p>
              ) : (
                <div className="space-y-4">
                  {sponsors.map((s) => (
                    <div
                      key={s._id}
                      className="flex items-center justify-between rounded-xl border p-4 transition-all hover:shadow-md"
                      style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/20">
                          <BadgeDollarSign className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: colors.text }}>{s.name}</p>
                          <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${tierColors[s.tier] ?? "bg-slate-500/20 text-slate-500"}`}>{s.tier}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-violet-600">{formatCurrency(s.amountMinor, s.currency)}</p>
                        <p className="text-xs" style={{ color: colors.textSoft }}>Visibility: {s.visibility}</p>
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
