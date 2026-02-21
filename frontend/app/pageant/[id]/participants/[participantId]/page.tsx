"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getPageants } from "@/shared/services/pageantService"
import { seedRegistrations } from "@/data/seed"
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageantPageHeader } from "@/shared/components/layout/PageantPageHeader"

const STAGE_HISTORY = [
  { stage: "Registration", status: "completed", date: "2024-05-01" },
  { stage: "Prelims", status: "current", date: "2024-05-15" },
  { stage: "Semi-finals", status: "upcoming", date: null },
  { stage: "Finals", status: "upcoming", date: null },
]

export default function ParticipantJourneyPage() {
  const params = useParams()
  const id = params.id as string
  const participantId = params.participantId as string
  const [pageant, setPageant] = useState<any>(null)
  const [participant, setParticipant] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPageants().then((pageants) => {
      setPageant(pageants.find((p: any) => p._id === id))
      const reg = (seedRegistrations as any[]).find((r) => r._id === participantId && r.pageantId === id)
      setParticipant(reg)
      setLoading(false)
    })
  }, [id, participantId])

  if (loading || !pageant) {
    return <p className="py-12 text-center text-slate-500">Loading…</p>
  }

  const p = participant ?? { contestantName: "Unknown", email: "", status: "—", stage: "—" }

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
          <Link href={`/pageant/${id}/live`}>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>
          </Link>
          <PageantPageHeader title={p.contestantName} subtitle={`${pageant.name} · Participant journey`} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Stage history</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {STAGE_HISTORY.map((s) => (
                  <div
                    key={s.stage}
                    className={`flex items-center gap-4 rounded-lg border p-4 ${
                      s.status === "completed"
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : s.status === "current"
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-slate-700 bg-slate-800/30"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        s.status === "completed"
                          ? "bg-emerald-100 text-emerald-600"
                          : s.status === "current"
                          ? "bg-violet-500/30 text-violet-600"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {s.status === "completed" ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{s.stage}</p>
                      <p className="text-xs text-slate-500">{s.status} {s.date && `· ${s.date}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Participant info</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">Name</p>
                  <p className="text-slate-800">{p.contestantName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Email</p>
                  <p className="text-slate-600">{p.email ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Status</p>
                  <span className="rounded-full border border-violet-500/40 bg-violet-500/10 px-2 py-0.5 text-xs text-violet-600">{p.status}</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Current stage</p>
                  <p className="text-slate-600">{p.stage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AgenciesPage>
  )
}
