"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getRunOfShowByEvent,
  getEventById,
  getChecklistById,
} from "@/shared/services/projectService"
import { Clock, AlertCircle, CheckSquare } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

export default function RunOfShowPage() {
  const params = useParams()
  const eventId = params?.id as string
  const { page } = useDashboardTheme()
  const [event, setEvent] = useState<any>(null)
  const [ros, setRos] = useState<any>(null)
  const [checklist, setChecklist] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!eventId) return
    Promise.all([
      getRunOfShowByEvent(eventId),
      getEventById(eventId),
    ]).then(async ([r, evt]) => {
      setRos(r)
      setEvent(evt)
      if (r?.checklistId) {
        const chk = await getChecklistById(r.checklistId)
        setChecklist(chk)
      }
      setLoading(false)
    })
  }, [eventId])

  if (loading) {
    return (
      <AgenciesPage>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-slate-500">Loading run-of-show…</p>
        </div>
      </AgenciesPage>
    )
  }

  if (!ros) {
    return (
      <AgenciesPage>
        <PageBanner
          title={event?.name ?? "Event"}
          subtitle="Run-of-show"
          variant="admin"
          backgroundImage="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80"
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/admin/events">
            <Button variant="ghost" size="sm">
              ← Events
            </Button>
          </Link>
        </div>
        <Card className="mt-6" style={{ borderColor: page.border }}>
          <CardContent className="py-12 text-center">
            <p className="text-slate-500">No run-of-show defined for this event.</p>
            <p className="mt-2 text-sm text-slate-400">
              Create one from the project linked to this event.
            </p>
          </CardContent>
        </Card>
      </AgenciesPage>
    )
  }

  const segments = ros.segments ?? []
  const issues = ros.issues ?? []

  return (
    <AgenciesPage>
      <PageBanner
        title={ros.name}
        subtitle={`${ros.eventDate} · ${segments.length} segments`}
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/events">
          <Button variant="ghost" size="sm">
            ← Events
          </Button>
        </Link>
        <Link href="/admin/projects">
          <Button variant="outline" size="sm">
            Projects
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card style={{ borderColor: page.border }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                <div className="space-y-4">
                  {segments.map((seg: any, i: number) => (
                    <div key={seg.id} className="relative flex gap-4 pl-10">
                      <div className="absolute left-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
                        {i + 1}
                      </div>
                      <div
                        className="flex-1 rounded-lg border p-3"
                        style={{ borderColor: page.border }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium" style={{ color: page.text }}>
                            {seg.time} – {seg.title}
                          </span>
                          <span className="text-xs text-slate-500">
                            {seg.duration}
                          </span>
                        </div>
                        {seg.notes && (
                          <p className="mt-1 text-sm text-slate-500">{seg.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {issues.length > 0 && (
            <Card style={{ borderColor: page.border }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Issues ({issues.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {issues.map((iss: any) => (
                    <li
                      key={iss.id}
                      className="rounded border border-amber-200 bg-amber-50 p-2 text-sm"
                    >
                      <p style={{ color: page.text }}>{iss.description}</p>
                      <span className="text-xs text-slate-500">
                        {iss.status} · Segment {iss.segmentId}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {checklist && (
            <Card style={{ borderColor: page.border }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <CheckSquare className="h-4 w-4" />
                  Pre-event checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium" style={{ color: page.text }}>
                  {checklist.name}
                </p>
                {checklist.completionGate && (
                  <p className="mt-1 text-xs text-slate-500">
                    Gate: {checklist.completionGate.replace(/_/g, " ")}
                  </p>
                )}
                <Link href={`/admin/projects/${checklist.projectId ?? ""}/checklists`}>
                  <Button variant="outline" size="sm" className="mt-3">
                    View checklist
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AgenciesPage>
  )
}
