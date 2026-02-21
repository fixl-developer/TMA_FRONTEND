"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getPageants } from "@/shared/services/pageantService"
import { getPageantLiveData } from "@/shared/services/pageantLiveService"
import { Radio, ArrowLeft, Users } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageantPageHeader } from "@/shared/components/layout/PageantPageHeader"
import { usePageantModeStyles } from "@/shared/lib/pageantModeStyles"

export default function LivePageantPage() {
  const { cardVariant, colors } = usePageantModeStyles()
  const params = useParams()
  const id = params.id as string
  const [pageant, setPageant] = useState<any>(null)
  const [liveData, setLiveData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getPageants(), getPageantLiveData(id)]).then(([pageants, live]) => {
      setPageant(pageants.find((p: any) => p._id === id))
      setLiveData(live)
      setLoading(false)
    })
  }, [id])

  if (loading || !pageant) {
    return <p className="py-12 text-center" style={{ color: colors.textSoft }}>Loading…</p>
  }

  const funnel = liveData?.funnel ?? []

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
          <Link href="/pageant/process">
            <Button variant="ghost" size="sm" style={{ color: colors.textSoft }}>
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>
          </Link>
          <div className="flex-1">
            <PageantPageHeader title={pageant.name} subtitle="Live dashboard" />
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5">
            <Radio className="h-4 w-4 animate-pulse text-emerald-600" />
            <span className="text-sm font-medium text-emerald-600">LIVE</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card variant={cardVariant} className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Participant funnel</CardTitle>
              <span className="text-sm" style={{ color: colors.textSoft }}>Current: {liveData?.currentStage ?? "—"}</span>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2 py-4">
                {funnel.map((f: any, i: number) => (
                  <div key={f.stage} className="flex flex-1 flex-col items-center">
                    <div
                      className="w-full rounded-t-lg bg-violet-500/40 transition-all"
                      style={{ height: `${Math.max(20, (f.count / (funnel[0]?.count || 1)) * 80)}px` }}
                    />
                    <p className="mt-2 text-center text-xs font-medium" style={{ color: colors.textMuted }}>{f.label}</p>
                    <p className="text-lg font-bold text-violet-600">{f.count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card variant={cardVariant}>
            <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
            <CardContent>
              <Link href={`/pageant/${id}/judge`}>
                <Button className="mb-2 w-full bg-violet-500 text-slate-800 hover:bg-violet-400">
                  Judge scoring
                </Button>
              </Link>
              <Link href={`/pageant/results?pageant=${id}`}>
                <Button variant="outline" className="mb-2 w-full" style={{ borderColor: colors.border, color: colors.text }}>
                  View results
                </Button>
              </Link>
              <Link href={`/pageant/${id}/analytics`}>
                <Button variant="outline" className="w-full" style={{ borderColor: colors.border, color: colors.text }}>
                  View analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card variant={cardVariant} className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Participants by stage</CardTitle>
            <span className="text-sm" style={{ color: colors.textSoft }}>{liveData?.participants?.length ?? 0} total</span>
          </CardHeader>
          <CardContent>
            {!liveData?.participants?.length ? (
              <p className="py-8 text-center" style={{ color: colors.textSoft }}>No participants yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {liveData.participants.map((p: any) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-3 rounded-xl border p-3 transition-all hover:shadow-md"
                    style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
                      <Users className="h-5 w-5 text-violet-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium" style={{ color: colors.text }}>{p.contestantName}</p>
                      <p className="text-xs" style={{ color: colors.textSoft }}>{p.stage} · {p.status}</p>
                    </div>
                    <Link href={`/pageant/${id}/participants/${p._id}`}>
                      <Button variant="ghost" size="sm" style={{ color: colors.textSoft }}>
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </AgenciesPage>
  )
}
