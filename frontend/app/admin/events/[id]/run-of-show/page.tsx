"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  getRunOfShowByEvent,
  getEventById,
  getChecklistById,
} from "@/shared/services/projectService"
import { Clock, AlertCircle, CheckSquare } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import { AdminPageLayout, AdminCard, AdminButton } from "@/shared/components/admin/AdminPageLayout"

export default function RunOfShowPage() {
  const params = useParams()
  const eventId = params?.id as string
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
      <AdminPageWrapper>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-white/60">Loading run-of-show…</p>
        </div>
      </AdminPageWrapper>
    )
  }

  if (!ros) {
    return (
      <AdminPageWrapper>
        <AdminPageLayout
          title={event?.name ?? "Event"}
          subtitle="Run-of-show"
          actions={
            <Link href="/admin/events">
              <AdminButton variant="outline">← Events</AdminButton>
            </Link>
          }
        >
          <AdminCard>
            <div className="py-12 text-center">
              <p className="text-white/60">No run-of-show defined for this event.</p>
              <p className="mt-2 text-sm text-white/40">
                Create one from the project linked to this event.
              </p>
            </div>
          </AdminCard>
        </AdminPageLayout>
      </AdminPageWrapper>
    )
  }

  const segments = ros.segments ?? []
  const issues = ros.issues ?? []

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title={ros.name}
        subtitle={`${ros.eventDate} · ${segments.length} segments`}
        actions={
          <div className="flex gap-2">
            <Link href="/admin/events">
              <AdminButton variant="outline">← Events</AdminButton>
            </Link>
            <Link href="/admin/projects">
              <AdminButton variant="outline">Projects</AdminButton>
            </Link>
          </div>
        }
      >
        <div className="grid min-w-0 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AdminCard>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-[#d4ff00]" />
                <h3 className="text-lg font-semibold text-white">Timeline</h3>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/20" />
                <div className="space-y-4">
                  {segments.map((seg: any, i: number) => (
                    <div key={seg.id} className="relative flex gap-4 pl-10">
                      <div className="absolute left-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#d4ff00]/20 text-sm font-semibold text-[#d4ff00]">
                        {i + 1}
                      </div>
                      <div className="flex-1 rounded-lg border border-white/10 bg-white/5 p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">
                            {seg.time} – {seg.title}
                          </span>
                          <span className="text-xs text-white/60">
                            {seg.duration}
                          </span>
                        </div>
                        {seg.notes && (
                          <p className="mt-1 text-sm text-white/60">{seg.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AdminCard>
          </div>

          <div className="space-y-6">
            {issues.length > 0 && (
              <AdminCard>
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-white">Issues ({issues.length})</h3>
                </div>
                <ul className="space-y-2">
                  {issues.map((iss: any) => (
                    <li
                      key={iss.id}
                      className="rounded border border-amber-500/30 bg-amber-500/20 p-2 text-sm"
                    >
                      <p className="text-white">{iss.description}</p>
                      <span className="text-xs text-white/60">
                        {iss.status} · Segment {iss.segmentId}
                      </span>
                    </li>
                  ))}
                </ul>
              </AdminCard>
            )}

            {checklist && (
              <AdminCard>
                <div className="flex items-center gap-2 mb-4">
                  <CheckSquare className="h-4 w-4 text-[#d4ff00]" />
                  <h3 className="text-sm font-semibold text-white">Pre-event checklist</h3>
                </div>
                <p className="text-sm font-medium text-white">
                  {checklist.name}
                </p>
                {checklist.completionGate && (
                  <p className="mt-1 text-xs text-white/60">
                    Gate: {checklist.completionGate.replace(/_/g, " ")}
                  </p>
                )}
                <Link href={`/admin/projects/${checklist.projectId ?? ""}/checklists`}>
                  <AdminButton variant="outline" size="sm" className="mt-3">
                    View checklist
                  </AdminButton>
                </Link>
              </AdminCard>
            )}
          </div>
        </div>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
