"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getCastingById, getShortlistedByCasting } from "@/shared/services/castingService"
import { useTenant } from "@/shared/context/TenantContext"
import { ArrowLeft, UserCircle2, MapPin, Ruler } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import { AdminPageLayout, AdminCard } from "@/shared/components/admin/AdminPageLayout"

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
      <AdminPageWrapper>
        <AdminCard>
          <div className="py-8 text-center text-white/60">
            Invalid session. <Link href="/admin/casting/viewer" className="text-[#d4ff00] hover:underline">Back to viewer</Link>
          </div>
        </AdminCard>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Client viewer"
        subtitle="View shortlisted talent. Share this link with your client."
        actions={
          <Link href="/admin/casting/viewer" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to sessions
          </Link>
        }
      >
        <AdminCard>
          <div className="flex items-center gap-2 mb-4">
            <UserCircle2 className="h-5 w-5 text-[#d4ff00]" />
            <h3 className="text-lg font-semibold text-white">
              {casting?.title ?? "Casting"} – Shortlist
            </h3>
          </div>
          {casting && (
            <p className="text-sm text-white/60 mb-6">
              {casting.client} · {casting.shortlistedCount ?? 0} shortlisted
            </p>
          )}
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : shortlisted.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-white/20 py-12 text-center">
              <UserCircle2 className="mx-auto h-12 w-12 text-white/30" />
              <p className="mt-4 text-white/60">No shortlisted talent yet.</p>
              <p className="mt-1 text-sm text-white/40">
                Shortlist submissions from the casting to show them here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shortlisted.map((s) => (
                <div
                  key={s._id}
                  className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-[#d4ff00]/30 hover:bg-white/10"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#d4ff00]/20 text-xl font-bold text-[#d4ff00]">
                    {s.talentName?.charAt(0) ?? "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">{s.talentName}</p>
                    {s.notes && <p className="mt-1 text-sm text-white/60 italic">{s.notes}</p>}
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/60">
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
        </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
