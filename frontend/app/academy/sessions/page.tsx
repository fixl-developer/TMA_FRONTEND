"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getAllSessions } from "@/shared/services/academyService"
import { Video, Calendar, ExternalLink } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const statusColors: Record<string, string> = {
  UPCOMING: "bg-amber-100 text-amber-700 border-amber-200",
  LIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  RECORDED: "bg-slate-100 text-slate-600 border-slate-200",
}

export default function AcademySessionsPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllSessions().then(setSessions).finally(() => setLoading(false))
  }, [])

  const upcoming = sessions.filter((s) => s.status === "UPCOMING")
  const recorded = sessions.filter((s) => s.status === "RECORDED")

  return (
    <AgenciesPage>
      <PageBanner title="Live sessions" subtitle="Join live workshops, watch recordings." variant="academy" backgroundImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80" />
        <section className="mt-8 space-y-8">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Upcoming</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-center text-slate-500">Loading…</p>
              ) : upcoming.length === 0 ? (
                <p className="py-8 text-center text-slate-500">No upcoming sessions.</p>
              ) : (
                <div className="space-y-4">
                  {upcoming.map((s) => (
                    <div key={s._id} className="flex flex-col gap-4 rounded-xl border border-[#E7E5E4] bg-white p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                          <Video className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{s.title}</p>
                          <p className="text-sm text-slate-500">
                            {new Date(s.scheduledAt).toLocaleString()} · {s.durationMinutes} min
                          </p>
                        </div>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[s.status] ?? ""}`}>{s.status}</span>
                      </div>
                      <Button className="bg-indigo-500 text-slate-800 hover:bg-indigo-400" asChild>
                        <a href={s.meetingUrl ?? "#"} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" /> Join
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Recordings</CardTitle></CardHeader>
            <CardContent>
              {recorded.length === 0 ? (
                <p className="py-8 text-center text-slate-500">No recordings yet.</p>
              ) : (
                <div className="space-y-4">
                  {recorded.map((s) => (
                    <div key={s._id} className="flex flex-col gap-4 rounded-xl border border-[#E7E5E4] bg-white p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-200">
                          <Video className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{s.title}</p>
                          <p className="text-sm text-slate-500">{new Date(s.scheduledAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[s.status] ?? ""}`}>{s.status}</span>
                      </div>
                      <Button variant="outline" asChild>
                        <a href={s.recordingUrl ?? "#"} target="_blank" rel="noopener noreferrer">Watch</a>
                      </Button>
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
