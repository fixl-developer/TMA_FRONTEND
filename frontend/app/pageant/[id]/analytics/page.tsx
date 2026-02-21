"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getPageants } from "@/shared/services/pageantService"
import { getPageantAnalytics } from "@/shared/services/pageantLiveService"
import { ArrowLeft } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageantPageHeader } from "@/shared/components/layout/PageantPageHeader"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency === "INR" ? "INR" : "USD" }).format(amountMinor / 100)
}

export default function PageantAnalyticsPage() {
  const params = useParams()
  const id = params.id as string
  const [pageant, setPageant] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getPageants(), getPageantAnalytics(id)]).then(([pageants, data]) => {
      setPageant(pageants.find((p: any) => p._id === id))
      setAnalytics(data)
      setLoading(false)
    })
  }, [id])

  if (loading || !pageant) {
    return <p className="py-12 text-center text-slate-500">Loading…</p>
  }

  const funnel = analytics?.conversionFunnel ?? []
  const revenue = analytics?.revenue ?? { totalMinor: 0, currency: "INR", registrations: 0 }

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
          <Link href={`/pageant/${id}/live`}>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>
          </Link>
          <PageantPageHeader title="Analytics" subtitle={pageant.name} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Revenue</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-violet-600">{formatCurrency(revenue.totalMinor, revenue.currency)}</p>
              <p className="mt-1 text-sm text-slate-500">{revenue.registrations} registrations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Conversion funnel</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {funnel.slice(0, 4).map((f: any) => (
                  <div key={f.stage} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{f.stage}</span>
                    <span className="font-semibold text-violet-600">{f.count} ({f.rate}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Stage completion</CardTitle></CardHeader>
            <CardContent>
              {(analytics?.stageCompletion ?? []).map((s: any) => (
                <div key={s.stage} className="mb-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">{s.stage}</span>
                    <span>{s.completed}/{s.total}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-violet-500"
                      style={{ width: `${(s.completed / s.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </AgenciesPage>
  )
}
