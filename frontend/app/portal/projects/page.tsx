"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getProjects } from "@/shared/services/projectService"
import { useTenant } from "@/shared/context/TenantContext"
import { Briefcase, CheckCircle2, Clock, ChevronRight } from "lucide-react"
import { format } from "date-fns"

export default function PortalProjectsPage() {
  const { tenantId } = useTenant()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProjects(tenantId).then((data) => {
      // Only show client-visible fields
      setProjects((data as any[]).map((p: any) => ({
        _id: p._id,
        name: p.name,
        status: p.status,
        startDate: p.startDate,
        endDate: p.endDate,
        milestones: p.milestones || [],
        clientName: p.clientName,
        brief: p.brief,
      })))
      setLoading(false)
    })
  }, [tenantId])

  const STATUS_COLORS: Record<string, string> = {
    ACTIVE: "bg-emerald-500/20 text-emerald-400",
    IN_PROGRESS: "bg-blue-500/20 text-blue-400",
    PLANNING: "bg-amber-500/20 text-amber-400",
    COMPLETED: "bg-white/10 text-white/60",
    ON_HOLD: "bg-rose-500/20 text-rose-400",
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/portal" className="text-white/50 hover:text-white text-sm">← Portal</Link>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
        </div>

        {loading ? (
          <div className="space-y-4">{[1,2,3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />)}</div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <Briefcase className="mx-auto mb-3 h-12 w-12 text-white/20" />
            <p className="text-white/50">No active projects.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((p) => (
              <div key={p._id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">{p.name}</p>
                    {p.brief && <p className="mt-1 text-sm text-white/50 line-clamp-2">{p.brief}</p>}
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[p.status] ?? "bg-white/10 text-white/50"}`}>
                    {p.status?.replace("_", " ") ?? "—"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/40">
                  {p.startDate && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Start {format(new Date(p.startDate), "MMM d, yyyy")}</span>}
                  {p.endDate && <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />End {format(new Date(p.endDate), "MMM d, yyyy")}</span>}
                </div>
                {p.milestones?.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/30">Milestones</p>
                    <div className="space-y-1.5">
                      {p.milestones.slice(0, 4).map((m: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className={`h-2 w-2 rounded-full ${m.completed ? "bg-emerald-400" : "bg-white/20"}`} />
                          <span className={m.completed ? "text-white/50 line-through" : "text-white/70"}>{m.title || m.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
