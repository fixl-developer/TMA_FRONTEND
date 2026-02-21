"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getCastingById, getShortlistedByCasting } from "@/shared/services/castingService"
import { useTenant } from "@/shared/context/TenantContext"
import { ArrowLeft, UserCircle2, MapPin, Ruler } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { ListRowSkeleton } from "@/shared/components/ui/loading-skeleton"

/**
 * Client viewer room – view shortlisted talent as a client (B2).
 * Shareable link for casting agencies to present shortlist to clients.
 */
export default function ClientViewerSessionPage() {
  const params = useParams()
  const castingId = params?.castingId as string
  const { tenantId } = useTenant()
  const [casting, setCasting] = useState<any>(null)
  const [shortlisted, setShortlisted] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!castingId) return
    Promise.all([
      getCastingById(castingId, tenantId),
      getShortlistedByCasting(castingId, tenantId),
    ]).then(([c, list]) => {
      setCasting(c)
      setShortlisted(list)
      setLoading(false)
    })
  }, [castingId, tenantId])

  if (!castingId) {
    return (
      <AgenciesPage>
        <Card>
          <CardContent className="py-8 text-center text-slate-500">
            Invalid session. <Link href="/admin/casting/viewer" className="text-amber-600 hover:underline">Back to viewer</Link>
          </CardContent>
        </Card>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="text-slate-500 hover:text-slate-800">
          <Link href="/admin/casting/viewer" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to sessions
          </Link>
        </Button>
      </div>
      <PageBanner
        title="Client viewer"
        subtitle="View shortlisted talent. Share this link with your client."
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
      />
      <Card className="mt-8 border-amber-200/60 bg-gradient-to-b from-white to-amber-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle2 className="h-5 w-5 text-amber-600" />
            {casting?.title ?? "Casting"} – Shortlist
          </CardTitle>
          {casting && (
            <p className="text-sm text-slate-500">
              {casting.client} · {casting.shortlistedCount ?? 0} shortlisted
            </p>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListRowSkeleton rows={4} />
          ) : shortlisted.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
              <UserCircle2 className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-500">No shortlisted talent yet.</p>
              <p className="mt-1 text-sm text-slate-400">
                Shortlist submissions from the casting to show them here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shortlisted.map((s) => (
                <div
                  key={s._id}
                  className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-amber-200 hover:shadow-md"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-600">
                    {s.talentName?.charAt(0) ?? "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">{s.talentName}</p>
                    {s.notes && <p className="mt-1 text-sm text-slate-500 italic">{s.notes}</p>}
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                      {s.height && (
                        <span className="flex items-center gap-1">
                          <Ruler className="h-3 w-3" /> {s.height}
                        </span>
                      )}
                      {s.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {s.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
